-- Migration: Set Breaking News Articles
-- Description: Mark some articles as breaking news so the ticker displays

-- Update beberapa artikel menjadi breaking news
UPDATE articles 
SET is_breaking = true 
WHERE slug IN (
  'pemerintah-umumkan-kebijakan-ekonomi-baru-2025',
  'timnas-indonesia-raih-kemenangan-bersejarah-piala-asia',
  'gempa-bumi-65-sr-guncang-sulawesi-tengah'
)
AND status = 'published';

-- Jika tidak ada artikel dengan slug tersebut, update 3 artikel terbaru
UPDATE articles 
SET is_breaking = true 
WHERE id IN (
  SELECT id FROM articles 
  WHERE status = 'published' 
  AND is_breaking = false
  ORDER BY published_at DESC 
  LIMIT 3
)
AND NOT EXISTS (
  SELECT 1 FROM articles WHERE is_breaking = true AND status = 'published'
);
