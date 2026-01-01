import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { toggleArticleReaction } from "@/lib/supabase/services/engagement-server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;
    const body = await request.json();
    const { reactionType } = body;

    // Validate reaction type
    if (!reactionType || !["like", "dislike"].includes(reactionType)) {
      return NextResponse.json(
        { error: "Invalid reaction type. Must be 'like' or 'dislike'" },
        { status: 400 }
      );
    }

    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Toggle the reaction
    const result = await toggleArticleReaction(
      articleId,
      user.id,
      reactionType as "like" | "dislike"
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to toggle reaction" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      newReaction: result.newReaction,
      likesCount: result.likesCount,
      dislikesCount: result.dislikesCount,
    });
  } catch (error) {
    console.error("Error in reaction API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
