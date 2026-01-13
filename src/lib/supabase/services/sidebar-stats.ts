import { createClient } from "../server";

export interface SidebarStats {
  totalArticles: number;
  totalComments: number;
  totalViews: number;
  totalUsers: number;
}

export interface MostCommentedArticle {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  comment_count: number;
  category_name: string | null;
}

export interface MostViewedArticle {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  views_count: number;
  category_name: string | null;
}

// Get sidebar statistics
export async function getSidebarStats(): Promise<SidebarStats> {
  const supabase = await createClient();

  try {
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
      totalComments,
      totalViews,
      totalUsers,
    };
  } catch (error) {
    console.error("Error fetching sidebar stats:", error);
    return {
      totalArticles: 0,
      totalComments: 0,
      totalViews: 0,
      totalUsers: 0,
    };
  }
}

interface CommentRow {
  article_id: string | null;
}

interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  categories: { name: string } | null;
}

// Get most commented articles
export async function getMostCommentedArticles(
  limit: number = 5
): Promise<MostCommentedArticle[]> {
  const supabase = await createClient();

  try {
    // Get comment counts per article
    const { data: commentCounts, error: countError } = await supabase
      .from("comments")
      .select("article_id")
      .eq("is_approved", true);

    if (countError || !commentCounts) {
      console.error("Error fetching comment counts:", countError);
      return [];
    }

    // Count comments per article
    const countMap: Record<string, number> = {};
    (commentCounts as CommentRow[]).forEach((c) => {
      if (c.article_id) {
        countMap[c.article_id] = (countMap[c.article_id] || 0) + 1;
      }
    });

    // Get top article IDs by comment count
    const topArticleIds = Object.entries(countMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id]) => id);

    if (topArticleIds.length === 0) {
      return [];
    }

    // Fetch article details
    const { data: articles, error: articlesError } = await supabase
      .from("articles")
      .select("id, title, slug, image_url, categories(name)")
      .in("id", topArticleIds)
      .eq("status", "published");

    if (articlesError || !articles) {
      console.error("Error fetching articles:", articlesError);
      return [];
    }

    // Map and sort by comment count
    return (articles as ArticleRow[])
      .map((article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        image_url: article.image_url,
        comment_count: countMap[article.id] || 0,
        category_name: article.categories?.name || null,
      }))
      .sort((a, b) => b.comment_count - a.comment_count);
  } catch (error) {
    console.error("Error fetching most commented articles:", error);
    return [];
  }
}

interface ViewedArticleRow {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  views_count: number | null;
  categories: { name: string } | null;
}

// Get most viewed articles (for sidebar)
export async function getMostViewedArticles(
  limit: number = 5
): Promise<MostViewedArticle[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("articles")
      .select("id, title, slug, image_url, views_count, categories(name)")
      .eq("status", "published")
      .order("views_count", { ascending: false })
      .limit(limit);

    if (error || !data) {
      console.error("Error fetching most viewed articles:", error);
      return [];
    }

    return (data as ViewedArticleRow[]).map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      image_url: article.image_url,
      views_count: article.views_count || 0,
      category_name: article.categories?.name || null,
    }));
  } catch (error) {
    console.error("Error fetching most viewed articles:", error);
    return [];
  }
}

// Format large numbers (e.g., 1500 -> 1.5K)
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}
