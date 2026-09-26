import React, { useState } from 'react';
import { Pipette, ArrowRightLeft, Copy, Check } from 'lucide-react';

export const HexConverter: React.FC = () => {
  const [hexInput, setHexInput] = useState<string>('#3b82f6');
  const [rInput, setRInput] = useState<string>('59');
  const [gInput, setGInput] = useState<string>('130');
  const [bInput, setBInput] = useState<string>('246');
  const [copied, setCopied] = useState<string | null>(null);

  const handleHexChange = (val: string) => {
    setHexInput(val);
    let clean = val.replace(/^#/, '');
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    if (/^[0-9A-Fa-f]{6}$/.test(clean)) {
      const num = parseInt(clean, 16);
      setRInput(String((num >> 16) & 255));
      setGInput(String((num >> 8) & 255));
      setBInput(String(num & 255));
    }
  };

  const handleRgbChange = (r: string, g: string, b: string) => {
    setRInput(r);
    setGInput(g);
    setBInput(b);

    const rNum = Math.min(255, Math.max(0, parseInt(r, 10) || 0));
    const gNum = Math.min(255, Math.max(0, parseInt(g, 10) || 0));
    const bNum = Math.min(255, Math.max(0, parseInt(b, 10) || 0));

    const hex =
      '#' +
      [rNum, gNum, bNum]
        .map((x) => x.toString(16).padStart(2, '0'))
        .join('');
    setHexInput(hex);
  };

  const copyVal = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const rNum = parseInt(rInput, 10) || 0;
  const gNum = parseInt(gInput, 10) || 0;
  const bNum = parseInt(bInput, 10) || 0;

  // Calculate HSL
  const rNorm = rNum / 255;
  const gNorm = gNum / 255;
  const bNorm = bNum / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  const hslString = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        {/* Color Preview Swatch */}
        <div
          style={{ backgroundColor: `rgb(${rNum}, ${gNum}, ${bNum})` }}
          className="h-28 rounded-2xl border border-slate-200/40 shadow-inner flex items-center justify-center transition-colors"
        >
          <div className="bg-black/20 backdrop-blur-xs px-4 py-1.5 rounded-xl text-white font-mono font-bold text-lg">
            {hexInput.toUpperCase()}
          </div>
        </div>

        {/* HEX Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            HEX Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#3B82F6"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base"
            />
            <button
              onClick={() => copyVal(hexInput.toUpperCase(), 'hex')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium cursor-pointer"
            >
              {copied === 'hex' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* RGB Channels */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            RGB Channels (0 - 255)
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-[11px] text-slate-400">Red (R)</span>
              <input
                type="number"
                min={0}
                max={255}
                value={rInput}
                onChange={(e) => handleRgbChange(e.target.value, gInput, bInput)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Green (G)</span>
              <input
                type="number"
                min={0}
                max={255}
                value={gInput}
                onChange={(e) => handleRgbChange(rInput, e.target.value, bInput)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Blue (B)</span>
              <input
                type="number"
                min={0}
                max={255}
                value={bInput}
                onChange={(e) => handleRgbChange(rInput, gInput, e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* HSL Result */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Calculated HSL</span>
            <p className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
              {hslString}
            </p>
          </div>
          <button
            onClick={() => copyVal(hslString, 'hsl')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer hover:bg-white dark:hover:bg-slate-800"
          >
            {copied === 'hsl' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied === 'hsl' ? 'Copied' : 'Copy HSL'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
