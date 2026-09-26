import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  Files,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { FileDropzone } from '../../components/FileDropzone';
import { PrivacyBadge } from '../../components/PrivacyBadge';
import { formatFileSize } from '../../utils/pdfHelper';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
}

export const ImagesToPdf: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<number>(20); // pts
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfSize, setPdfSize] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    setError(null);
    setPdfUrl(null);
    const valid = newFiles.filter((f) => f.type.startsWith('image/'));

    if (valid.length < newFiles.length) {
      setError('Some non-image files were skipped.');
    }

    const items: ImageItem[] = valid.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setImages((prev) => [...prev, ...items]);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((item) => item.id !== id));
    setPdfUrl(null);
  };

  const handleCreatePdf = async () => {
    if (images.length === 0) {
      setError('Please add at least one image.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        // Convert to canvas image data if needed, or read as array buffer
        const arrayBuffer = await item.file.arrayBuffer();
        let embeddedImage;

        // Try direct embedding or convert via canvas to JPEG
        if (item.file.type === 'image/jpeg' || item.name.toLowerCase().endsWith('.jpg') || item.name.toLowerCase().endsWith('.jpeg')) {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        } else if (item.file.type === 'image/png' || item.name.toLowerCase().endsWith('.png')) {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // WebP or other browser-supported format: rasterize to PNG via offscreen canvas
          const imgBitmap = await createImageBitmap(item.file);
          const canvas = document.createElement('canvas');
          canvas.width = imgBitmap.width;
          canvas.height = imgBitmap.height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(imgBitmap, 0, 0);
          const pngBlob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), 'image/png'));
          const pngBuffer = await pngBlob.arrayBuffer();
          embeddedImage = await pdfDoc.embedPng(pngBuffer);
        }

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        let pageWidth = 595.28; // A4 pt
        let pageHeight = 841.89;

        if (pageSize === 'letter') {
          pageWidth = 612;
          pageHeight = 792;
        } else if (pageSize === 'fit') {
          pageWidth = imgWidth + margin * 2;
          pageHeight = imgHeight + margin * 2;
        }

        if (pageSize !== 'fit' && orientation === 'landscape') {
          const temp = pageWidth;
          pageWidth = pageHeight;
          pageHeight = temp;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Fit image within margins
        const availableW = pageWidth - margin * 2;
        const availableH = pageHeight - margin * 2;

        const scaleX = availableW / imgWidth;
        const scaleY = availableH / imgHeight;
        const scale = Math.min(scaleX, scaleY);

        const drawW = imgWidth * scale;
        const drawH = imgHeight * scale;

        // Center on page
        const posX = margin + (availableW - drawW) / 2;
        const posY = margin + (availableH - drawH) / 2;

        page.drawImage(embeddedImage, {
          x: posX,
          y: posY,
          width: drawW,
          height: drawH,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setPdfUrl(url);
      setPdfSize(blob.size);
    } catch (err: any) {
      console.error(err);
      setError('An error occurred while compiling the PDF. Please check image formats.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `images-document-${Date.now()}.pdf`;
    a.click();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <FileDropzone
        accept="image/png,image/jpeg,image/webp"
        multiple={true}
        onFilesSelected={handleFilesSelected}
        label="Select images to convert to PDF"
        sublabel="Supports JPG, PNG, and WebP images. Reorder and customize margins."
        buttonText="Choose Images"
        icon={<ImageIcon className="w-7 h-7" />}
      />

      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {images.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Selected Images ({images.length})
            </h3>
            <button
              onClick={() => {
                setImages([]);
                setPdfUrl(null);
              }}
              className="text-xs text-red-600 dark:text-red-400 hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Page Size
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              >
                <option value="a4">A4 (Standard)</option>
                <option value="letter">US Letter</option>
                <option value="fit">Fit to Image</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Orientation
              </label>
              <select
                value={orientation}
                disabled={pageSize === 'fit'}
                onChange={(e) => setOrientation(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white disabled:opacity-50"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Page Margin
              </label>
              <select
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              >
                <option value={0}>No Margin (Edge-to-edge)</option>
                <option value={20}>Standard (20pt)</option>
                <option value={40}>Wide (40pt)</option>
              </select>
            </div>
          </div>

          {/* List of reorderable images */}
          <div className="space-y-2">
            {images.map((item, index) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-slate-400 w-4 text-center">
                    {index + 1}
                  </span>
                  <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs sm:max-w-md">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">{formatFileSize(item.size)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={index === 0}
                    onClick={() => moveUp(index)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={index === images.length - 1}
                    onClick={() => moveDown(index)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeImage(item.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-red-500 cursor-pointer ml-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <PrivacyBadge text="Images compiled 100% locally in your browser." />

            <button
              disabled={isProcessing}
              onClick={handleCreatePdf}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer shadow-sm"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating PDF...</span>
                </>
              ) : (
                <>
                  <Files className="w-4 h-4" />
                  <span>Create PDF Document</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {pdfUrl && (
        <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                PDF Created Successfully!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                Contains {images.length} pages • Size: {formatFileSize(pdfSize)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={downloadPdf}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm font-medium hover:bg-emerald-100/50 cursor-pointer"
            >
              Preview PDF
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
