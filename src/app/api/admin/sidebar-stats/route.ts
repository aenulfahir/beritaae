import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch counts in parallel
    const [articlesResult, pendingCommentsResult] = await Promise.all([
      supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("is_approved", false),
    ]);

    return NextResponse.json({
      articlesCount: articlesResult.count || 0,
      pendingCommentsCount: pendingCommentsResult.count || 0,
    });
  } catch (error) {
    console.error("Error fetching sidebar stats:", error);
    return NextResponse.json(
      { articlesCount: 0, pendingCommentsCount: 0 },
      { status: 500 }
    );
  }
}
