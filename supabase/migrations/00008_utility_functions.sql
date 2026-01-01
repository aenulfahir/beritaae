-- Migration: Utility Functions
-- Description: Create helper functions for common operations

-- Function to increment article view count
CREATE OR REPLACE FUNCTION increment_view_count(article_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE articles
  SET views_count = views_count + 1
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        TRIM(title),
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Function to toggle comment like
CREATE OR REPLACE FUNCTION toggle_comment_like(p_comment_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  liked BOOLEAN;
BEGIN
  -- Check if already liked
  IF EXISTS (SELECT 1 FROM comment_likes WHERE comment_id = p_comment_id AND user_id = p_user_id) THEN
    -- Unlike
    DELETE FROM comment_likes WHERE comment_id = p_comment_id AND user_id = p_user_id;
    UPDATE comments SET likes_count = likes_count - 1 WHERE id = p_comment_id;
    liked := FALSE;
  ELSE
    -- Like
    INSERT INTO comment_likes (comment_id, user_id) VALUES (p_comment_id, p_user_id);
    UPDATE comments SET likes_count = likes_count + 1 WHERE id = p_comment_id;
    liked := TRUE;
  END IF;
  RETURN liked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
DECLARE
  user_role_value user_role;
BEGIN
  SELECT role INTO user_role_value FROM profiles WHERE id = user_id;
  RETURN COALESCE(user_role_value, 'member');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON FUNCTION increment_view_count(UUID) IS 'Increments the view count for an article';
COMMENT ON FUNCTION generate_slug(TEXT) IS 'Generates a URL-friendly slug from a title';
COMMENT ON FUNCTION toggle_comment_like(UUID, UUID) IS 'Toggles a like on a comment, returns true if liked, false if unliked';
COMMENT ON FUNCTION get_user_role(UUID) IS 'Returns the role of a user, defaults to member if not found';
