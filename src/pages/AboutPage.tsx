import React from 'react';
import { ArrowLeft, Shield, Zap, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
  onExploreTools: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack, onExploreTools }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tools</span>
      </button>

      {/* Hero */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About ToolNest</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Useful tools. Simple. Fast. Free.
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          ToolNest is a curated collection of lightweight online utilities engineered to help everyday people, developers, students, and professionals get things done quickly without installing bulky desktop software or creating endless accounts.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Blazing Fast</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Instant execution. Most tools leverage modern Web APIs directly in your browser, eliminating network transfer delays.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Privacy by Design</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your PDFs, photos, calculations, and sensitive text never leave your device. All computations happen in your browser memory.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Account Ever Needed</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No signup barriers, no email confirmations, and no spam. Open the website, use the tool, and download your result immediately.
          </p>
        </div>
      </div>

      {/* Philosophy */}
      <div className="p-8 rounded-2xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Product Philosophy</h2>
        <ul className="space-y-3 text-slate-700 dark:text-slate-300 text-sm">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>No fake progress bars:</strong> If a conversion takes 100 milliseconds, we show you the result in 100 milliseconds without artificial delays.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Transparent limitations:</strong> When client-side memory or format compatibility has boundaries, we tell you openly.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Zero bloat:</strong> Only clean, functional tools built with modern Web Standards.</span>
          </li>
        </ul>
        <div className="pt-2">
          <button
            onClick={onExploreTools}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer"
          >
            Explore All Tools Now
          </button>
        </div>
      </div>
    </div>
  );
};
