import React, { useState, useRef } from 'react';
import {
  RefreshCw,
  Download,
  FileImage,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { FileDropzone } from '../../components/FileDropzone';
import { PrivacyBadge } from '../../components/PrivacyBadge';
import { formatFileSize } from '../../utils/pdfHelper';

export const ImageConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState<number>(0.92);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    if (!f.type.startsWith('image/')) {
      setError('Please upload a JPG, PNG, or WebP image.');
      return;
    }

    setError(null);
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setConvertedUrl(null);

    // Auto select different target format
    if (f.type.includes('png')) {
      setTargetFormat('jpeg');
    } else if (f.type.includes('jpeg')) {
      setTargetFormat('png');
    } else {
      setTargetFormat('png');
    }

    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
    };
    img.src = url;
  };

  const handleConvert = () => {
    if (!imgRef.current || !file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const img = imgRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;

      // Handle transparent background when converting to JPG
      if (targetFormat === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const mimeType = `image/${targetFormat}`;
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setConvertedUrl(url);
            setConvertedSize(blob.size);
          } else {
            setError('Conversion failed.');
          }
          setIsProcessing(false);
        },
        mimeType,
        quality
      );
    } catch (err: any) {
      console.error(err);
      setError('An error occurred during conversion.');
      setIsProcessing(false);
    }
  };

  const downloadConverted = () => {
    if (!convertedUrl || !file) return;
    const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
    const a = document.createElement('a');
    a.href = convertedUrl;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}.${ext}`;
    a.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {!file ? (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp"
          onFilesSelected={handleFilesSelected}
          label="Upload an image to convert"
          sublabel="Convert instantly between JPG, PNG, and WebP."
          buttonText="Choose Image"
          icon={<RefreshCw className="w-7 h-7" />}
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
                  {formatFileSize(file.size)} • Type: {file.type.replace('image/', '').toUpperCase()}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
                setConvertedUrl(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Choose different image
            </button>
          </div>

          {/* Conversion target selector */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Convert to Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'png', label: 'PNG', desc: 'Lossless & transparent' },
                  { id: 'jpeg', label: 'JPG', desc: 'Standard photo format' },
                  { id: 'webp', label: 'WebP', desc: 'Ultra compact modern' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setTargetFormat(item.id as any);
                      setConvertedUrl(null);
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      targetFormat === item.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {targetFormat !== 'png' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
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
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <PrivacyBadge text="Converted locally inside your browser." />

            <button
              disabled={isProcessing}
              onClick={handleConvert}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm transition-colors cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>Convert to {targetFormat.toUpperCase()}</span>
            </button>
          </div>

          {/* Success Download Card */}
          {convertedUrl && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  Ready: {file.name.replace(/\.[^/.]+$/, '')}.{targetFormat === 'jpeg' ? 'jpg' : targetFormat}
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Converted size: {formatFileSize(convertedSize)}
                </p>
              </div>

              <button
                onClick={downloadConverted}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Result</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
