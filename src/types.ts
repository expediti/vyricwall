export type Category = 'All' | 'Abstract' | 'Nature' | 'Minimal' | 'Dark' | 'Space' | 'City' | 'Laptop' | 'Phone';

export const CATEGORIES: Category[] = [
  'Abstract',
  'Nature',
  'Minimal',
  'Dark',
  'Space',
  'City',
  'Laptop',
  'Phone'
];

export interface Wallpaper {
  id: number;
  image_link: string;
  name: string;
  ratio: string;
  size: string;
  category?: string;
  prompt?: string;
  createdAt?: number;
}
