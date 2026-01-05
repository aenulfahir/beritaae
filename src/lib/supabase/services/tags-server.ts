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

  // Use direct query instead of RPC to avoid function not found errors
  return getFallbackTrendingTags(supabase, limit);
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

  // Use direct query instead of RPC to avoid function not found errors
  return getArticlesByTagFallback(supabase, tagSlug, limit);
}

// Fallback function for getting articles by tag
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getArticlesByTagFallback(
  supabase: any,
  tagSlug: string,
  limit: number
): Promise<TagArticle[]> {
  try {
    // First get the tag ID
    const { data: tagData, error: tagError } = await supabase
      .from("tags")
      .select("id")
      .eq("slug", tagSlug)
      .single();

    if (tagError || !tagData) {
      console.error("Error finding tag:", tagError);
      return [];
    }

    // Get article IDs for this tag
    const { data: articleTagsData, error: articleTagsError } = await supabase
      .from("article_tags")
      .select("article_id")
      .eq("tag_id", tagData.id);

    if (articleTagsError || !articleTagsData || articleTagsData.length === 0) {
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const articleIds = articleTagsData.map((at: any) => at.article_id);

    // Get articles with their relations
    const { data: articlesData, error: articlesError } = await supabase
      .from("articles")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        image_url,
        views_count,
        published_at,
        category:categories (name, slug, color),
        author:profiles!articles_author_id_fkey (full_name, avatar_url)
      `
      )
      .in("id", articleIds)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);

    if (articlesError) {
      console.error("Error fetching articles:", articlesError);
      return [];
    }

    // Transform to TagArticle format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (articlesData || []).map((article: any) => ({
      article_id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || "",
      image_url: article.image_url || "/placeholder.jpg",
      views_count: article.views_count || 0,
      published_at: article.published_at || new Date().toISOString(),
      category_name: article.category?.name || "Umum",
      category_slug: article.category?.slug || "umum",
      category_color: article.category?.color || "#6366f1",
      author_name: article.author?.full_name || "Anonymous",
      author_avatar: article.author?.avatar_url || "",
    }));
  } catch (err) {
    console.error("Error in fallback articles by tag:", err);
    return [];
  }
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
