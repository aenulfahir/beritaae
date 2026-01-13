import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const limit = parseInt(searchParams.get("limit") || "10");

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const supabase = await createClient();

    // Search articles by title, excerpt, or content
    const { data: articles, error } = await supabase
      .from("articles")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        image_url,
        created_at,
        views_count,
        categories (
          name,
          color
        )
      `
      )
      .eq("status", "published")
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order("views_count", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Search error:", error);
      return NextResponse.json(
        { results: [], error: error.message },
        { status: 500 }
      );
    }

    // Transform results
    const results = (articles || []).map((article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      image_url: article.image_url,
      category: article.categories,
      created_at: article.created_at,
      views_count: article.views_count || 0,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { results: [], error: "Internal server error" },
      { status: 500 }
    );
  }
}
