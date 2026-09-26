import React, { useState } from 'react';
import { Sparkles, Copy, Check, Trash2, Download } from 'lucide-react';

export const TextCleaner: React.FC = () => {
  const [text, setText] = useState<string>(
    '   This text    has excessive spaces.   \n\n\nAnd multiple blank lines between paragraphs.   \n\n     Extra   tabs and spaces everywhere.   '
  );
  const [copied, setCopied] = useState(false);

  // Operations
  const removeExtraSpaces = () => {
    setText((prev) => prev.replace(/[ \t]+/g, ' '));
  };

  const removeEmptyLines = () => {
    setText((prev) =>
      prev
        .split('\n')
        .filter((line) => line.trim().length > 0)
        .join('\n')
    );
  };

  const trimAllLines = () => {
    setText((prev) =>
      prev
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
    );
  };

  const cleanAll = () => {
    setText((prev) =>
      prev
        .split('\n')
        .map((line) => line.trim().replace(/[ \t]+/g, ' '))
        .filter((line) => line.length > 0)
        .join('\n')
    );
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
    a.download = `cleaned-text-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Cleaning Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={cleanAll}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Clean Everything</span>
        </button>
        <button
          onClick={removeExtraSpaces}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer shadow-xs"
        >
          Single Space Only
        </button>
        <button
          onClick={removeEmptyLines}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer shadow-xs"
        >
          Remove Blank Lines
        </button>
        <button
          onClick={trimAllLines}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer shadow-xs"
        >
          Trim Line Ends
        </button>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400">
            {text.length} characters • {text.split('\n').length} lines
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
          placeholder="Paste messy text here..."
          className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden text-sm font-sans leading-relaxed resize-y"
        />
      </div>
    </div>
  );
};
