import React, { useState } from 'react';
import { Type, Copy, Trash2, Download, Check } from 'lucide-react';

export const CaseConverter: React.FC = () => {
  const [text, setText] = useState<string>('hello world. welcome to toolnest online utilities.');
  const [copied, setCopied] = useState(false);

  const toUpperCase = () => setText((prev) => prev.toUpperCase());
  const toLowerCase = () => setText((prev) => prev.toLowerCase());

  const toSentenceCase = () => {
    setText((prev) =>
      prev.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
    );
  };

  const toTitleCase = () => {
    const minorWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'in', 'of'];
    setText((prev) =>
      prev
        .toLowerCase()
        .split(' ')
        .map((word, index) => {
          if (index > 0 && minorWords.includes(word)) return word;
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ')
    );
  };

  const toCapitalizeEachWord = () => {
    setText((prev) =>
      prev
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );
  };

  const toCamelCase = () => {
    setText((prev) =>
      prev
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/^[A-Z]/, (c) => c.toLowerCase())
    );
  };

  const toSnakeCase = () => {
    setText((prev) =>
      prev
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '')
    );
  };

  const toKebabCase = () => {
    setText((prev) =>
      prev
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '')
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
    a.download = `case-converted-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Transformation Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={toUpperCase}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs"
        >
          UPPERCASE
        </button>
        <button
          onClick={toLowerCase}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs"
        >
          lowercase
        </button>
        <button
          onClick={toSentenceCase}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs"
        >
          Sentence case
        </button>
        <button
          onClick={toTitleCase}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs"
        >
          Title Case
        </button>
        <button
          onClick={toCapitalizeEachWord}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs"
        >
          Capitalize Words
        </button>
        <button
          onClick={toCamelCase}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs"
        >
          camelCase
        </button>
        <button
          onClick={toKebabCase}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs"
        >
          kebab-case
        </button>
        <button
          onClick={toSnakeCase}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs"
        >
          snake_case
        </button>
      </div>

      {/* Editor Box */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400">
            {text.length} characters • {text.trim() ? text.trim().split(/\s+/).length : 0} words
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
          rows={9}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text..."
          className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden text-base leading-relaxed resize-y font-sans"
        />
      </div>
    </div>
  );
};
