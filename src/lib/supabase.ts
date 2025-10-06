import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Poem = {
  id: string;
  title: string;
  content: string;
  style: string;
  theme: string | null;
  mood: string | null;
  author_id: string | null;
  is_public: boolean;
  likes_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
};

export type Collection = {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  is_public: boolean;
  created_at: string;
};

export type PoemLike = {
  poem_id: string;
  user_id: string;
  created_at: string;
};
