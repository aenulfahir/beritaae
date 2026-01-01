-- =====================================================
-- Admin Settings & Management Tables
-- =====================================================

-- 1. Site Settings Table (General settings, SEO, appearance)
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL DEFAULT '{}',
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO site_settings (key, value, category, description) VALUES
('site_name', '"Berita AE"', 'general', 'Website name'),
('tagline', '"Portal Berita Terpercaya"', 'general', 'Website tagline'),
('site_url', '"https://beritaae.com"', 'general', 'Website URL'),
('timezone', '"Asia/Jakarta"', 'general', 'Default timezone'),
('meta_title', '"Berita AE - Portal Berita Terpercaya Indonesia"', 'seo', 'SEO meta title'),
('meta_description', '"Baca berita terkini dari Indonesia dan dunia."', 'seo', 'SEO meta description'),
('meta_keywords', '"berita, indonesia, politik, ekonomi, olahraga"', 'seo', 'SEO meta keywords'),
('default_theme', '"system"', 'appearance', 'Default theme (light/dark/system)'),
('primary_color', '"#3b82f6"', 'appearance', 'Primary brand color'),
('articles_per_page', '12', 'appearance', 'Articles per page'),
('sidebar_position', '"right"', 'appearance', 'Sidebar position'),
('logo_url', '""', 'branding', 'Logo URL'),
('favicon_url', '""', 'branding', 'Favicon URL'),
('maintenance_mode', 'false', 'advanced', 'Maintenance mode enabled'),
('maintenance_message', '"Website sedang dalam perbaikan."', 'advanced', 'Maintenance message')
ON CONFLICT (key) DO NOTHING;

-- 2. Trending Articles Table
CREATE TABLE IF NOT EXISTS trending_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL DEFAULT 1,
    trend_score INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_manual BOOLEAN DEFAULT false,
    period VARCHAR(20) DEFAULT 'daily', -- daily, weekly, monthly
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    UNIQUE(article_id, period)
);

-- 3. Breaking News Table
CREATE TABLE IF NOT EXISTS breaking_news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    priority INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    UNIQUE(article_id)
);

-- 4. Popular Articles Table
CREATE TABLE IF NOT EXISTS popular_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL DEFAULT 1,
    views_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_manual BOOLEAN DEFAULT false,
    period VARCHAR(20) DEFAULT 'weekly', -- daily, weekly, monthly
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(article_id, period)
);

-- 5. Contact Settings Table
CREATE TABLE IF NOT EXISTS contact_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255),
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    address TEXT,
    operational_hours VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default contact settings
INSERT INTO contact_settings (email, phone, address, operational_hours) VALUES
('redaksi@beritaae.com', '+62 21 1234 5678', 'Jakarta, Indonesia', 'Senin - Jumat: 08:00 - 17:00 WIB')
ON CONFLICT DO NOTHING;

-- 6. Social Media Links Table
CREATE TABLE IF NOT EXISTS social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) UNIQUE NOT NULL,
    url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default social links
INSERT INTO social_links (platform, url, display_order) VALUES
('facebook', '', 1),
('twitter', '', 2),
('instagram', '', 3),
('youtube', '', 4),
('tiktok', '', 5),
('linkedin', '', 6)
ON CONFLICT (platform) DO NOTHING;

-- 7. Legal Documents Table
CREATE TABLE IF NOT EXISTS legal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) UNIQUE NOT NULL, -- terms, privacy, cookies, disclaimer
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default legal documents
INSERT INTO legal_documents (type, title, content) VALUES
('terms', 'Syarat dan Ketentuan', 'Syarat dan ketentuan penggunaan website...'),
('privacy', 'Kebijakan Privasi', 'Kebijakan privasi dan perlindungan data...'),
('cookies', 'Kebijakan Cookie', 'Kebijakan penggunaan cookie...'),
('disclaimer', 'Disclaimer', 'Disclaimer dan penyangkalan...')
ON CONFLICT (type) DO NOTHING;

-- Add updated_at triggers
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_trending_articles_updated_at BEFORE UPDATE ON trending_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_breaking_news_updated_at BEFORE UPDATE ON breaking_news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_popular_articles_updated_at BEFORE UPDATE ON popular_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_contact_settings_updated_at BEFORE UPDATE ON contact_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_legal_documents_updated_at BEFORE UPDATE ON legal_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
