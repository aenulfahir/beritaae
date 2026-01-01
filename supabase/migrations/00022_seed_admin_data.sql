-- =====================================================
-- Seed Data for Admin Tables
-- =====================================================

-- =====================================================
-- 1. Team Members (Tim Redaksi)
-- =====================================================
INSERT INTO team_members (name, role, department, bio, display_order, is_active) VALUES
('Ahmad Wijaya', 'Pemimpin Redaksi', 'Editorial', 'Berpengalaman lebih dari 15 tahun di industri media. Sebelumnya bekerja di berbagai media nasional terkemuka.', 1, true),
('Siti Rahayu', 'Wakil Pemimpin Redaksi', 'Editorial', 'Jurnalis senior dengan spesialisasi berita politik dan ekonomi. Lulusan Universitas Indonesia.', 2, true),
('Budi Santoso', 'Redaktur Pelaksana', 'Editorial', 'Mengelola operasional harian redaksi dan memastikan kualitas konten.', 3, true),
('Dewi Lestari', 'Editor Senior', 'Editorial', 'Spesialis editing dan fact-checking dengan pengalaman 10 tahun.', 4, true),
('Rudi Hermawan', 'Kepala IT', 'Technology', 'Bertanggung jawab atas infrastruktur teknologi dan pengembangan platform digital.', 5, true),
('Maya Putri', 'Social Media Manager', 'Marketing', 'Mengelola seluruh akun media sosial dan strategi digital marketing.', 6, true),
('Andi Pratama', 'Video Producer', 'Multimedia', 'Produser konten video dan multimedia untuk platform digital.', 7, true),
('Rina Wulandari', 'Reporter Senior', 'Editorial', 'Reporter lapangan dengan fokus pada berita investigasi.', 8, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. Job Listings (Lowongan Kerja)
-- =====================================================
INSERT INTO job_listings (title, department, location, job_type, level, salary_range, description, requirements, benefits, is_active) VALUES
('Reporter Politik', 'Editorial', 'Jakarta', 'full-time', 'mid', 'Rp 8.000.000 - Rp 12.000.000', 
 'Kami mencari reporter politik yang berpengalaman untuk meliput berita politik nasional dan internasional.',
 '- Minimal S1 Jurnalistik atau Komunikasi
- Pengalaman minimal 2 tahun sebagai reporter
- Memiliki jaringan sumber berita yang luas
- Mampu bekerja di bawah tekanan deadline
- Memiliki kemampuan menulis yang baik',
 '- Gaji kompetitif
- BPJS Kesehatan & Ketenagakerjaan
- Tunjangan transportasi
- Bonus tahunan
- Kesempatan pengembangan karir', true),

('Video Editor', 'Multimedia', 'Jakarta', 'full-time', 'junior', 'Rp 6.000.000 - Rp 9.000.000',
 'Dibutuhkan video editor kreatif untuk memproduksi konten video berita dan feature.',
 '- Minimal D3/S1 Multimedia atau bidang terkait
- Menguasai Adobe Premiere Pro dan After Effects
- Pengalaman minimal 1 tahun
- Kreatif dan detail-oriented
- Mampu bekerja dalam tim',
 '- Gaji kompetitif
- BPJS Kesehatan & Ketenagakerjaan
- Peralatan kerja disediakan
- Lingkungan kerja yang dinamis', true),

('Social Media Specialist', 'Marketing', 'Jakarta (Hybrid)', 'full-time', 'junior', 'Rp 5.000.000 - Rp 8.000.000',
 'Bergabunglah dengan tim marketing kami untuk mengelola dan mengembangkan presence di media sosial.',
 '- Minimal S1 Komunikasi atau Marketing
- Pengalaman mengelola akun media sosial profesional
- Memahami analytics dan metrics media sosial
- Kreatif dalam membuat konten
- Update dengan tren media sosial terkini',
 '- Gaji kompetitif
- Flexible working arrangement
- BPJS Kesehatan & Ketenagakerjaan
- Training dan sertifikasi', true),

('Web Developer', 'Technology', 'Jakarta (Remote)', 'full-time', 'mid', 'Rp 12.000.000 - Rp 18.000.000',
 'Kami mencari web developer untuk mengembangkan dan memelihara platform berita digital kami.',
 '- Minimal S1 Teknik Informatika atau bidang terkait
- Menguasai React/Next.js dan TypeScript
- Pengalaman dengan database PostgreSQL
- Familiar dengan cloud services (AWS/GCP)
- Pengalaman minimal 3 tahun',
 '- Gaji kompetitif
- Full remote working
- BPJS Kesehatan & Ketenagakerjaan
- Laptop dan peralatan kerja
- Budget untuk learning & development', true),

('Content Writer Intern', 'Editorial', 'Jakarta', 'internship', 'junior', 'Rp 2.500.000 - Rp 3.500.000',
 'Program magang untuk mahasiswa atau fresh graduate yang ingin berkarir di dunia jurnalistik.',
 '- Mahasiswa semester akhir atau fresh graduate
- Jurusan Jurnalistik, Komunikasi, atau Sastra
- Memiliki kemampuan menulis yang baik
- Aktif di media sosial
- Bersedia magang minimal 3 bulan',
 '- Uang saku bulanan
- Sertifikat magang
- Mentoring dari jurnalis senior
- Kesempatan diangkat menjadi karyawan tetap', true)
ON CONFLICT DO NOTHING;


-- =====================================================
-- 3. Trending Articles (dari artikel yang sudah ada)
-- =====================================================
INSERT INTO trending_articles (article_id, rank, trend_score, is_active, is_manual, period)
SELECT id, ROW_NUMBER() OVER (ORDER BY views_count DESC), views_count, true, false, 'daily'
FROM articles 
WHERE status = 'published' 
ORDER BY views_count DESC 
LIMIT 5
ON CONFLICT (article_id, period) DO NOTHING;

INSERT INTO trending_articles (article_id, rank, trend_score, is_active, is_manual, period)
SELECT id, ROW_NUMBER() OVER (ORDER BY views_count DESC), views_count, true, false, 'weekly'
FROM articles 
WHERE status = 'published' 
ORDER BY views_count DESC 
LIMIT 10
ON CONFLICT (article_id, period) DO NOTHING;

-- =====================================================
-- 4. Breaking News (berita terbaru sebagai breaking)
-- =====================================================
INSERT INTO breaking_news (article_id, priority, is_active, expires_at)
SELECT id, 1, true, NOW() + INTERVAL '24 hours'
FROM articles 
WHERE status = 'published' 
ORDER BY created_at DESC 
LIMIT 1
ON CONFLICT (article_id) DO NOTHING;

-- =====================================================
-- 5. Popular Articles
-- =====================================================
INSERT INTO popular_articles (article_id, rank, views_count, is_active, is_manual, period)
SELECT id, ROW_NUMBER() OVER (ORDER BY views_count DESC), views_count, true, false, 'weekly'
FROM articles 
WHERE status = 'published' 
ORDER BY views_count DESC 
LIMIT 10
ON CONFLICT (article_id, period) DO NOTHING;

INSERT INTO popular_articles (article_id, rank, views_count, is_active, is_manual, period)
SELECT id, ROW_NUMBER() OVER (ORDER BY views_count DESC), views_count, true, false, 'monthly'
FROM articles 
WHERE status = 'published' 
ORDER BY views_count DESC 
LIMIT 15
ON CONFLICT (article_id, period) DO NOTHING;

-- =====================================================
-- 6. Legal Documents (Dokumen Hukum Lengkap)
-- =====================================================
UPDATE legal_documents SET content = 
'# Syarat dan Ketentuan Penggunaan

## 1. Penerimaan Syarat
Dengan mengakses dan menggunakan website BeritaAE, Anda menyetujui untuk terikat dengan syarat dan ketentuan ini.

## 2. Penggunaan Layanan
- Anda harus berusia minimal 13 tahun untuk menggunakan layanan ini
- Anda bertanggung jawab atas aktivitas yang dilakukan melalui akun Anda
- Dilarang menggunakan layanan untuk tujuan ilegal

## 3. Konten Pengguna
- Anda bertanggung jawab atas komentar dan konten yang Anda posting
- Kami berhak menghapus konten yang melanggar ketentuan
- Dilarang memposting konten yang mengandung SARA, pornografi, atau kekerasan

## 4. Hak Kekayaan Intelektual
- Seluruh konten di website ini dilindungi hak cipta
- Dilarang menyalin atau mendistribusikan konten tanpa izin tertulis

## 5. Batasan Tanggung Jawab
BeritaAE tidak bertanggung jawab atas kerugian yang timbul dari penggunaan layanan ini.

## 6. Perubahan Ketentuan
Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya.

Terakhir diperbarui: Desember 2024'
WHERE type = 'terms';

UPDATE legal_documents SET content = 
'# Kebijakan Privasi

## 1. Informasi yang Kami Kumpulkan
Kami mengumpulkan informasi berikut:
- Informasi akun (nama, email, foto profil)
- Data penggunaan (halaman yang dikunjungi, waktu akses)
- Informasi perangkat (browser, sistem operasi, IP address)

## 2. Penggunaan Informasi
Informasi Anda digunakan untuk:
- Menyediakan dan meningkatkan layanan
- Personalisasi konten dan rekomendasi
- Mengirim newsletter (jika berlangganan)
- Analisis dan statistik penggunaan

## 3. Perlindungan Data
- Data Anda disimpan dengan enkripsi yang aman
- Kami tidak menjual data pribadi Anda kepada pihak ketiga
- Akses ke data dibatasi hanya untuk karyawan yang membutuhkan

## 4. Cookie
Kami menggunakan cookie untuk:
- Menyimpan preferensi pengguna
- Analisis traffic website
- Personalisasi iklan

## 5. Hak Pengguna
Anda berhak untuk:
- Mengakses data pribadi Anda
- Meminta penghapusan data
- Menolak penggunaan data untuk marketing

## 6. Kontak
Untuk pertanyaan tentang privasi, hubungi: privasi@beritaae.com

Terakhir diperbarui: Desember 2024'
WHERE type = 'privacy';

UPDATE legal_documents SET content = 
'# Kebijakan Cookie

## Apa itu Cookie?
Cookie adalah file kecil yang disimpan di perangkat Anda saat mengunjungi website.

## Jenis Cookie yang Kami Gunakan

### Cookie Esensial
- Diperlukan untuk fungsi dasar website
- Tidak dapat dinonaktifkan

### Cookie Analitik
- Membantu kami memahami penggunaan website
- Menggunakan Google Analytics

### Cookie Preferensi
- Menyimpan pengaturan tema dan bahasa
- Mengingat status login

### Cookie Marketing
- Digunakan untuk menampilkan iklan yang relevan
- Dapat dinonaktifkan melalui pengaturan browser

## Mengelola Cookie
Anda dapat mengelola cookie melalui pengaturan browser Anda. Menonaktifkan cookie tertentu dapat mempengaruhi fungsi website.

Terakhir diperbarui: Desember 2024'
WHERE type = 'cookies';

UPDATE legal_documents SET content = 
'# Disclaimer

## Informasi Umum
Konten yang disajikan di BeritaAE bersifat informatif dan tidak dimaksudkan sebagai nasihat profesional.

## Akurasi Informasi
- Kami berusaha menyajikan informasi yang akurat dan terkini
- Namun, kami tidak menjamin keakuratan 100% dari seluruh konten
- Pembaca disarankan untuk memverifikasi informasi penting dari sumber lain

## Tautan Eksternal
- Website ini mungkin berisi tautan ke situs eksternal
- Kami tidak bertanggung jawab atas konten situs eksternal tersebut

## Opini dan Komentar
- Opini yang disampaikan dalam artikel opini adalah pandangan penulis
- Komentar pengguna tidak mencerminkan pandangan BeritaAE

## Perubahan Konten
Kami berhak mengubah atau menghapus konten tanpa pemberitahuan sebelumnya.

Terakhir diperbarui: Desember 2024'
WHERE type = 'disclaimer';


-- =====================================================
-- 7. Company Profile (Update dengan data lengkap)
-- =====================================================
UPDATE company_profile SET 
    tagline = 'Portal Berita Terpercaya Indonesia',
    description = 'BeritaAE adalah portal berita digital yang berkomitmen menyajikan informasi terkini, akurat, dan berimbang kepada masyarakat Indonesia. Didirikan pada tahun 2020, kami terus berkembang menjadi salah satu sumber berita terpercaya di Indonesia.',
    vision = 'Menjadi portal berita digital terdepan yang menyajikan informasi berkualitas dan terpercaya untuk masyarakat Indonesia.',
    mission = '1. Menyajikan berita yang akurat, berimbang, dan bertanggung jawab
2. Mengutamakan kepentingan publik dalam setiap pemberitaan
3. Mengembangkan jurnalisme digital yang inovatif
4. Membangun komunitas pembaca yang kritis dan informatif
5. Menjunjung tinggi etika jurnalistik',
    history = 'BeritaAE didirikan pada tahun 2020 oleh sekelompok jurnalis berpengalaman yang memiliki visi untuk menciptakan media digital yang independen dan terpercaya. Berawal dari tim kecil, kini BeritaAE telah berkembang menjadi portal berita dengan jutaan pembaca setiap bulannya.

Perjalanan kami dimulai di tengah pandemi COVID-19, di mana kebutuhan akan informasi yang akurat sangat tinggi. Kami berkomitmen untuk menyajikan berita yang tidak hanya cepat, tetapi juga terverifikasi dan berimbang.

Hingga saat ini, BeritaAE terus berinovasi dalam menyajikan konten berita melalui berbagai format: artikel, video, podcast, dan infografis.',
    founded_year = 2020,
    address = 'Gedung Media Center Lt. 5
Jl. Sudirman Kav. 52-53
Jakarta Selatan 12190
Indonesia',
    phone = '+62 21 5555 1234',
    email = 'redaksi@beritaae.com',
    email_editorial = 'editorial@beritaae.com',
    email_complaints = 'pengaduan@beritaae.com'
WHERE id IS NOT NULL;

-- =====================================================
-- 8. Careers Settings (Update)
-- =====================================================
UPDATE careers_settings SET 
    page_title = 'Bergabung dengan Tim BeritaAE',
    page_description = 'Bergabunglah dengan BeritaAE dan jadilah bagian dari perubahan di industri media digital Indonesia. Kami mencari talenta-talenta terbaik yang memiliki passion di bidang jurnalistik dan teknologi.

Di BeritaAE, Anda akan:
- Bekerja dengan tim yang dinamis dan profesional
- Mendapat kesempatan untuk berkembang
- Berkontribusi dalam menyajikan informasi berkualitas
- Menjadi bagian dari transformasi media digital',
    contact_email = 'karir@beritaae.com',
    contact_whatsapp = '+62 812 3456 7890'
WHERE id IS NOT NULL;

-- =====================================================
-- 9. Ads Settings (Update)
-- =====================================================
UPDATE ads_settings SET 
    page_title = 'Beriklan di BeritaAE',
    page_description = 'Jangkau jutaan pembaca aktif dengan beriklan di BeritaAE. Kami menawarkan berbagai format iklan yang efektif untuk meningkatkan brand awareness dan konversi bisnis Anda.

Keunggulan beriklan di BeritaAE:
- Jangkauan luas ke pembaca aktif
- Targeting berdasarkan kategori berita
- Format iklan yang beragam
- Laporan performa yang detail
- Tim support yang responsif',
    contact_email = 'iklan@beritaae.com',
    contact_whatsapp = '+62 812 9876 5432'
WHERE id IS NOT NULL;

-- =====================================================
-- 10. Newsletter Subscribers (Sample)
-- =====================================================
INSERT INTO newsletter_subscribers (email, name, is_active, source) VALUES
('subscriber1@example.com', 'Andi Subscriber', true, 'website'),
('subscriber2@example.com', 'Budi Reader', true, 'popup'),
('subscriber3@example.com', 'Citra News', true, 'footer'),
('subscriber4@example.com', 'Deni Pembaca', true, 'website'),
('subscriber5@example.com', 'Eka Follower', true, 'popup')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 11. Sample Analytics Data (untuk demo)
-- =====================================================
INSERT INTO analytics_daily (date, total_views, unique_visitors, returning_visitors, new_users, total_sessions, avg_session_duration, bounce_rate, mobile_views, desktop_views, tablet_views) VALUES
(CURRENT_DATE - INTERVAL '6 days', 15420, 8500, 3200, 5300, 9800, 245, 42.5, 9200, 5100, 1120),
(CURRENT_DATE - INTERVAL '5 days', 18650, 10200, 4100, 6100, 11500, 268, 40.2, 11100, 6200, 1350),
(CURRENT_DATE - INTERVAL '4 days', 22100, 12500, 5200, 7300, 14200, 285, 38.8, 13200, 7400, 1500),
(CURRENT_DATE - INTERVAL '3 days', 19800, 11000, 4500, 6500, 12800, 255, 41.0, 11800, 6600, 1400),
(CURRENT_DATE - INTERVAL '2 days', 24500, 14200, 6100, 8100, 16500, 295, 37.5, 14700, 8100, 1700),
(CURRENT_DATE - INTERVAL '1 day', 28900, 16800, 7200, 9600, 19200, 310, 35.2, 17300, 9600, 2000),
(CURRENT_DATE, 12500, 7200, 3100, 4100, 8500, 220, 44.0, 7500, 4100, 900)
ON CONFLICT (date) DO UPDATE SET 
    total_views = EXCLUDED.total_views,
    unique_visitors = EXCLUDED.unique_visitors;

-- =====================================================
-- 12. Traffic Sources (Sample)
-- =====================================================
INSERT INTO traffic_sources (date, source, medium, visits) VALUES
(CURRENT_DATE, 'organic', 'google', 5200),
(CURRENT_DATE, 'organic', 'bing', 450),
(CURRENT_DATE, 'direct', NULL, 3100),
(CURRENT_DATE, 'social', 'facebook', 1800),
(CURRENT_DATE, 'social', 'twitter', 920),
(CURRENT_DATE, 'social', 'instagram', 680),
(CURRENT_DATE, 'referral', 'news.google.com', 1200),
(CURRENT_DATE - INTERVAL '1 day', 'organic', 'google', 8500),
(CURRENT_DATE - INTERVAL '1 day', 'direct', NULL, 4200),
(CURRENT_DATE - INTERVAL '1 day', 'social', 'facebook', 2800)
ON CONFLICT (date, source, medium) DO UPDATE SET visits = EXCLUDED.visits;
