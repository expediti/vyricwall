import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CATEGORIES, Category, Wallpaper } from '../types';
import { useAppContext } from '../App';
import { generateWallpaperImage } from '../services/geminiService';
import { WallpaperCard } from '../components/WallpaperCard';
import { SEO } from '../components/SEO';

export const Home: React.FC = () => {
  const { wallpapers, addWallpaper } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState<Category | string>('All');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const location = useLocation();
  
  useEffect(() => {
    if (location.state && (location.state as any).searchQuery) {
      const query = (location.state as any).searchQuery;
      setSelectedCategory(query);
      handleGenerate(query, 'Custom Search');
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const displayedWallpapers = wallpapers.filter(w => {
    if (selectedCategory === 'All') return true;
    if (CATEGORIES.includes(selectedCategory as Category)) {
      return w.category === selectedCategory;
    }
    return true;
  });

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat);
    setGenerationError(null);
  };

  const handleGenerate = async (promptInput?: string, categoryInput?: string) => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setGenerationError(null);

    const categoryToUse = categoryInput || (selectedCategory === 'All' ? 'Abstract' : selectedCategory);
    const promptToUse = promptInput || categoryToUse;

    // Determine aspect ratio based on category
    let ratio = "3:4";
    if (categoryToUse === 'Laptop') ratio = "16:9";
    if (categoryToUse === 'Phone') ratio = "9:16";

    const result = await generateWallpaperImage(promptToUse, categoryToUse, ratio);

    if (result.success && result.imageBase64) {
      const newWallpaper: Wallpaper = {
        id: Date.now().toString(),
        url: result.imageBase64,
        category: categoryToUse,
        prompt: promptToUse,
        createdAt: Date.now(),
        aspectRatio: ratio
      };
      addWallpaper(newWallpaper);
    } else {
      setGenerationError(result.error || "Failed to generate.");
    }

    setIsGenerating(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <SEO 
        title="Vyric - Retro OS Wallpaper Database | Free 4K"
        description="Access and download unique, high-quality 4K wallpapers. Retro aesthetic, minimalist design, and free to use for phone and desktop."
        keywords="wallpaper, free 4k wallpaper, retro background, pixel art, database, vyric os"
      />
      
      {/* Hero Section */}
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
              Undefined<br/>Elegance_
            </h1>
            <p className="text-xl md:text-2xl text-retro-black/60 dark:text-white/60 font-mono">
              {'>'} Initiating premium pixel render sequence...<br/>
              {'>'} Loading unique assets...
            </p>
        </div>
      </div>

      {/* Categories - Unique Chip Design */}
      <div className="mb-12">
        <nav aria-label="Categories" className="flex flex-wrap gap-3">
            <button
                onClick={() => handleCategoryClick('All')}
                className={`
                    group relative px-3 py-1 text-sm md:text-base font-bold uppercase border-2 transition-all duration-100
                    ${selectedCategory === 'All'
                    ? 'bg-retro-black dark:bg-white text-white dark:text-black border-retro-black dark:border-white shadow-none translate-y-1'
                    : 'bg-white dark:bg-black text-retro-black dark:text-white border-retro-black dark:border-white shadow-retro-sm hover:-translate-y-0.5 hover:shadow-retro hover:bg-retro-orange hover:text-white dark:hover:bg-retro-orange'
                    }
                `}
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
                className={`
                    group relative px-3 py-1 text-sm md:text-base font-bold uppercase border-2 transition-all duration-100
                    ${selectedCategory === cat
                    ? 'bg-retro-black dark:bg-white text-white dark:text-black border-retro-black dark:border-white shadow-none translate-y-1'
                    : 'bg-white dark:bg-black text-retro-black dark:text-white border-retro-black dark:border-white shadow-retro-sm hover:-translate-y-0.5 hover:shadow-retro hover:bg-retro-orange hover:text-white dark:hover:bg-retro-orange'
                    }
                `}
                >
                 <span className="flex items-center gap-2">
                   {/* Small chip decoration */}
                   <span className="text-xs opacity-50">/</span>
                   {cat}
                </span>
                </button>
            ))}
        </nav>
      </div>

      {/* Error Message */}
      {generationError && (
        <div className="mb-8 p-4 border-2 border-red-500 bg-red-100 text-red-600 font-bold uppercase flex items-center gap-4" role="alert">
            <span>[ ERROR ]</span>
            <span>{generationError}</span>
        </div>
      )}

      {/* Grid */}
      {displayedWallpapers.length === 0 ? (
        <div className="py-32 border-2 border-dashed border-retro-black dark:border-white flex flex-col items-center justify-center text-retro-black dark:text-white opacity-50">
             <p className="text-2xl uppercase">Directory Empty.</p>
        </div>
      ) : (
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-label="Wallpaper Gallery">
          {displayedWallpapers.map((wp, index) => (
            <WallpaperCard key={wp.id} wallpaper={wp} index={index} />
          ))}
        </section>
      )}
      
      {isGenerating && (
         <div className="fixed bottom-8 right-8 w-64 bg-white dark:bg-black border-2 border-retro-black dark:border-white shadow-retro z-50">
             <div className="bg-retro-black dark:bg-white text-white dark:text-black px-2 py-1 text-sm uppercase font-bold flex justify-between">
                <span>System_Worker.exe</span>
                <span>[ - ]</span>
             </div>
             <div className="p-4 flex flex-col gap-2">
                <p className="text-lg uppercase text-retro-black dark:text-white animate-pulse">{'>>'} RENDERING PIXELS...</p>
                <div className="h-4 border-2 border-retro-black dark:border-white p-0.5">
                    <div className="h-full bg-retro-orange w-full animate-[pulse_1s_ease-in-out_infinite]"></div>
                </div>
             </div>
         </div>
      )}
    </div>
  );
};
