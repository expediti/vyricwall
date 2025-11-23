import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { WallpaperCard } from '../components/WallpaperCard';
import { SEO } from '../components/SEO';
import { getWallpapers } from '../services/supabaseService';
import { Wallpaper } from '../types';

export const WallpaperDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const [suggestions, setSuggestions] = useState<Wallpaper[]>([]);
  const [allWallpapers, setAllWallpapers] = useState<Wallpaper[]>([]);

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

  return (
    <div className="min-h-[calc(100vh-5rem)] p-4 md:p-8">
      <SEO
        title={`${wallpaper.name} - Vyric OS`}
        description={`Download ${wallpaper.name}`}
        keywords={`${wallpaper.category || 'wallpaper'}`}
      />
      <article className="max-w-7xl mx-auto border-2 border-retro-black dark:border-white bg-white dark:bg-black mb-16">
        <header className="bg-retro-black dark:bg-white text-white dark:text-black p-2 flex justify-between items-center">
          <span className="uppercase text-xl">:: File_Inspector_V1.0 ::</span>
          <Link to="/" className="hover:bg-retro-orange hover:text-white px-2 uppercase text-lg">
            [ X CLOSE ]
          </Link>
        </header>
        <div className="p-8">
          <img src={wallpaper.image_link} alt={wallpaper.name} className="w-full h-auto mb-4" />
          <h1 className="text-4xl uppercase mb-2">{wallpaper.name}</h1>
          <div>Ratio: {wallpaper.ratio}</div>
          <div>Size: {wallpaper.size}</div>
          {wallpaper.category && <div>Category: {wallpaper.category}</div>}
        </div>
      </article>
      <section className="max-w-7xl mx-auto">
        <h2 className="text-2xl mb-4 uppercase">Suggested_Datastreams</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {suggestions.map((w) => (
            <WallpaperCard key={w.id} wallpaper={w} />
          ))}
        </div>
      </section>
    </div>
  );
};