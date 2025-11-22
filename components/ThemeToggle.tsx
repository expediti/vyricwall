import React from 'react';
import { useAppContext } from '../App';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useAppContext();

  return (
    <button
      onClick={toggleTheme}
      className="relative px-3 py-1 border-2 border-retro-black dark:border-white bg-white dark:bg-black text-retro-black dark:text-white hover:bg-retro-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors focus:outline-none text-xl uppercase"
      aria-label="Toggle Theme"
    >
       {theme === 'light' ? '[LIGHT_MODE]' : '[DARK_MODE]'}
    </button>
  );
};