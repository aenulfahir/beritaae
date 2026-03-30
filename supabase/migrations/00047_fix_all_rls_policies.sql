-- =====================================================
-- FIX ALL RLS POLICIES - Drop and recreate cleanly
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Fix get_user_role to handle NULL
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
DECLARE
  user_role_value user_role;
BEGIN
  IF user_id IS NULL THEN
    RETURN 'member'::user_role;
  END IF;
  SELECT role INTO user_role_value FROM profiles WHERE id = user_id;
  RETURN COALESCE(user_role_value, 'member'::user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Fix ARTICLES - published must be readable by EVERYONE
DROP POLICY IF EXISTS "Published articles are viewable by everyone" ON articles;
CREATE POLICY "Published articles are viewable by everyone"
  ON articles FOR SELECT
  USING (
    status = 'published'
    OR (auth.uid() IS NOT NULL AND author_id = auth.uid())
    OR (auth.uid() IS NOT NULL AND get_user_role(auth.uid()) IN ('admin', 'editor'))
  );

-- 3. Fix COMMENTS SELECT - approved comments readable by everyone
DROP POLICY IF EXISTS "Approved comments are viewable by everyone" ON comments;
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
DROP POLICY IF EXISTS "comments_select_policy" ON comments;
CREATE POLICY "comments_select_policy"
  ON comments FOR SELECT
  USING (true);

-- 4. Fix COMMENTS INSERT - authenticated users can insert
DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
DROP POLICY IF EXISTS "comments_insert_policy" ON comments;
CREATE POLICY "comments_insert_policy"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 5. Fix COMMENTS UPDATE
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "comments_update_policy" ON comments;
CREATE POLICY "comments_update_policy"
  ON comments FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NOT NULL AND get_user_role(auth.uid()) IN ('admin', 'editor'))
  );

-- 6. Fix COMMENTS DELETE
DROP POLICY IF EXISTS "Comment delete policy" ON comments;
DROP POLICY IF EXISTS "comments_delete_policy" ON comments;
DROP POLICY IF EXISTS "Admins can delete any comment" ON comments;
CREATE POLICY "comments_delete_policy"
  ON comments FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NOT NULL AND get_user_role(auth.uid()) IN ('admin', 'editor'))
  );

-- 7. Fix ADS - must be readable by everyone
DROP POLICY IF EXISTS "Active ads are viewable by everyone" ON ads;
DROP POLICY IF EXISTS "Ads are viewable by everyone" ON ads;
DROP POLICY IF EXISTS "ads_select_policy" ON ads;
CREATE POLICY "ads_select_policy"
  ON ads FOR SELECT
  USING (true);

-- 8. Fix COMMENT_LIKES
DROP POLICY IF EXISTS "Users can view all likes" ON comment_likes;
DROP POLICY IF EXISTS "comment_likes_select" ON comment_likes;
CREATE POLICY "comment_likes_select"
  ON comment_likes FOR SELECT
  USING (true);
