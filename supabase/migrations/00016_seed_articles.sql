-- Seed Articles Migration
-- This migration seeds initial news articles data
-- Safe to run multiple times (idempotent)

-- Insert sample articles
-- Note: author_id is NULL since we don't have users yet
-- Articles will be published and visible to all users

INSERT INTO public.articles (
  title, 
  slug, 
  excerpt, 
  content, 
  image_url, 
  category_id, 
  status, 
  is_breaking, 
  is_featured, 
  views_count, 
  read_time, 
  published_at
)
SELECT 
  'Pemerintah Umumkan Kebijakan Ekonomi Baru untuk Tahun 2025',
  'pemerintah-umumkan-kebijakan-ekonomi-baru-2025',
  'Pemerintah Indonesia mengumumkan serangkaian kebijakan ekonomi baru yang akan diterapkan mulai tahun 2025 untuk mendorong pertumbuhan ekonomi nasional.',
  '<p>Jakarta - Pemerintah Indonesia resmi mengumumkan paket kebijakan ekonomi baru yang akan mulai berlaku pada awal tahun 2025. Kebijakan ini mencakup berbagai sektor strategis termasuk industri manufaktur, pertanian, dan teknologi digital.</p>
  <p>Menteri Keuangan menyatakan bahwa kebijakan ini dirancang untuk meningkatkan daya saing ekonomi Indonesia di tingkat global. "Kami berharap kebijakan ini dapat mendorong investasi dan menciptakan lapangan kerja baru," ujarnya dalam konferensi pers.</p>
  <p>Beberapa poin utama dari kebijakan baru ini meliputi:</p>
  <ul>
    <li>Insentif pajak untuk industri teknologi</li>
    <li>Kemudahan perizinan usaha</li>
    <li>Program pelatihan tenaga kerja</li>
    <li>Dukungan untuk UMKM</li>
  </ul>
  <p>Para ekonom menyambut baik langkah ini dan berharap implementasinya dapat berjalan dengan lancar.</p>',
  'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
  (SELECT id FROM categories WHERE slug = 'ekonomi'),
  'published',
  true,
  true,
  1250,
  '5 min',
  NOW() - INTERVAL '2 hours'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  updated_at = NOW();


INSERT INTO public.articles (
  title, slug, excerpt, content, image_url, category_id, status, is_breaking, is_featured, views_count, read_time, published_at
)
SELECT 
  'Timnas Indonesia Raih Kemenangan Bersejarah di Piala Asia',
  'timnas-indonesia-raih-kemenangan-bersejarah-piala-asia',
  'Tim nasional Indonesia berhasil meraih kemenangan bersejarah dalam pertandingan Piala Asia melawan tim unggulan.',
  '<p>Doha - Tim nasional Indonesia mencatatkan sejarah baru dengan meraih kemenangan gemilang dalam pertandingan Piala Asia. Pertandingan yang berlangsung sengit ini berakhir dengan skor 2-1.</p>
  <p>Gol pertama Indonesia dicetak pada menit ke-35 melalui tendangan bebas yang spektakuler. Gol kedua menyusul di babak kedua melalui serangan balik yang dimainkan dengan apik.</p>
  <p>Pelatih tim nasional mengapresiasi kerja keras seluruh pemain. "Ini adalah hasil dari latihan keras dan semangat juang yang tinggi," katanya setelah pertandingan.</p>
  <p>Kemenangan ini membawa Indonesia ke babak selanjutnya dan meningkatkan harapan untuk meraih prestasi lebih tinggi di turnamen ini.</p>',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  (SELECT id FROM categories WHERE slug = 'olahraga'),
  'published',
  true,
  true,
  3420,
  '4 min',
  NOW() - INTERVAL '4 hours'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  updated_at = NOW();

INSERT INTO public.articles (
  title, slug, excerpt, content, image_url, category_id, status, is_breaking, is_featured, views_count, read_time, published_at
)
SELECT 
  'Startup Indonesia Raih Pendanaan Seri B Senilai $50 Juta',
  'startup-indonesia-raih-pendanaan-seri-b-50-juta',
  'Startup teknologi asal Indonesia berhasil meraih pendanaan Seri B senilai $50 juta dari investor global.',
  '<p>Jakarta - Sebuah startup teknologi Indonesia yang bergerak di bidang fintech berhasil mengamankan pendanaan Seri B senilai $50 juta atau sekitar Rp 780 miliar.</p>
  <p>Pendanaan ini dipimpin oleh beberapa venture capital ternama dari Silicon Valley dan Singapura. Dana tersebut akan digunakan untuk ekspansi ke pasar Asia Tenggara.</p>
  <p>CEO startup tersebut menyatakan optimismenya terhadap pertumbuhan bisnis. "Pendanaan ini membuktikan kepercayaan investor terhadap potensi pasar Indonesia," ujarnya.</p>
  <p>Startup ini telah melayani lebih dari 5 juta pengguna dan mencatat pertumbuhan transaksi 300% year-over-year.</p>',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
  (SELECT id FROM categories WHERE slug = 'teknologi'),
  'published',
  false,
  true,
  890,
  '3 min',
  NOW() - INTERVAL '6 hours'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  updated_at = NOW();

INSERT INTO public.articles (
  title, slug, excerpt, content, image_url, category_id, status, is_breaking, is_featured, views_count, read_time, published_at
)
SELECT 
  'DPR Sahkan RUU Perlindungan Data Pribadi',
  'dpr-sahkan-ruu-perlindungan-data-pribadi',
  'DPR RI resmi mengesahkan Rancangan Undang-Undang Perlindungan Data Pribadi setelah pembahasan panjang.',
  '<p>Jakarta - Dewan Perwakilan Rakyat (DPR) RI akhirnya mengesahkan Rancangan Undang-Undang (RUU) Perlindungan Data Pribadi dalam rapat paripurna.</p>
  <p>UU ini mengatur tentang pengumpulan, pengolahan, dan penyimpanan data pribadi warga negara Indonesia. Pelanggaran terhadap UU ini dapat dikenakan sanksi pidana dan denda.</p>
  <p>Ketua DPR menyatakan bahwa UU ini sangat penting di era digital. "Ini adalah langkah maju untuk melindungi privasi warga negara," katanya.</p>
  <p>UU ini akan mulai berlaku 2 tahun setelah diundangkan untuk memberikan waktu transisi bagi pelaku usaha.</p>',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
  (SELECT id FROM categories WHERE slug = 'politik'),
  'published',
  false,
  false,
  567,
  '4 min',
  NOW() - INTERVAL '8 hours'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  updated_at = NOW();


INSERT INTO public.articles (
  title, slug, excerpt, content, image_url, category_id, status, is_breaking, is_featured, views_count, read_time, published_at
)
SELECT 
  'Artis Papan Atas Umumkan Konser Tur Asia 2025',
  'artis-papan-atas-umumkan-konser-tur-asia-2025',
  'Penyanyi terkenal Indonesia mengumumkan rencana konser tur Asia yang akan digelar di 10 kota besar.',
  '<p>Jakarta - Salah satu penyanyi papan atas Indonesia mengumumkan rencana konser tur Asia yang akan digelar sepanjang tahun 2025.</p>
  <p>Konser ini akan digelar di 10 kota besar termasuk Jakarta, Singapura, Kuala Lumpur, Bangkok, dan Tokyo. Tiket presale akan dibuka minggu depan.</p>
  <p>"Ini adalah impian saya untuk bisa tampil di berbagai negara Asia," ujar sang artis dalam konferensi pers.</p>
  <p>Konser ini akan menampilkan lagu-lagu hits serta beberapa lagu baru dari album terbarunya yang akan dirilis bulan depan.</p>',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  (SELECT id FROM categories WHERE slug = 'hiburan'),
  'published',
  false,
  false,
  2340,
  '3 min',
  NOW() - INTERVAL '10 hours'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  updated_at = NOW();

INSERT INTO public.articles (
  title, slug, excerpt, content, image_url, category_id, status, is_breaking, is_featured, views_count, read_time, published_at
)
SELECT 
  'Kemenkes Luncurkan Program Vaksinasi Nasional Baru',
  'kemenkes-luncurkan-program-vaksinasi-nasional-baru',
  'Kementerian Kesehatan meluncurkan program vaksinasi nasional baru untuk meningkatkan cakupan imunisasi.',
  '<p>Jakarta - Kementerian Kesehatan (Kemenkes) resmi meluncurkan program vaksinasi nasional baru yang menargetkan peningkatan cakupan imunisasi di seluruh Indonesia.</p>
  <p>Program ini mencakup vaksinasi untuk berbagai penyakit termasuk campak, polio, dan hepatitis B. Target cakupan adalah 95% untuk anak-anak di bawah 5 tahun.</p>
  <p>Menteri Kesehatan menyatakan komitmen pemerintah untuk kesehatan masyarakat. "Vaksinasi adalah investasi terbaik untuk kesehatan generasi mendatang," ujarnya.</p>
  <p>Program ini akan dilaksanakan secara bertahap mulai dari daerah dengan cakupan vaksinasi terendah.</p>',
  'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800',
  (SELECT id FROM categories WHERE slug = 'kesehatan'),
  'published',
  false,
  true,
  1120,
  '4 min',
  NOW() - INTERVAL '12 hours'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  updated_at = NOW();

INSERT INTO public.articles (
  title, slug, excerpt, content, image_url, category_id, status, is_breaking, is_featured, views_count, read_time, published_at
)
SELECT 
  'Kemendikbud Rilis Kurikulum Merdeka Versi Terbaru',
  'kemendikbud-rilis-kurikulum-merdeka-versi-terbaru',
  'Kementerian Pendidikan dan Kebudayaan merilis pembaruan Kurikulum Merdeka dengan fokus pada pembelajaran berbasis proyek.',
  '<p>Jakarta - Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi (Kemendikbudristek) merilis versi terbaru dari Kurikulum Merdeka.</p>
  <p>Pembaruan ini menekankan pada pembelajaran berbasis proyek dan pengembangan soft skills siswa. Kurikulum baru ini akan diterapkan secara bertahap mulai tahun ajaran 2025/2026.</p>
  <p>Mendikbudristek menjelaskan bahwa kurikulum ini dirancang untuk mempersiapkan siswa menghadapi tantangan abad ke-21. "Kami ingin siswa tidak hanya pintar secara akademis, tapi juga memiliki karakter yang kuat," katanya.</p>
  <p>Pelatihan untuk guru akan dimulai semester depan untuk memastikan implementasi yang sukses.</p>',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
  (SELECT id FROM categories WHERE slug = 'pendidikan'),
  'published',
  false,
  false,
  780,
  '5 min',
  NOW() - INTERVAL '14 hours'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  updated_at = NOW();

INSERT INTO public.articles (
  title, slug, excerpt, content, image_url, category_id, status, is_breaking, is_featured, views_count, read_time, published_at
)
SELECT 
  'KTT G20 Bahas Isu Perubahan Iklim Global',
  'ktt-g20-bahas-isu-perubahan-iklim-global',
  'Para pemimpin negara G20 berkumpul untuk membahas langkah konkret mengatasi perubahan iklim global.',
  '<p>Rio de Janeiro - Para pemimpin negara-negara G20 berkumpul dalam Konferensi Tingkat Tinggi (KTT) untuk membahas isu perubahan iklim yang semakin mendesak.</p>
  <p>Dalam pertemuan ini, para pemimpin dunia menyepakati target pengurangan emisi karbon sebesar 50% pada tahun 2030. Komitmen pendanaan untuk negara berkembang juga ditingkatkan.</p>
  <p>Presiden Indonesia menyampaikan komitmen Indonesia dalam transisi energi bersih. "Indonesia berkomitmen untuk mencapai net zero emission pada tahun 2060," ujarnya.</p>
  <p>KTT ini juga membahas kerja sama teknologi hijau dan transfer pengetahuan antar negara.</p>',
  'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800',
  (SELECT id FROM categories WHERE slug = 'internasional'),
  'published',
  false,
  true,
  1560,
  '6 min',
  NOW() - INTERVAL '16 hours'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  updated_at = NOW();


INSERT INTO public.articles (
  title, slug, excerpt, content, image_url, category_id, status, is_breaking, is_featured, views_count, read_time, published_at
)
SELECT 
  'Tren Gaya Hidup Sehat Meningkat di Kalangan Milenial',
  'tren-gaya-hidup-sehat-meningkat-kalangan-milenial',
  'Survei terbaru menunjukkan peningkatan signifikan minat generasi milenial terhadap gaya hidup sehat.',
  '<p>Jakarta - Sebuah survei terbaru menunjukkan bahwa minat generasi milenial Indonesia terhadap gaya hidup sehat meningkat drastis dalam dua tahun terakhir.</p>
  <p>Survei yang melibatkan 5.000 responden ini menemukan bahwa 78% milenial kini lebih memperhatikan pola makan dan olahraga. Tren ini juga mendorong pertumbuhan industri makanan sehat dan fitness.</p>
  <p>Pakar kesehatan menyambut baik tren ini. "Kesadaran akan pentingnya kesehatan adalah investasi jangka panjang," ujar seorang dokter spesialis gizi.</p>
  <p>Beberapa tren yang populer termasuk plant-based diet, intermittent fasting, dan olahraga HIIT.</p>',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
  (SELECT id FROM categories WHERE slug = 'gaya-hidup'),
  'published',
  false,
  false,
  920,
  '4 min',
  NOW() - INTERVAL '18 hours'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  updated_at = NOW();

INSERT INTO public.articles (
  title, slug, excerpt, content, image_url, category_id, status, is_breaking, is_featured, views_count, read_time, published_at
)
SELECT 
  'Gempa Bumi 6.5 SR Guncang Sulawesi Tengah',
  'gempa-bumi-65-sr-guncang-sulawesi-tengah',
  'Gempa bumi berkekuatan 6.5 SR mengguncang wilayah Sulawesi Tengah, BMKG imbau warga tetap waspada.',
  '<p>Palu - Gempa bumi berkekuatan 6.5 Skala Richter mengguncang wilayah Sulawesi Tengah pada dini hari tadi. Pusat gempa berada di kedalaman 10 km.</p>
  <p>BMKG menyatakan tidak ada potensi tsunami dari gempa ini. Namun, warga diimbau untuk tetap waspada terhadap gempa susulan.</p>
  <p>Beberapa bangunan dilaporkan mengalami kerusakan ringan. Tim SAR dan BPBD telah dikerahkan untuk melakukan pengecekan dan evakuasi jika diperlukan.</p>
  <p>Gubernur Sulawesi Tengah meminta warga untuk tidak panik dan mengikuti arahan dari pihak berwenang.</p>',
  'https://images.unsplash.com/photo-1545552987-720aa18145ca?w=800',
  (SELECT id FROM categories WHERE slug = 'nasional'),
  'published',
  true,
  false,
  4520,
  '3 min',
  NOW() - INTERVAL '1 hour'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  updated_at = NOW();

INSERT INTO public.articles (
  title, slug, excerpt, content, image_url, category_id, status, is_breaking, is_featured, views_count, read_time, published_at
)
SELECT 
  'Apple Rilis iPhone 17 dengan Fitur AI Canggih',
  'apple-rilis-iphone-17-fitur-ai-canggih',
  'Apple resmi meluncurkan iPhone 17 dengan berbagai fitur kecerdasan buatan yang revolusioner.',
  '<p>Cupertino - Apple resmi mengumumkan peluncuran iPhone 17 dalam acara tahunan mereka. Smartphone terbaru ini hadir dengan berbagai fitur AI yang diklaim revolusioner.</p>
  <p>Fitur utama termasuk asisten AI yang lebih pintar, kemampuan fotografi dengan AI enhancement, dan baterai yang lebih tahan lama berkat optimasi AI.</p>
  <p>CEO Apple menyatakan bahwa iPhone 17 adalah "lompatan besar dalam teknologi smartphone". Harga mulai dari $999 untuk model standar.</p>
  <p>Pre-order akan dibuka minggu depan dan pengiriman dimulai bulan depan. Indonesia termasuk dalam gelombang pertama peluncuran.</p>',
  'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
  (SELECT id FROM categories WHERE slug = 'teknologi'),
  'published',
  false,
  true,
  3200,
  '4 min',
  NOW() - INTERVAL '20 hours'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  updated_at = NOW();

INSERT INTO public.articles (
  title, slug, excerpt, content, image_url, category_id, status, is_breaking, is_featured, views_count, read_time, published_at
)
SELECT 
  'Bank Indonesia Pertahankan Suku Bunga Acuan',
  'bank-indonesia-pertahankan-suku-bunga-acuan',
  'Bank Indonesia memutuskan untuk mempertahankan suku bunga acuan di level 6% untuk menjaga stabilitas ekonomi.',
  '<p>Jakarta - Rapat Dewan Gubernur Bank Indonesia memutuskan untuk mempertahankan suku bunga acuan BI Rate di level 6%.</p>
  <p>Keputusan ini diambil dengan mempertimbangkan kondisi inflasi yang terkendali dan stabilitas nilai tukar rupiah. BI optimis pertumbuhan ekonomi akan tetap solid.</p>
  <p>Gubernur BI menyatakan bahwa kebijakan ini konsisten dengan upaya menjaga stabilitas makroekonomi. "Kami akan terus memantau perkembangan global dan domestik," ujarnya.</p>
  <p>Para ekonom menilai keputusan ini sudah sesuai ekspektasi pasar dan memberikan kepastian bagi pelaku usaha.</p>',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
  (SELECT id FROM categories WHERE slug = 'ekonomi'),
  'published',
  false,
  false,
  650,
  '4 min',
  NOW() - INTERVAL '22 hours'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  updated_at = NOW();

INSERT INTO public.articles (
  title, slug, excerpt, content, image_url, category_id, status, is_breaking, is_featured, views_count, read_time, published_at
)
SELECT 
  'Liga 1 Indonesia Masuki Babak Penentuan Juara',
  'liga-1-indonesia-masuki-babak-penentuan-juara',
  'Kompetisi Liga 1 Indonesia memasuki fase krusial dengan tiga tim bersaing ketat untuk gelar juara.',
  '<p>Jakarta - Kompetisi Liga 1 Indonesia musim ini memasuki babak penentuan dengan tiga tim masih bersaing ketat untuk meraih gelar juara.</p>
  <p>Persija Jakarta, Persib Bandung, dan Bali United hanya terpaut 3 poin di klasemen. Pertandingan sisa akan menentukan siapa yang berhak menjadi juara.</p>
  <p>Pelatih Persija optimis timnya bisa meraih gelar. "Kami akan berjuang sampai akhir," katanya. Sementara Persib dan Bali United juga menyatakan kesiapan mereka.</p>
  <p>Pertandingan penentuan akan berlangsung dalam dua pekan ke depan dengan jadwal yang padat.</p>',
  'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
  (SELECT id FROM categories WHERE slug = 'olahraga'),
  'published',
  false,
  false,
  1890,
  '3 min',
  NOW() - INTERVAL '24 hours'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  updated_at = NOW();

