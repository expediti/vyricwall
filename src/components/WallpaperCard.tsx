import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallpaper } from '../types';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  // index removed since it was unused
}

export const WallpaperCard: React.FC<WallpaperCardProps> = ({ wallpaper }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const imgSrc = wallpaper.url.startsWith('http') 
    ? wallpaper.url 
    : `data:image/jpeg;base64,${wallpaper.url}`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    navigate(`/wallpaper/${wallpaper.id}`);
  };

  return (
    <div 
    ref={cardRef}
    onClick={handleClick}
    className={`
        group relative overflow-hidden border-2 border-retro-black dark:border-white bg-white dark:bg-black
        transform transition-all duration-0 cursor-pointer
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        hover:shadow-retro dark:hover:shadow-[4px_4px_0_0_#ffffff] hover:-translate-y-1
    `}
    >
    
        <div className="aspect-[3/4] relative">
            <img 
            src={imgSrc} 
            alt={wallpaper.prompt}
            className="w-full h-full object-cover transition-all duration-0"
            loading="lazy"
            />
            
            {/* Grid Overlay effect */}
            <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-20 pointer-events-none"></div>
        </div>

        {/* Category Tag - Always Visible at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-retro-black dark:bg-white text-white dark:text-black border-t-2 border-retro-black dark:border-white p-1 md:p-2">
            <p className="text-sm md:text-lg uppercase truncate text-center">
                {wallpaper.category}
            </p>
        </div>
    </div>
  );
};
