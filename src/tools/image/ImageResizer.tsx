import React, { useState, useRef, useEffect } from 'react';
import {
  Maximize,
  Download,
  Lock,
  Unlock,
  RotateCw,
  AlertCircle,
  FileImage,
  Sparkles,
} from 'lucide-react';
import { FileDropzone } from '../../components/FileDropzone';
import { PrivacyBadge } from '../../components/PrivacyBadge';
import { formatFileSize } from '../../utils/pdfHelper';

export const ImageResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState<number>(0.9);
  const [resizedBlobUrl, setResizedBlobUrl] = useState<string | null>(null);
  const [resizedSize, setResizedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    if (!f.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    setError(null);
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setResizedBlobUrl(null);

    const img = new Image();
    img.onload = () => {
      setOriginalWidth(img.naturalWidth);
      setOriginalHeight(img.naturalHeight);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      setAspectRatio(img.naturalWidth / img.naturalHeight);
      imgRef.current = img;
    };
    img.src = url;
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && aspectRatio > 0) {
      setHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && aspectRatio > 0) {
      setWidth(Math.round(val * aspectRatio));
    }
  };

  const handleScalePercent = (pct: number) => {
    const newW = Math.round(originalWidth * (pct / 100));
    const newH = Math.round(originalHeight * (pct / 100));
    setWidth(newW);
    setHeight(newH);
  };

  const processResize = async () => {
    if (!file || !imgRef.current) return;
    setIsProcessing(true);
    setError(null);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context unavailable');

      // High-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // If converting to JPEG, fill white background to avoid transparent black artifacts
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setResizedBlobUrl(url);
            setResizedSize(blob.size);
          } else {
            setError('Failed to process image resizing.');
          }
          setIsProcessing(false);
        },
        format,
        quality
      );
    } catch (err: any) {
      console.error(err);
      setError('An error occurred during resizing.');
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!resizedBlobUrl || !file) return;
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
    const a = document.createElement('a');
    a.href = resizedBlobUrl;
    a.download = `resized-${width}x${height}-${file.name.replace(/\.[^/.]+$/, '')}.${ext}`;
    a.click();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {!file ? (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp"
          onFilesSelected={handleFilesSelected}
          label="Upload an image to resize"
          sublabel="JPG, PNG, or WebP up to 25MB. Processed completely in your browser."
          buttonText="Choose Image"
          icon={<Maximize className="w-7 h-7" />}
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
                  Original: {originalWidth} × {originalHeight} px • {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
                setResizedBlobUrl(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Choose different image
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Preview thumbnail */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Preview & Scale
              </span>
              <div className="aspect-[4/3] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-2 flex items-center justify-center overflow-hidden">
                {previewUrl && (
                  <img
                    src={resizedBlobUrl || previewUrl}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain rounded-md"
                  />
                )}
              </div>

              {/* Quick scale presets */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <span>Presets:</span>
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleScalePercent(pct)}
                    className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Dimension & Output Controls */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={width || ''}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={height || ''}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              {/* Maintain aspect ratio toggle */}
              <button
                type="button"
                onClick={() => setLockAspect(!lockAspect)}
                className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 cursor-pointer"
              >
                {lockAspect ? (
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <Unlock className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Maintain aspect ratio ({lockAspect ? 'Locked' : 'Unlocked'})</span>
              </button>

              {/* Format selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                >
                  <option value="image/jpeg">JPG / JPEG (Best for photos)</option>
                  <option value="image/png">PNG (Best for transparency / graphics)</option>
                  <option value="image/webp">WebP (Modern, high compression)</option>
                </select>
              </div>

              {/* Quality slider (for JPG and WebP) */}
              {format !== 'image/png' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>Quality</span>
                    <span>{Math.round(quality * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={1.0}
                    step={0.05}
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={processResize}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm transition-colors cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Apply Resize</span>
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Download Box */}
          {resizedBlobUrl && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Resized to {width} × {height} px
                </p>
                <p className="text-xs text-slate-500">
                  New size: {formatFileSize(resizedSize)} ({format.replace('image/', '').toUpperCase()})
                </p>
              </div>

              <button
                onClick={downloadImage}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Resized Image</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
