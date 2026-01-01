-- Migration: Article Tags System
-- Description: Create tags table and article_tags junction table for hashtag functionality

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6366f1', -- Default indigo color
    usage_count INTEGER DEFAULT 0,
    is_trending BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create article_tags junction table
CREATE TABLE IF NOT EXISTS article_tags (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (article_id, tag_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_usage ON tags(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_tags_trending ON tags(is_trending) WHERE is_trending = TRUE;
CREATE INDEX IF NOT EXISTS idx_article_tags_article ON article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_article_tags_tag ON article_tags(tag_id);

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tags
CREATE POLICY "Anyone can view tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage tags" ON tags FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- RLS Policies for article_tags
CREATE POLICY "Anyone can view article_tags" ON article_tags FOR SELECT USING (true);
CREATE POLICY "Authors can manage article_tags" ON article_tags FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor', 'author'))
);

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags SET usage_count = GREATEST(0, usage_count - 1) WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update usage count
DROP TRIGGER IF EXISTS trigger_update_tag_usage ON article_tags;
CREATE TRIGGER trigger_update_tag_usage
    AFTER INSERT OR DELETE ON article_tags
    FOR EACH ROW
    EXECUTE FUNCTION update_tag_usage_count();

-- Function to get trending tags based on article views in last 7 days
CREATE OR REPLACE FUNCTION get_trending_tags(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    slug VARCHAR,
    color VARCHAR,
    article_count BIGINT,
    total_views BIGINT,
    trend_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        t.slug,
        t.color,
        COUNT(DISTINCT at.article_id) as article_count,
        COALESCE(SUM(a.views_count), 0)::BIGINT as total_views,
        -- Trend score: weighted by views and recency
        (COALESCE(SUM(a.views_count), 0) * 
         (1 + COUNT(DISTINCT CASE WHEN a.published_at > NOW() - INTERVAL '24 hours' THEN a.id END) * 0.5))::NUMERIC as trend_score
    FROM tags t
    INNER JOIN article_tags at ON t.id = at.tag_id
    INNER JOIN articles a ON at.article_id = a.id
    WHERE a.status = 'published'
      AND a.published_at > NOW() - INTERVAL '7 days'
    GROUP BY t.id, t.name, t.slug, t.color
    ORDER BY trend_score DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get articles by tag
CREATE OR REPLACE FUNCTION get_articles_by_tag(p_tag_slug VARCHAR, p_limit INTEGER DEFAULT 20)
RETURNS TABLE (
    article_id UUID,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    image_url TEXT,
    views_count INTEGER,
    published_at TIMESTAMPTZ,
    category_name VARCHAR,
    category_slug VARCHAR,
    category_color VARCHAR,
    author_name VARCHAR,
    author_avatar VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id as article_id,
        a.title,
        a.slug,
        a.excerpt,
        a.image_url,
        a.views_count,
        a.published_at,
        c.name as category_name,
        c.slug as category_slug,
        c.color as category_color,
        p.full_name as author_name,
        p.avatar_url as author_avatar
    FROM articles a
    INNER JOIN article_tags at ON a.id = at.article_id
    INNER JOIN tags t ON at.tag_id = t.id
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN profiles p ON a.author_id = p.id
    WHERE t.slug = p_tag_slug
      AND a.status = 'published'
    ORDER BY a.published_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger for tags
DROP TRIGGER IF EXISTS trigger_tags_updated_at ON tags;
CREATE TRIGGER trigger_tags_updated_at
    BEFORE UPDATE ON tags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE tags IS 'Hashtags/tags for categorizing articles';
COMMENT ON TABLE article_tags IS 'Junction table linking articles to tags';
COMMENT ON FUNCTION get_trending_tags IS 'Returns trending tags based on article views in last 7 days';
COMMENT ON FUNCTION get_articles_by_tag IS 'Returns articles associated with a specific tag';
