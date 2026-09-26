import React, { useState } from 'react';
import { Braces, Copy, Check, Download, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';

export const JsonFormatter: React.FC = () => {
  const [jsonText, setJsonText] = useState<string>(
    '{"name":"ToolNest","version":"1.0.0","privacy":{"localProcessing":true,"trackers":false},"features":["PDF Tools","Image Converter","Calculators","Unit Converter"]}'
  );
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const formatJson = (indent: number) => {
    setError(null);
    if (!jsonText.trim()) return;

    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, indent));
      setIsValid(true);
    } catch (err: any) {
      setIsValid(false);
      setError(err?.message || 'Invalid JSON syntax');
    }
  };

  const minifyJson = () => {
    setError(null);
    if (!jsonText.trim()) return;

    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed));
      setIsValid(true);
    } catch (err: any) {
      setIsValid(false);
      setError(err?.message || 'Invalid JSON syntax');
    }
  };

  const validateJson = () => {
    if (!jsonText.trim()) {
      setError('JSON is empty.');
      setIsValid(false);
      return;
    }
    try {
      JSON.parse(jsonText);
      setIsValid(true);
      setError(null);
    } catch (err: any) {
      setIsValid(false);
      setError(err?.message || 'Invalid JSON syntax');
    }
  };

  const copyJson = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => formatJson(2)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
          >
            Format (2 Spaces)
          </button>
          <button
            onClick={() => formatJson(4)}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs"
          >
            Format (4 Spaces)
          </button>
          <button
            onClick={minifyJson}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs"
          >
            Minify (Compact)
          </button>
          <button
            onClick={validateJson}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs"
          >
            Validate Only
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={downloadJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
            title="Download JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <button
            onClick={() => {
              setJsonText('');
              setError(null);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 cursor-pointer"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status banner */}
      {error ? (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Invalid JSON Syntax: </strong>
            <span>{error}</span>
          </div>
        </div>
      ) : isValid && jsonText.trim() ? (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Valid JSON structure. Ready to copy or download.</span>
        </div>
      ) : null}

      {/* Editor Box */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
        <textarea
          rows={16}
          value={jsonText}
          onChange={(e) => {
            setJsonText(e.target.value);
            setError(null);
          }}
          placeholder="Paste raw JSON here..."
          className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden text-sm font-mono leading-relaxed resize-y selection:bg-blue-500/20"
        />
      </div>
    </div>
  );
};
