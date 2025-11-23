import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { WallpaperCard } from '../components/WallpaperCard';
import { SEO } from '../components/SEO';
import { getWallpapers } from '../services/supabaseService';
import { Wallpaper } from '../types';

// Retro Typewriter Component
const RetroTypewriter: React.FC<{ text: string | number; delay?: number; className?: string }> = ({ text, delay = 0, className = "" }) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const strText = String(text);

  useEffect(() => {
    setDisplayText('');
    setShowCursor(false);

    const startTimeout = setTimeout(() => {
      setShowCursor(true);
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayText(strText.substring(0, i + 1));
        i++;
        if (i >= strText.length) {
          clearInterval(intervalId);
        }
      }, 50); // Typing speed
      return () => clearInterval(intervalId);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [strText, delay]);

  return (
    <span className={`${className} inline-flex items-center`}>
      {displayText}
      <span className={`inline-block w-3 h-[1em] bg-retro-orange ml-1 ${showCursor ? 'animate-pulse' : 'opacity-0'}`}></span>
    </span>
  );
};

export const WallpaperDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const [suggestions, setSuggestions] = useState<Wallpaper[]>([]);
  const [allWallpapers, setAllWallpapers] = useState<Wallpaper[]>([]);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'preparing' | 'downloading' | 'complete'>('idle');

  useEffect(() => {
    (async () => {
      try {
        const data = await getWallpapers();
        setAllWallpapers(data || []);
      } catch (e) {
        setAllWallpapers([]);
      }
    })();
  }, []);

  useEffect(() => {
    const found = allWallpapers.find(w => w.id.toString() === id);
    if (found) {
      setWallpaper(found);
      const otherWallpapers = allWallpapers.filter(w => w.id.toString() !== id);
      const shuffled = [...otherWallpapers].sort(() => 0.5 - Math.random());
      setSuggestions(shuffled.slice(0, 4));
    } else if (allWallpapers.length > 0) {
      navigate('/');
    }
  }, [id, allWallpapers, navigate]);

  if (!wallpaper) return null;

  const imgSrc = wallpaper.image_link;

  const startDownload = () => {
    setDownloadStatus('downloading');
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = `vyric-${wallpaper.name.replace(/\s+/g, '-').toLowerCase()}-${wallpaper.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloadStatus('complete'), 1000);
    setTimeout(() => setDownloadStatus('idle'), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] p-4 md:p-8 bg-retro-bg dark:bg-retro-black">
      <SEO
        title={`${wallpaper.name} Wallpaper - Free Download | Vyric OS`}
        description={`Download this high-resolution ${wallpaper.category || 'wallpaper'} for free. Asset ID: ${wallpaper.id}. Optimized for ${wallpaper.ratio} screens.`}
        keywords={`${wallpaper.category || 'wallpaper'}, free wallpaper, 4k wallpaper, retro aesthetic, digital art`}
        image={imgSrc}
      />

      <article className="max-w-7xl mx-auto border-2 border-retro-black dark:border-white bg-white dark:bg-black shadow-retro dark:shadow-[8px_8px_0_0_#ffffff] mb-16">
        {/* Header Bar */}
        <header className="bg-retro-black dark:bg-white text-white dark:text-black p-2 flex justify-between items-center">
          <span className="uppercase text-xl">:: File_Inspector_V1.0 ::</span>
          <Link to="/" className="hover:bg-retro-orange hover:text-white px-2 uppercase text-lg" aria-label="Close">
            [ X CLOSE ]
          </Link>
        </header>

        <div className="flex flex-col lg:flex-row">
          {/* Image Area - No padding, full width/height of container, centered */}
          <div className="lg:w-2/3 border-b-2 lg:border-b-0 lg:border-r-2 border-retro-black dark:border-white relative bg-transparent flex items-center justify-center p-0 overflow-hidden">
            <img
              src={imgSrc}
              alt={`Detailed view of ${wallpaper.name}`}
              className="w-full h-auto max-h-[85vh] object-contain block"
            />
          </div>

          {/* Data Panel */}
          <div className="lg:w-1/3 p-8 flex flex-col justify-between">
            <div>
              <div className="mb-4 min-h-[4rem]">
                <h1 className="text-4xl uppercase text-retro-orange leading-none break-words">
                  <RetroTypewriter text={wallpaper.name} delay={200} />
                </h1>
              </div>

              {/* Stats Table */}
              <div className="w-full border-2 border-retro-black dark:border-white text-lg mb-8">
                <div className="flex border-b-2 border-retro-black dark:border-white">
                  <div className="w-1/2 p-2 border-r-2 border-retro-black dark:border-white bg-neutral-100 dark:bg-neutral-800 uppercase">Ratio</div>
                  <div className="w-1/2 p-2 font-mono">
                    <RetroTypewriter text={wallpaper.ratio || "3:4"} delay={800} />
                  </div>
                </div>
                <div className="flex border-b-2 border-retro-black dark:border-white">
                  <div className="w-1/2 p-2 border-r-2 border-retro-black dark:border-white bg-neutral-100 dark:bg-neutral-800 uppercase">Size</div>
                  <div className="w-1/2 p-2 font-mono">
                    <RetroTypewriter text={wallpaper.size} delay={1400} />
                  </div>
                </div>
                {wallpaper.category && (
                  <div className="flex">
                    <div className="w-1/2 p-2 border-r-2 border-retro-black dark:border-white bg-neutral-100 dark:bg-neutral-800 uppercase">Category</div>
                    <div className="w-1/2 p-2 uppercase">{wallpaper.category}</div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={startDownload}
              className="w-full py-4 text-2xl uppercase font-bold border-2 border-retro-black dark:border-white shadow-retro-sm hover:shadow-retro hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all bg-retro-orange text-white"
            >
              {downloadStatus === 'downloading' ? (
                <span>{'>>'} TRANSFERRING {'>>'}</span>
              ) : downloadStatus === 'complete' ? (
                <span>[ COMPLETE ]</span>
              ) : (
                <span>[ DOWNLOAD_ASSET ]</span>
              )}
            </button>
          </div>
        </div>
      </article>

      {/* Suggestions Section */}
      <section className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6 border-b-2 border-retro-black dark:border-white pb-2">
          <div className="w-4 h-4 bg-retro-orange"></div>
          <h2 className="text-2xl md:text-3xl uppercase">Suggested_Datastreams</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {suggestions.map((w) => (
            <WallpaperCard key={w.id} wallpaper={w} />
          ))}
        </div>
      </section>
    </div>
  );
};