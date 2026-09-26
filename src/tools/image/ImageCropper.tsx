import React, { useState, useRef, useEffect } from 'react';
import {
  Crop,
  Download,
  FileImage,
  Sparkles,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { FileDropzone } from '../../components/FileDropzone';
import { PrivacyBadge } from '../../components/PrivacyBadge';
import { formatFileSize } from '../../utils/pdfHelper';

type RatioPreset = 'free' | '1:1' | '4:3' | '16:9';

export const ImageCropper: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imgNaturalWidth, setImgNaturalWidth] = useState(0);
  const [imgNaturalHeight, setImgNaturalHeight] = useState(0);
  const [ratio, setRatio] = useState<RatioPreset>('free');

  // Crop box in percentages (0 to 100)
  const [crop, setCrop] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });

  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [croppedSize, setCroppedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    if (!f.type.startsWith('image/')) {
      setError('Please choose a valid image.');
      return;
    }

    setError(null);
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setCroppedUrl(null);

    const img = new Image();
    img.onload = () => {
      setImgNaturalWidth(img.naturalWidth);
      setImgNaturalHeight(img.naturalHeight);
      imgRef.current = img;
      setCrop({ x: 10, y: 10, width: 80, height: 80 });
    };
    img.src = url;
  };

  const applyPresetRatio = (preset: RatioPreset) => {
    setRatio(preset);
    if (!imgNaturalWidth || !imgNaturalHeight) return;

    if (preset === 'free') {
      setCrop({ x: 10, y: 10, width: 80, height: 80 });
      return;
    }

    let targetRatio = 1;
    if (preset === '1:1') targetRatio = 1;
    else if (preset === '4:3') targetRatio = 4 / 3;
    else if (preset === '16:9') targetRatio = 16 / 9;

    const imgAspect = imgNaturalWidth / imgNaturalHeight;

    let w = 80;
    let h = 80;

    if (targetRatio > imgAspect) {
      // Wider than image
      w = 80;
      h = (80 / targetRatio) * imgAspect;
    } else {
      // Taller than image
      h = 80;
      w = (80 * targetRatio) / imgAspect;
    }

    w = Math.min(90, Math.max(20, w));
    h = Math.min(90, Math.max(20, h));

    setCrop({
      x: (100 - w) / 2,
      y: (100 - h) / 2,
      width: w,
      height: h,
    });
  };

  const handleCrop = () => {
    if (!imgRef.current || !file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const img = imgRef.current;
      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;

      const sourceX = (crop.x / 100) * naturalW;
      const sourceY = (crop.y / 100) * naturalH;
      const sourceW = (crop.width / 100) * naturalW;
      const sourceH = (crop.height / 100) * naturalH;

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(sourceW);
      canvas.height = Math.round(sourceH);
      const ctx = canvas.getContext('2d')!;

      ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setCroppedUrl(url);
          setCroppedSize(blob.size);
        } else {
          setError('Failed to create cropped image.');
        }
        setIsProcessing(false);
      }, 'image/png');
    } catch (err: any) {
      console.error(err);
      setError('An error occurred during cropping.');
      setIsProcessing(false);
    }
  };

  const downloadCropped = () => {
    if (!croppedUrl || !file) return;
    const a = document.createElement('a');
    a.href = croppedUrl;
    a.download = `cropped-${file.name.replace(/\.[^/.]+$/, '')}.png`;
    a.click();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {!file ? (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp"
          onFilesSelected={handleFilesSelected}
          label="Upload an image to crop"
          sublabel="Interactive crop selection with 1:1, 4:3, 16:9 presets."
          buttonText="Choose Image"
          icon={<Crop className="w-7 h-7" />}
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
                  {imgNaturalWidth} × {imgNaturalHeight} px • {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
                setCroppedUrl(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Choose different image
            </button>
          </div>

          {/* Aspect Ratio Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Aspect Ratio Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'free', label: 'Freeform' },
                { id: '1:1', label: '1:1 Square' },
                { id: '4:3', label: '4:3 Standard' },
                { id: '16:9', label: '16:9 Widescreen' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPresetRatio(p.id as RatioPreset)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                    ratio === p.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Crop Viewport */}
          <div
            ref={containerRef}
            className="relative select-none max-h-[500px] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900/90 flex items-center justify-center p-4"
          >
            {previewUrl && (
              <div className="relative inline-block max-h-[460px]">
                <img
                  src={previewUrl}
                  alt="Crop Target"
                  className="max-h-[440px] max-w-full block object-contain pointer-events-none"
                />

                {/* Crop Box Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: `${crop.y}%`,
                    left: `${crop.x}%`,
                    width: `${crop.width}%`,
                    height: `${crop.height}%`,
                  }}
                  className="border-2 border-white shadow-2xl shadow-black ring-1 ring-blue-500 bg-blue-500/10 backdrop-brightness-110 cursor-move"
                >
                  {/* Grid lines inside crop */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-white" />
                    <div className="border-r border-white" />
                    <div />
                  </div>

                  <span className="absolute bottom-1 right-1.5 text-[10px] font-mono text-white bg-black/60 px-1 rounded">
                    {Math.round((crop.width / 100) * imgNaturalWidth)} ×{' '}
                    {Math.round((crop.height / 100) * imgNaturalHeight)} px
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Fine Tuning Position Sliders */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">Position X</span>
              <input
                type="range"
                min={0}
                max={100 - crop.width}
                value={crop.x}
                onChange={(e) => setCrop((c) => ({ ...c, x: Number(e.target.value) }))}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Position Y</span>
              <input
                type="range"
                min={0}
                max={100 - crop.height}
                value={crop.y}
                onChange={(e) => setCrop((c) => ({ ...c, y: Number(e.target.value) }))}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Crop Width</span>
              <input
                type="range"
                min={15}
                max={100 - crop.x}
                value={crop.width}
                onChange={(e) => setCrop((c) => ({ ...c, width: Number(e.target.value) }))}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Crop Height</span>
              <input
                type="range"
                min={15}
                max={100 - crop.y}
                value={crop.height}
                onChange={(e) => setCrop((c) => ({ ...c, height: Number(e.target.value) }))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <PrivacyBadge text="Cropped locally with Canvas API." />

            <button
              disabled={isProcessing}
              onClick={handleCrop}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer shadow-sm"
            >
              <Crop className="w-4 h-4" />
              <span>Crop Image</span>
            </button>
          </div>

          {/* Success Download Card */}
          {croppedUrl && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white overflow-hidden border border-emerald-200 shrink-0 flex items-center justify-center">
                  <img src={croppedUrl} alt="Crop Result" className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Cropped Successfully
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Size: {formatFileSize(croppedSize)}
                  </p>
                </div>
              </div>

              <button
                onClick={downloadCropped}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Cropped PNG</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
