import React, { useState, createContext, useContext, useEffect, ReactNode } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { WallpaperDetail } from './pages/WallpaperDetail';
import { Wallpaper } from './types';

// --- Context Setup ---
interface AppContextType {
  wallpapers: Wallpaper[];
  addWallpaper: (wallpaper: Wallpaper) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

const INITIAL_WALLPAPERS: Wallpaper[] = [
  {
    id: 'init-1',
    url: 'https://images.unsplash.com/photo-1623934199716-dc28818a6ec7?q=80&w=1000&auto=format&fit=crop',
    prompt: 'Iron Man Mark LXXXV',
    category: 'Iron Man',
    createdAt: Date.now(),
    aspectRatio: '3:4'
  },
  {
    id: 'init-2',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop',
    prompt: 'Industrial Gears & Machineries',
    category: 'Machineries',
    createdAt: Date.now(),
    aspectRatio: '3:4'
  },
  {
    id: 'init-3',
    url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1000&auto=format&fit=crop',
    prompt: 'The Amazing Spider-Man',
    category: 'Spider-Man',
    createdAt: Date.now(),
    aspectRatio: '3:4'
  },
  {
    id: 'init-4',
    url: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=1000&auto=format&fit=crop',
    prompt: 'Avengers Assemble',
    category: 'Avengers',
    createdAt: Date.now(),
    aspectRatio: '3:4'
  },
  {
    id: 'init-5',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
    prompt: 'Pandora Bioluminescence',
    category: 'Avatar',
    createdAt: Date.now(),
    aspectRatio: '3:4'
  }
];

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(INITIAL_WALLPAPERS);
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

  const addWallpaper = (wallpaper: Wallpaper) => {
    setWallpapers(prev => [wallpaper, ...prev]);
  };

  return (
    <AppContext.Provider value={{ wallpapers, addWallpaper, theme, toggleTheme }}>
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