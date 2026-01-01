-- =====================================================
-- RLS Policies for Admin Tables
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE trending_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE breaking_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE popular_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Public Read Policies (for frontend display)
-- =====================================================

-- Site Settings - Public can read
CREATE POLICY "Site settings are viewable by everyone" ON site_settings
    FOR SELECT USING (true);

-- Trending Articles - Public can read active ones
CREATE POLICY "Active trending articles are viewable by everyone" ON trending_articles
    FOR SELECT USING (is_active = true);

-- Breaking News - Public can read active ones
CREATE POLICY "Active breaking news are viewable by everyone" ON breaking_news
    FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Popular Articles - Public can read active ones
CREATE POLICY "Active popular articles are viewable by everyone" ON popular_articles
    FOR SELECT USING (is_active = true);

-- Contact Settings - Public can read
CREATE POLICY "Contact settings are viewable by everyone" ON contact_settings
    FOR SELECT USING (true);

-- Social Links - Public can read active ones
CREATE POLICY "Active social links are viewable by everyone" ON social_links
    FOR SELECT USING (is_active = true);

-- Legal Documents - Public can read published ones
CREATE POLICY "Published legal documents are viewable by everyone" ON legal_documents
    FOR SELECT USING (is_published = true);

-- Company Profile - Public can read
CREATE POLICY "Company profile is viewable by everyone" ON company_profile
    FOR SELECT USING (true);

-- Team Members - Public can read active ones
CREATE POLICY "Active team members are viewable by everyone" ON team_members
    FOR SELECT USING (is_active = true);

-- Job Listings - Public can read active ones
CREATE POLICY "Active job listings are viewable by everyone" ON job_listings
    FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Ad Placements - Public can read active ones
CREATE POLICY "Active ad placements are viewable by everyone" ON ad_placements
    FOR SELECT USING (is_active = true);

-- Advertisements - Public can read active ones within date range
CREATE POLICY "Active advertisements are viewable by everyone" ON advertisements
    FOR SELECT USING (is_active = true AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE);

-- Careers Settings - Public can read
CREATE POLICY "Careers settings are viewable by everyone" ON careers_settings
    FOR SELECT USING (true);

-- Ads Settings - Public can read
CREATE POLICY "Ads settings are viewable by everyone" ON ads_settings
    FOR SELECT USING (true);

-- =====================================================
-- Admin Write Policies
-- =====================================================

-- Site Settings - Admin can manage
CREATE POLICY "Admins can manage site settings" ON site_settings
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Trending Articles - Admin can manage
CREATE POLICY "Admins can manage trending articles" ON trending_articles
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Breaking News - Admin can manage
CREATE POLICY "Admins can manage breaking news" ON breaking_news
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Popular Articles - Admin can manage
CREATE POLICY "Admins can manage popular articles" ON popular_articles
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Contact Settings - Admin can manage
CREATE POLICY "Admins can manage contact settings" ON contact_settings
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Social Links - Admin can manage
CREATE POLICY "Admins can manage social links" ON social_links
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Legal Documents - Admin can manage
CREATE POLICY "Admins can manage legal documents" ON legal_documents
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Company Profile - Admin can manage
CREATE POLICY "Admins can manage company profile" ON company_profile
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Team Members - Admin can manage
CREATE POLICY "Admins can manage team members" ON team_members
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Job Listings - Admin can manage
CREATE POLICY "Admins can manage job listings" ON job_listings
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Job Applications - Admin can manage
CREATE POLICY "Admins can manage job applications" ON job_applications
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Ad Placements - Admin can manage
CREATE POLICY "Admins can manage ad placements" ON ad_placements
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Advertisements - Admin can manage
CREATE POLICY "Admins can manage advertisements" ON advertisements
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Careers Settings - Admin can manage
CREATE POLICY "Admins can manage careers settings" ON careers_settings
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Ads Settings - Admin can manage
CREATE POLICY "Admins can manage ads settings" ON ads_settings
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- =====================================================
-- Analytics Policies
-- =====================================================

-- Page Views - Anyone can insert (for tracking), Admin can read
CREATE POLICY "Anyone can insert page views" ON page_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view page views" ON page_views
    FOR SELECT USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Analytics Daily - Admin can manage
CREATE POLICY "Admins can manage daily analytics" ON analytics_daily
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Article Analytics - Admin can manage
CREATE POLICY "Admins can manage article analytics" ON article_analytics
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Traffic Sources - Admin can manage
CREATE POLICY "Admins can manage traffic sources" ON traffic_sources
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Realtime Visitors - Anyone can insert, Admin can read
CREATE POLICY "Anyone can insert realtime visitors" ON realtime_visitors
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view realtime visitors" ON realtime_visitors
    FOR SELECT USING (get_user_role(auth.uid()) = 'admin');

-- =====================================================
-- User-specific Policies
-- =====================================================

-- Notifications - Users can read their own
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- Admin Activity Log - Admin can read
CREATE POLICY "Admins can view activity log" ON admin_activity_log
    FOR SELECT USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "System can insert activity log" ON admin_activity_log
    FOR INSERT WITH CHECK (true);

-- Newsletter Subscribers - Admin can manage
CREATE POLICY "Admins can manage newsletter subscribers" ON newsletter_subscribers
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Email Campaigns - Admin can manage
CREATE POLICY "Admins can manage email campaigns" ON email_campaigns
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Saved Articles - Users can manage their own
CREATE POLICY "Users can manage their saved articles" ON saved_articles
    FOR ALL USING (auth.uid() = user_id);

-- Reading History - Users can manage their own
CREATE POLICY "Users can manage their reading history" ON reading_history
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- Job Applications - Public can insert
-- =====================================================
CREATE POLICY "Anyone can submit job applications" ON job_applications
    FOR INSERT WITH CHECK (true);
