-- Migration: Media Storage Bucket
-- Description: Create storage bucket for article images and media

-- Create media bucket (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Media upload policy" ON storage.objects;
DROP POLICY IF EXISTS "Media select policy" ON storage.objects;
DROP POLICY IF EXISTS "Media update policy" ON storage.objects;
DROP POLICY IF EXISTS "Media delete policy" ON storage.objects;

-- Allow authenticated users with author/editor/admin role to upload
CREATE POLICY "Media upload policy"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Allow anyone to view media (public bucket)
CREATE POLICY "Media select policy"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- Allow authenticated users to update files in media bucket
CREATE POLICY "Media update policy"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media');

-- Allow authenticated users to delete files in media bucket
CREATE POLICY "Media delete policy"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');
