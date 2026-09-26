import React, { useState } from 'react';
import { ListFilter, Copy, Check, Trash2, Download } from 'lucide-react';

export const RemoveDuplicates: React.FC = () => {
  const [text, setText] = useState<string>(
    'apple\nbanana\nApple\norange\nbanana\ngrape\norange\n\nwatermelon'
  );
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [removeEmpty, setRemoveEmpty] = useState<boolean>(true);
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);

  const lines = text.split('\n');
  const originalLineCount = lines.length;

  const processLines = (): string[] => {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const rawLine of lines) {
      let line = rawLine;
      if (trimWhitespace) line = line.trim();
      if (removeEmpty && line.length === 0) continue;

      const compareKey = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(compareKey)) {
        seen.add(compareKey);
        result.push(line);
      }
    }

    return result;
  };

  const deduplicatedLines = processLines();
  const deduplicatedText = deduplicatedLines.join('\n');
  const removedCount = originalLineCount - deduplicatedLines.length;

  const copyResult = () => {
    navigator.clipboard.writeText(deduplicatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResult = () => {
    const blob = new Blob([deduplicatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deduplicated-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Options bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded accent-blue-600"
            />
            <span>Case Sensitive</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeEmpty}
              onChange={(e) => setRemoveEmpty(e.target.checked)}
              className="rounded accent-blue-600"
            />
            <span>Remove Empty Lines</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(e) => setTrimWhitespace(e.target.checked)}
              className="rounded accent-blue-600"
            />
            <span>Trim Whitespace</span>
          </label>
        </div>

        <div className="text-xs text-slate-500">
          <span>{originalLineCount} lines → </span>
          <strong className="text-blue-600 dark:text-blue-400">{deduplicatedLines.length} unique</strong>
          {removedCount > 0 && <span className="text-emerald-600 ml-1">({removedCount} removed)</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Input Lines
            </span>
            <button
              onClick={() => setText('')}
              className="text-xs text-slate-400 hover:text-red-500 cursor-pointer"
            >
              Clear
            </button>
          </div>
          <textarea
            rows={12}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste lines of text here..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden text-sm font-mono leading-relaxed resize-y"
          />
        </div>

        {/* Output */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Unique Output
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={copyResult}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={downloadResult}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                title="Download"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <textarea
            readOnly
            rows={12}
            value={deduplicatedText}
            placeholder="Unique lines will appear here..."
            className="w-full bg-transparent text-slate-900 dark:text-white focus:outline-hidden text-sm font-mono leading-relaxed resize-y"
          />
        </div>
      </div>
    </div>
  );
};
