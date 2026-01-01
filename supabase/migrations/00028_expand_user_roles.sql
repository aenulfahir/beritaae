-- Migration: Expand User Roles
-- Description: Add superadmin and moderator roles to user_role enum

-- Add new values to user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'superadmin' BEFORE 'admin';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'moderator' AFTER 'editor';

-- Add status column to profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned'));
  END IF;
END $$;

-- Add last_login column to profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_login TIMESTAMPTZ;
  END IF;
END $$;

-- Add phone column to profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone TEXT;
  END IF;
END $$;

-- Create index for status
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

-- Update get_user_role function to include new roles
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
DECLARE
  v_role user_role;
BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = user_id;
  RETURN COALESCE(v_role, 'member'::user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has admin-level access (superadmin, admin, moderator)
CREATE OR REPLACE FUNCTION is_admin_user(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_role user_role;
BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = user_id;
  RETURN v_role IN ('superadmin', 'admin', 'moderator');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can manage other users
CREATE OR REPLACE FUNCTION can_manage_users(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_role user_role;
BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = user_id;
  RETURN v_role IN ('superadmin', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check role hierarchy (can user A manage user B)
CREATE OR REPLACE FUNCTION can_manage_role(manager_id UUID, target_role user_role)
RETURNS BOOLEAN AS $$
DECLARE
  manager_role user_role;
  role_hierarchy INTEGER;
  target_hierarchy INTEGER;
BEGIN
  SELECT role INTO manager_role FROM profiles WHERE id = manager_id;
  
  -- Define role hierarchy (higher number = more power)
  role_hierarchy := CASE manager_role
    WHEN 'superadmin' THEN 6
    WHEN 'admin' THEN 5
    WHEN 'moderator' THEN 4
    WHEN 'editor' THEN 3
    WHEN 'author' THEN 2
    WHEN 'member' THEN 1
    ELSE 0
  END;
  
  target_hierarchy := CASE target_role
    WHEN 'superadmin' THEN 6
    WHEN 'admin' THEN 5
    WHEN 'moderator' THEN 4
    WHEN 'editor' THEN 3
    WHEN 'author' THEN 2
    WHEN 'member' THEN 1
    ELSE 0
  END;
  
  -- Can only manage roles below your level
  RETURN role_hierarchy > target_hierarchy;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION is_admin_user IS 'Check if user has admin-level access';
COMMENT ON FUNCTION can_manage_users IS 'Check if user can manage other users';
COMMENT ON FUNCTION can_manage_role IS 'Check if user can manage a specific role level';
