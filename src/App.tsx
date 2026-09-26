import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { FeedbackModal } from './components/FeedbackModal';
import { HomePage } from './pages/HomePage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { getToolById, TOOLS } from './data/toolsRegistry';
import { Tool, ToolCategory } from './types';

function MainApp() {
  const { searchOpen, setSearchOpen } = useApp();
  const [activeView, setActiveView] = useState<'home' | 'tool' | 'about' | 'privacy'>('home');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false);

  // Sync hash routing so back/forward buttons and direct links work
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (!hash) {
        setActiveView('home');
        setSelectedTool(null);
      } else if (hash === 'about') {
        setActiveView('about');
        setSelectedTool(null);
      } else if (hash === 'privacy') {
        setActiveView('privacy');
        setSelectedTool(null);
      } else {
        const found = getToolById(hash);
        if (found) {
          setSelectedTool(found);
          setActiveView('tool');
        } else {
          setActiveView('home');
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToHome = () => {
    window.location.hash = '';
    setActiveView('home');
    setSelectedTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTool = (tool: Tool) => {
    window.location.hash = `/${tool.id}`;
    setSelectedTool(tool);
    setActiveView('tool');
  };

  const handleSelectCategory = (catId: ToolCategory | 'all' | 'favorites') => {
    setActiveCategory(catId);
    if (activeView !== 'home') {
      window.location.hash = '';
      setActiveView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAbout = () => {
    window.location.hash = '/about';
    setActiveView('about');
    setSelectedTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPrivacy = () => {
    window.location.hash = '/privacy';
    setActiveView('privacy');
    setSelectedTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navigation */}
      <Header
        onNavigateHome={navigateToHome}
        onSelectCategory={handleSelectCategory}
        activeCategory={activeCategory}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'home' && (
          <HomePage
            onSelectTool={handleSelectTool}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        )}

        {activeView === 'tool' && selectedTool && (
          <ToolDetailPage tool={selectedTool} onBack={navigateToHome} />
        )}

        {activeView === 'about' && (
          <AboutPage onBack={navigateToHome} onExploreTools={navigateToHome} />
        )}

        {activeView === 'privacy' && <PrivacyPage onBack={navigateToHome} />}
      </main>

      {/* Global Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenAbout={navigateToAbout}
        onOpenPrivacy={navigateToPrivacy}
        onOpenFeedback={() => setFeedbackOpen(true)}
      />

      {/* Global Search Modal (Ctrl/Cmd + K) */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectTool={handleSelectTool}
      />

      {/* Feedback & Support Modal */}
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
