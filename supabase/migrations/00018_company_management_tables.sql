-- =====================================================
-- Company Management Tables (About, Team, Careers, Ads)
-- =====================================================

-- 1. Company Profile Table
CREATE TABLE IF NOT EXISTS company_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL DEFAULT 'PT Berita Aktual Indonesia',
    tagline VARCHAR(500),
    description TEXT,
    vision TEXT,
    mission TEXT,
    history TEXT,
    founded_year INTEGER,
    logo_url VARCHAR(500),
    favicon_url VARCHAR(500),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    email_editorial VARCHAR(255),
    email_complaints VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default company profile
INSERT INTO company_profile (name, tagline, description, founded_year) VALUES
('PT Berita Aktual Indonesia', 'Portal Berita Terpercaya Indonesia', 
 'BeritaAE adalah portal berita digital yang berkomitmen menyajikan informasi terkini, akurat, dan berimbang kepada masyarakat Indonesia.',
 2020)
ON CONFLICT DO NOTHING;

-- 2. Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    email VARCHAR(255),
    linkedin_url VARCHAR(500),
    twitter_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Job Listings Table (Careers)
CREATE TABLE IF NOT EXISTS job_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    location VARCHAR(255),
    job_type VARCHAR(50), -- full-time, part-time, contract, internship
    level VARCHAR(50), -- junior, mid, senior, lead
    salary_range VARCHAR(100),
    description TEXT,
    requirements TEXT,
    benefits TEXT,
    is_active BOOLEAN DEFAULT true,
    applicants_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- 4. Job Applications Table
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    resume_url VARCHAR(500),
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, reviewed, shortlisted, rejected, hired
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Ad Placements Table
CREATE TABLE IF NOT EXISTS ad_placements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL, -- homepage-top, sidebar, in-article, mobile-sticky, popup
    size VARCHAR(100), -- 970x250, 300x250, 728x90, etc.
    price_monthly DECIMAL(15, 2),
    price_weekly DECIMAL(15, 2),
    price_daily DECIMAL(15, 2),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default ad placements
INSERT INTO ad_placements (name, position, size, price_monthly, price_weekly, display_order) VALUES
('Homepage Banner', 'homepage-top', '970x250', 5000000, 1500000, 1),
('Sidebar Rectangle', 'sidebar', '300x250', 2500000, 750000, 2),
('In-Article Banner', 'in-article', '728x90', 3000000, 900000, 3),
('Mobile Sticky', 'mobile-sticky', '320x50', 2000000, 600000, 4)
ON CONFLICT DO NOTHING;

-- 6. Active Advertisements Table
CREATE TABLE IF NOT EXISTS advertisements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    placement_id UUID NOT NULL REFERENCES ad_placements(id) ON DELETE CASCADE,
    advertiser_name VARCHAR(255) NOT NULL,
    advertiser_email VARCHAR(255),
    advertiser_phone VARCHAR(50),
    image_url VARCHAR(500) NOT NULL,
    target_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Careers Page Settings
CREATE TABLE IF NOT EXISTS careers_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_title VARCHAR(255) DEFAULT 'Bergabung dengan Tim Kami',
    page_description TEXT,
    contact_email VARCHAR(255),
    contact_whatsapp VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default careers settings
INSERT INTO careers_settings (page_title, page_description, contact_email) VALUES
('Bergabung dengan Tim Kami', 
 'Bergabunglah dengan BeritaAE dan jadilah bagian dari perubahan di industri media digital Indonesia.',
 'karir@beritaae.com')
ON CONFLICT DO NOTHING;

-- 8. Ads Page Settings
CREATE TABLE IF NOT EXISTS ads_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_title VARCHAR(255) DEFAULT 'Pasang Iklan di BeritaAE',
    page_description TEXT,
    contact_email VARCHAR(255),
    contact_whatsapp VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default ads settings
INSERT INTO ads_settings (page_title, page_description, contact_email) VALUES
('Pasang Iklan di BeritaAE',
 'Jangkau jutaan pembaca aktif dengan beriklan di BeritaAE.',
 'iklan@beritaae.com')
ON CONFLICT DO NOTHING;

-- Add updated_at triggers
CREATE TRIGGER update_company_profile_updated_at BEFORE UPDATE ON company_profile
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_job_listings_updated_at BEFORE UPDATE ON job_listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ad_placements_updated_at BEFORE UPDATE ON ad_placements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_advertisements_updated_at BEFORE UPDATE ON advertisements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_careers_settings_updated_at BEFORE UPDATE ON careers_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ads_settings_updated_at BEFORE UPDATE ON ads_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_team_members_department ON team_members(department);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_job_listings_active ON job_listings(is_active);
CREATE INDEX IF NOT EXISTS idx_job_listings_department ON job_listings(department);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_advertisements_placement ON advertisements(placement_id);
CREATE INDEX IF NOT EXISTS idx_advertisements_active ON advertisements(is_active);
CREATE INDEX IF NOT EXISTS idx_advertisements_dates ON advertisements(start_date, end_date);
