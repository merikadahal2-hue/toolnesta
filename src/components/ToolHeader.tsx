import React from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { Tool } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { PrivacyBadge } from './PrivacyBadge';
import { useApp } from '../context/AppContext';

interface ToolHeaderProps {
  tool: Tool;
  onBack: () => void;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({ tool, onBack }) => {
  const { isFavorite, toggleFavorite } = useApp();
  const favorited = isFavorite(tool.id);

  return (
    <div className="mb-6 space-y-4">
      {/* Navigation Breadcrumb / Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tools</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
            {tool.categoryName}
          </span>
          <button
            onClick={() => toggleFavorite(tool.id)}
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              favorited
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-500 fill-amber-500'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-200'
            }`}
          >
            <Star className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Tool Title and Details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
            <DynamicIcon name={tool.icon} className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {tool.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {tool.description}
            </p>
          </div>
        </div>

        {tool.privacyNotice && (
          <div className="shrink-0">
            <PrivacyBadge text={tool.privacyNotice} />
          </div>
        )}
      </div>
    </div>
  );
};
