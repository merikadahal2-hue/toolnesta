import React, { useState, useMemo } from 'react';
import { FileText, Copy, Trash2, Clock, Check } from 'lucide-react';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState<string>(
    'ToolNest is a fast, simple collection of everyday web utilities that run completely inside your browser. No registration is required, and your files stay private.'
  );
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const raw = text.trim();
    if (!raw) {
      return {
        words: 0,
        charsWithSpaces: text.length,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
      };
    }

    // Words
    const words = raw.split(/\s+/).filter(Boolean).length;
    // Chars with and without spaces
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    // Sentences
    const sentences = raw.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    // Paragraphs
    const paragraphs = raw.split(/\n+/).filter((p) => p.trim().length > 0).length;

    // Reading time at ~200 wpm, speaking at ~130 wpm
    const readingTimeMinutes = Math.ceil(words / 200);
    const speakingTimeMinutes = Math.ceil(words / 130);

    return {
      words,
      charsWithSpaces,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
    };
  }, [text]);

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-center space-y-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
            {stats.words.toLocaleString()}
          </span>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Words
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-center space-y-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
            {stats.charsWithSpaces.toLocaleString()}
          </span>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Characters
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 text-center space-y-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">
            {stats.charsNoSpaces.toLocaleString()}
          </span>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            No Spaces
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-center space-y-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {stats.sentences.toLocaleString()}
          </span>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Sentences
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 text-center space-y-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
            {stats.paragraphs.toLocaleString()}
          </span>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Paragraphs
          </p>
        </div>
      </div>

      {/* Editor Box */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Reading time: ~{stats.readingTimeMinutes} min
            </span>
            <span className="hidden sm:inline">Speaking time: ~{stats.speakingTimeMinutes} min</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyText}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={() => setText('')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 cursor-pointer"
              title="Clear text"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or start typing your text here..."
          className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden text-base leading-relaxed resize-y"
        />
      </div>
    </div>
  );
};
