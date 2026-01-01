-- Migration: Article Likes Table
-- Description: Create article_likes table for storing user reactions (likes/dislikes) on articles

-- Create reaction_type enum if not exists
DO $$ BEGIN
  CREATE TYPE reaction_type AS ENUM ('like', 'dislike');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create article_likes table
CREATE TABLE IF NOT EXISTS article_likes (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type reaction_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (article_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_article_likes_article ON article_likes(article_id);
CREATE INDEX IF NOT EXISTS idx_article_likes_user ON article_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_article_likes_reaction ON article_likes(reaction_type);

-- Enable RLS
ALTER TABLE article_likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view article likes" ON article_likes;
DROP POLICY IF EXISTS "Authenticated users can insert own reactions" ON article_likes;
DROP POLICY IF EXISTS "Users can update own reactions" ON article_likes;
DROP POLICY IF EXISTS "Users can delete own reactions or admin can delete any" ON article_likes;

-- RLS Policies
-- Anyone can view article likes (for counting)
CREATE POLICY "Anyone can view article likes"
  ON article_likes FOR SELECT
  USING (true);

-- Authenticated users can insert their own reactions
CREATE POLICY "Authenticated users can insert own reactions"
  ON article_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reactions
CREATE POLICY "Users can update own reactions"
  ON article_likes FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reactions, admins can delete any
CREATE POLICY "Users can delete own reactions or admin can delete any"
  ON article_likes FOR DELETE
  USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Add comment for documentation
COMMENT ON TABLE article_likes IS 'User reactions (likes/dislikes) on articles';
