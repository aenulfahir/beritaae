import { createClient } from "../client";
import { NewsArticle } from "@/types";

function getSupabase() {
  return createClient();
}

export interface SavedArticle {
  id: string;
  user_id: string;
  article_id: string;
  created_at: string;
  article?: NewsArticle;
}

// Type for the raw saved article data from Supabase
interface RawSavedArticle {
  id: string;
  user_id: string;
  article_id: string;
  created_at: string;
  articles: Record<string, unknown> | null;
}

// Get user's saved articles with article details
export async function getSavedArticles(
  userId: string
): Promise<SavedArticle[]> {
  const supabase = getSupabase();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("saved_articles")
      .select(
        `
        *,
        articles (
          *,
          categories (*),
          profiles:author_id (*)
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      // Handle RLS/permission errors silently
      if (
        error.code === "42501" ||
        error.code === "PGRST116" ||
        error.message?.includes("permission")
      ) {
        console.log("RLS policy may not be configured for saved_articles");
        return [];
      }
      console.error("Error fetching saved articles:", error.message);
      return [];
    }

    return ((data as RawSavedArticle[]) || []).map((item) => ({
      id: item.id,
      user_id: item.user_id,
      article_id: item.article_id,
      created_at: item.created_at,
      article: item.articles ? transformArticle(item.articles) : undefined,
    }));
  } catch (err) {
    console.error("Exception fetching saved articles:", err);
    return [];
  }
}

// Save an article
export async function saveArticle(
  userId: string,
  articleId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("saved_articles")
    .insert({ user_id: userId, article_id: articleId });

  if (error) {
    // Handle duplicate error gracefully
    if (error.code === "23505") {
      return { success: true }; // Already saved
    }
    console.error("Error saving article:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Remove saved article
export async function unsaveArticle(
  userId: string,
  articleId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();

  const { error } = await supabase
    .from("saved_articles")
    .delete()
    .eq("user_id", userId)
    .eq("article_id", articleId);

  if (error) {
    console.error("Error removing saved article:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Check if article is saved
export async function isArticleSaved(
  userId: string,
  articleId: string
): Promise<boolean> {
  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from("saved_articles")
      .select("id")
      .eq("user_id", userId)
      .eq("article_id", articleId)
      .maybeSingle();

    if (error) {
      // Handle RLS/permission errors silently
      if (
        error.code === "42501" ||
        error.code === "PGRST116" ||
        error.message?.includes("permission")
      ) {
        return false;
      }
      console.error("Error checking if article saved:", error.message);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error("Exception checking if article saved:", err);
    return false;
  }
}

// Toggle save status
export async function toggleSaveArticle(
  userId: string,
  articleId: string
): Promise<{ saved: boolean; error?: string }> {
  const isSaved = await isArticleSaved(userId, articleId);

  if (isSaved) {
    const result = await unsaveArticle(userId, articleId);
    return { saved: false, error: result.error };
  } else {
    const result = await saveArticle(userId, articleId);
    return { saved: true, error: result.error };
  }
}

// Get saved article count for user
export async function getSavedArticleCount(userId: string): Promise<number> {
  const supabase = getSupabase();

  const { count, error } = await supabase
    .from("saved_articles")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error("Error getting saved count:", error.message);
    return 0;
  }

  return count || 0;
}

// Helper to transform article data
function transformArticle(data: Record<string, unknown>): NewsArticle {
  const category = data.categories as Record<string, unknown> | null;
  const author = data.profiles as Record<string, unknown> | null;

  // Default category when not available
  const defaultCategory = {
    id: "",
    name: "Uncategorized",
    slug: "uncategorized",
    color: "#6366f1",
    description: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Default author when not available
  const defaultAuthor = {
    id: "",
    name: "Unknown",
    avatar: "",
    email: "",
    role: "member" as const,
  };

  return {
    id: data.id as string,
    title: data.title as string,
    slug: data.slug as string,
    excerpt: (data.excerpt as string) || "",
    content: (data.content as string) || "",
    image_url: (data.image_url as string) || "",
    category_id: data.category_id as string,
    author_id: data.author_id as string,
    status: data.status as "draft" | "published" | "archived",
    is_featured: (data.is_featured as boolean) || false,
    is_breaking: (data.is_breaking as boolean) || false,
    views_count: (data.views_count as number) || 0,
    read_time: (data.read_time as string) || "3 min",
    published_at: data.published_at as string | null,
    created_at: data.created_at as string,
    updated_at: data.updated_at as string,
    category: category
      ? {
          id: category.id as string,
          name: category.name as string,
          slug: category.slug as string,
          color: (category.color as string) || "#6366f1",
          description: category.description as string | null,
          created_at: category.created_at as string,
          updated_at: category.updated_at as string,
        }
      : defaultCategory,
    author: author
      ? {
          id: author.id as string,
          name: (author.full_name as string) || "Unknown",
          avatar: (author.avatar_url as string) || "",
          email: author.email as string,
          role: author.role as "member" | "author" | "editor" | "admin",
        }
      : defaultAuthor,
  };
}
