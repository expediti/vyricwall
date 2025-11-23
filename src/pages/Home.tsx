import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CATEGORIES, Category, Wallpaper } from '../types';
import { WallpaperCard } from '../components/WallpaperCard';
import { SEO } from '../components/SEO';
import { getWallpapers } from '../services/supabaseService';

export const Home: React.FC = () => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | string>('All');
  const [generationError, setGenerationError] = useState<string | null>(null);
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getWallpapers();
        setWallpapers(data || []);
      } catch (e) {
        setWallpapers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (location.state && (location.state as any).searchQuery) {
      const query = (location.state as any).searchQuery;
      setSelectedCategory(query);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const displayedWallpapers = wallpapers.filter(w => {
    if (selectedCategory === 'All') return true;
    if (CATEGORIES.includes(selectedCategory as Category) && w.category) {
      return w.category === selectedCategory;
    }
    return true;
  });

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat);
    setGenerationError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <SEO
        title="Vyric - Retro OS Wallpaper Database | Free 4K"
        description="Access and download unique, high-quality 4K wallpapers. Retro aesthetic, minimalist design, and free to use for phone and desktop."
        keywords="wallpaper, free 4k wallpaper, retro background, pixel art, database, vyric os"
      />

      <div className="mb-12 border-b-4 border-double border-retro-black dark:border-white pb-8">
        <div className="flex flex-col items-start justify-center gap-4">
          <div className="flex items-center gap-3 border-2 border-retro-orange bg-white dark:bg-black px-4 py-2 shadow-[4px_4px_0_0_#ff4500]">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full bg-retro-orange opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 bg-retro-orange"></span>
            </div>
            <span className="text-retro-orange font-bold uppercase tracking-widest text-lg">
              User_Online
            </span>
          </div>
          <h1 className="text-6xl md:text-9xl text-retro-black dark:text-white leading-none uppercase">
            Undefined<br />Elegance_
          </h1>
          <p className="text-xl md:text-2xl text-retro-black/60 dark:text-white/60 font-mono">
            {'>'} Initiating premium pixel render sequence...<br />
            {'>'} Loading unique assets...
          </p>
        </div>
      </div>

      <div className="mb-12">
        <nav aria-label="Categories" className="flex flex-wrap gap-3">
          <button
            onClick={() => handleCategoryClick('All')}
            className={`group relative px-3 py-1 text-sm md:text-base font-bold uppercase border-2 transition-all duration-100 ${selectedCategory === 'All' ? 'bg-retro-black dark:bg-white text-white dark:text-black border-retro-black dark:border-white shadow-none translate-y-1' : 'bg-white dark:bg-black text-retro-black dark:text-white border-retro-black dark:border-white shadow-retro-sm hover:-translate-y-0.5 hover:shadow-retro hover:bg-retro-orange hover:text-white dark:hover:bg-retro-orange'}`}
          >
            <span className="flex items-center gap-2">
              <span className={`block w-2 h-2 ${selectedCategory === 'All' ? 'bg-retro-orange' : 'bg-retro-black dark:bg-white group-hover:bg-white'}`}></span>
              [ ALL_DATA ]
            </span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`group relative px-3 py-1 text-sm md:text-base font-bold uppercase border-2 transition-all duration-100 ${selectedCategory === cat ? 'bg-retro-black dark:bg-white text-white dark:text-black border-retro-black dark:border-white shadow-none translate-y-1' : 'bg-white dark:bg-black text-retro-black dark:text-white border-retro-black dark:border-white shadow-retro-sm hover:-translate-y-0.5 hover:shadow-retro hover:bg-retro-orange hover:text-white dark:hover:bg-retro-orange'}`}
            >
              <span className="flex items-center gap-2">
                <span className="text-xs opacity-50">/</span>
                {cat}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {generationError && (
        <div className="mb-8 p-4 border-2 border-red-500 bg-red-100 text-red-600 font-bold uppercase flex items-center gap-4" role="alert">
          <span>[ ERROR ]</span>
          <span>{generationError}</span>
        </div>
      )}

      {loading ? (
        <div className="py-32 flex items-center justify-center text-retro-black dark:text-white opacity-50">
          <p className="text-2xl uppercase">Loading wallpapers...</p>
        </div>
      ) : displayedWallpapers.length === 0 ? (
        <div className="py-32 border-2 border-dashed border-retro-black dark:border-white flex flex-col items-center justify-center text-retro-black dark:text-white opacity-50">
          <p className="text-2xl uppercase">Directory Empty.</p>
        </div>
      ) : (
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-label="Wallpaper Gallery">
          {displayedWallpapers.map((wp) => (
            <WallpaperCard key={wp.id} wallpaper={wp} />
          ))}
        </section>
      )}
    </div>
  );
};