-- Migration: Fix Notifications RLS Policy
-- Description: Allow authenticated users to create notifications for any user (for reply notifications)

-- Drop existing insert policy
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;

-- Create a more permissive insert policy
-- Authenticated users can create notifications for any user (needed for reply notifications)
CREATE POLICY "Authenticated users can create notifications" ON notifications
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Drop existing function with old signature (VARCHAR types)
DROP FUNCTION IF EXISTS create_notification(UUID, VARCHAR, VARCHAR, TEXT, VARCHAR, JSONB);

-- Create/replace function to insert notifications with SECURITY DEFINER
-- This bypasses RLS and allows the system to create notifications
-- Using VARCHAR types to match existing usage
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type VARCHAR,
    p_title VARCHAR,
    p_message TEXT DEFAULT NULL,
    p_link VARCHAR DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (user_id, type, title, message, link, metadata)
    VALUES (p_user_id, p_type, p_title, p_message, p_link, p_metadata)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_notification(UUID, VARCHAR, VARCHAR, TEXT, VARCHAR, JSONB) TO authenticated;

-- Add comment
COMMENT ON FUNCTION create_notification(UUID, VARCHAR, VARCHAR, TEXT, VARCHAR, JSONB) IS 'Creates a notification for a user, bypassing RLS';
