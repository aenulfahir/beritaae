import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ user: null, notifications: [] });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Get pending comments count (for notifications)
    const { count: pendingComments } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("is_approved", false);

    // Get draft articles count
    const { count: draftArticles } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft");

    // Build notifications
    const notifications = [];

    if (pendingComments && pendingComments > 0) {
      notifications.push({
        id: "pending-comments",
        title: `${pendingComments} komentar menunggu moderasi`,
        time: "Baru",
        type: "comment",
      });
    }

    if (draftArticles && draftArticles > 0) {
      notifications.push({
        id: "draft-articles",
        title: `${draftArticles} artikel draft`,
        time: "Baru",
        type: "article",
      });
    }

    return NextResponse.json({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: profile
        ? {
            id: (profile as any).id,
            name: (profile as any).full_name || "Admin",
            email: (profile as any).email,
            avatar: (profile as any).avatar_url,
            role: (profile as any).role,
          }
        : null,
      notifications,
      notificationCount: notifications.length,
    });
  } catch (error) {
    console.error("Error fetching header data:", error);
    return NextResponse.json({
      user: null,
      notifications: [],
      notificationCount: 0,
    });
  }
}
