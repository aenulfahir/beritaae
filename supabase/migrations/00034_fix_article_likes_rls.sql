-- Migration: Fix Article Likes RLS Policy
-- Description: Add SECURITY DEFINER function to handle article reactions server-side

-- Create a function to toggle article reaction with SECURITY DEFINER
-- This bypasses RLS and allows the server to manage reactions
CREATE OR REPLACE FUNCTION toggle_article_reaction(
    p_article_id UUID,
    p_user_id UUID,
    p_reaction_type reaction_type
)
RETURNS TABLE (
    success BOOLEAN,
    new_reaction TEXT,
    likes_count BIGINT,
    dislikes_count BIGINT
) AS $$
DECLARE
    existing_reaction reaction_type;
    result_reaction TEXT;
BEGIN
    -- Check if user already has a reaction
    SELECT reaction_type INTO existing_reaction
    FROM article_likes
    WHERE article_id = p_article_id AND user_id = p_user_id;
    
    IF existing_reaction IS NOT NULL THEN
        IF existing_reaction = p_reaction_type THEN
            -- Same reaction - toggle off (delete)
            DELETE FROM article_likes
            WHERE article_id = p_article_id AND user_id = p_user_id;
            result_reaction := NULL;
        ELSE
            -- Different reaction - update
            UPDATE article_likes
            SET reaction_type = p_reaction_type
            WHERE article_id = p_article_id AND user_id = p_user_id;
            result_reaction := p_reaction_type::TEXT;
        END IF;
    ELSE
        -- No existing reaction - insert new
        INSERT INTO article_likes (article_id, user_id, reaction_type)
        VALUES (p_article_id, p_user_id, p_reaction_type);
        result_reaction := p_reaction_type::TEXT;
    END IF;
    
    -- Return result with updated counts
    RETURN QUERY
    SELECT 
        TRUE as success,
        result_reaction as new_reaction,
        (SELECT COUNT(*) FROM article_likes WHERE article_id = p_article_id AND reaction_type = 'like') as likes_count,
        (SELECT COUNT(*) FROM article_likes WHERE article_id = p_article_id AND reaction_type = 'dislike') as dislikes_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION toggle_article_reaction TO authenticated;

-- Add comment
COMMENT ON FUNCTION toggle_article_reaction IS 'Toggles article reaction (like/dislike) for a user, bypassing RLS';
