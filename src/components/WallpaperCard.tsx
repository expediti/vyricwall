import React from 'react';

interface WallpaperProps {
  wallpaper: {
    id: number;
    image_link: string;
    name: string;
    ratio: string;
    size: string;
    category?: string;
    prompt?: string;
    createdAt?: number;
  };
}

export const WallpaperCard: React.FC<WallpaperProps> = ({ wallpaper }) => (
  <div className="border-2 border-retro-black dark:border-white bg-white dark:bg-black p-3 flex flex-col items-center rounded shadow hover:shadow-lg transition-all">
    <img
      src={wallpaper.image_link}
      alt={wallpaper.name}
      className="w-full h-auto max-h-64 object-cover mb-2"
    />
    <div className="w-full text-left">
      <div className="font-bold text-lg truncate">{wallpaper.name}</div>
      <div className="text-sm text-retro-black dark:text-white/60 mt-1">Ratio: {wallpaper.ratio}</div>
      <div className="text-sm text-retro-black dark:text-white/60">Size: {wallpaper.size}</div>
      {wallpaper.category && (
        <div className="text-xs uppercase text-retro-orange mt-1">{wallpaper.category}</div>
      )}
    </div>
  </div>
);
