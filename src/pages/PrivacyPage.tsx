import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, HardDrive, EyeOff } from 'lucide-react';

interface PrivacyPageProps {
  onBack: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tools</span>
      </button>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy-First Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy & Technical Guarantees
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          At ToolNest, we believe that simple utility tools shouldn't require surrendering your personal documents, files, or sensitive information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">100% Client-Side Processing</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            All PDF operations (viewing, merging, splitting, compressing), image conversions, QR codes, word counters, and math calculations execute strictly inside your local browser tab using WebAssembly, HTML5 Canvas, and client-side JavaScript.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Server Storage</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We operate no backend file storage buckets, no temporary file caches, and no tracking databases. When you close or refresh your tab, your active files are wiped from browser RAM.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <HardDrive className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">What is stored locally on your device?</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          For your convenience, ToolNest utilizes your browser's local storage (<code>localStorage</code>) strictly for:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300 pl-2">
          <li><strong>Theme preference:</strong> Dark mode, light mode, or system default.</li>
          <li><strong>Favorite tools:</strong> Your starred tools so you can access them quickly.</li>
          <li><strong>Recently used tools:</strong> The last 10 tools you opened (you can clear this anytime).</li>
          <li><strong>Optional local feedback:</strong> Any feedback draft you submit.</li>
        </ul>
        <p className="text-xs text-slate-500 dark:text-slate-400 pt-2">
          None of this local data is ever transmitted or synchronized across the network.
        </p>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 pt-6 text-xs text-slate-500 dark:text-slate-400">
        Last updated: September 2026. For questions or technical security audits, please use the Feedback option in the footer.
      </div>
    </div>
  );
};
