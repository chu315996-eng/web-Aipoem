/*
  # AI Poetry Platform Database Schema

  ## Overview
  Complete database schema for an AI poetry creation platform with user management,
  poem storage, collections, and social features.

  ## New Tables

  ### 1. poems
  Main table storing all generated poems
  - `id` (uuid, primary key): Unique identifier for each poem
  - `title` (text): Poem title
  - `content` (text): The poem content/verses
  - `style` (text): Poetry style (e.g., "classical", "modern", "haiku")
  - `theme` (text): Theme or topic of the poem
  - `mood` (text): Emotional tone (e.g., "melancholic", "joyful")
  - `author_id` (uuid, nullable): Reference to user who created it
  - `is_public` (boolean): Whether poem is visible to others
  - `likes_count` (integer): Number of likes received
  - `views_count` (integer): Number of views
  - `created_at` (timestamptz): Creation timestamp
  - `updated_at` (timestamptz): Last update timestamp

  ### 2. collections
  User-created collections of poems
  - `id` (uuid, primary key): Unique identifier
  - `name` (text): Collection name
  - `description` (text, nullable): Collection description
  - `user_id` (uuid): Owner of the collection
  - `is_public` (boolean): Public visibility
  - `created_at` (timestamptz): Creation timestamp

  ### 3. collection_poems
  Junction table linking poems to collections
  - `collection_id` (uuid): Reference to collection
  - `poem_id` (uuid): Reference to poem
  - `added_at` (timestamptz): When poem was added to collection

  ### 4. poem_likes
  Track user likes on poems
  - `poem_id` (uuid): Reference to poem
  - `user_id` (uuid): User who liked the poem
  - `created_at` (timestamptz): When the like occurred

  ## Security
  - RLS enabled on all tables
  - Users can only modify their own content
  - Public poems visible to all authenticated users
  - Private poems only visible to owner
*/

-- Create poems table
CREATE TABLE IF NOT EXISTS poems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  style text DEFAULT 'modern',
  theme text,
  mood text,
  author_id uuid,
  is_public boolean DEFAULT true,
  likes_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  user_id uuid NOT NULL,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create collection_poems junction table
CREATE TABLE IF NOT EXISTS collection_poems (
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE,
  poem_id uuid REFERENCES poems(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  PRIMARY KEY (collection_id, poem_id)
);

-- Create poem_likes table
CREATE TABLE IF NOT EXISTS poem_likes (
  poem_id uuid REFERENCES poems(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (poem_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_poems_author ON poems(author_id);
CREATE INDEX IF NOT EXISTS idx_poems_created ON poems(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_poems_public ON poems(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_collections_user ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_poem_likes_poem ON poem_likes(poem_id);

-- Enable Row Level Security
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE poem_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for poems table
CREATE POLICY "Anyone can view public poems"
  ON poems FOR SELECT
  TO authenticated
  USING (is_public = true OR author_id = auth.uid());

CREATE POLICY "Users can create their own poems"
  ON poems FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid() OR author_id IS NULL);

CREATE POLICY "Users can update their own poems"
  ON poems FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete their own poems"
  ON poems FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- RLS Policies for collections table
CREATE POLICY "Users can view public collections and their own"
  ON collections FOR SELECT
  TO authenticated
  USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can create their own collections"
  ON collections FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own collections"
  ON collections FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own collections"
  ON collections FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for collection_poems table
CREATE POLICY "Users can view poems in their collections or public collections"
  ON collection_poems FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_poems.collection_id
      AND (collections.user_id = auth.uid() OR collections.is_public = true)
    )
  );

CREATE POLICY "Users can add poems to their own collections"
  ON collection_poems FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_poems.collection_id
      AND collections.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove poems from their own collections"
  ON collection_poems FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_poems.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- RLS Policies for poem_likes table
CREATE POLICY "Anyone can view likes"
  ON poem_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like poems"
  ON poem_likes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unlike poems"
  ON poem_likes FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_poems_updated_at
  BEFORE UPDATE ON poems
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment likes count
CREATE OR REPLACE FUNCTION increment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE poems SET likes_count = likes_count + 1 WHERE id = NEW.poem_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement likes count
CREATE OR REPLACE FUNCTION decrement_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE poems SET likes_count = likes_count - 1 WHERE id = OLD.poem_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Triggers for likes count
CREATE TRIGGER increment_poem_likes
  AFTER INSERT ON poem_likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_likes_count();

CREATE TRIGGER decrement_poem_likes
  AFTER DELETE ON poem_likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_likes_count();