-- Migration: RLS Policies for Categories
-- Description: Row Level Security policies for categories table

-- Enable RLS on categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Everyone can view categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- Only admins can insert categories
CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- Only admins can update categories
CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  USING (get_user_role(auth.uid()) = 'admin');

-- Only admins can delete categories
CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  USING (get_user_role(auth.uid()) = 'admin');

-- Add comments for documentation
COMMENT ON POLICY "Categories are viewable by everyone" ON categories IS 'Allow public read access to all categories';
COMMENT ON POLICY "Admins can insert categories" ON categories IS 'Only admins can create new categories';
COMMENT ON POLICY "Admins can update categories" ON categories IS 'Only admins can modify categories';
COMMENT ON POLICY "Admins can delete categories" ON categories IS 'Only admins can delete categories';
