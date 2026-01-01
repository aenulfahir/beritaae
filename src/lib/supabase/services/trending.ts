import { createClient } from "../client";
import { NewsArticle } from "@/types";

function getSupabase() {
  return createClient();
}

// =====================================================
// Trending Articles
// =====================================================

export interface TrendingArticle {
  id: string;
  article_id: string;
  rank: number;
  trend_score: number;
  is_active: boolean;
  is_manual: boolean;
  period: "daily" | "weekly" | "monthly";
  created_at: string;
  expires_at?: string;
  article?: NewsArticle;
}

export async function getTrendingArticlesList(
  period: "daily" | "weekly" | "monthly" = "daily",
  limit: number = 10
): Promise<TrendingArticle[]> {
  const supabase = getSupabase();
  const { data, error } = await (supabase.from("trending_articles") as any)
    .select(
      `
      *,
      article:articles (
        *,
        category:categories (*),
        author:profiles (*)
      )
    `
    )
    .eq("period", period)
    .eq("is_active", true)
    .order("rank", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching trending articles:", error);
    return [];
  }
  return data || [];
}

export async function addToTrending(
  articleId: string,
  period: "daily" | "weekly" | "monthly" = "daily",
  isManual: boolean = true
): Promise<boolean> {
  const supabase = getSupabase();
  // Get current max rank
  const { data: existing } = await (supabase.from("trending_articles") as any)
    .select("rank")
    .eq("period", period)
    .order("rank", { ascending: false })
    .limit(1);

  const nextRank =
    existing && existing.length > 0 ? (existing[0] as any).rank + 1 : 1;

  const { error } = await (supabase.from("trending_articles") as any).upsert({
    article_id: articleId,
    period,
    rank: nextRank,
    is_manual: isManual,
    is_active: true,
  });

  if (error) {
    console.error("Error adding to trending:", error);
    return false;
  }
  return true;
}

export async function removeFromTrending(
  articleId: string,
  period: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("trending_articles") as any)
    .delete()
    .eq("article_id", articleId)
    .eq("period", period);

  if (error) {
    console.error("Error removing from trending:", error);
    return false;
  }
  return true;
}

export async function updateTrendingRank(
  id: string,
  rank: number
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("trending_articles") as any)
    .update({ rank })
    .eq("id", id);

  if (error) {
    console.error("Error updating trending rank:", error);
    return false;
  }
  return true;
}

export async function toggleTrendingActive(
  id: string,
  isActive: boolean
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("trending_articles") as any)
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    console.error("Error toggling trending active:", error);
    return false;
  }
  return true;
}

// =====================================================
// Breaking News
// =====================================================

export interface BreakingNews {
  id: string;
  article_id: string;
  priority: number;
  is_active: boolean;
  created_at: string;
  expires_at?: string;
  article?: NewsArticle;
}

export async function getBreakingNewsList(
  limit: number = 5
): Promise<BreakingNews[]> {
  const supabase = getSupabase();
  const { data, error } = await (supabase.from("breaking_news") as any)
    .select(
      `
      *,
      article:articles (
        *,
        category:categories (*),
        author:profiles (*)
      )
    `
    )
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("priority", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching breaking news:", error);
    return [];
  }
  return data || [];
}

export async function addToBreakingNews(
  articleId: string,
  expiresAt?: string
): Promise<boolean> {
  const supabase = getSupabase();
  // Get current max priority
  const { data: existing } = await (supabase.from("breaking_news") as any)
    .select("priority")
    .order("priority", { ascending: false })
    .limit(1);

  const nextPriority =
    existing && existing.length > 0 ? (existing[0] as any).priority + 1 : 1;

  const { error } = await (supabase.from("breaking_news") as any).upsert({
    article_id: articleId,
    priority: nextPriority,
    is_active: true,
    expires_at: expiresAt,
  });

  if (error) {
    console.error("Error adding to breaking news:", error);
    return false;
  }
  return true;
}

export async function removeFromBreakingNews(
  articleId: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("breaking_news") as any)
    .delete()
    .eq("article_id", articleId);

  if (error) {
    console.error("Error removing from breaking news:", error);
    return false;
  }
  return true;
}

export async function toggleBreakingNewsActive(
  id: string,
  isActive: boolean
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("breaking_news") as any)
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    console.error("Error toggling breaking news active:", error);
    return false;
  }
  return true;
}

// =====================================================
// Popular Articles
// =====================================================

export interface PopularArticle {
  id: string;
  article_id: string;
  rank: number;
  views_count: number;
  is_active: boolean;
  is_manual: boolean;
  period: "daily" | "weekly" | "monthly";
  article?: NewsArticle;
}

export async function getPopularArticles(
  period: "daily" | "weekly" | "monthly" = "weekly",
  limit: number = 10
): Promise<PopularArticle[]> {
  const supabase = getSupabase();
  const { data, error } = await (supabase.from("popular_articles") as any)
    .select(
      `
      *,
      article:articles (
        *,
        category:categories (*),
        author:profiles (*)
      )
    `
    )
    .eq("period", period)
    .eq("is_active", true)
    .order("rank", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching popular articles:", error);
    return [];
  }
  return data || [];
}

export async function addToPopular(
  articleId: string,
  period: "daily" | "weekly" | "monthly" = "weekly"
): Promise<boolean> {
  const supabase = getSupabase();
  const { data: existing } = await (supabase.from("popular_articles") as any)
    .select("rank")
    .eq("period", period)
    .order("rank", { ascending: false })
    .limit(1);

  const nextRank =
    existing && existing.length > 0 ? (existing[0] as any).rank + 1 : 1;

  const { error } = await (supabase.from("popular_articles") as any).upsert({
    article_id: articleId,
    period,
    rank: nextRank,
    is_manual: true,
    is_active: true,
  });

  if (error) {
    console.error("Error adding to popular:", error);
    return false;
  }
  return true;
}

export async function togglePopularActive(
  id: string,
  isActive: boolean
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("popular_articles") as any)
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    console.error("Error toggling popular active:", error);
    return false;
  }
  return true;
}
