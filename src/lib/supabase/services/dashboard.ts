import { createClient } from "../client";

function getSupabase() {
  return createClient();
}

// =====================================================
// TypeScript Interfaces
// =====================================================

export interface DashboardStats {
  totalArticles: number;
  totalViews: number;
  totalComments: number;
  totalUsers: number;
  articlesChange: number;
  viewsChange: number;
  commentsChange: number;
  usersChange: number;
}

export interface DailyViewsData {
  date: string;
  dayName: string;
  views: number;
  articles: number;
}

export interface HourlyTrafficData {
  hour: string;
  value: number;
}

export interface CategoryDistribution {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export interface DeviceDistribution {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export interface PopularArticle {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  views_count: number;
}

export interface RecentArticle {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  category: {
    name: string;
    color: string;
  };
  is_breaking: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  entity_title: string | null;
  user_name: string;
  created_at: string;
}

// =====================================================
// Helper Functions
// =====================================================

const INDONESIAN_DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function getIndonesianDayName(date: Date): string {
  return INDONESIAN_DAYS[date.getDay()];
}

// =====================================================
// Dashboard Stats - OPTIMIZED
// =====================================================

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = getSupabase();
  const defaultStats: DashboardStats = {
    totalArticles: 0,
    totalViews: 0,
    totalComments: 0,
    totalUsers: 0,
    articlesChange: 0,
    viewsChange: 0,
    commentsChange: 0,
    usersChange: 0,
  };

  try {
    // Simple parallel counts
    const [articlesResult, commentsResult, usersResult] = await Promise.all([
      supabase
        .from("articles")
        .select("views_count", { count: "exact" })
        .eq("status", "published"),
      supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("is_approved", true),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
    ]);

    const totalArticles = articlesResult.count || 0;
    const totalViews =
      (articlesResult.data as { views_count: number }[] | null)?.reduce(
        (sum, a) => sum + (a.views_count || 0),
        0
      ) || 0;
    const totalComments = commentsResult.count || 0;
    const totalUsers = usersResult.count || 0;

    return {
      totalArticles,
      totalViews,
      totalComments,
      totalUsers,
      articlesChange: 5,
      viewsChange: 8,
      commentsChange: 12,
      usersChange: 3,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return defaultStats;
  }
}

// =====================================================
// Daily Views Data - SIMPLIFIED (mock data)
// =====================================================

export async function getDailyViews(
  days: number = 7
): Promise<DailyViewsData[]> {
  const result: DailyViewsData[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result.push({
      date: date.toISOString().split("T")[0],
      dayName: getIndonesianDayName(date),
      views: Math.floor(Math.random() * 2000) + 1500,
      articles: Math.floor(Math.random() * 5) + 1,
    });
  }

  return result;
}

// =====================================================
// Hourly Traffic - SIMPLIFIED (mock data)
// =====================================================

export async function getHourlyTraffic(): Promise<HourlyTrafficData[]> {
  return [
    { hour: "00:00", value: 400 },
    { hour: "03:00", value: 300 },
    { hour: "06:00", value: 600 },
    { hour: "09:00", value: 1400 },
    { hour: "12:00", value: 1800 },
    { hour: "15:00", value: 2200 },
    { hour: "18:00", value: 1900 },
    { hour: "21:00", value: 1200 },
  ];
}

// =====================================================
// Category Distribution - OPTIMIZED
// =====================================================

export async function getCategoryDistribution(): Promise<
  CategoryDistribution[]
> {
  const supabase = getSupabase();

  try {
    const [categoriesResult, articlesResult] = await Promise.all([
      supabase.from("categories").select("id, name, color"),
      supabase.from("articles").select("category_id").eq("status", "published"),
    ]);

    const categories = categoriesResult.data;
    const articles = articlesResult.data;

    if (!categories) return [];

    const countByCategory: Record<string, number> = {};
    if (articles) {
      (articles as { category_id: string | null }[]).forEach((a) => {
        if (a.category_id) {
          countByCategory[a.category_id] =
            (countByCategory[a.category_id] || 0) + 1;
        }
      });
    }

    return (categories as { id: string; name: string; color: string }[])
      .map((cat) => ({
        name: cat.name,
        value: countByCategory[cat.id] || 0,
        color: cat.color || "#6366f1",
      }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error("Error fetching category distribution:", error);
    return [];
  }
}

// =====================================================
// Device Distribution - SIMPLIFIED (mock data)
// =====================================================

export async function getDeviceDistribution(): Promise<DeviceDistribution[]> {
  return [
    { name: "Mobile", value: 58, color: "#3b82f6" },
    { name: "Desktop", value: 32, color: "#10b981" },
    { name: "Tablet", value: 10, color: "#f59e0b" },
  ];
}

// =====================================================
// Popular Articles - OPTIMIZED
// =====================================================

export async function getPopularArticles(
  limit: number = 5
): Promise<PopularArticle[]> {
  const supabase = getSupabase();

  try {
    const { data } = await supabase
      .from("articles")
      .select("id, title, slug, image_url, views_count")
      .eq("status", "published")
      .order("views_count", { ascending: false })
      .limit(limit);

    if (!data) return [];

    return (
      data as {
        id: string;
        title: string;
        slug: string;
        image_url: string | null;
        views_count: number | null;
      }[]
    ).map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      image_url: article.image_url || "",
      views_count: article.views_count || 0,
    }));
  } catch (error) {
    console.error("Error fetching popular articles:", error);
    return [];
  }
}

// =====================================================
// Recent Articles - OPTIMIZED
// =====================================================

export async function getRecentArticles(
  limit: number = 5
): Promise<RecentArticle[]> {
  const supabase = getSupabase();

  try {
    const { data } = await supabase
      .from("articles")
      .select(
        `id, title, slug, image_url, is_breaking, created_at, categories (name, color)`
      )
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (!data) return [];

    interface RecentArticleRow {
      id: string;
      title: string;
      slug: string;
      image_url: string | null;
      is_breaking: boolean | null;
      created_at: string;
      categories: { name: string; color: string } | null;
    }

    return (data as RecentArticleRow[]).map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      image_url: article.image_url || "",
      category: article.categories
        ? {
            name: article.categories.name,
            color: article.categories.color || "#6366f1",
          }
        : { name: "Uncategorized", color: "#6366f1" },
      is_breaking: article.is_breaking || false,
      created_at: article.created_at,
    }));
  } catch (error) {
    console.error("Error fetching recent articles:", error);
    return [];
  }
}

// =====================================================
// Recent Admin Activity - SIMPLIFIED (return empty)
// =====================================================

export async function getRecentActivity(): Promise<ActivityLog[]> {
  return [];
}

// =====================================================
// Format Activity Action for Display
// =====================================================

export function formatActivityAction(
  action: string,
  entityType: string
): string {
  const actionMap: Record<string, string> = {
    create: "Membuat",
    update: "Memperbarui",
    delete: "Menghapus",
    publish: "Mempublikasikan",
  };

  const entityMap: Record<string, string> = {
    article: "artikel",
    category: "kategori",
    comment: "komentar",
    user: "pengguna",
  };

  return `${actionMap[action.toLowerCase()] || action} ${
    entityMap[entityType.toLowerCase()] || entityType
  }`;
}

// =====================================================
// Analytics Page Data
// =====================================================

export interface AnalyticsMetrics {
  totalPageviews: number;
  uniqueVisitors: number;
  avgSessionDuration: string;
  bounceRate: number;
  pageviewsChange: number;
  visitorsChange: number;
  durationChange: number;
  bounceRateChange: number;
}

export interface WeeklyViewsData {
  name: string;
  views: number;
  unique: number;
  returning: number;
}

export interface TrafficSource {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export interface TopPage {
  path: string;
  title: string;
  views: number;
  change: number;
}

export interface CategoryPerformance {
  name: string;
  articles: number;
  views: number;
  color: string;
  [key: string]: string | number;
}

export interface RealtimeStats {
  activeVisitors: number;
  pageviewsLastHour: number;
  newVisitors: number;
  avgTimeOnPage: string;
}

export async function getAnalyticsMetrics(): Promise<AnalyticsMetrics> {
  return {
    totalPageviews: 156400,
    uniqueVisitors: 89200,
    avgSessionDuration: "4m 32s",
    bounceRate: 42.3,
    pageviewsChange: 12.5,
    visitorsChange: 8.3,
    durationChange: -2.1,
    bounceRateChange: -5.4,
  };
}

export async function getWeeklyViews(): Promise<WeeklyViewsData[]> {
  return [
    { name: "Sen", views: 12400, unique: 8200, returning: 4200 },
    { name: "Sel", views: 15600, unique: 10400, returning: 5200 },
    { name: "Rab", views: 18200, unique: 12100, returning: 6100 },
    { name: "Kam", views: 14800, unique: 9800, returning: 5000 },
    { name: "Jum", views: 16500, unique: 11000, returning: 5500 },
    { name: "Sab", views: 21000, unique: 14000, returning: 7000 },
    { name: "Min", views: 19500, unique: 13000, returning: 6500 },
  ];
}

export async function getTrafficSources(): Promise<TrafficSource[]> {
  return [
    { name: "Organic Search", value: 45, color: "#3b82f6" },
    { name: "Direct", value: 25, color: "#10b981" },
    { name: "Social Media", value: 18, color: "#8b5cf6" },
    { name: "Referral", value: 8, color: "#f59e0b" },
    { name: "Email", value: 4, color: "#ef4444" },
  ];
}

export async function getTopPages(limit: number = 5): Promise<TopPage[]> {
  const supabase = getSupabase();

  try {
    const { data } = await supabase
      .from("articles")
      .select("id, title, slug, views_count")
      .eq("status", "published")
      .order("views_count", { ascending: false })
      .limit(limit);

    if (!data) return [];

    return (
      data as {
        id: string;
        title: string;
        slug: string;
        views_count: number | null;
      }[]
    ).map((article) => ({
      path: `/news/${article.slug}`,
      title: article.title,
      views: article.views_count || 0,
      change: Math.floor(Math.random() * 20) - 5,
    }));
  } catch (error) {
    console.error("Error fetching top pages:", error);
    return [];
  }
}

export async function getCategoryPerformance(): Promise<CategoryPerformance[]> {
  const supabase = getSupabase();

  try {
    const [categoriesResult, articlesResult] = await Promise.all([
      supabase.from("categories").select("id, name, color"),
      supabase
        .from("articles")
        .select("category_id, views_count")
        .eq("status", "published"),
    ]);

    const categories = categoriesResult.data;
    const articles = articlesResult.data;

    if (!categories) return [];

    const byCategory: Record<string, { articles: number; views: number }> = {};
    if (articles) {
      (
        articles as { category_id: string | null; views_count: number | null }[]
      ).forEach((a) => {
        if (a.category_id) {
          if (!byCategory[a.category_id]) {
            byCategory[a.category_id] = { articles: 0, views: 0 };
          }
          byCategory[a.category_id].articles++;
          byCategory[a.category_id].views += a.views_count || 0;
        }
      });
    }

    return (categories as { id: string; name: string; color: string }[])
      .map((cat) => ({
        name: cat.name,
        articles: byCategory[cat.id]?.articles || 0,
        views: byCategory[cat.id]?.views || 0,
        color: cat.color || "#6366f1",
      }))
      .sort((a, b) => b.views - a.views);
  } catch (error) {
    console.error("Error fetching category performance:", error);
    return [];
  }
}

export async function getRealtimeStats(): Promise<RealtimeStats> {
  return {
    activeVisitors: Math.floor(Math.random() * 100) + 50,
    pageviewsLastHour: Math.floor(Math.random() * 500) + 200,
    newVisitors: Math.floor(Math.random() * 30) + 10,
    avgTimeOnPage: "2m 45s",
  };
}

// =====================================================
// Full Hourly Traffic (24 hours)
// =====================================================

export async function getFullHourlyTraffic(): Promise<HourlyTrafficData[]> {
  return [
    { hour: "00:00", value: 400 },
    { hour: "01:00", value: 350 },
    { hour: "02:00", value: 300 },
    { hour: "03:00", value: 280 },
    { hour: "04:00", value: 320 },
    { hour: "05:00", value: 450 },
    { hour: "06:00", value: 600 },
    { hour: "07:00", value: 900 },
    { hour: "08:00", value: 1200 },
    { hour: "09:00", value: 1400 },
    { hour: "10:00", value: 1600 },
    { hour: "11:00", value: 1700 },
    { hour: "12:00", value: 1800 },
    { hour: "13:00", value: 1750 },
    { hour: "14:00", value: 1900 },
    { hour: "15:00", value: 2200 },
    { hour: "16:00", value: 2100 },
    { hour: "17:00", value: 2000 },
    { hour: "18:00", value: 1900 },
    { hour: "19:00", value: 1700 },
    { hour: "20:00", value: 1500 },
    { hour: "21:00", value: 1200 },
    { hour: "22:00", value: 800 },
    { hour: "23:00", value: 500 },
  ];
}
