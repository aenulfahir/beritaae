-- =====================================================
-- Analytics & Notifications Tables
-- =====================================================

-- 1. Page Views Analytics Table
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
    page_path VARCHAR(500) NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    device_type VARCHAR(20), -- mobile, desktop, tablet
    browser VARCHAR(50),
    os VARCHAR(50),
    country VARCHAR(100),
    city VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Daily Analytics Summary Table
CREATE TABLE IF NOT EXISTS analytics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    total_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    returning_visitors INTEGER DEFAULT 0,
    new_users INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    avg_session_duration INTEGER DEFAULT 0, -- in seconds
    bounce_rate DECIMAL(5, 2) DEFAULT 0,
    mobile_views INTEGER DEFAULT 0,
    desktop_views INTEGER DEFAULT 0,
    tablet_views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Article Analytics Table
CREATE TABLE IF NOT EXISTS article_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    unique_views INTEGER DEFAULT 0,
    avg_time_on_page INTEGER DEFAULT 0, -- in seconds
    scroll_depth DECIMAL(5, 2) DEFAULT 0, -- percentage
    shares INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(article_id, date)
);

-- 4. Traffic Sources Table
CREATE TABLE IF NOT EXISTS traffic_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    source VARCHAR(100) NOT NULL, -- organic, direct, social, referral, email
    medium VARCHAR(100),
    campaign VARCHAR(255),
    visits INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date, source, medium)
);

-- 5. Real-time Visitors Table (for live stats)
CREATE TABLE IF NOT EXISTS realtime_visitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(100) NOT NULL,
    page_path VARCHAR(500),
    article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
    device_type VARCHAR(20),
    country VARCHAR(100),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- comment, like, mention, system, breaking_news
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Admin Activity Log Table
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL, -- create, update, delete, publish, unpublish, etc.
    entity_type VARCHAR(50) NOT NULL, -- article, category, comment, user, etc.
    entity_id UUID,
    entity_title VARCHAR(255),
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    source VARCHAR(100), -- website, popup, footer, etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Email Campaigns Table
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, sent
    recipients_count INTEGER DEFAULT 0,
    opens_count INTEGER DEFAULT 0,
    clicks_count INTEGER DEFAULT 0,
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Saved Articles (Bookmarks) Table
CREATE TABLE IF NOT EXISTS saved_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, article_id)
);

-- 11. Reading History Table
CREATE TABLE IF NOT EXISTS reading_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT NOW(),
    time_spent INTEGER DEFAULT 0, -- in seconds
    scroll_depth DECIMAL(5, 2) DEFAULT 0,
    UNIQUE(user_id, article_id)
);

-- Add updated_at triggers
CREATE TRIGGER update_analytics_daily_updated_at BEFORE UPDATE ON analytics_daily
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_article_analytics_updated_at BEFORE UPDATE ON article_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_views_article ON page_views(article_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);

CREATE INDEX IF NOT EXISTS idx_analytics_daily_date ON analytics_daily(date);

CREATE INDEX IF NOT EXISTS idx_article_analytics_article ON article_analytics(article_id);
CREATE INDEX IF NOT EXISTS idx_article_analytics_date ON article_analytics(date);

CREATE INDEX IF NOT EXISTS idx_traffic_sources_date ON traffic_sources(date);

CREATE INDEX IF NOT EXISTS idx_realtime_visitors_activity ON realtime_visitors(last_activity);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

CREATE INDEX IF NOT EXISTS idx_admin_activity_user ON admin_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_entity ON admin_activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created ON admin_activity_log(created_at);

CREATE INDEX IF NOT EXISTS idx_saved_articles_user ON saved_articles(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_history_user ON reading_history(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_history_article ON reading_history(article_id);

-- Function to clean up old realtime visitors (older than 5 minutes)
CREATE OR REPLACE FUNCTION cleanup_realtime_visitors()
RETURNS void AS $$
BEGIN
    DELETE FROM realtime_visitors WHERE last_activity < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- Function to increment article view count
CREATE OR REPLACE FUNCTION increment_article_views(p_article_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE articles SET views_count = views_count + 1 WHERE id = p_article_id;
    
    -- Also update or insert into article_analytics
    INSERT INTO article_analytics (article_id, date, views)
    VALUES (p_article_id, CURRENT_DATE, 1)
    ON CONFLICT (article_id, date) 
    DO UPDATE SET views = article_analytics.views + 1;
END;
$$ LANGUAGE plpgsql;
