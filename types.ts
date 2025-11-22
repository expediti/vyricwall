export interface Wallpaper {
  id: string;
  url: string;
  prompt: string;
  category: string;
  createdAt: number;
  aspectRatio: string;
}

export type Category = 'Iron Man' | 'Machineries' | 'Spider-Man' | 'Avengers' | 'Avatar' | 'Phone' | 'Laptop' | 'All';

export const CATEGORIES: Category[] = [
  'Iron Man',
  'Machineries',
  'Spider-Man',
  'Avengers',
  'Avatar',
  'Phone',
  'Laptop'
];