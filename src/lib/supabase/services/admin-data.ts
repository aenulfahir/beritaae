import { createClient } from "../server";
import {
  getAdminUsers,
  getStaffUsers,
  getMemberUsers,
  getUsersStats,
  getUsersWithArticleCounts,
  type UserProfile,
  type UsersStats,
} from "./users";

// Server-side data fetching for admin pages
// Uses server client for better performance

export async function getAdminDashboardData() {
  const supabase = await createClient();

  try {
    const [
      { data: articles },
      { data: categories },
      { data: comments },
      { data: profiles },
    ] = await Promise.all([
      supabase
        .from("articles")
        .select(
          "id, title, slug, image_url, views_count, status, is_breaking, is_featured, created_at, published_at, category_id, categories(*)"
        )
        .order("created_at", { ascending: false })
        .limit(100),
      supabase.from("categories").select("*").order("name"),
      supabase
        .from("comments")
        .select("id, is_approved, created_at")
        .limit(1000),
      supabase.from("profiles").select("id").limit(1000),
    ]);

    const totalArticles = articles?.length || 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const publishedArticles =
      articles?.filter((a: any) => a.status === "published").length || 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalViews =
      articles?.reduce(
        (acc: number, a: any) => acc + (a.views_count || 0),
        0
      ) || 0;
    const totalComments = comments?.length || 0;
    const totalUsers = profiles?.length || 0;

    // Recent articles
    const recentArticles = (articles || []).slice(0, 5).map((a: any) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      image_url: a.image_url || "/placeholder-image.jpg",
      views_count: a.views_count || 0,
      is_breaking: a.is_breaking,
      created_at: a.created_at,
      category: a.categories || {
        id: "",
        name: "Uncategorized",
        slug: "uncategorized",
        color: "#6B7280",
      },
    }));

    // Popular articles (by views)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const popularArticles = [...(articles || [])]
      .sort((a: any, b: any) => (b.views_count || 0) - (a.views_count || 0))
      .slice(0, 5)
      .map((a: any) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        image_url: a.image_url || "/placeholder-image.jpg",
        views_count: a.views_count || 0,
      }));

    // Category distribution
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categoryDistribution = (categories || []).map((cat: any) => ({
      name: cat.name,
      color: cat.color,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: articles?.filter((a: any) => a.category_id === cat.id).length || 0,
    }));

    return {
      stats: {
        totalArticles,
        publishedArticles,
        totalViews,
        totalComments,
        totalUsers,
        articlesChange: 12,
        viewsChange: 8,
        commentsChange: -3,
        usersChange: 5,
      },
      recentArticles,
      popularArticles,
      categoryDistribution,
      categories: categories || [],
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      stats: {
        totalArticles: 0,
        publishedArticles: 0,
        totalViews: 0,
        totalComments: 0,
        totalUsers: 0,
        articlesChange: 0,
        viewsChange: 0,
        commentsChange: 0,
        usersChange: 0,
      },
      recentArticles: [],
      popularArticles: [],
      categoryDistribution: [],
      categories: [],
    };
  }
}

export async function getAdminArticlesData() {
  const supabase = await createClient();

  try {
    const [{ data: articles }, { data: categories }] = await Promise.all([
      supabase
        .from("articles")
        .select(
          `
          *,
          categories (*),
          profiles:author_id (id, full_name, avatar_url, email, role)
        `
        )
        .order("created_at", { ascending: false })
        .limit(100),
      supabase.from("categories").select("*").order("name"),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedArticles = (articles || []).map((article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || "",
      content: article.content || "",
      image_url: article.image_url || "/placeholder-image.jpg",
      category: article.categories
        ? {
            id: article.categories.id,
            name: article.categories.name,
            slug: article.categories.slug,
            color: article.categories.color,
          }
        : {
            id: "",
            name: "Uncategorized",
            slug: "uncategorized",
            color: "#6B7280",
          },
      category_id: article.category_id,
      author: article.profiles
        ? {
            id: article.profiles.id,
            name: article.profiles.full_name || "Anonymous",
            avatar: article.profiles.avatar_url || "",
            email: article.profiles.email,
            role: article.profiles.role,
          }
        : { id: "", name: "Anonymous", avatar: "", email: "", role: "member" },
      author_id: article.author_id,
      status: article.status,
      is_breaking: article.is_breaking || false,
      is_featured: article.is_featured || false,
      views_count: article.views_count || 0,
      read_time: article.read_time || "5 menit",
      published_at: article.published_at,
      created_at: article.created_at,
      updated_at: article.updated_at,
    }));

    return {
      articles: transformedArticles,
      categories: categories || [],
    };
  } catch (error) {
    console.error("Error fetching articles data:", error);
    return { articles: [], categories: [] };
  }
}

export async function getAdminCategoriesData() {
  const supabase = await createClient();

  try {
    const [{ data: categories }, { data: articles }] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase
        .from("articles")
        .select("id, category_id, views_count")
        .eq("status", "published"),
    ]);

    const categoriesWithStats = (categories || []).map((cat: any) => {
      const catArticles = (articles || []).filter(
        (a: any) => a.category_id === cat.id
      );
      return {
        ...cat,
        articleCount: catArticles.length,
        totalViews: catArticles.reduce(
          (acc: number, a: any) => acc + (a.views_count || 0),
          0
        ),
      };
    });

    return {
      categories: categoriesWithStats,
      totalArticles: articles?.length || 0,
    };
  } catch (error) {
    console.error("Error fetching categories data:", error);
    return { categories: [], totalArticles: 0 };
  }
}

export async function getAdminCommentsData() {
  const supabase = await createClient();

  try {
    const { data: comments, error } = await supabase
      .from("comments")
      .select(
        `
        id,
        content,
        likes_count,
        is_approved,
        created_at,
        profiles:user_id (id, full_name, avatar_url, email),
        articles:article_id (id, title, slug, image_url)
      `
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Error fetching comments:", error);
      return { comments: [] };
    }

    return { comments: comments || [] };
  } catch (error) {
    console.error("Error fetching comments data:", error);
    return { comments: [] };
  }
}

export async function getAdminBreakingData() {
  const supabase = await createClient();

  try {
    const [{ data: breakingNews }, { data: availableArticles }] =
      await Promise.all([
        supabase
          .from("articles")
          .select(
            `
          *,
          categories (*),
          profiles:author_id (id, full_name, avatar_url, email, role)
        `
          )
          .eq("is_breaking", true)
          .eq("status", "published")
          .order("published_at", { ascending: false }),
        supabase
          .from("articles")
          .select(
            `
          *,
          categories (*),
          profiles:author_id (id, full_name, avatar_url, email, role)
        `
          )
          .eq("status", "published")
          .eq("is_breaking", false)
          .order("published_at", { ascending: false })
          .limit(50),
      ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformArticle = (article: any, index?: number) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || "",
      content: article.content || "",
      image_url: article.image_url || "/placeholder-image.jpg",
      category: article.categories
        ? {
            id: article.categories.id,
            name: article.categories.name,
            slug: article.categories.slug,
            color: article.categories.color,
          }
        : {
            id: "",
            name: "Uncategorized",
            slug: "uncategorized",
            color: "#6B7280",
          },
      category_id: article.category_id,
      author: article.profiles
        ? {
            id: article.profiles.id,
            name: article.profiles.full_name || "Anonymous",
            avatar: article.profiles.avatar_url || "",
            email: article.profiles.email,
            role: article.profiles.role,
          }
        : { id: "", name: "Anonymous", avatar: "", email: "", role: "member" },
      author_id: article.author_id,
      status: article.status,
      is_breaking: article.is_breaking,
      is_featured: article.is_featured,
      views_count: article.views_count || 0,
      read_time: article.read_time || "5 menit",
      published_at: article.published_at,
      created_at: article.created_at,
      updated_at: article.updated_at,
      priority: index !== undefined ? index + 1 : 0,
    });

    return {
      breakingNews: (breakingNews || []).map((a, i) => transformArticle(a, i)),
      availableArticles: (availableArticles || []).map((a) =>
        transformArticle(a)
      ),
    };
  } catch (error) {
    console.error("Error fetching breaking data:", error);
    return { breakingNews: [], availableArticles: [] };
  }
}

export async function getAdminTrendingData(period: string = "week") {
  const supabase = await createClient();

  try {
    // Calculate date range
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case "day":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const [{ data: articles }, { data: categories }, { data: comments }] =
      await Promise.all([
        supabase
          .from("articles")
          .select(
            `
          *,
          categories (*),
          profiles:author_id (id, full_name, avatar_url, email, role)
        `
          )
          .eq("status", "published")
          .gte("published_at", startDate.toISOString())
          .order("views_count", { ascending: false })
          .limit(50),
        supabase.from("categories").select("*").order("name"),
        supabase.from("comments").select("article_id"),
      ]);

    // Count comments per article
    const commentCounts: Record<string, number> = {};
    (comments || []).forEach((c: any) => {
      commentCounts[c.article_id] = (commentCounts[c.article_id] || 0) + 1;
    });

    // Find max values
    const maxViews = Math.max(
      ...(articles || []).map((a: any) => a.views_count || 0),
      1
    );
    const maxComments = Math.max(...Object.values(commentCounts), 1);

    // Calculate trending scores
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const trendingArticles = (articles || []).map((article: any) => {
      const commentsCount = commentCounts[article.id] || 0;

      // Views score (0-40)
      const viewsScore =
        maxViews > 0 ? ((article.views_count || 0) / maxViews) * 40 : 0;

      // Comments score (0-30)
      const commentsScore =
        maxComments > 0 ? (commentsCount / maxComments) * 30 : 0;

      // Recency score (0-30)
      let recencyScore = 0;
      if (article.published_at) {
        const hoursAgo =
          (Date.now() - new Date(article.published_at).getTime()) /
          (1000 * 60 * 60);
        if (hoursAgo <= 6) recencyScore = 30;
        else if (hoursAgo <= 24) recencyScore = 25;
        else if (hoursAgo <= 48) recencyScore = 20;
        else if (hoursAgo <= 72) recencyScore = 15;
        else if (hoursAgo <= 168) recencyScore = 10;
        else recencyScore = 5;
      }

      const trendScore = Math.round(viewsScore + commentsScore + recencyScore);

      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        image_url: article.image_url || "/placeholder-image.jpg",
        category: article.categories
          ? {
              id: article.categories.id,
              name: article.categories.name,
              slug: article.categories.slug,
              color: article.categories.color,
            }
          : {
              id: "",
              name: "Uncategorized",
              slug: "uncategorized",
              color: "#6B7280",
            },
        views_count: article.views_count || 0,
        published_at: article.published_at,
        commentsCount,
        trendScore,
        scoreBreakdown: {
          viewsScore: Math.round(viewsScore),
          commentsScore: Math.round(commentsScore),
          recencyScore: Math.round(recencyScore),
        },
        rank: 0,
      };
    });

    // Sort and assign ranks
    trendingArticles.sort((a, b) => b.trendScore - a.trendScore);
    trendingArticles.forEach((article, index) => {
      article.rank = index + 1;
    });

    return {
      trending: trendingArticles,
      categories: categories || [],
    };
  } catch (error) {
    console.error("Error fetching trending data:", error);
    return { trending: [], categories: [] };
  }
}

export async function getAdminPopularData(period: string = "all") {
  const supabase = await createClient();

  try {
    // Calculate date filter
    let dateFilter: string | null = null;
    const now = new Date();

    if (period === "day") {
      dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    } else if (period === "week") {
      dateFilter = new Date(
        now.getTime() - 7 * 24 * 60 * 60 * 1000
      ).toISOString();
    } else if (period === "month") {
      dateFilter = new Date(
        now.getTime() - 30 * 24 * 60 * 60 * 1000
      ).toISOString();
    }

    let query = supabase
      .from("articles")
      .select(
        `
        *,
        categories (*),
        profiles:author_id (id, full_name, avatar_url, email, role)
      `
      )
      .eq("status", "published")
      .order("views_count", { ascending: false })
      .limit(20);

    if (dateFilter) {
      query = query.gte("published_at", dateFilter);
    }

    const [{ data: articles }, { data: categories }] = await Promise.all([
      query,
      supabase.from("categories").select("*").order("name"),
    ]);

    const maxViews = Math.max(
      ...(articles || []).map((a: any) => a.views_count || 0),
      1
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const popularArticles = (articles || []).map(
      (article: any, index: number) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        image_url: article.image_url || "/placeholder-image.jpg",
        category: article.categories
          ? {
              id: article.categories.id,
              name: article.categories.name,
              slug: article.categories.slug,
              color: article.categories.color,
            }
          : {
              id: "",
              name: "Uncategorized",
              slug: "uncategorized",
              color: "#6B7280",
            },
        views_count: article.views_count || 0,
        published_at: article.published_at,
        rank: index + 1,
        viewsPercentage: Math.round(
          ((article.views_count || 0) / maxViews) * 100
        ),
      })
    );

    return {
      popular: popularArticles,
      categories: categories || [],
    };
  } catch (error) {
    console.error("Error fetching popular data:", error);
    return { popular: [], categories: [] };
  }
}

export async function getAdminMediaData() {
  const supabase = await createClient();

  try {
    // List files from media bucket
    const { data: files, error } = await supabase.storage
      .from("media")
      .list("", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error("Error listing media files:", error);
      return { media: [] };
    }

    // Get public URLs and transform data
    const mediaFiles = (files || [])
      .filter((file) => file.name !== ".emptyFolderPlaceholder")
      .map((file) => {
        const { data: urlData } = supabase.storage
          .from("media")
          .getPublicUrl(file.name);

        // Determine file type
        const ext = file.name.split(".").pop()?.toLowerCase() || "";
        let type = "document";
        if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
          type = "image";
        } else if (["mp4", "webm", "mov", "avi"].includes(ext)) {
          type = "video";
        } else if (["mp3", "wav", "ogg"].includes(ext)) {
          type = "audio";
        }

        return {
          id: file.id || file.name,
          name: file.name,
          url: urlData.publicUrl,
          size: file.metadata?.size || 0,
          type,
          bucket: "media",
          path: file.name,
          createdAt: file.created_at || new Date().toISOString(),
        };
      });

    return { media: mediaFiles };
  } catch (error) {
    console.error("Error fetching media data:", error);
    return { media: [] };
  }
}

export async function getAdminAnalyticsData() {
  // Import dashboard functions
  const {
    getAnalyticsMetrics,
    getWeeklyViews,
    getTrafficSources,
    getTopPages,
    getCategoryPerformance,
    getFullHourlyTraffic,
    getRealtimeStats,
    getDeviceDistribution,
  } = await import("./dashboard");

  try {
    const [
      metrics,
      weeklyViews,
      trafficSources,
      topPages,
      categoryPerformance,
      hourlyTraffic,
      realtimeStats,
      deviceData,
    ] = await Promise.all([
      getAnalyticsMetrics().catch(() => null),
      getWeeklyViews().catch(() => []),
      getTrafficSources().catch(() => []),
      getTopPages(5).catch(() => []),
      getCategoryPerformance().catch(() => []),
      getFullHourlyTraffic().catch(() => []),
      getRealtimeStats().catch(() => null),
      getDeviceDistribution().catch(() => []),
    ]);

    return {
      metrics,
      weeklyViews,
      trafficSources,
      topPages,
      categoryPerformance,
      hourlyTraffic,
      realtimeStats,
      deviceData,
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return {
      metrics: null,
      weeklyViews: [],
      trafficSources: [],
      topPages: [],
      categoryPerformance: [],
      hourlyTraffic: [],
      realtimeStats: null,
      deviceData: [],
    };
  }
}

// Admin Users Data (superadmin, admin, moderator)
export async function getAdminUsersData() {
  try {
    const [users, stats] = await Promise.all([
      getAdminUsers(),
      getUsersStats(),
    ]);

    return {
      users,
      stats: {
        total: users.length,
        active: users.filter((u) => u.status === "active" || !u.status).length,
        inactive: users.filter((u) => u.status === "inactive").length,
        superadmin: users.filter((u) => u.role === "superadmin").length,
        admin: users.filter((u) => u.role === "admin").length,
        moderator: users.filter((u) => u.role === "moderator").length,
      },
    };
  } catch (error) {
    console.error("Error fetching admin users data:", error);
    return {
      users: [],
      stats: {
        total: 0,
        active: 0,
        inactive: 0,
        superadmin: 0,
        admin: 0,
        moderator: 0,
      },
    };
  }
}

// Authors/Staff Data (editor, author)
export async function getAuthorsData() {
  try {
    const users = await getUsersWithArticleCounts(["editor", "author"]);

    return {
      users,
      stats: {
        total: users.length,
        active: users.filter((u) => u.status === "active" || !u.status).length,
        inactive: users.filter((u) => u.status === "inactive").length,
        editors: users.filter((u) => u.role === "editor").length,
        authors: users.filter((u) => u.role === "author").length,
        totalArticles: users.reduce(
          (acc, u) => acc + (u.articles_count || 0),
          0
        ),
        totalViews: users.reduce((acc, u) => acc + (u.total_views || 0), 0),
      },
    };
  } catch (error) {
    console.error("Error fetching authors data:", error);
    return {
      users: [],
      stats: {
        total: 0,
        active: 0,
        inactive: 0,
        editors: 0,
        authors: 0,
        totalArticles: 0,
        totalViews: 0,
      },
    };
  }
}

// Members Data
export async function getMembersData() {
  try {
    const supabase = await createClient();

    // Get members
    const { data: members } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "member")
      .order("created_at", { ascending: false });

    // Get comment counts per user
    const { data: comments } = await supabase
      .from("comments")
      .select("user_id");

    // Get comment likes per user
    const { data: commentLikes } = await supabase
      .from("comment_likes")
      .select("user_id");

    // Calculate stats per user
    const commentsByUser: Record<string, number> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (comments || []).forEach((c: any) => {
      commentsByUser[c.user_id] = (commentsByUser[c.user_id] || 0) + 1;
    });

    const likesByUser: Record<string, number> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (commentLikes || []).forEach((l: any) => {
      likesByUser[l.user_id] = (likesByUser[l.user_id] || 0) + 1;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usersWithStats = (members || []).map((member: any) => ({
      ...member,
      comments_count: commentsByUser[member.id] || 0,
      likes_given: likesByUser[member.id] || 0,
    }));

    return {
      users: usersWithStats,
      stats: {
        total: usersWithStats.length,
        active: usersWithStats.filter(
          (u: any) => u.status === "active" || !u.status
        ).length,
        inactive: usersWithStats.filter((u: any) => u.status === "inactive")
          .length,
        banned: usersWithStats.filter((u: any) => u.status === "banned").length,
        totalComments: Object.values(commentsByUser).reduce((a, b) => a + b, 0),
      },
    };
  } catch (error) {
    console.error("Error fetching members data:", error);
    return {
      users: [],
      stats: {
        total: 0,
        active: 0,
        inactive: 0,
        banned: 0,
        totalComments: 0,
      },
    };
  }
}

// Export types for use in components
export type { UserProfile, UsersStats };

// =====================================================
// Company Data Functions
// =====================================================

export interface CompanyProfile {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  vision?: string;
  mission?: string;
  history?: string;
  founded_year?: number;
  logo_url?: string;
  favicon_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  email_editorial?: string;
  email_complaints?: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
  tiktok_url?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  bio?: string;
  avatar_url?: string;
  email?: string;
  linkedin_url?: string;
  twitter_url?: string;
  display_order: number;
  is_active: boolean;
}

export interface JobListing {
  id: string;
  title: string;
  department?: string;
  location?: string;
  job_type?: string;
  level?: string;
  salary_range?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  is_active: boolean;
  applicants_count: number;
  created_at: string;
  expires_at?: string;
}

export interface CareerSettings {
  id: string;
  page_title: string;
  page_description?: string;
  application_email?: string;
  whatsapp?: string;
}

export interface AdPlacement {
  id: string;
  name: string;
  position: string;
  size?: string;
  price_monthly: number;
  price_weekly: number;
  price_daily?: number;
  description?: string;
  impressions: number;
  clicks: number;
  is_active: boolean;
  display_order: number;
}

export interface AdSettings {
  id: string;
  page_title: string;
  page_description?: string;
  contact_email?: string;
  whatsapp?: string;
}

// Company About Data
export async function getCompanyAboutData() {
  const supabase = await createClient();

  try {
    const { data: profile } = await supabase
      .from("company_profile")
      .select("*")
      .single();

    return {
      profile: profile || null,
    };
  } catch (error) {
    console.error("Error fetching company about data:", error);
    return { profile: null };
  }
}

// Company Team Data
export async function getCompanyTeamData() {
  const supabase = await createClient();

  try {
    const { data: members } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true });

    // Group by department
    const departments = [
      ...new Set(
        (members || []).map((m: TeamMember) => m.department).filter(Boolean)
      ),
    ];

    return {
      members: members || [],
      departments,
      stats: {
        total: (members || []).length,
        active: (members || []).filter((m: TeamMember) => m.is_active).length,
        departmentCount: departments.length,
      },
    };
  } catch (error) {
    console.error("Error fetching company team data:", error);
    return {
      members: [],
      departments: [],
      stats: { total: 0, active: 0, departmentCount: 0 },
    };
  }
}

// Company Careers Data
export async function getCompanyCareersData() {
  const supabase = await createClient();

  try {
    const [{ data: jobs }, { data: settings }] = await Promise.all([
      supabase
        .from("job_listings")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("career_settings").select("*").single(),
    ]);

    return {
      jobs: jobs || [],
      settings: settings || null,
      stats: {
        total: (jobs || []).length,
        active: (jobs || []).filter((j: JobListing) => j.is_active).length,
        totalApplicants: (jobs || []).reduce(
          (acc: number, j: JobListing) => acc + (j.applicants_count || 0),
          0
        ),
      },
    };
  } catch (error) {
    console.error("Error fetching company careers data:", error);
    return {
      jobs: [],
      settings: null,
      stats: { total: 0, active: 0, totalApplicants: 0 },
    };
  }
}

// Company Ads Data
export async function getCompanyAdsData() {
  const supabase = await createClient();

  try {
    const [{ data: placements }, { data: settings }] = await Promise.all([
      supabase
        .from("ad_placements")
        .select("*")
        .order("display_order", { ascending: true }),
      supabase.from("ad_settings").select("*").single(),
    ]);

    const totalImpressions = (placements || []).reduce(
      (acc: number, p: AdPlacement) => acc + (p.impressions || 0),
      0
    );
    const totalClicks = (placements || []).reduce(
      (acc: number, p: AdPlacement) => acc + (p.clicks || 0),
      0
    );

    return {
      placements: placements || [],
      settings: settings || null,
      stats: {
        total: (placements || []).length,
        active: (placements || []).filter((p: AdPlacement) => p.is_active)
          .length,
        totalImpressions,
        totalClicks,
      },
    };
  } catch (error) {
    console.error("Error fetching company ads data:", error);
    return {
      placements: [],
      settings: null,
      stats: { total: 0, active: 0, totalImpressions: 0, totalClicks: 0 },
    };
  }
}

// Public Company Data (for public pages)
export async function getPublicCompanyData(): Promise<{
  profile: CompanyProfile | null;
  team: TeamMember[];
}> {
  const supabase = await createClient();

  try {
    const [{ data: profile }, { data: team }] = await Promise.all([
      supabase.from("company_profile").select("*").single(),
      supabase
        .from("team_members")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true }),
    ]);

    return {
      profile: profile ? (profile as unknown as CompanyProfile) : null,
      team: (team as unknown as TeamMember[]) || [],
    };
  } catch (error) {
    console.error("Error fetching public company data:", error);
    return { profile: null, team: [] };
  }
}

// Public Careers Data
export async function getPublicCareersData(): Promise<{
  jobs: JobListing[];
  settings: CareerSettings | null;
}> {
  const supabase = await createClient();

  try {
    const [{ data: jobs }, { data: settings }] = await Promise.all([
      supabase
        .from("job_listings")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false }),
      supabase.from("career_settings").select("*").single(),
    ]);

    return {
      jobs: (jobs as unknown as JobListing[]) || [],
      settings: settings ? (settings as unknown as CareerSettings) : null,
    };
  } catch (error) {
    console.error("Error fetching public careers data:", error);
    return { jobs: [], settings: null };
  }
}

// Public Ads Data
export async function getPublicAdsData(): Promise<{
  placements: AdPlacement[];
  settings: AdSettings | null;
}> {
  const supabase = await createClient();

  try {
    const [{ data: placements }, { data: settings }] = await Promise.all([
      supabase
        .from("ad_placements")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true }),
      supabase.from("ad_settings").select("*").single(),
    ]);

    return {
      placements: (placements as unknown as AdPlacement[]) || [],
      settings: settings ? (settings as unknown as AdSettings) : null,
    };
  } catch (error) {
    console.error("Error fetching public ads data:", error);
    return { placements: [], settings: null };
  }
}
