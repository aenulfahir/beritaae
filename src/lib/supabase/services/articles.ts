import { createClient } from "../client";
import { NewsArticle } from "@/types";

function getSupabase() {
  return createClient();
}

// Transform database row to NewsArticle type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformArticle(row: any): NewsArticle {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || "",
    content: row.content || "",
    image_url: row.image_url || "/placeholder-image.jpg",
    category: row.categories
      ? {
          id: row.categories.id,
          name: row.categories.name,
          slug: row.categories.slug,
          color: row.categories.color,
        }
      : {
          id: "",
          name: "Uncategorized",
          slug: "uncategorized",
          color: "#6B7280",
        },
    category_id: row.category_id,
    author: row.profiles
      ? {
          id: row.profiles.id,
          name: row.profiles.full_name || "Anonymous",
          avatar: row.profiles.avatar_url || "",
          email: row.profiles.email,
          role: row.profiles.role,
        }
      : { id: "", name: "Anonymous", avatar: "", email: "", role: "member" },
    author_id: row.author_id,
    status: row.status,
    is_breaking: row.is_breaking || false,
    is_featured: row.is_featured || false,
    views_count: row.views_count || 0,
    read_time: row.read_time || "5 menit",
    published_at: row.published_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// Common select query with explicit foreign key reference to avoid ambiguity
const ARTICLE_SELECT = `
  *,
  categories (*),
  profiles!articles_author_id_fkey (*)
`;

// Get all articles (for admin - includes all statuses)
export async function getAllArticles(options?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<NewsArticle[]> {
  const supabase = getSupabase();

  try {
    let query = supabase
      .from("articles")
      .select(ARTICLE_SELECT)
      .order("created_at", { ascending: false });

    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching articles:", error);
      return [];
    }

    return (data || []).map(transformArticle);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function getPublishedArticles(options?: {
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<NewsArticle[]> {
  const supabase = getSupabase();

  try {
    let query = supabase
      .from("articles")
      .select(ARTICLE_SELECT)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (options?.category) {
      query = query.eq("categories.slug", options.category);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching articles:", error);
      return [];
    }

    return (data || []).map(transformArticle);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function getArticleBySlug(
  slug: string
): Promise<NewsArticle | null> {
  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT)
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching article:", error);
      return null;
    }

    return transformArticle(data);
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export async function getArticleById(id: string): Promise<NewsArticle | null> {
  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching article:", error);
      return null;
    }

    return transformArticle(data);
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export async function getFeaturedArticles(): Promise<NewsArticle[]> {
  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT)
      .eq("status", "published")
      .eq("is_featured", true)
      .order("published_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching featured articles:", error);
      return [];
    }

    return (data || []).map(transformArticle);
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    return [];
  }
}

export async function getBreakingNews(): Promise<NewsArticle[]> {
  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT)
      .eq("status", "published")
      .eq("is_breaking", true)
      .order("published_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching breaking news:", error);
      return [];
    }

    return (data || []).map(transformArticle);
  } catch (error) {
    console.error("Error fetching breaking news:", error);
    return [];
  }
}

export async function getTrendingArticles(
  limit: number = 5
): Promise<NewsArticle[]> {
  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT)
      .eq("status", "published")
      .order("views_count", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching trending articles:", error);
      return [];
    }

    return (data || []).map(transformArticle);
  } catch (error) {
    console.error("Error fetching trending articles:", error);
    return [];
  }
}

export async function getArticlesByCategory(
  categorySlug: string,
  limit: number = 10
): Promise<NewsArticle[]> {
  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        categories!inner (*),
        profiles!articles_author_id_fkey (*)
      `
      )
      .eq("status", "published")
      .eq("categories.slug", categorySlug)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching articles by category:", error);
      return [];
    }

    return (data || []).map(transformArticle);
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    return [];
  }
}

export async function incrementViewCount(articleId: string): Promise<void> {
  const supabase = getSupabase();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).rpc("increment_view_count", {
      article_id: articleId,
    });

    if (error) {
      console.error("Error incrementing view count:", error);
    }
  } catch (error) {
    console.error("Error incrementing view count:", error);
  }
}

// Admin functions
export async function createArticle(data: {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image_url?: string;
  category_id?: string;
  author_id: string;
  status?: "draft" | "published" | "archived";
  is_breaking?: boolean;
  is_featured?: boolean;
  read_time?: string;
}): Promise<NewsArticle | null> {
  const supabase = getSupabase();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: article, error } = await (supabase as any)
      .from("articles")
      .insert({
        ...data,
        published_at:
          data.status === "published" ? new Date().toISOString() : null,
      })
      .select(ARTICLE_SELECT)
      .single();

    if (error) {
      console.error("Error creating article:", error);
      return null;
    }

    return transformArticle(article);
  } catch (error) {
    console.error("Error creating article:", error);
    return null;
  }
}

export async function updateArticle(
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image_url: string;
    category_id: string;
    status: "draft" | "published" | "archived";
    is_breaking: boolean;
    is_featured: boolean;
    read_time: string;
  }>
): Promise<NewsArticle | null> {
  const supabase = getSupabase();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { ...data };

    // Set published_at when publishing
    if (data.status === "published") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existing } = await (supabase as any)
        .from("articles")
        .select("published_at")
        .eq("id", id)
        .single();

      if (!existing?.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: article, error } = await (supabase as any)
      .from("articles")
      .update(updateData)
      .eq("id", id)
      .select(ARTICLE_SELECT)
      .single();

    if (error) {
      console.error("Error updating article:", error);
      return null;
    }

    return transformArticle(article);
  } catch (error) {
    console.error("Error updating article:", error);
    return null;
  }
}

export async function deleteArticle(id: string): Promise<boolean> {
  const supabase = getSupabase();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("articles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting article:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting article:", error);
    return false;
  }
}
