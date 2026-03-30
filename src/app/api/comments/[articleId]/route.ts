import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET comments for an article - server-side, bypasses client RLS issues
export async function GET(
  request: Request,
  { params }: { params: Promise<{ articleId: string }> },
) {
  const { articleId } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comments")
    .select("*, profiles:user_id (*)")
    .eq("article_id", articleId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[API] Error fetching comments:", error.message);
    return NextResponse.json({ comments: [] });
  }

  return NextResponse.json({ comments: data || [] });
}

// POST a new comment
export async function POST(
  request: Request,
  { params }: { params: Promise<{ articleId: string }> },
) {
  const { articleId } = await params;
  const supabase = await createClient();

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { content, parent_id } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  // Ensure profile exists for this user (foreign key requirement)
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!existingProfile) {
    // Create profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name:
        user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
      role: "member",
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("comments")
    .insert({
      article_id: articleId,
      user_id: user.id,
      content: content.trim(),
      parent_id: parent_id || null,
      is_approved: true,
    })
    .select("*, profiles:user_id (*)")
    .single();

  if (error) {
    console.error("[API] Error creating comment:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comment: data });
}
