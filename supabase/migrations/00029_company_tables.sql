-- Migration: Company Tables Update
-- Description: Add missing columns to company tables and create missing tables

-- =====================================================
-- Add Social Media Columns to Company Profile
-- =====================================================
DO $$ 
BEGIN
  -- Add facebook_url if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'company_profile' AND column_name = 'facebook_url') THEN
    ALTER TABLE company_profile ADD COLUMN facebook_url TEXT;
  END IF;
  
  -- Add twitter_url if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'company_profile' AND column_name = 'twitter_url') THEN
    ALTER TABLE company_profile ADD COLUMN twitter_url TEXT;
  END IF;
  
  -- Add instagram_url if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'company_profile' AND column_name = 'instagram_url') THEN
    ALTER TABLE company_profile ADD COLUMN instagram_url TEXT;
  END IF;
  
  -- Add youtube_url if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'company_profile' AND column_name = 'youtube_url') THEN
    ALTER TABLE company_profile ADD COLUMN youtube_url TEXT;
  END IF;
  
  -- Add linkedin_url if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'company_profile' AND column_name = 'linkedin_url') THEN
    ALTER TABLE company_profile ADD COLUMN linkedin_url TEXT;
  END IF;
  
  -- Add tiktok_url if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'company_profile' AND column_name = 'tiktok_url') THEN
    ALTER TABLE company_profile ADD COLUMN tiktok_url TEXT;
  END IF;
END $$;

-- =====================================================
-- Career Settings Table (if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS career_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_title TEXT DEFAULT 'Bergabung dengan Tim Kami',
  page_description TEXT,
  application_email TEXT,
  whatsapp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Ad Settings Table (if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS ad_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_title TEXT DEFAULT 'Pasang Iklan di BeritaAE',
  page_description TEXT,
  contact_email TEXT,
  whatsapp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Add missing columns to ad_placements
-- =====================================================
DO $$ 
BEGIN
  -- Add impressions if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ad_placements' AND column_name = 'impressions') THEN
    ALTER TABLE ad_placements ADD COLUMN impressions INTEGER DEFAULT 0;
  END IF;
  
  -- Add clicks if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ad_placements' AND column_name = 'clicks') THEN
    ALTER TABLE ad_placements ADD COLUMN clicks INTEGER DEFAULT 0;
  END IF;
  
  -- Add price_daily if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ad_placements' AND column_name = 'price_daily') THEN
    ALTER TABLE ad_placements ADD COLUMN price_daily BIGINT DEFAULT 0;
  END IF;
END $$;

-- =====================================================
-- RLS Policies for new tables
-- =====================================================
ALTER TABLE career_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public can read career settings" ON career_settings;
DROP POLICY IF EXISTS "Public can read ad settings" ON ad_settings;
DROP POLICY IF EXISTS "Admin full access career settings" ON career_settings;
DROP POLICY IF EXISTS "Admin full access ad settings" ON ad_settings;

-- Public read access
CREATE POLICY "Public can read career settings" ON career_settings FOR SELECT USING (true);
CREATE POLICY "Public can read ad settings" ON ad_settings FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "Admin full access career settings" ON career_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('superadmin', 'admin'))
);
CREATE POLICY "Admin full access ad settings" ON ad_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('superadmin', 'admin'))
);
