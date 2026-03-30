-- Migration: Fix RLS policies to handle NULL auth.uid() gracefully
-- Problem: When session is not ready, auth.uid() returns NULL which causes
-- get_user_role(NULL) to potentially error, blocking ALL queries including
-- public SELECT on published articles.

-- Fix get_user_role to handle NULL input gracefully
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
DECLARE
  user_role_value user_role;
BEGIN
  -- Return 'member' immediately if user_id is NULL
  IF user_id IS NULL THEN
    RETURN 'member'::user_role;
  END IF;
  
  SELECT role INTO user_role_value FROM profiles WHERE id = user_id;
  RETURN COALESCE(user_role_value, 'member'::user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix articles RLS: published articles should ALWAYS be readable, even without auth
DROP POLICY IF EXISTS "Published articles are viewable by everyone" ON articles;
CREATE POLICY "Published articles are viewable by everyone"
  ON articles FOR SELECT
  USING (
    status = 'published'
    OR (auth.uid() IS NOT NULL AND author_id = auth.uid())
    OR (auth.uid() IS NOT NULL AND get_user_role(auth.uid()) IN ('admin', 'editor'))
  );

-- Fix comments RLS: ensure comments on published articles are always readable
-- Check if there's a restrictive SELECT policy on comments
DO $$
BEGIN
  -- Drop existing select policy if it exists and recreate
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'comments' 
    AND policyname LIKE '%viewable%'
    AND cmd = 'SELECT'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments';
  END IF;
  
  -- Also drop any other SELECT policies that might be restrictive
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'comments' 
    AND policyname LIKE '%approved%'
    AND cmd = 'SELECT'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "Approved comments are viewable by everyone" ON comments';
  END IF;
END $$;

-- Create a permissive SELECT policy for comments - approved comments are always visible
CREATE POLICY "Approved comments are viewable by everyone"
  ON comments FOR SELECT
  USING (
    is_approved = true
    OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NOT NULL AND get_user_role(auth.uid()) IN ('admin', 'editor'))
  );

-- Fix ads table RLS: ensure ads are always readable publicly
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ads' 
    AND cmd = 'SELECT'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "Active ads are viewable by everyone" ON ads';
    EXECUTE 'DROP POLICY IF EXISTS "Ads are viewable by everyone" ON ads';
  END IF;
END $$;

-- Ensure RLS is enabled on ads
ALTER TABLE IF EXISTS ads ENABLE ROW LEVEL SECURITY;

-- Create permissive SELECT policy for ads - active ads always visible
CREATE POLICY "Active ads are viewable by everyone"
  ON ads FOR SELECT
  USING (true);

-- Fix categories RLS: ensure categories are always readable
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'categories' 
    AND cmd = 'SELECT'
    AND qual = 'true'
  ) THEN
    -- Drop and recreate to ensure it's permissive
    EXECUTE 'DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories';
    EXECUTE 'CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true)';
  END IF;
END $$;

COMMENT ON FUNCTION get_user_role(UUID) IS 'Returns the role of a user, handles NULL gracefully, defaults to member';
