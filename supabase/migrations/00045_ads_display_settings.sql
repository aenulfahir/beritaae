-- Add flexible display settings for ads
-- Allows custom width/height configuration per ad

-- Add display dimension columns
ALTER TABLE ads ADD COLUMN IF NOT EXISTS display_width INTEGER;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS display_height INTEGER;
ALTER TABLE ads ADD COLUMN IF NOT EXISTS display_mode VARCHAR(20) DEFAULT 'auto' CHECK (display_mode IN ('auto', 'fixed', 'responsive'));

-- display_mode options:
-- 'auto' = use default slot dimensions
-- 'fixed' = use custom display_width and display_height exactly
-- 'responsive' = scale proportionally within max dimensions

-- Add index for display settings queries
CREATE INDEX IF NOT EXISTS idx_ads_display_mode ON ads(display_mode);

-- Comment for documentation
COMMENT ON COLUMN ads.display_width IS 'Custom display width in pixels (used when display_mode is fixed or responsive)';
COMMENT ON COLUMN ads.display_height IS 'Custom display height in pixels (used when display_mode is fixed or responsive)';
COMMENT ON COLUMN ads.display_mode IS 'Display mode: auto (default slot size), fixed (exact custom size), responsive (scale within max)';
