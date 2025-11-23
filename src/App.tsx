import React, { useState, createContext, useContext, useEffect, ReactNode } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { WallpaperDetail } from './pages/WallpaperDetail';

// --- Context Setup ---
interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('vyric-theme');
        if (saved === 'light' || saved === 'dark') return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Default to light for the "white" feel
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('vyric-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};

// --- Scroll To Top Component ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Main App Component ---
const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="relative min-h-screen flex flex-col selection:bg-retro-orange selection:text-white">
          {/* Scrolling Background Layer - Absolute to container, not fixed to viewport */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-10 dark:opacity-20 bg-dot-pattern dark:bg-dot-pattern-dark bg-dot-grid" />
          
          <div className="relative z-10 flex flex-col flex-grow">
            <Header />
            <main className="flex-grow pt-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/wallpaper/:id" element={<WallpaperDetail />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;