import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Star,
  FileText,
  Image as ImageIcon,
  Calculator,
  ArrowRightLeft,
  Type,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/toolsRegistry';
import { ToolCategory } from '../types';

interface HeaderProps {
  onNavigateHome: () => void;
  onSelectCategory: (categoryId: ToolCategory | 'all' | 'favorites') => void;
  activeCategory: string;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateHome,
  onSelectCategory,
  activeCategory,
}) => {
  const { theme, setTheme, setSearchOpen, favorites } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else setTheme('dark');
  };

  const navCategories: { id: ToolCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'pdf', label: 'PDF Tools', icon: <FileText className="w-4 h-4" /> },
    { id: 'image', label: 'Image Tools', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'calculator', label: 'Calculators', icon: <Calculator className="w-4 h-4" /> },
    { id: 'converter', label: 'Converters', icon: <ArrowRightLeft className="w-4 h-4" /> },
    { id: 'text', label: 'Text Tools', icon: <Type className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => {
              onNavigateHome();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                Tool<span className="text-blue-600 dark:text-blue-400">Nest</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 -mt-1 font-medium tracking-wide">
                SIMPLE • FAST • FREE
              </span>
            </div>
          </div>

          {/* Desktop Search Trigger */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <span>Search tools...</span>
              </div>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              All Tools
            </button>

            {navCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                }`}
              >
                {cat.label}
              </button>
            ))}

            {/* More Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60 cursor-pointer"
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {categoriesDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50"
                  onClick={() => setCategoriesDropdownOpen(false)}
                >
                  {CATEGORIES.slice(5).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onSelectCategory(cat.id)}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                    >
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right actions: Favorites, Search (mobile), Theme toggle, Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Mobile Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Favorites link */}
            <button
              onClick={() => onSelectCategory('favorites')}
              className={`p-2 rounded-xl transition-colors cursor-pointer relative ${
                activeCategory === 'favorites'
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Favorite Tools"
            >
              <Star className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>

            {/* Theme switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => {
              onSelectCategory('all');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            All Tools
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer"
            >
              <span>{cat.name}</span>
            </button>
          ))}
          <button
            onClick={() => {
              onSelectCategory('favorites');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2 cursor-pointer"
          >
            <Star className="w-4 h-4 fill-current" />
            <span>My Starred Tools ({favorites.length})</span>
          </button>
        </div>
      )}
    </header>
  );
};
