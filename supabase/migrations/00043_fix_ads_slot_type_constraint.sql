-- Fix ads slot_type constraint to include popup and remove sidebar_sticky

-- Drop the old constraint
ALTER TABLE ads DROP CONSTRAINT IF EXISTS ads_slot_type_check;

-- Add new constraint with updated slot types
ALTER TABLE ads ADD CONSTRAINT ads_slot_type_check 
  CHECK (slot_type IN ('in_article', 'homepage_hero', 'post_article', 'popup'));

-- Update any existing sidebar_sticky ads to in_article (if any remain)
UPDATE ads SET slot_type = 'in_article' WHERE slot_type = 'sidebar_sticky';

-- Also ensure admins can read ALL ads (not just active ones) for admin panel
DROP POLICY IF EXISTS "Admins can read all ads" ON ads;
CREATE POLICY "Admins can read all ads"
  ON ads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'author')
    )
  );
