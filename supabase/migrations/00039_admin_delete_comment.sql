-- Migration: Admin Delete Comment Function
-- Description: RPC function for admins to delete comments (bypasses RLS)

-- Create function for admin to delete comments
CREATE OR REPLACE FUNCTION admin_delete_comment(p_comment_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_role user_role;
BEGIN
    -- Get the role of the current user
    SELECT role INTO v_user_role
    FROM profiles
    WHERE id = auth.uid();
    
    -- Check if user is admin or editor
    IF v_user_role NOT IN ('admin', 'editor') THEN
        RAISE EXCEPTION 'Permission denied: Only admins and editors can delete comments';
    END IF;
    
    -- Delete the comment
    DELETE FROM comments WHERE id = p_comment_id;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION admin_delete_comment(UUID) TO authenticated;

-- Add comment
COMMENT ON FUNCTION admin_delete_comment(UUID) IS 'Allows admins and editors to delete any comment';
