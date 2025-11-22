import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate('/', { state: { searchQuery: searchValue } });
      setSearchValue('');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="relative z-50 w-full bg-retro-bg dark:bg-retro-black border-b-2 border-retro-black dark:border-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2 hover:opacity-70 transition-opacity">
            <div className="w-6 h-6 bg-retro-orange border-2 border-retro-black dark:border-white"></div>
            <span className="text-4xl tracking-tighter text-retro-black dark:text-white">
                VYRIC
            </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Desktop Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="SEARCH_DATABASE..."
              className="w-64 pl-4 pr-12 py-2 bg-white dark:bg-black text-retro-black dark:text-white border-2 border-retro-black dark:border-white focus:outline-none focus:shadow-retro-orange placeholder-gray-400 text-xl uppercase"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-retro-black dark:text-white hover:text-retro-orange">
              [GO]
            </button>
          </form>

          {/* Mobile Search Toggle */}
          <button 
            className="md:hidden p-2 border-2 border-retro-black dark:border-white hover:bg-retro-orange hover:text-white transition-colors"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
             SEARCH
          </button>

          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      <div className={`
        md:hidden overflow-hidden border-b-2 border-retro-black dark:border-white transition-all duration-0 ease-linear
        ${isSearchOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="p-4 bg-retro-bg dark:bg-retro-black">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
             <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="ENTER KEYWORD..."
              className="flex-1 pl-4 pr-4 py-2 bg-white dark:bg-black text-retro-black dark:text-white border-2 border-retro-black dark:border-white outline-none text-xl uppercase"
              autoFocus
            />
            <button type="submit" className="bg-retro-orange text-white border-2 border-retro-black px-6 py-2 text-xl uppercase hover:shadow-retro transition-shadow">
              Run
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};