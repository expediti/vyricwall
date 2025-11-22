import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../App';
import { Wallpaper } from '../types';
import { WallpaperCard } from '../components/WallpaperCard';
import { SEO } from '../components/SEO';

// Helper for typewriter effect
interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 20, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayedText.length < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeoutId);
    }
  }, [displayedText, text, speed, started]);

  return <span>{displayedText}{displayedText.length < text.length && <span className="animate-pulse">_</span>}</span>;
};

export const WallpaperDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { wallpapers } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const [suggestions, setSuggestions] = useState<Wallpaper[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'preparing' | 'downloading' | 'complete'>('idle');

  useEffect(() => {
    const found = wallpapers.find(w => w.id === id);
    if (found) {
      setWallpaper(found);
      const otherWallpapers = wallpapers.filter(w => w.id !== id);
      const shuffled = [...otherWallpapers].sort(() => 0.5 - Math.random());
      setSuggestions(shuffled.slice(0, 4));
    } else {
      navigate('/');
    }
  }, [id, wallpapers, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'download' && wallpaper) {
        setDownloadStatus('preparing');
        const timer = setTimeout(() => {
            startDownload();
        }, 1000);
        return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, wallpaper]);

  useEffect(() => {
    setIsLoaded(false);
  }, [id]);

  if (!wallpaper) return null;

  const imgSrc = wallpaper.url.startsWith('http') 
    ? wallpaper.url 
    : `data:image/jpeg;base64,${wallpaper.url}`;

  const startDownload = () => {
    setDownloadStatus('downloading');
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = `vyric-${wallpaper.category.replace(/\s+/g, '-').toLowerCase()}-${wallpaper.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setDownloadStatus('complete'), 1000);
    setTimeout(() => setDownloadStatus('idle'), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] p-4 md:p-8 bg-retro-bg dark:bg-retro-black">
      <SEO 
        title={`${wallpaper.category} Wallpaper - Free Download | Vyric OS`}
        description={`Download this high-resolution ${wallpaper.category} wallpaper for free. Asset ID: ${wallpaper.id}. Optimized for ${wallpaper.aspectRatio === '16:9' ? 'Laptop' : wallpaper.aspectRatio === '9:16' ? 'Phone' : 'Mobile/Desktop'} screens.`}
        keywords={`${wallpaper.category}, free wallpaper, 4k wallpaper, retro aesthetic, digital art, ${wallpaper.prompt.split(' ').slice(0,3).join(', ')}`}
        image={imgSrc.startsWith('http') ? imgSrc : undefined}
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
            {/* Image Area */}
            <div className="lg:w-2/3 p-4 border-b-2 lg:border-b-0 lg:border-r-2 border-retro-black dark:border-white flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 min-h-[50vh]">
                 <img 
                    src={imgSrc} 
                    alt={`Detailed view of ${wallpaper.prompt}`}
                    className={`max-h-[70vh] w-auto border-2 border-retro-black dark:border-white transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setIsLoaded(true)}
                />
            </div>

            {/* Data Panel */}
            <div className="lg:w-1/3 p-8 flex flex-col justify-between">
                <div>
                    <div className="mb-8 min-h-[150px]">
                        <p className="text-sm text-retro-black/50 dark:text-white/50 uppercase mb-1">
                           <TypewriterText key={`cat-${id}`} text="Category //" speed={30} />
                        </p>
                        <h1 className="text-4xl uppercase text-retro-orange leading-none">
                           <TypewriterText key={`title-${id}`} text={wallpaper.category} speed={50} delay={300} />
                        </h1>
                        <div className="mt-4 text-2xl uppercase border-l-4 border-retro-black dark:border-white pl-4">
                            "<TypewriterText key={`prompt-${id}`} text={wallpaper.prompt} speed={20} delay={800} />"
                        </div>
                    </div>

                    {/* Stats Table */}
                    <div className="w-full border-2 border-retro-black dark:border-white text-lg mb-8" role="table" aria-label="Wallpaper Specifications">
                        <div className="flex border-b-2 border-retro-black dark:border-white" role="row">
                            <div className="w-1/2 p-2 border-r-2 border-retro-black dark:border-white bg-neutral-100 dark:bg-neutral-800 uppercase" role="rowheader">Asset</div>
                            <div className="w-1/2 p-2" role="cell">
                                <span className="bg-retro-orange text-white px-2 font-bold">FREE</span>
                            </div>
                        </div>
                        <div className="flex border-b-2 border-retro-black dark:border-white" role="row">
                            <div className="w-1/2 p-2 border-r-2 border-retro-black dark:border-white bg-neutral-100 dark:bg-neutral-800 uppercase" role="rowheader">Ratio</div>
                            <div className="w-1/2 p-2" role="cell">{wallpaper.aspectRatio || "3:4"}</div>
                        </div>
                        <div className="flex border-b-2 border-retro-black dark:border-white" role="row">
                            <div className="w-1/2 p-2 border-r-2 border-retro-black dark:border-white bg-neutral-100 dark:bg-neutral-800 uppercase" role="rowheader">Size</div>
                            <div className="w-1/2 p-2" role="cell">High Res</div>
                        </div>
                        <div className="flex" role="row">
                            <div className="w-1/2 p-2 border-r-2 border-retro-black dark:border-white bg-neutral-100 dark:bg-neutral-800 uppercase" role="rowheader">Status</div>
                            <div className="w-1/2 p-2 text-green-600 dark:text-green-400" role="cell">
                                <TypewriterText key={`status-${id}`} text="Ready" speed={100} delay={500} />
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={startDownload}
                    disabled={downloadStatus === 'preparing'}
                    className={`
                        w-full py-4 text-2xl uppercase font-bold border-2 border-retro-black dark:border-white shadow-retro-sm hover:shadow-retro hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all
                        ${downloadStatus === 'preparing' 
                            ? 'bg-neutral-200 text-neutral-500 cursor-wait' 
                            : 'bg-retro-orange text-white'
                        }
                    `}
                    aria-label="Download Wallpaper"
                >
                    {downloadStatus === 'preparing' ? (
                         <span className="animate-pulse">... INITIALIZING ...</span>
                    ) : downloadStatus === 'downloading' ? (
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
            {suggestions.map((w, index) => (
                <WallpaperCard key={w.id} wallpaper={w} index={index} />
            ))}
        </div>
      </section>
    </div>
  );
};
