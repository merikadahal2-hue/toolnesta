import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  FileText,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { FileDropzone } from '../../components/FileDropzone';
import { PrivacyBadge } from '../../components/PrivacyBadge';
import { formatFileSize } from '../../utils/pdfHelper';

interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

export const PdfMerge: React.FC = () => {
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [mergedPdfSize, setMergedPdfSize] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    setError(null);
    setMergedPdfUrl(null);
    const pdfFiles = newFiles.filter((f) => f.type === 'application/pdf' || f.name.endsWith('.pdf'));

    if (pdfFiles.length < newFiles.length) {
      setError('Some files were ignored because they are not valid PDF documents.');
    }

    const items: PdfFileItem[] = pdfFiles.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
    }));

    setFiles((prev) => [...prev, ...items]);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
    setMergedPdfUrl(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please add at least two PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const arrayBuffer = await item.file.arrayBuffer();
        const donorPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const donorPages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());

        for (const page of donorPages) {
          mergedPdf.addPage(page);
        }
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setMergedPdfUrl(url);
      setMergedPdfSize(blob.size);
    } catch (err: any) {
      console.error(err);
      setError('Failed to merge PDFs. One of the documents may be password protected or corrupted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadMerged = () => {
    if (!mergedPdfUrl) return;
    const a = document.createElement('a');
    a.href = mergedPdfUrl;
    a.download = `merged-document-${Date.now()}.pdf`;
    a.click();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Upload area */}
      <FileDropzone
        accept="application/pdf"
        multiple={true}
        onFilesSelected={handleFilesSelected}
        label="Select multiple PDF files to merge"
        sublabel="Add 2 or more PDFs. You can reorder them before merging."
        buttonText="Choose PDF Files"
        icon={<Layers className="w-7 h-7" />}
      />

      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Selected files list */}
      {files.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Selected Documents ({files.length})
              </h3>
              <p className="text-xs text-slate-500">
                Total size: {formatFileSize(files.reduce((acc, f) => acc + f.size, 0))}
              </p>
            </div>
            <button
              onClick={() => {
                setFiles([]);
                setMergedPdfUrl(null);
              }}
              className="text-xs text-red-600 dark:text-red-400 hover:underline cursor-pointer"
            >
              Remove All
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {files.map((item, index) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-3 text-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs flex items-center justify-center font-bold shrink-0">
                    {index + 1}
                  </span>
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs sm:max-w-md">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">{formatFileSize(item.size)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    disabled={index === 0}
                    onClick={() => moveUp(index)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={index === files.length - 1}
                    onClick={() => moveDown(index)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer ml-1"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <PrivacyBadge text="Your files are processed locally in your browser." />

            <button
              disabled={files.length < 2 || isProcessing}
              onClick={handleMerge}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-medium text-sm transition-colors cursor-pointer shadow-sm"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Merging locally...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Merge {files.length} PDFs</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Success Download Card */}
      {mergedPdfUrl && (
        <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                Your merged PDF is ready!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                Output size: {formatFileSize(mergedPdfSize)} • {files.length} documents combined
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={downloadMerged}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Merged PDF</span>
            </button>
            <a
              href={mergedPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm font-medium hover:bg-emerald-100/50 cursor-pointer"
            >
              Preview in New Tab
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
