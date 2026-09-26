import React, { useState, useMemo } from 'react';
import {
  Search,
  Star,
  History,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { TOOLS, CATEGORIES, POPULAR_TOOLS, getToolById } from '../data/toolsRegistry';
import { Tool, ToolCategory } from '../types';
import { ToolCard } from '../components/ToolCard';
import { useApp } from '../context/AppContext';

interface HomePageProps {
  onSelectTool: (tool: Tool) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTool,
  activeCategory,
  setActiveCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { favorites, recentTools, clearRecentTools } = useApp();

  // Quick filter tools
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      // Category filter
      if (activeCategory === 'favorites') {
        if (!favorites.includes(tool.id)) return false;
      } else if (activeCategory !== 'all' && tool.categoryId !== activeCategory) {
        return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.categoryName.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [activeCategory, searchQuery, favorites]);

  // Resolved recent tool objects
  const recentToolObjects = useMemo(() => {
    return recentTools
      .map((id) => getToolById(id))
      .filter((t): t is Tool => Boolean(t));
  }, [recentTools]);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-4xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-xs">
          <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Useful tools. Simple. Fast. Free.</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Everything you need, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            in one place.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Free, simple online tools for PDFs, images, calculations, text, conversions, and everyday tasks. No sign-up required.
        </p>

        {/* Big Search Input */}
        <div className="relative max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center shadow-lg shadow-blue-500/5 dark:shadow-none rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
            <Search className="w-6 h-6 text-slate-400 ml-4 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a tool... (e.g. PDF Reader, Resizer, Calculator, QR)"
              className="w-full py-4 pl-3 pr-4 text-base sm:text-lg bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mr-3 px-2 py-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Popular shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium mr-1">Popular:</span>
            {[
              { id: 'pdf-reader', label: 'PDF Reader' },
              { id: 'merge-pdf', label: 'PDF Merge' },
              { id: 'calculator', label: 'Calculator' },
              { id: 'image-resizer', label: 'Image Resizer' },
              { id: 'qr-generator', label: 'QR Generator' },
              { id: 'word-counter', label: 'Word Counter' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  const t = getToolById(item.id);
                  if (t) onSelectTool(t);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Category Pills Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            All Tools ({TOOLS.length})
          </button>

          <button
            onClick={() => setActiveCategory('favorites')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'favorites'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Star className={`w-4 h-4 ${activeCategory === 'favorites' ? 'fill-white' : ''}`} />
            <span>Favorites ({favorites.length})</span>
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Recently Used Tools (if any exist) */}
      {!searchQuery && activeCategory === 'all' && recentToolObjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recently Used</h2>
            </div>
            <button
              onClick={clearRecentTools}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentToolObjects.map((tool) => (
              <ToolCard key={`recent-${tool.id}`} tool={tool} onOpen={onSelectTool} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Tools Highlight (shown on All Tools default view) */}
      {!searchQuery && activeCategory === 'all' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Popular Tools</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {POPULAR_TOOLS.map((tool) => (
              <ToolCard key={`pop-${tool.id}`} tool={tool} onOpen={onSelectTool} />
            ))}
          </div>
        </section>
      )}

      {/* Main Grid / Filtered Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {activeCategory === 'all'
                ? searchQuery
                  ? `Search Results (${filteredTools.length})`
                  : 'All Tools'
                : activeCategory === 'favorites'
                ? `Your Starred Tools (${filteredTools.length})`
                : `${CATEGORIES.find((c) => c.id === activeCategory)?.name || 'Tools'} (${filteredTools.length})`}
            </h2>
            {activeCategory !== 'all' && activeCategory !== 'favorites' && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {CATEGORIES.find((c) => c.id === activeCategory)?.description}
              </p>
            )}
          </div>
        </div>

        {filteredTools.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                No tools found
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {activeCategory === 'favorites'
                  ? "You haven't starred any tools yet. Click the star icon on any tool card to save it here!"
                  : `We couldn't find any tool matching "${searchQuery}".`}
              </p>
            </div>
            {(searchQuery || activeCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onOpen={onSelectTool} />
            ))}
          </div>
        )}
      </section>

      {/* Privacy Banner callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Client-Side Processing Guarantee
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Your private files never leave your device. All PDF conversions, image compression, formatting, and calculations happen directly within your browser.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <button
              onClick={() => setActiveCategory('pdf')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-sm font-medium hover:border-blue-500 shadow-xs transition-colors cursor-pointer"
            >
              <span>Explore PDF Tools</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
