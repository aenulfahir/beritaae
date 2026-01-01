import { createClient } from "../client";

function getSupabase() {
  return createClient();
}

// =====================================================
// Page Views Tracking
// =====================================================

export interface PageView {
  article_id?: string;
  page_path: string;
  session_id?: string;
  device_type?: string;
  referrer?: string;
}

export async function trackPageView(pageView: PageView): Promise<void> {
  try {
    const supabase = getSupabase();
    await (supabase.from("page_views") as any).insert(pageView);
  } catch (error) {
    // Silently fail - analytics shouldn't break the app
    console.error("Error tracking page view:", error);
  }
}

export async function incrementArticleViews(articleId: string): Promise<void> {
  try {
    const supabase = getSupabase();
    await (supabase.rpc as any)("increment_article_views", {
      p_article_id: articleId,
    });
  } catch (error) {
    console.error("Error incrementing article views:", error);
  }
}

// =====================================================
// Analytics Data
// =====================================================

export interface DailyAnalytics {
  id: string;
  date: string;
  total_views: number;
  unique_visitors: number;
  returning_visitors: number;
  new_users: number;
  total_sessions: number;
  avg_session_duration: number;
  bounce_rate: number;
  mobile_views: number;
  desktop_views: number;
  tablet_views: number;
}

export async function getDailyAnalytics(
  startDate: string,
  endDate: string
): Promise<DailyAnalytics[]> {
  const supabase = getSupabase();
  const { data, error } = await (supabase.from("analytics_daily") as any)
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching daily analytics:", error);
    return [];
  }
  return data || [];
}

export interface ArticleAnalytics {
  id: string;
  article_id: string;
  date: string;
  views: number;
  unique_views: number;
  avg_time_on_page: number;
  scroll_depth: number;
  shares: number;
  comments: number;
}

export async function getArticleAnalytics(
  articleId: string,
  startDate?: string,
  endDate?: string
): Promise<ArticleAnalytics[]> {
  const supabase = getSupabase();
  let query = (supabase.from("article_analytics") as any)
    .select("*")
    .eq("article_id", articleId)
    .order("date", { ascending: false });

  if (startDate) {
    query = query.gte("date", startDate);
  }
  if (endDate) {
    query = query.lte("date", endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching article analytics:", error);
    return [];
  }
  return data || [];
}

export interface TrafficSource {
  source: string;
  medium?: string;
  visits: number;
}

export async function getTrafficSources(
  startDate: string,
  endDate: string
): Promise<TrafficSource[]> {
  const supabase = getSupabase();
  const { data, error } = await (supabase.from("traffic_sources") as any)
    .select("source, medium, visits")
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) {
    console.error("Error fetching traffic sources:", error);
    return [];
  }

  // Aggregate by source
  const aggregated: Record<string, TrafficSource> = {};
  (data || []).forEach((item: any) => {
    const key = item.source;
    if (!aggregated[key]) {
      aggregated[key] = { source: item.source, medium: item.medium, visits: 0 };
    }
    aggregated[key].visits += item.visits;
  });

  return Object.values(aggregated).sort((a, b) => b.visits - a.visits);
}

// =====================================================
// Real-time Visitors
// =====================================================

export interface RealtimeVisitor {
  id: string;
  session_id: string;
  page_path?: string;
  article_id?: string;
  device_type?: string;
  country?: string;
  last_activity: string;
}

export async function getRealtimeVisitors(): Promise<RealtimeVisitor[]> {
  const supabase = getSupabase();
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const { data, error } = await (supabase.from("realtime_visitors") as any)
    .select("*")
    .gte("last_activity", fiveMinutesAgo);

  if (error) {
    console.error("Error fetching realtime visitors:", error);
    return [];
  }
  return data || [];
}

export async function updateRealtimeVisitor(
  sessionId: string,
  pagePath: string,
  articleId?: string
): Promise<void> {
  try {
    const supabase = getSupabase();
    await (supabase.from("realtime_visitors") as any).upsert({
      session_id: sessionId,
      page_path: pagePath,
      article_id: articleId,
      last_activity: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating realtime visitor:", error);
  }
}

// =====================================================
// Notifications
// =====================================================

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message?: string;
  link?: string;
  is_read: boolean;
  metadata?: Record<string, any>;
  created_at: string;
}

export async function getUserNotifications(
  userId: string,
  limit: number = 20
): Promise<Notification[]> {
  const supabase = getSupabase();
  const { data, error } = await (supabase.from("notifications") as any)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
  return data || [];
}

export async function getUnreadNotificationsCount(
  userId: string
): Promise<number> {
  const supabase = getSupabase();
  const { count, error } = await (supabase.from("notifications") as any)
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) return 0;
  return count || 0;
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("notifications") as any)
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
  return true;
}

export async function markAllNotificationsAsRead(
  userId: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("notifications") as any)
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
  return true;
}

// =====================================================
// Admin Activity Log
// =====================================================

export interface AdminActivity {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  entity_title?: string;
  details?: Record<string, any>;
  created_at: string;
}

export async function logAdminActivity(
  userId: string,
  action: string,
  entityType: string,
  entityId?: string,
  entityTitle?: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    const supabase = getSupabase();
    await (supabase.from("admin_activity_log") as any).insert({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      entity_title: entityTitle,
      details,
    });
  } catch (error) {
    console.error("Error logging admin activity:", error);
  }
}

export async function getAdminActivityLog(
  limit: number = 50
): Promise<AdminActivity[]> {
  const supabase = getSupabase();
  const { data, error } = await (supabase.from("admin_activity_log") as any)
    .select(
      `
      *,
      user:profiles (full_name, avatar_url)
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching admin activity log:", error);
    return [];
  }
  return data || [];
}

// =====================================================
// Saved Articles (Bookmarks)
// =====================================================

export async function saveArticle(
  userId: string,
  articleId: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("saved_articles") as any).insert({
    user_id: userId,
    article_id: articleId,
  });

  if (error) {
    console.error("Error saving article:", error);
    return false;
  }
  return true;
}

export async function unsaveArticle(
  userId: string,
  articleId: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("saved_articles") as any)
    .delete()
    .eq("user_id", userId)
    .eq("article_id", articleId);

  if (error) {
    console.error("Error unsaving article:", error);
    return false;
  }
  return true;
}

export async function isArticleSaved(
  userId: string,
  articleId: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { data, error } = await (supabase.from("saved_articles") as any)
    .select("id")
    .eq("user_id", userId)
    .eq("article_id", articleId)
    .single();

  if (error) return false;
  return !!data;
}

export async function getSavedArticles(userId: string): Promise<string[]> {
  const supabase = getSupabase();
  const { data, error } = await (supabase.from("saved_articles") as any)
    .select("article_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching saved articles:", error);
    return [];
  }
  return (data || []).map((item: any) => item.article_id);
}

// =====================================================
// Newsletter
// =====================================================

export async function subscribeToNewsletter(
  email: string,
  name?: string,
  source?: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (
    supabase.from("newsletter_subscribers") as any
  ).insert({ email, name, source });

  if (error) {
    // Check if already subscribed
    if (error.code === "23505") {
      return true; // Already subscribed
    }
    console.error("Error subscribing to newsletter:", error);
    return false;
  }
  return true;
}

export async function unsubscribeFromNewsletter(
  email: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("newsletter_subscribers") as any)
    .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
    .eq("email", email);

  if (error) {
    console.error("Error unsubscribing from newsletter:", error);
    return false;
  }
  return true;
}
