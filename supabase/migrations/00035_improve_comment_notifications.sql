-- Migration: Improve Comment Notifications
-- Description: Update comment notification trigger to include more metadata for better UI

-- Drop existing trigger first
DROP TRIGGER IF EXISTS trigger_notify_on_comment ON comments;

-- Update the notify_on_comment function with better metadata
CREATE OR REPLACE FUNCTION notify_on_comment()
RETURNS TRIGGER AS $$
DECLARE
    article_author_id UUID;
    article_title VARCHAR;
    article_slug VARCHAR;
    commenter_name VARCHAR;
    commenter_avatar VARCHAR;
    comment_preview TEXT;
BEGIN
    -- Get article info
    SELECT author_id, title, slug INTO article_author_id, article_title, article_slug
    FROM articles WHERE id = NEW.article_id;
    
    -- Get commenter info
    SELECT full_name, avatar_url INTO commenter_name, commenter_avatar
    FROM profiles WHERE id = NEW.user_id;
    
    -- Create comment preview (first 120 chars)
    comment_preview := LEFT(NEW.content, 120);
    IF LENGTH(NEW.content) > 120 THEN
        comment_preview := comment_preview || '...';
    END IF;
    
    -- Don't notify if commenting on own article or if it's a reply (replies handled separately)
    IF article_author_id IS NOT NULL 
       AND article_author_id != NEW.user_id 
       AND NEW.parent_id IS NULL THEN
        PERFORM create_notification(
            article_author_id,
            'comment',
            '💬 ' || COALESCE(commenter_name, 'Seseorang') || ' mengomentari artikel Anda',
            '"' || comment_preview || '"',
            '/news/' || article_slug || '#comment-' || NEW.id,
            jsonb_build_object(
                'article_id', NEW.article_id,
                'article_title', article_title,
                'article_slug', article_slug,
                'comment_id', NEW.id,
                'commenter_id', NEW.user_id,
                'commenter_name', COALESCE(commenter_name, 'Seseorang'),
                'commenter_avatar', commenter_avatar,
                'comment_content', NEW.content
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER trigger_notify_on_comment
    AFTER INSERT ON comments
    FOR EACH ROW
    EXECUTE FUNCTION notify_on_comment();

-- Add comment
COMMENT ON FUNCTION notify_on_comment IS 'Creates notification when someone comments on an article (not for replies)';
