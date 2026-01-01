-- Migration: Storage Policies
-- Description: Row Level Security policies for storage buckets

-- ARTICLE THUMBNAILS POLICIES

-- Anyone can view article thumbnails (public bucket)
CREATE POLICY "Anyone can view article thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'article-thumbnails');

-- Authors, editors, and admins can upload article thumbnails
CREATE POLICY "Authors, editors, admins can upload article thumbnails"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'article-thumbnails'
    AND get_user_role(auth.uid()) IN ('author', 'editor', 'admin')
  );

-- Authors, editors, and admins can update article thumbnails
CREATE POLICY "Authors, editors, admins can update article thumbnails"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'article-thumbnails'
    AND get_user_role(auth.uid()) IN ('author', 'editor', 'admin')
  );

-- Only admins can delete article thumbnails
CREATE POLICY "Admins can delete article thumbnails"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'article-thumbnails'
    AND get_user_role(auth.uid()) = 'admin'
  );

-- USER AVATARS POLICIES

-- Anyone can view user avatars (public bucket)
CREATE POLICY "Anyone can view user avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-avatars');

-- Users can upload their own avatar (to their own folder)
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can update their own avatar
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'user-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own avatar
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
