import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { Tool } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { useApp } from '../context/AppContext';

interface ToolCardProps {
  tool: Tool;
  onOpen: (tool: Tool) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onOpen }) => {
  const { isFavorite, toggleFavorite } = useApp();
  const favorited = isFavorite(tool.id);

  return (
    <div
      onClick={() => onOpen(tool)}
      className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
            <DynamicIcon name={tool.icon} className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.popular && (
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40">
                Popular
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(tool.id);
              }}
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
            >
              <Star className={`w-4 h-4 ${favorited ? 'text-amber-500 fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {tool.name}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium">
        <span className="text-slate-400 dark:text-slate-500">
          {tool.categoryName}
        </span>
        <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
          Open Tool
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
