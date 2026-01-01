import { createClient } from "../client";

function getSupabase() {
  return createClient();
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  usage_count: number;
  is_trending: boolean;
  created_at: string;
}

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

// Get all tags
export async function getAllTags(): Promise<Tag[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("usage_count", { ascending: false });

  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
  return data || [];
}

// Get trending tags using RPC function
export async function getTrendingTags(
  limit: number = 10
): Promise<TrendingTag[]> {
  const supabase = getSupabase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc("get_trending_tags", {
    p_limit: limit,
  });

  if (error) {
    console.error("Error fetching trending tags:", error);
    // Fallback: get tags by usage count
    return getFallbackTrendingTags(limit);
  }

  return data || [];
}

// Fallback function if RPC not available
async function getFallbackTrendingTags(limit: number): Promise<TrendingTag[]> {
  const supabase = getSupabase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
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

// Get articles by tag using RPC function
export async function getArticlesByTag(
  tagSlug: string,
  limit: number = 20
): Promise<TagArticle[]> {
  const supabase = getSupabase();

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

// Get tag by slug
export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
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

// Get tags for an article
export async function getArticleTags(articleId: string): Promise<Tag[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("article_tags")
    .select("tag:tags(*)")
    .eq("article_id", articleId);

  if (error) {
    console.error("Error fetching article tags:", error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((item: any) => item.tag).filter(Boolean);
}

// Add tag to article
export async function addTagToArticle(
  articleId: string,
  tagId: string
): Promise<boolean> {
  const supabase = getSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("article_tags")
    .insert({ article_id: articleId, tag_id: tagId });

  if (error) {
    console.error("Error adding tag to article:", error);
    return false;
  }
  return true;
}

// Remove tag from article
export async function removeTagFromArticle(
  articleId: string,
  tagId: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("article_tags")
    .delete()
    .eq("article_id", articleId)
    .eq("tag_id", tagId);

  if (error) {
    console.error("Error removing tag from article:", error);
    return false;
  }
  return true;
}

// Create new tag
export async function createTag(
  name: string,
  slug: string,
  color?: string,
  description?: string
): Promise<Tag | null> {
  const supabase = getSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("tags")
    .insert({
      name,
      slug,
      color: color || "#6366f1",
      description,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating tag:", error);
    return null;
  }
  return data;
}

// Search tags
export async function searchTags(query: string): Promise<Tag[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .ilike("name", `%${query}%`)
    .order("usage_count", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error searching tags:", error);
    return [];
  }
  return data || [];
}

// Format tag count for display (e.g., 1500 -> "1.5K")
export function formatTagCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M";
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  }
  return count.toString();
}
