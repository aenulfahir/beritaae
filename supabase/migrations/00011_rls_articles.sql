-- Migration: RLS Policies for Articles
-- Description: Row Level Security policies for articles table

-- Enable RLS on articles
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Everyone can view published articles
-- Authors can view their own articles regardless of status
-- Admins and editors can view all articles
CREATE POLICY "Published articles are viewable by everyone"
  ON articles FOR SELECT
  USING (
    status = 'published'
    OR author_id = auth.uid()
    OR get_user_role(auth.uid()) IN ('admin', 'editor')
  );

-- Admins, editors, and authors can create articles
CREATE POLICY "Admins, editors, and authors can create articles"
  ON articles FOR INSERT
  WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'editor', 'author'));

-- Authors can update their own articles
-- Admins and editors can update any article
CREATE POLICY "Article update policy"
  ON articles FOR UPDATE
  USING (
    author_id = auth.uid()
    OR get_user_role(auth.uid()) IN ('admin', 'editor')
  );

-- Only admins can delete articles
CREATE POLICY "Only admins can delete articles"
  ON articles FOR DELETE
  USING (get_user_role(auth.uid()) = 'admin');

-- Add comments for documentation
COMMENT ON POLICY "Published articles are viewable by everyone" ON articles IS 'Public can see published articles, authors see their own, admins/editors see all';
COMMENT ON POLICY "Admins, editors, and authors can create articles" ON articles IS 'Only users with author role or higher can create articles';
COMMENT ON POLICY "Article update policy" ON articles IS 'Authors can update own articles, admins/editors can update any';
COMMENT ON POLICY "Only admins can delete articles" ON articles IS 'Only admins can permanently delete articles';
