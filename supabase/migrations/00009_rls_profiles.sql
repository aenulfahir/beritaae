-- Migration: RLS Policies for Profiles
-- Description: Row Level Security policies for profiles table

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Everyone can view profiles (public profile information)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Only admins can update any profile (including roles)
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (get_user_role(auth.uid()) = 'admin');

-- Add comment for documentation
COMMENT ON POLICY "Profiles are viewable by everyone" ON profiles IS 'Allow public read access to all profiles';
COMMENT ON POLICY "Users can update own profile" ON profiles IS 'Allow users to update their own profile data';
COMMENT ON POLICY "Admins can update any profile" ON profiles IS 'Allow admins to update any profile including roles';
