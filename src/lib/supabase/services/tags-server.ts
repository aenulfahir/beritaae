import { createClient } from "../server";

export interface TrendingTag {
  id: string;
  name: string;
  slug: string;
  color: string;
  article_count: number;
  total_views: number;
  trend_score: number;
}

export interface TagArticle {
  article_id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  views_count: number;
  published_at: string;
  category_name: string;
  category_slug: string;
  category_color: string;
  author_name: string;
  author_avatar: string;
}

// Get trending tags (server-side)
export async function getTrendingTagsServer(
  limit: number = 10
): Promise<TrendingTag[]> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc("get_trending_tags", {
    p_limit: limit,
  });

  if (error) {
    console.error("Error fetching trending tags:", error);
    // Fallback: get tags by usage count
    return getFallbackTrendingTags(supabase, limit);
  }

  // If no trending tags from RPC (no recent articles), use fallback
  if (!data || data.length === 0) {
    return getFallbackTrendingTags(supabase, limit);
  }

  return data || [];
}

// Fallback function if RPC not available
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getFallbackTrendingTags(
  supabase: any,
  limit: number
): Promise<TrendingTag[]> {
  const { data, error } = await supabase
    .from("tags")
    .select("id, name, slug, color, usage_count")
    .order("usage_count", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error in fallback trending tags:", error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((tag: any) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    color: tag.color,
    article_count: tag.usage_count,
    total_views: 0,
    trend_score: tag.usage_count,
  }));
}

// Get articles by tag (server-side)
export async function getArticlesByTagServer(
  tagSlug: string,
  limit: number = 20
): Promise<TagArticle[]> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc("get_articles_by_tag", {
    p_tag_slug: tagSlug,
    p_limit: limit,
  });

  if (error) {
    console.error("Error fetching articles by tag:", error);
    return [];
  }

  return data || [];
}

// Get tag by slug (server-side)
export async function getTagBySlugServer(slug: string): Promise<{
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  usage_count: number;
} | null> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("tags")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching tag:", error);
    return null;
  }
  return data;
}

// Get trending articles for trending page (server-side)
export async function getTrendingArticlesServer(limit: number = 20) {
  const supabase = await createClient();

  // Get articles sorted by views in last 7 days
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("articles")
    .select(
      `
      *,
      category:categories (*),
      author:profiles!articles_author_id_fkey (*)
    `
    )
    .eq("status", "published")
    .order("views_count", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching trending articles:", error);
    return [];
  }

  // Ensure all articles have valid dates
  const now = new Date().toISOString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((article: any) => ({
    ...article,
    published_at: article.published_at || article.created_at || now,
    created_at: article.created_at || article.published_at || now,
  }));
}
