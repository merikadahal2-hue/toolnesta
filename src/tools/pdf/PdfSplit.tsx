import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  Scissors,
  FileText,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { FileDropzone } from '../../components/FileDropzone';
import { PrivacyBadge } from '../../components/PrivacyBadge';
import { formatFileSize } from '../../utils/pdfHelper';

export const PdfSplit: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [rangeInput, setRangeInput] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdfUrl, setResultPdfUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number>(0);
  const [extractedCount, setExtractedCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setError(null);
    setResultPdfUrl(null);

    try {
      const buffer = await selected.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdf.getPageCount();

      setFile(selected);
      setNumPages(count);
      setRangeInput(count > 1 ? `1-${Math.min(count, 3)}` : '1');
    } catch (err: any) {
      console.error(err);
      setError('Could not read this PDF. Make sure it is not corrupted or password-protected.');
    }
  };

  // Parse page ranges like "1-3, 5, 7-9"
  const parsePageRanges = (input: string, max: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (!part) continue;
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map((s) => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const minVal = Math.max(1, Math.min(start, end));
          const maxVal = Math.min(max, Math.max(start, end));
          for (let i = minVal; i <= maxVal; i++) {
            pages.add(i);
          }
        }
      } else {
        const val = parseInt(part, 10);
        if (!isNaN(val) && val >= 1 && val <= max) {
          pages.add(val);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || numPages === 0) return;

    const selectedPages = parsePageRanges(rangeInput, numPages);
    if (selectedPages.length === 0) {
      setError(`Please specify valid pages between 1 and ${numPages} (e.g. "1-3, 5").`);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      // Convert 1-indexed to 0-indexed indices
      const indicesToCopy = selectedPages.map((p) => p - 1);
      const copiedPages = await newDoc.copyPages(srcDoc, indicesToCopy);

      for (const page of copiedPages) {
        newDoc.addPage(page);
      }

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setResultPdfUrl(url);
      setResultSize(blob.size);
      setExtractedCount(selectedPages.length);
    } catch (err: any) {
      console.error(err);
      setError('An error occurred while extracting the pages. Please verify the document format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultPdfUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultPdfUrl;
    a.download = `split-${file.name.replace(/\.pdf$/i, '')}-${rangeInput.replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`;
    a.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {!file ? (
        <FileDropzone
          accept="application/pdf"
          onFilesSelected={handleFilesSelected}
          label="Upload a PDF to split"
          sublabel="Extract custom pages or ranges into a separate PDF locally."
          buttonText="Choose PDF"
          icon={<Scissors className="w-7 h-7" />}
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
                  {formatFileSize(file.size)} • Total pages: <strong className="text-blue-600 dark:text-blue-400">{numPages}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setResultPdfUrl(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Choose different file
            </button>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Page Range to Extract
            </label>
            <input
              type="text"
              value={rangeInput}
              onChange={(e) => setRangeInput(e.target.value)}
              placeholder="e.g. 1-3, 5, 8"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:border-blue-500"
            />
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span>Quick presets:</span>
              <button
                type="button"
                onClick={() => setRangeInput('1')}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
              >
                First page only
              </button>
              {numPages >= 2 && (
                <button
                  type="button"
                  onClick={() => setRangeInput(`1-${Math.ceil(numPages / 2)}`)}
                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                >
                  First half (1-{Math.ceil(numPages / 2)})
                </button>
              )}
              {numPages >= 2 && (
                <button
                  type="button"
                  onClick={() => setRangeInput(`${Math.ceil(numPages / 2) + 1}-${numPages}`)}
                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                >
                  Second half ({Math.ceil(numPages / 2) + 1}-{numPages})
                </button>
              )}
              <button
                type="button"
                onClick={() => setRangeInput(`${numPages}`)}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
              >
                Last page ({numPages})
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <PrivacyBadge text="Extracted 100% locally in your browser." />

            <button
              disabled={isProcessing}
              onClick={handleSplit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm transition-colors cursor-pointer shadow-sm"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Extracting...</span>
                </>
              ) : (
                <>
                  <Scissors className="w-4 h-4" />
                  <span>Extract Pages</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Result Card */}
      {resultPdfUrl && (
        <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                New PDF generated successfully!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                Contains {extractedCount} extracted page(s) • Size: {formatFileSize(resultSize)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={downloadResult}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Extracted PDF</span>
            </button>
            <a
              href={resultPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm font-medium hover:bg-emerald-100/50 cursor-pointer"
            >
              Preview Document
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
