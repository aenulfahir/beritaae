-- =====================================================
-- Helper Functions for Admin Features
-- =====================================================

-- Function to increment job applicants count
CREATE OR REPLACE FUNCTION increment_applicants_count(job_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE job_listings 
    SET applicants_count = applicants_count + 1 
    WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment ad impressions
CREATE OR REPLACE FUNCTION increment_ad_impressions(ad_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE advertisements 
    SET impressions = impressions + 1 
    WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment ad clicks
CREATE OR REPLACE FUNCTION increment_ad_clicks(ad_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE advertisements 
    SET clicks = clicks + 1 
    WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql;

-- Function to recalculate trending articles based on views and engagement
CREATE OR REPLACE FUNCTION recalculate_trending(p_period VARCHAR DEFAULT 'daily')
RETURNS void AS $$
DECLARE
    date_filter TIMESTAMPTZ;
BEGIN
    -- Set date filter based on period
    CASE p_period
        WHEN 'daily' THEN date_filter := NOW() - INTERVAL '1 day';
        WHEN 'weekly' THEN date_filter := NOW() - INTERVAL '7 days';
        WHEN 'monthly' THEN date_filter := NOW() - INTERVAL '30 days';
        ELSE date_filter := NOW() - INTERVAL '1 day';
    END CASE;

    -- Clear existing non-manual trending for this period
    DELETE FROM trending_articles 
    WHERE period = p_period AND is_manual = false;

    -- Insert new trending based on views and comments
    INSERT INTO trending_articles (article_id, rank, trend_score, is_active, is_manual, period)
    SELECT 
        a.id,
        ROW_NUMBER() OVER (ORDER BY (a.views_count + COALESCE(c.comment_count, 0) * 10) DESC),
        (a.views_count + COALESCE(c.comment_count, 0) * 10),
        true,
        false,
        p_period
    FROM articles a
    LEFT JOIN (
        SELECT article_id, COUNT(*) as comment_count 
        FROM comments 
        WHERE created_at >= date_filter
        GROUP BY article_id
    ) c ON a.id = c.article_id
    WHERE a.status = 'published' 
      AND a.created_at >= date_filter
    ORDER BY (a.views_count + COALESCE(c.comment_count, 0) * 10) DESC
    LIMIT 10
    ON CONFLICT (article_id, period) DO UPDATE SET
        rank = EXCLUDED.rank,
        trend_score = EXCLUDED.trend_score,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to recalculate popular articles
CREATE OR REPLACE FUNCTION recalculate_popular(p_period VARCHAR DEFAULT 'weekly')
RETURNS void AS $$
DECLARE
    date_filter TIMESTAMPTZ;
BEGIN
    CASE p_period
        WHEN 'daily' THEN date_filter := NOW() - INTERVAL '1 day';
        WHEN 'weekly' THEN date_filter := NOW() - INTERVAL '7 days';
        WHEN 'monthly' THEN date_filter := NOW() - INTERVAL '30 days';
        ELSE date_filter := NOW() - INTERVAL '7 days';
    END CASE;

    -- Clear existing non-manual popular for this period
    DELETE FROM popular_articles 
    WHERE period = p_period AND is_manual = false;

    -- Insert new popular based on views
    INSERT INTO popular_articles (article_id, rank, views_count, is_active, is_manual, period)
    SELECT 
        a.id,
        ROW_NUMBER() OVER (ORDER BY a.views_count DESC),
        a.views_count,
        true,
        false,
        p_period
    FROM articles a
    WHERE a.status = 'published'
    ORDER BY a.views_count DESC
    LIMIT 10
    ON CONFLICT (article_id, period) DO UPDATE SET
        rank = EXCLUDED.rank,
        views_count = EXCLUDED.views_count,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type VARCHAR,
    p_title VARCHAR,
    p_message TEXT DEFAULT NULL,
    p_link VARCHAR DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
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
$$ LANGUAGE plpgsql;

-- Trigger to create notification when comment is added
CREATE OR REPLACE FUNCTION notify_on_comment()
RETURNS TRIGGER AS $$
DECLARE
    article_author_id UUID;
    article_title VARCHAR;
BEGIN
    -- Get article author
    SELECT author_id, title INTO article_author_id, article_title
    FROM articles WHERE id = NEW.article_id;
    
    -- Don't notify if commenting on own article
    IF article_author_id IS NOT NULL AND article_author_id != NEW.user_id THEN
        PERFORM create_notification(
            article_author_id,
            'comment',
            'Komentar baru pada artikel Anda',
            'Seseorang mengomentari artikel "' || article_title || '"',
            '/news/' || (SELECT slug FROM articles WHERE id = NEW.article_id),
            jsonb_build_object('article_id', NEW.article_id, 'comment_id', NEW.id)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for comment notifications (only if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_notify_on_comment') THEN
        CREATE TRIGGER trigger_notify_on_comment
            AFTER INSERT ON comments
            FOR EACH ROW
            EXECUTE FUNCTION notify_on_comment();
    END IF;
END $$;

-- Function to get dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
    total_articles BIGINT,
    total_views BIGINT,
    total_comments BIGINT,
    total_users BIGINT,
    articles_today BIGINT,
    comments_today BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM articles WHERE status = 'published')::BIGINT as total_articles,
        (SELECT COALESCE(SUM(views_count), 0) FROM articles)::BIGINT as total_views,
        (SELECT COUNT(*) FROM comments WHERE is_approved = true)::BIGINT as total_comments,
        (SELECT COUNT(*) FROM profiles)::BIGINT as total_users,
        (SELECT COUNT(*) FROM articles WHERE status = 'published' AND DATE(created_at) = CURRENT_DATE)::BIGINT as articles_today,
        (SELECT COUNT(*) FROM comments WHERE DATE(created_at) = CURRENT_DATE)::BIGINT as comments_today;
END;
$$ LANGUAGE plpgsql;
