-- Migration: Seed Company Data
-- Description: Update company data with social media URLs and seed new tables

-- =====================================================
-- Update Company Profile with Social Media URLs
-- =====================================================
UPDATE company_profile SET
  facebook_url = 'https://facebook.com/beritaae',
  twitter_url = 'https://twitter.com/beritaae',
  instagram_url = 'https://instagram.com/beritaae',
  youtube_url = 'https://youtube.com/@beritaae',
  linkedin_url = 'https://linkedin.com/company/beritaae',
  tiktok_url = 'https://tiktok.com/@beritaae'
WHERE facebook_url IS NULL;

-- =====================================================
-- Team Members (insert if not exists)
-- =====================================================
INSERT INTO team_members (name, role, department, bio, avatar_url, email, linkedin_url, twitter_url, display_order, is_active) 
SELECT * FROM (VALUES
  ('Ahmad Fadillah', 'CEO & Founder', 'Executive', 'Pendiri BeritaAE dengan pengalaman 15 tahun di industri media.', 'https://i.pravatar.cc/150?img=1', 'ahmad@beritaae.com', 'https://linkedin.com/in/ahmadfadillah', 'https://twitter.com/ahmadfadillah', 1, true),
  ('Siti Nurhaliza', 'Editor in Chief', 'Editorial', 'Memimpin tim editorial dengan standar jurnalistik tertinggi.', 'https://i.pravatar.cc/150?img=5', 'siti@beritaae.com', 'https://linkedin.com/in/sitinurhaliza', NULL, 2, true),
  ('Budi Santoso', 'CTO', 'Technology', 'Bertanggung jawab atas infrastruktur teknologi platform.', 'https://i.pravatar.cc/150?img=12', 'budi@beritaae.com', 'https://linkedin.com/in/budisantoso', 'https://twitter.com/budisantoso', 3, true),
  ('Dewi Lestari', 'Marketing Director', 'Marketing', 'Mengembangkan strategi pemasaran dan brand awareness.', 'https://i.pravatar.cc/150?img=9', 'dewi@beritaae.com', NULL, 'https://twitter.com/dewilestari', 4, true),
  ('Rudi Hartono', 'Head of News', 'Editorial', 'Memimpin tim reporter untuk liputan berita nasional.', 'https://i.pravatar.cc/150?img=15', 'rudi@beritaae.com', 'https://linkedin.com/in/rudihartono', NULL, 5, true),
  ('Maya Indah', 'HR Manager', 'Human Resources', 'Mengelola talent acquisition dan employee development.', 'https://i.pravatar.cc/150?img=23', 'maya@beritaae.com', 'https://linkedin.com/in/mayaindah', NULL, 6, true)
) AS v(name, role, department, bio, avatar_url, email, linkedin_url, twitter_url, display_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE team_members.email = v.email);

-- =====================================================
-- Job Listings (insert if table is empty)
-- =====================================================
INSERT INTO job_listings (title, department, location, job_type, level, salary_range, description, requirements, is_active, applicants_count)
SELECT * FROM (VALUES
  ('Senior Journalist', 'Editorial', 'Jakarta', 'Full-time', 'Senior', 'Rp 15-25 juta/bulan', 'Kami mencari jurnalis senior berpengalaman untuk memimpin liputan berita nasional.', '- Minimal 5 tahun pengalaman
- Kemampuan menulis yang baik
- Networking yang luas', true, 24),
  ('Frontend Developer', 'Technology', 'Remote', 'Full-time', 'Mid-Senior', 'Rp 20-35 juta/bulan', 'Bergabunglah dengan tim engineering kami untuk membangun platform berita modern.', '- React/Next.js expert
- TypeScript proficient
- 3+ years experience', true, 45),
  ('Social Media Manager', 'Marketing', 'Jakarta', 'Contract', 'Mid', 'Rp 10-15 juta/bulan', 'Kelola akun media sosial BeritaAE dan tingkatkan engagement.', '- Pengalaman 2+ tahun di social media
- Kreatif dan up-to-date
- Kemampuan analitik', true, 67),
  ('Video Editor', 'Content', 'Jakarta', 'Full-time', 'Junior-Mid', 'Rp 8-12 juta/bulan', 'Edit video berita dan konten multimedia untuk platform digital.', '- Adobe Premiere Pro
- After Effects basic
- Portfolio required', false, 32),
  ('Data Analyst', 'Technology', 'Jakarta / Remote', 'Full-time', 'Mid', 'Rp 15-22 juta/bulan', 'Analisis data pembaca dan performa konten untuk insight bisnis.', '- SQL & Python
- Data visualization
- 2+ years experience', true, 18),
  ('Content Writer', 'Editorial', 'Jakarta', 'Full-time', 'Junior', 'Rp 6-10 juta/bulan', 'Menulis artikel berkualitas untuk berbagai kategori berita.', '- Fresh graduate welcome
- Kemampuan menulis yang baik
- Minat di dunia jurnalistik', true, 89)
) AS v(title, department, location, job_type, level, salary_range, description, requirements, is_active, applicants_count)
WHERE NOT EXISTS (SELECT 1 FROM job_listings WHERE job_listings.title = v.title);

-- =====================================================
-- Career Settings (insert if empty)
-- =====================================================
INSERT INTO career_settings (page_title, page_description, application_email, whatsapp)
SELECT 'Bergabung dengan Tim Kami', 'Bergabunglah dengan BeritaAE dan jadilah bagian dari perubahan di industri media digital Indonesia.', 'karir@beritaae.com', '+62 812 3456 7890'
WHERE NOT EXISTS (SELECT 1 FROM career_settings);

-- =====================================================
-- Update Ad Placements with impressions/clicks
-- =====================================================
UPDATE ad_placements SET 
  impressions = CASE 
    WHEN position = 'homepage-top' THEN 125000
    WHEN position = 'sidebar' THEN 89000
    WHEN position = 'in-article' THEN 156000
    WHEN position = 'mobile-sticky' THEN 45000
    ELSE 0
  END,
  clicks = CASE 
    WHEN position = 'homepage-top' THEN 3200
    WHEN position = 'sidebar' THEN 1800
    WHEN position = 'in-article' THEN 4500
    WHEN position = 'mobile-sticky' THEN 1200
    ELSE 0
  END
WHERE impressions IS NULL OR impressions = 0;

-- Add Popup/Interstitial placement if not exists
INSERT INTO ad_placements (name, position, size, price_monthly, price_weekly, price_daily, description, impressions, clicks, is_active, display_order)
SELECT 'Popup/Interstitial', 'popup', '600x400 (Interstitial)', 8000000, 2500000, 400000, 'Popup saat masuk/keluar', 67000, 2100, true, 5
WHERE NOT EXISTS (SELECT 1 FROM ad_placements WHERE position = 'popup');

-- =====================================================
-- Ad Settings (insert if empty)
-- =====================================================
INSERT INTO ad_settings (page_title, page_description, contact_email, whatsapp)
SELECT 'Pasang Iklan di BeritaAE', 'Jangkau jutaan pembaca aktif dengan beriklan di BeritaAE. Kami menawarkan berbagai format iklan yang menarik dan efektif untuk brand Anda.', 'iklan@beritaae.com', '+62 812 3456 7890'
WHERE NOT EXISTS (SELECT 1 FROM ad_settings);
