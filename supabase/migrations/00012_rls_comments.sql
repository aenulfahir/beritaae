-- Migration: RLS Policies for Comments
-- Description: Row Level Security policies for comments and comment_likes tables

-- Enable RLS on comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Enable RLS on comment_likes
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- COMMENTS POLICIES

-- Everyone can view approved comments
-- Users can view their own comments regardless of approval status
-- Admins and editors can view all comments
CREATE POLICY "Approved comments are viewable by everyone"
  ON comments FOR SELECT
  USING (
    is_approved = true
    OR user_id = auth.uid()
    OR get_user_role(auth.uid()) IN ('admin', 'editor')
  );

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Users can update their own comments
-- Admins and editors can update any comment
CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (
    user_id = auth.uid()
    OR get_user_role(auth.uid()) IN ('admin', 'editor')
  );

-- Users can delete their own comments
-- Admins and editors can delete any comment
CREATE POLICY "Comment delete policy"
  ON comments FOR DELETE
  USING (
    user_id = auth.uid()
    OR get_user_role(auth.uid()) IN ('admin', 'editor')
  );

-- COMMENT LIKES POLICIES

-- Everyone can view likes
CREATE POLICY "Users can view all likes"
  ON comment_likes FOR SELECT
  USING (true);

-- Authenticated users can like comments
CREATE POLICY "Authenticated users can like comments"
  ON comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their own likes
CREATE POLICY "Users can remove their own likes"
  ON comment_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON POLICY "Approved comments are viewable by everyone" ON comments IS 'Public sees approved comments, users see own, admins/editors see all';
COMMENT ON POLICY "Authenticated users can create comments" ON comments IS 'Only logged-in users can post comments';
COMMENT ON POLICY "Users can update own comments" ON comments IS 'Users can edit own comments, admins/editors can edit any';
COMMENT ON POLICY "Comment delete policy" ON comments IS 'Users can delete own comments, admins/editors can delete any';
