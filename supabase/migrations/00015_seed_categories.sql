-- Seed Categories Migration
-- This migration seeds initial category data
-- Safe to run multiple times (idempotent)

INSERT INTO public.categories (name, slug, color, description)
VALUES 
  ('Politik', 'politik', '#ef4444', 'Berita politik dan pemerintahan'),
  ('Ekonomi', 'ekonomi', '#22c55e', 'Berita ekonomi dan bisnis'),
  ('Teknologi', 'teknologi', '#3b82f6', 'Berita teknologi dan inovasi'),
  ('Olahraga', 'olahraga', '#f97316', 'Berita olahraga dan kompetisi'),
  ('Hiburan', 'hiburan', '#a855f7', 'Berita hiburan dan selebriti'),
  ('Nasional', 'nasional', '#64748b', 'Berita nasional Indonesia'),
  ('Internasional', 'internasional', '#06b6d4', 'Berita internasional dan dunia'),
  ('Kesehatan', 'kesehatan', '#10b981', 'Berita kesehatan dan medis'),
  ('Pendidikan', 'pendidikan', '#8b5cf6', 'Berita pendidikan dan akademik'),
  ('Gaya Hidup', 'gaya-hidup', '#ec4899', 'Berita gaya hidup dan lifestyle')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  color = EXCLUDED.color,
  description = EXCLUDED.description;
