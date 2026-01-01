-- Migration: Seed Initial Tags
-- Description: Add initial tags and link them to existing articles based on categories

-- Insert initial tags
INSERT INTO tags (name, slug, description, color) VALUES
    ('Politik', 'politik', 'Berita seputar politik dan pemerintahan', '#ef4444'),
    ('Ekonomi', 'ekonomi', 'Berita ekonomi dan bisnis', '#22c55e'),
    ('Teknologi', 'teknologi', 'Berita teknologi dan inovasi', '#3b82f6'),
    ('Olahraga', 'olahraga', 'Berita olahraga dan pertandingan', '#f97316'),
    ('Hiburan', 'hiburan', 'Berita hiburan dan selebriti', '#ec4899'),
    ('Kesehatan', 'kesehatan', 'Berita kesehatan dan medis', '#14b8a6'),
    ('Pendidikan', 'pendidikan', 'Berita pendidikan dan akademik', '#8b5cf6'),
    ('Internasional', 'internasional', 'Berita internasional dan global', '#6366f1'),
    ('Nasional', 'nasional', 'Berita nasional Indonesia', '#dc2626'),
    ('Lokal', 'lokal', 'Berita lokal dan daerah', '#0891b2'),
    ('CPNS2025', 'cpns2025', 'Informasi CPNS 2025', '#7c3aed'),
    ('Pemilu', 'pemilu', 'Berita seputar pemilihan umum', '#be123c'),
    ('Startup', 'startup', 'Berita startup dan entrepreneurship', '#0ea5e9'),
    ('AI', 'ai', 'Berita artificial intelligence', '#6366f1'),
    ('Crypto', 'crypto', 'Berita cryptocurrency dan blockchain', '#f59e0b'),
    ('Otomotif', 'otomotif', 'Berita otomotif dan kendaraan', '#64748b'),
    ('Properti', 'properti', 'Berita properti dan real estate', '#84cc16'),
    ('Wisata', 'wisata', 'Berita wisata dan pariwisata', '#06b6d4'),
    ('Kuliner', 'kuliner', 'Berita kuliner dan makanan', '#f43f5e'),
    ('Lifestyle', 'lifestyle', 'Berita gaya hidup', '#a855f7')
ON CONFLICT (slug) DO NOTHING;

-- Link existing articles to tags based on their categories
-- This creates initial connections between articles and relevant tags

-- Link Politik category articles to Politik tag
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id
FROM articles a
CROSS JOIN tags t
WHERE a.category_id IN (SELECT id FROM categories WHERE slug = 'politik')
  AND t.slug = 'politik'
  AND a.status = 'published'
ON CONFLICT DO NOTHING;

-- Link Ekonomi category articles to Ekonomi tag
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id
FROM articles a
CROSS JOIN tags t
WHERE a.category_id IN (SELECT id FROM categories WHERE slug = 'ekonomi')
  AND t.slug = 'ekonomi'
  AND a.status = 'published'
ON CONFLICT DO NOTHING;

-- Link Teknologi category articles to Teknologi tag
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id
FROM articles a
CROSS JOIN tags t
WHERE a.category_id IN (SELECT id FROM categories WHERE slug = 'teknologi')
  AND t.slug = 'teknologi'
  AND a.status = 'published'
ON CONFLICT DO NOTHING;

-- Link Olahraga category articles to Olahraga tag
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id
FROM articles a
CROSS JOIN tags t
WHERE a.category_id IN (SELECT id FROM categories WHERE slug = 'olahraga')
  AND t.slug = 'olahraga'
  AND a.status = 'published'
ON CONFLICT DO NOTHING;

-- Also add Nasional tag to all published articles (as default)
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id
FROM articles a
CROSS JOIN tags t
WHERE t.slug = 'nasional'
  AND a.status = 'published'
ON CONFLICT DO NOTHING;

-- Update usage counts
UPDATE tags SET usage_count = (
    SELECT COUNT(*) FROM article_tags WHERE tag_id = tags.id
);
