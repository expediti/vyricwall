import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getWallpapers() {
  const { data, error } = await supabase
    .from('wallpapers')
    .select('id, image_link, name, ratio, size, category, prompt, createdAt')
    .order('id', { ascending: false });
  if (error) throw error;
  return data;
}
