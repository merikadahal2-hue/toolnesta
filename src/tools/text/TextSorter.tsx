import React, { useState } from 'react';
import { ArrowDownAZ, Copy, Check, Trash2, Download } from 'lucide-react';

export const TextSorter: React.FC = () => {
  const [text, setText] = useState<string>(
    'Zebras\n10 apples\n2 bananas\nMonkeys\nApples\n1 orange\nGiraffes'
  );
  const [copied, setCopied] = useState(false);

  const getLines = () => text.split('\n');

  const sortAZ = () => {
    const sorted = [...getLines()].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    setText(sorted.join('\n'));
  };

  const sortZA = () => {
    const sorted = [...getLines()].sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
    setText(sorted.join('\n'));
  };

  const sortNumeric = () => {
    const sorted = [...getLines()].sort((a, b) => {
      const numA = parseFloat(a.match(/-?\d+(\.\d+)?/)?.[0] || '0');
      const numB = parseFloat(b.match(/-?\d+(\.\d+)?/)?.[0] || '0');
      return numA - numB;
    });
    setText(sorted.join('\n'));
  };

  const reverseLines = () => {
    setText([...getLines()].reverse().join('\n'));
  };

  const shuffleLines = () => {
    const arr = [...getLines()];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setText(arr.join('\n'));
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sorted-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Sort Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={sortAZ}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs"
        >
          Sort A → Z
        </button>
        <button
          onClick={sortZA}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs"
        >
          Sort Z → A
        </button>
        <button
          onClick={sortNumeric}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs"
        >
          Natural Numeric
        </button>
        <button
          onClick={reverseLines}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs"
        >
          Reverse Order
        </button>
        <button
          onClick={shuffleLines}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs"
        >
          Random Shuffle
        </button>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400">
            {text.split('\n').length} lines
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={copyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={downloadText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
              title="Download text file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={() => setText('')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 cursor-pointer"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type lines to sort..."
          className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden text-sm font-mono leading-relaxed resize-y"
        />
      </div>
    </div>
  );
};
