-- Seed data for Premium Ad Slots
-- Sample ads for each slot type with varied states

INSERT INTO ads (title, image_url, target_url, slot_type, is_active, start_date, end_date, impressions, clicks) VALUES

-- In-Article Ads
(
  'Tokopedia - Belanja Hemat',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=250&fit=crop',
  'https://tokopedia.com',
  'in_article',
  true,
  NOW() - INTERVAL '7 days',
  NOW() + INTERVAL '30 days',
  15420,
  342
),
(
  'Gojek - Promo Akhir Tahun',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=250&fit=crop',
  'https://gojek.com',
  'in_article',
  true,
  NOW() - INTERVAL '3 days',
  NOW() + INTERVAL '60 days',
  8750,
  198
),
(
  'Grab - Diskon 50%',
  'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=300&h=250&fit=crop',
  'https://grab.com',
  'in_article',
  true,
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '37 days',
  0,
  0
),

-- Homepage Hero Sponsor
(
  'Bank BCA - KPR Terbaik',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=970&h=250&fit=crop',
  'https://bca.co.id',
  'homepage_hero',
  true,
  NOW() - INTERVAL '14 days',
  NOW() + INTERVAL '45 days',
  45200,
  1250
),
(
  'Telkomsel - Paket Internet',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=970&h=250&fit=crop',
  'https://telkomsel.com',
  'homepage_hero',
  false,
  NOW() - INTERVAL '90 days',
  NOW() - INTERVAL '60 days',
  125000,
  3420
),

-- Post-Article Ads
(
  'Bukalapak - Promo Spesial',
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=728&h=90&fit=crop',
  'https://bukalapak.com',
  'post_article',
  true,
  NOW() - INTERVAL '5 days',
  NOW() + INTERVAL '25 days',
  12300,
  287
),
(
  'Lazada - Mega Sale',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=728&h=90&fit=crop',
  'https://lazada.co.id',
  'post_article',
  true,
  NOW() - INTERVAL '10 days',
  NOW() + INTERVAL '20 days',
  9800,
  215
),

-- Popup Ad
(
  'Shopee - Flash Sale 12.12',
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&h=400&fit=crop',
  'https://shopee.co.id',
  'popup',
  true,
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '30 days',
  5200,
  890
);
