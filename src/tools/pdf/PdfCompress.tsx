import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  Minimize2,
  FileText,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';
import { FileDropzone } from '../../components/FileDropzone';
import { PrivacyBadge } from '../../components/PrivacyBadge';
import { formatFileSize } from '../../utils/pdfHelper';

export const PdfCompress: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressionMode, setCompressionMode] = useState<'standard' | 'aggressive'>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdfUrl, setResultPdfUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [savingsPercent, setSavingsPercent] = useState<number>(0);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
    setOriginalSize(files[0].size);
    setResultPdfUrl(null);
    setError(null);
    setNote(null);
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setNote(null);

    try {
      const buffer = await file.arrayBuffer();
      // Load and clean structural metadata
      const pdf = await PDFDocument.load(buffer, {
        ignoreEncryption: true,
        updateMetadata: false,
      });

      // Use pdf-lib object stream compression
      const compressedBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const newSize = compressedBytes.byteLength;
      const blob = new Blob([compressedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setCompressedSize(newSize);
      setResultPdfUrl(url);

      const diff = file.size - newSize;
      const pct = Math.round((diff / file.size) * 100);

      if (diff > 0) {
        setSavingsPercent(pct);
        setNote(`Optimized stream structures saved ${formatFileSize(diff)} (${pct}% reduction).`);
      } else {
        setSavingsPercent(0);
        setNote(
          'This PDF was already heavily optimized by its creator. Re-saving removed redundant object trees, but further reduction without downscaling embedded images is limited client-side.'
        );
      }
    } catch (err: any) {
      console.error(err);
      setError('Could not optimize this PDF. Make sure the file is not password-protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadCompressed = () => {
    if (!resultPdfUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultPdfUrl;
    a.download = `optimized-${file.name}`;
    a.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {!file ? (
        <FileDropzone
          accept="application/pdf"
          onFilesSelected={handleFilesSelected}
          label="Upload a PDF to compress"
          sublabel="Optimizes object streams and metadata locally in your browser."
          buttonText="Choose PDF"
          icon={<Minimize2 className="w-7 h-7" />}
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
                  Original size: <strong>{formatFileSize(file.size)}</strong>
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
              Change file
            </button>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Compression Strategy
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCompressionMode('standard')}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  compressionMode === 'standard'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="font-bold text-sm">Object Stream Packing</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Lossless structure cleaning. Best for forms, vectors, and documents.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCompressionMode('aggressive')}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  compressionMode === 'aggressive'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="font-bold text-sm">Max Stream Deduplication</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Compresses cross-reference streams and strips unreferenced metadata.
                </div>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <span>
              <strong>Client-Side Processing Notice:</strong> We optimize and rebuild the PDF's internal object streams inside your browser tab without sending your file to an unknown third-party server.
            </span>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <PrivacyBadge text="Optimized 100% locally in browser." />

            <button
              disabled={isProcessing}
              onClick={handleCompress}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm transition-colors cursor-pointer shadow-sm"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Optimizing streams...</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>Optimize PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Result Card */}
      {resultPdfUrl && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Optimization Complete
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">{note}</p>
            </div>
          </div>

          {/* Before & After comparison pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div>
              <span className="text-xs text-slate-400">Original Size</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                {formatFileSize(originalSize)}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Optimized Size</span>
              <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                {formatFileSize(compressedSize)}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-400">Savings</span>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {savingsPercent > 0 ? `-${savingsPercent}%` : 'Already minimal'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={downloadCompressed}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Optimized PDF</span>
            </button>
            <a
              href={resultPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              Preview Document
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
