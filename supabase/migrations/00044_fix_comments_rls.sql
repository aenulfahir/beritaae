-- Migration: Fix Comments RLS for better performance
-- Description: Simplify RLS policy for comments to improve query performance

-- Drop existing policy
DROP POLICY IF EXISTS "Approved comments are viewable by everyone" ON comments;

-- Create simpler policy that allows public to read approved comments
-- This avoids calling get_user_role for every row when user is not authenticated
CREATE POLICY "Public can view approved comments"
  ON comments FOR SELECT
  USING (is_approved = true);

-- Separate policy for authenticated users to see their own comments
CREATE POLICY "Users can view own comments"
  ON comments FOR SELECT
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Separate policy for admins/editors to see all comments
CREATE POLICY "Admins can view all comments"
  ON comments FOR SELECT
  USING (
    auth.uid() IS NOT NULL 
    AND get_user_role(auth.uid()) IN ('admin', 'editor')
  );

-- Add comment for documentation
COMMENT ON POLICY "Public can view approved comments" ON comments IS 'Anyone can see approved comments without authentication';
COMMENT ON POLICY "Users can view own comments" ON comments IS 'Authenticated users can see their own comments regardless of approval';
COMMENT ON POLICY "Admins can view all comments" ON comments IS 'Admins and editors can see all comments';
