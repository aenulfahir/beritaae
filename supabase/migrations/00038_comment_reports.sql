-- Migration: Comment Reports System
-- Description: Create comment_reports table for reporting inappropriate comments

-- Create comment_reports table
CREATE TABLE IF NOT EXISTS comment_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE NOT NULL,
    reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reason VARCHAR(50) NOT NULL, -- spam, harassment, inappropriate, misinformation, other
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, reviewed, resolved, dismissed
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_comment_reports_comment ON comment_reports(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_reports_reporter ON comment_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_comment_reports_status ON comment_reports(status);
CREATE INDEX IF NOT EXISTS idx_comment_reports_created ON comment_reports(created_at DESC);

-- Enable RLS
ALTER TABLE comment_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone authenticated can create a report
CREATE POLICY "Users can create reports" ON comment_reports 
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can view their own reports
CREATE POLICY "Users can view own reports" ON comment_reports 
    FOR SELECT USING (reporter_id = auth.uid());

-- Admins can view and manage all reports
CREATE POLICY "Admins can manage reports" ON comment_reports 
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- Function to create a report (bypasses RLS for notification)
CREATE OR REPLACE FUNCTION report_comment(
    p_comment_id UUID,
    p_reporter_id UUID,
    p_reason VARCHAR,
    p_description TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_report_id UUID;
    v_comment_content TEXT;
    v_article_id UUID;
    v_article_title TEXT;
BEGIN
    -- Insert the report
    INSERT INTO comment_reports (comment_id, reporter_id, reason, description)
    VALUES (p_comment_id, p_reporter_id, p_reason, p_description)
    RETURNING id INTO v_report_id;
    
    -- Get comment and article info for notification
    SELECT c.content, c.article_id, a.title
    INTO v_comment_content, v_article_id, v_article_title
    FROM comments c
    LEFT JOIN articles a ON c.article_id = a.id
    WHERE c.id = p_comment_id;
    
    -- Create notification for admins
    INSERT INTO notifications (user_id, type, title, message, link, metadata)
    SELECT 
        p.id,
        'report',
        '🚨 Laporan Komentar Baru',
        'Komentar dilaporkan: ' || LEFT(v_comment_content, 50) || CASE WHEN LENGTH(v_comment_content) > 50 THEN '...' ELSE '' END,
        '/admin/comments?tab=reports',
        jsonb_build_object(
            'report_id', v_report_id,
            'comment_id', p_comment_id,
            'article_id', v_article_id,
            'article_title', v_article_title,
            'reason', p_reason
        )
    FROM profiles p
    WHERE p.role IN ('admin', 'editor');
    
    RETURN v_report_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update report status
CREATE OR REPLACE FUNCTION update_report_status(
    p_report_id UUID,
    p_status VARCHAR,
    p_reviewer_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE comment_reports
    SET 
        status = p_status,
        reviewed_by = p_reviewer_id,
        reviewed_at = NOW(),
        updated_at = NOW()
    WHERE id = p_report_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add updated_at trigger
DROP TRIGGER IF EXISTS trigger_comment_reports_updated_at ON comment_reports;
CREATE TRIGGER trigger_comment_reports_updated_at
    BEFORE UPDATE ON comment_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE comment_reports IS 'Reports for inappropriate comments';
COMMENT ON FUNCTION report_comment IS 'Creates a comment report and notifies admins';
