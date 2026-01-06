-- Premium Ad Slots Table
-- Supports 4 slot types: sidebar_sticky, in_article, homepage_hero, post_article

CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  slot_type VARCHAR(50) NOT NULL CHECK (slot_type IN ('sidebar_sticky', 'in_article', 'homepage_hero', 'post_article')),
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for efficient querying of active ads by slot
CREATE INDEX IF NOT EXISTS idx_ads_slot_active ON ads(slot_type, is_active, start_date, end_date);

-- Index for admin listing
CREATE INDEX IF NOT EXISTS idx_ads_created_at ON ads(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_ads_updated_at
  BEFORE UPDATE ON ads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- Anyone can read active ads (for display)
CREATE POLICY "Anyone can read active ads"
  ON ads FOR SELECT
  USING (is_active = true AND NOW() BETWEEN start_date AND end_date);

-- Admins can do everything
CREATE POLICY "Admins can manage ads"
  ON ads FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Function to increment impressions
CREATE OR REPLACE FUNCTION increment_ad_impressions(ad_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE ads SET impressions = impressions + 1 WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment clicks
CREATE OR REPLACE FUNCTION increment_ad_clicks(ad_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE ads SET clicks = clicks + 1 WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_ad_impressions(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION increment_ad_clicks(UUID) TO authenticated, anon;
