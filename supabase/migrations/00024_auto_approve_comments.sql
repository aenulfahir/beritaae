-- Migration: Auto-approve comments
-- Description: Change default is_approved to true for better UX

-- Change default value for is_approved to true
ALTER TABLE comments ALTER COLUMN is_approved SET DEFAULT TRUE;

-- Add comment for documentation
COMMENT ON COLUMN comments.is_approved IS 'Whether comment is approved - defaults to true for immediate visibility';
