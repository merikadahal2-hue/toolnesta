import React from 'react';
import { Wrench, Shield, Heart } from 'lucide-react';
import { CATEGORIES } from '../data/toolsRegistry';
import { ToolCategory } from '../types';

interface FooterProps {
  onSelectCategory: (categoryId: ToolCategory | 'all') => void;
  onOpenAbout: () => void;
  onOpenPrivacy: () => void;
  onOpenFeedback: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAbout,
  onOpenPrivacy,
  onOpenFeedback,
}) => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors mt-auto">
      {/* Privacy Banner strip */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/80 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Privacy First:</strong> All file conversions and calculations execute client-side in your browser. We never inspect or store your documents.
            </span>
          </div>
          <button
            onClick={onOpenPrivacy}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer shrink-0"
          >
            Read Privacy Architecture →
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Tool<span className="text-blue-600 dark:text-blue-400">Nest</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              ToolNest — Simple tools for everyday tasks. High speed, zero clutter, and zero sign-ups needed.
            </p>
            <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <span>Built with precision & local privacy</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-current inline" />
            </div>
          </div>

          {/* Categories Col 1 */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Categories
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Col 2 */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              More Tools
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {CATEGORIES.slice(4).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company / Legal Col */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              About & Legal
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  About ToolNest
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFeedback}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Feedback & Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ToolNest. All rights reserved. No accounts required.</p>
          <p>Browser-powered client-side tools.</p>
        </div>
      </div>
    </footer>
  );
};
