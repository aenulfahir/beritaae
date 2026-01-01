import { createClient } from "../server";
import { NewsArticle } from "@/types";

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

// Common select query with explicit foreign key reference
const ARTICLE_SELECT = `
  *,
  categories (*),
  profiles!articles_author_id_fkey (*)
`;

export async function getPublishedArticles(options?: {
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<NewsArticle[]> {
  try {
    const supabase = await createClient();

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
      console.error(
        "[articles-server] Error fetching articles:",
        JSON.stringify(error, null, 2)
      );
      return [];
    }

    return (data || []).map(transformArticle);
  } catch (error) {
    console.error("[articles-server] Exception fetching articles:", error);
    return [];
  }
}

export async function getArticleBySlug(
  slug: string
): Promise<NewsArticle | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT)
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(
        "[articles-server] Error fetching article by slug:",
        JSON.stringify(error, null, 2)
      );
      return null;
    }

    return transformArticle(data);
  } catch (error) {
    console.error(
      "[articles-server] Exception fetching article by slug:",
      error
    );
    return null;
  }
}

export async function getFeaturedArticles(): Promise<NewsArticle[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT)
      .eq("status", "published")
      .eq("is_featured", true)
      .order("published_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error(
        "[articles-server] Error fetching featured articles:",
        JSON.stringify(error, null, 2)
      );
      return [];
    }

    return (data || []).map(transformArticle);
  } catch (error) {
    console.error(
      "[articles-server] Exception fetching featured articles:",
      error
    );
    return [];
  }
}

export async function getBreakingNews(): Promise<NewsArticle[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT)
      .eq("status", "published")
      .eq("is_breaking", true)
      .order("published_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error(
        "[articles-server] Error fetching breaking news:",
        JSON.stringify(error, null, 2)
      );
      return [];
    }

    return (data || []).map(transformArticle);
  } catch (error) {
    console.error("[articles-server] Exception fetching breaking news:", error);
    return [];
  }
}

export async function getTrendingArticles(
  limit: number = 5
): Promise<NewsArticle[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT)
      .eq("status", "published")
      .order("views_count", { ascending: false })
      .limit(limit);

    if (error) {
      console.error(
        "[articles-server] Error fetching trending articles:",
        JSON.stringify(error, null, 2)
      );
      return [];
    }

    return (data || []).map(transformArticle);
  } catch (error) {
    console.error(
      "[articles-server] Exception fetching trending articles:",
      error
    );
    return [];
  }
}

export async function getArticlesByCategory(
  categorySlug: string,
  limit: number = 10
): Promise<NewsArticle[]> {
  try {
    const supabase = await createClient();

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
      console.error(
        "[articles-server] Error fetching articles by category:",
        JSON.stringify(error, null, 2)
      );
      return [];
    }

    return (data || []).map(transformArticle);
  } catch (error) {
    console.error(
      "[articles-server] Exception fetching articles by category:",
      error
    );
    return [];
  }
}

export async function incrementViewCount(articleId: string): Promise<void> {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).rpc("increment_view_count", {
      article_id: articleId,
    });

    if (error) {
      console.error(
        "[articles-server] Error incrementing view count:",
        JSON.stringify(error, null, 2)
      );
    }
  } catch (error) {
    console.error(
      "[articles-server] Exception incrementing view count:",
      error
    );
  }
}
