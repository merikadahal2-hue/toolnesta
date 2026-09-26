import React, { useState, useEffect } from 'react';
import {
  FileImage,
  Download,
  RefreshCw,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { FileDropzone } from '../../components/FileDropzone';
import { PrivacyBadge } from '../../components/PrivacyBadge';
import { pdfjsLib, formatFileSize } from '../../utils/pdfHelper';

interface PageImage {
  pageNumber: number;
  dataUrl: string;
}

export const PdfToImages: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [quality, setQuality] = useState<number>(0.92);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [renderedPages, setRenderedPages] = useState<PageImage[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setError(null);
    setRenderedPages([]);
    setIsProcessing(true);

    try {
      const buffer = await selected.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
      setFile(selected);
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setSelectedPage(1);
    } catch (err: any) {
      console.error(err);
      setError('Could not read this PDF document. Please ensure it is a valid file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderSinglePageToImage = async (doc: any, pageNo: number, mimeType: string): Promise<string> => {
    const page = await doc.getPage(pageNo);
    const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for sharp export
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    await page.render({ canvasContext: ctx, viewport }).promise;
    return canvas.toDataURL(mimeType, quality);
  };

  const handleConvertPage = async () => {
    if (!pdfDoc) return;
    setIsProcessing(true);
    setError(null);

    try {
      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = await renderSinglePageToImage(pdfDoc, selectedPage, mime);
      setRenderedPages([{ pageNumber: selectedPage, dataUrl }]);
    } catch (err: any) {
      console.error(err);
      setError('Failed to convert page. Please try another page.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvertAllPages = async () => {
    if (!pdfDoc) return;
    setIsProcessing(true);
    setError(null);
    setRenderedPages([]);

    try {
      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const results: PageImage[] = [];

      for (let i = 1; i <= Math.min(numPages, 20); i++) {
        const dataUrl = await renderSinglePageToImage(pdfDoc, i, mime);
        results.push({ pageNumber: i, dataUrl });
      }

      setRenderedPages(results);
    } catch (err: any) {
      console.error(err);
      setError('Failed during page conversion.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (item: PageImage) => {
    const ext = format === 'png' ? 'png' : 'jpg';
    const a = document.createElement('a');
    a.href = item.dataUrl;
    a.download = `${file?.name.replace(/\.pdf$/i, '') || 'page'}-page-${item.pageNumber}.${ext}`;
    a.click();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {!file ? (
        <FileDropzone
          accept="application/pdf"
          onFilesSelected={handleFilesSelected}
          label="Upload a PDF to convert to images"
          sublabel="Extract pages as high-resolution PNG or JPG image files."
          buttonText="Choose PDF"
          icon={<FileImage className="w-7 h-7" />}
        />
      ) : (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white truncate max-w-sm">
                  {file.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {formatFileSize(file.size)} • {numPages} total pages
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setPdfDoc(null);
                setRenderedPages([]);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Choose different PDF
            </button>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Output Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg')}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              >
                <option value="png">PNG (Lossless & Crisp)</option>
                <option value="jpeg">JPG (Compact size)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Select Page
              </label>
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              >
                {Array.from({ length: numPages }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>
                    Page {p} of {numPages}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Resolution Quality
              </label>
              <select
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              >
                <option value={1.0}>Ultra High (2x Canvas)</option>
                <option value={0.92}>Standard (High)</option>
                <option value={0.75}>Medium</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <PrivacyBadge text="Rendered directly on your device." />

            <div className="flex items-center gap-2">
              <button
                disabled={isProcessing}
                onClick={handleConvertPage}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm transition-colors cursor-pointer shadow-sm"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileImage className="w-4 h-4" />}
                <span>Convert Page {selectedPage}</span>
              </button>

              {numPages > 1 && (
                <button
                  disabled={isProcessing}
                  onClick={handleConvertAllPages}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-sm transition-colors cursor-pointer"
                >
                  <span>Convert All ({numPages})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rendered Images list */}
      {renderedPages.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Generated Images ({renderedPages.length})
            </h3>
            <span className="text-xs text-slate-400">Click download on any image</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderedPages.map((item) => (
              <div
                key={item.pageNumber}
                className="group relative rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950/40 p-2 space-y-2"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-white flex items-center justify-center border border-slate-100 dark:border-slate-800">
                  <img
                    src={item.dataUrl}
                    alt={`Page ${item.pageNumber}`}
                    className="object-contain max-h-full max-w-full"
                  />
                </div>
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Page {item.pageNumber}
                  </span>
                  <button
                    onClick={() => downloadImage(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
