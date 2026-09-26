import React, { useState, useRef, useEffect } from 'react';
import {
  FileArchive,
  Download,
  AlertCircle,
  FileImage,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { FileDropzone } from '../../components/FileDropzone';
import { PrivacyBadge } from '../../components/PrivacyBadge';
import { formatFileSize } from '../../utils/pdfHelper';

export const ImageCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0.75);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg');
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    if (!f.type.startsWith('image/')) {
      setError('Please choose a valid image file.');
      return;
    }

    setError(null);
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setCompressedUrl(null);

    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      runCompression(img, quality, outputFormat, f);
    };
    img.src = url;
  };

  const runCompression = (
    img: HTMLImageElement,
    q: number,
    fmt: 'image/jpeg' | 'image/webp',
    originalFile: File
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;

      // White background for JPEG to preserve transparency clean
      if (fmt === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setCompressedUrl(url);
            setCompressedSize(blob.size);
          } else {
            setError('Compression failed.');
          }
          setIsProcessing(false);
        },
        fmt,
        q
      );
    } catch (err: any) {
      console.error(err);
      setError('Failed to compress image.');
      setIsProcessing(false);
    }
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (imgRef.current && file) {
      runCompression(imgRef.current, newQ, outputFormat, file);
    }
  };

  const handleFormatChange = (newFmt: 'image/jpeg' | 'image/webp') => {
    setOutputFormat(newFmt);
    if (imgRef.current && file) {
      runCompression(imgRef.current, quality, newFmt, file);
    }
  };

  const downloadCompressed = () => {
    if (!compressedUrl || !file) return;
    const ext = outputFormat === 'image/webp' ? 'webp' : 'jpg';
    const a = document.createElement('a');
    a.href = compressedUrl;
    a.download = `compressed-${file.name.replace(/\.[^/.]+$/, '')}.${ext}`;
    a.click();
  };

  const savings = file ? file.size - compressedSize : 0;
  const savingsPct = file && file.size > 0 ? Math.round((savings / file.size) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {!file ? (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp"
          onFilesSelected={handleFilesSelected}
          label="Upload an image to compress"
          sublabel="JPG, PNG, or WebP. Shrink file size locally with live preview."
          buttonText="Choose Image"
          icon={<FileArchive className="w-7 h-7" />}
        />
      ) : (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <FileImage className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white truncate max-w-sm">
                  {file.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Original: {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
                setCompressedUrl(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Choose different image
            </button>
          </div>

          {/* Sliders & Format */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Output Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleFormatChange('image/jpeg')}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium cursor-pointer ${
                    outputFormat === 'image/jpeg'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  JPG (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatChange('image/webp')}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium cursor-pointer ${
                    outputFormat === 'image/webp'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  WebP (Ultra compact)
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Compression Quality</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono">
                  {Math.round(quality * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.95}
                step={0.05}
                value={quality}
                onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Smaller size</span>
                <span>Better quality</span>
              </div>
            </div>
          </div>

          {/* Size Comparison Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400">Original</span>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {formatFileSize(file.size)}
              </p>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400" />

            <div className="space-y-0.5">
              <span className="text-xs text-slate-400">Compressed</span>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {formatFileSize(compressedSize)}
              </p>
            </div>

            <div className="text-right space-y-0.5">
              <span className="text-xs text-slate-400">Reduction</span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {savingsPct > 0 ? `-${savingsPct}%` : '0%'}
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <PrivacyBadge text="Compressed 100% locally in browser." />

            <button
              disabled={isProcessing || !compressedUrl}
              onClick={downloadCompressed}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-sm transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Compressed Image</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
