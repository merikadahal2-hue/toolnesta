import React, { useState, useEffect } from 'react';
import { Fingerprint, Copy, RefreshCw, Check, Download } from 'lucide-react';
import { PrivacyBadge } from '../../components/PrivacyBadge';

export const UuidGenerator: React.FC = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState<number>(5);
  const [isUppercase, setIsUppercase] = useState<boolean>(false);
  const [removeHyphens, setRemoveHyphens] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const generateUuids = () => {
    const list: string[] = [];
    const limit = Math.min(100, Math.max(1, count));

    for (let i = 0; i < limit; i++) {
      let id = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

      if (removeHyphens) id = id.replace(/-/g, '');
      if (isUppercase) id = id.toUpperCase();
      list.push(id);
    }

    setUuids(list);
  };

  useEffect(() => {
    generateUuids();
  }, [count, isUppercase, removeHyphens]);

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Quantity:
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            >
              {[1, 5, 10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'UUID' : 'UUIDs'}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isUppercase}
                onChange={(e) => setIsUppercase(e.target.checked)}
                className="rounded accent-blue-600"
              />
              <span>UPPERCASE</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={removeHyphens}
                onChange={(e) => setRemoveHyphens(e.target.checked)}
                className="rounded accent-blue-600"
              />
              <span>No hyphens</span>
            </label>
          </div>
        </div>

        {/* Results output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Generated {uuids.length} v4 {uuids.length === 1 ? 'UUID' : 'UUIDs'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={generateUuids}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                title="Regenerate"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={copyAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy All'}</span>
              </button>
              <button
                onClick={downloadTxt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 max-h-80 overflow-y-auto font-mono text-sm space-y-1.5 selection:bg-blue-500/20">
            {uuids.map((id, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-0.5 group hover:text-blue-600 dark:hover:text-blue-400"
              >
                <span>{id}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(id)}
                  className="opacity-0 group-hover:opacity-100 text-[11px] text-slate-400 hover:text-blue-600 px-1 cursor-pointer"
                >
                  copy
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <PrivacyBadge text="Generated client-side using crypto.randomUUID()." />
        </div>
      </div>
    </div>
  );
};
