import React, { useState } from 'react';
import { Palette, Copy, Check, Eye } from 'lucide-react';

export const ColorPicker: React.FC = () => {
  const [color, setColor] = useState<string>('#3b82f6');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Convert hex to rgb
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    let clean = hex.replace(/^#/, '');
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  // Convert rgb to hsl
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const hexString = color.toUpperCase();
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  const copyVal = (val: string, formatName: string) => {
    navigator.clipboard.writeText(val);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // Contrast luminance check
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  const isLight = luminance > 0.5;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        {/* Large Swatch Preview */}
        <div
          style={{ backgroundColor: color }}
          className="h-44 sm:h-52 rounded-2xl border border-slate-200/50 shadow-inner flex flex-col items-center justify-center p-4 transition-colors"
        >
          <div
            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
            className="text-center space-y-1 backdrop-blur-xs bg-black/10 dark:bg-white/10 px-4 py-2 rounded-xl"
          >
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-wider">
              {hexString}
            </div>
            <p className="text-xs font-medium opacity-80">
              {isLight ? 'Dark text recommended' : 'Light text recommended'}
            </p>
          </div>
        </div>

        {/* Color picker input */}
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-14 h-14 rounded-2xl border border-slate-200 dark:border-slate-700 cursor-pointer p-1"
          />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select or Type HEX Color
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
            />
          </div>
        </div>

        {/* Color Codes Table */}
        <div className="space-y-2.5">
          {[
            { label: 'HEX', value: hexString },
            { label: 'RGB', value: rgbString },
            { label: 'HSL', value: hslString },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-10">{item.label}</span>
                <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">
                  {item.value}
                </span>
              </div>
              <button
                onClick={() => copyVal(item.value, item.label)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer hover:bg-white dark:hover:bg-slate-800"
              >
                {copiedFormat === item.label ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedFormat === item.label ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Palette Harmonies */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Quick Palette Presets
          </span>
          <div className="grid grid-cols-6 gap-2">
            {[
              '#3b82f6',
              '#10b981',
              '#f59e0b',
              '#ef4444',
              '#8b5cf6',
              '#ec4899',
              '#06b6d4',
              '#84cc16',
              '#6366f1',
              '#14b8a6',
              '#f97316',
              '#64748b',
            ].map((p) => (
              <button
                key={p}
                style={{ backgroundColor: p }}
                onClick={() => setColor(p)}
                className="h-9 rounded-lg border border-slate-200/40 cursor-pointer hover:scale-105 transition-transform"
                title={p}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
