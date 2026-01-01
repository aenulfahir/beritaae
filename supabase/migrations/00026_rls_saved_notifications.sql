-- =====================================================
-- RLS Policies for Saved Articles and Notifications
-- =====================================================

-- Enable RLS on saved_articles
ALTER TABLE saved_articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own saved articles" ON saved_articles;
DROP POLICY IF EXISTS "Users can save articles" ON saved_articles;
DROP POLICY IF EXISTS "Users can unsave articles" ON saved_articles;

-- Saved Articles Policies
CREATE POLICY "Users can view own saved articles" ON saved_articles
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can save articles" ON saved_articles
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unsave articles" ON saved_articles
    FOR DELETE TO authenticated
    USING (user_id = auth.uid());

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own notifications" ON notifications
    FOR DELETE TO authenticated
    USING (user_id = auth.uid());

-- Allow authenticated users to create notifications (for comment replies)
CREATE POLICY "Authenticated users can create notifications" ON notifications
    FOR INSERT TO authenticated
    WITH CHECK (true);
