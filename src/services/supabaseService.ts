import { createClient } from '@supabase/supabase-js';

// Vite uses import.meta.env for environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getWallpapers() {
  const { data, error } = await supabase
    .from('wallpapers')
    .select('id, image_link, name, ratio, size')
    .order('id', { ascending: false });
  if (error) throw error;
  return data;
}
