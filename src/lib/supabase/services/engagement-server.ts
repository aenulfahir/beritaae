import { createClient } from "../server";

export interface ArticleEngagement {
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  trendingRank: number | null;
  userReaction: "like" | "dislike" | null;
}

/**
 * Get all engagement data for an article (Server-side version)
 * Fetches likes count, dislikes count, comments count, trending rank, and user's reaction
 */
export async function getArticleEngagement(
  articleId: string,
  userId?: string
): Promise<ArticleEngagement> {
  const supabase = await createClient();

  try {
    // Fetch likes and dislikes counts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: likesData, error: likesError } = await (supabase as any)
      .from("article_likes")
      .select("reaction_type")
      .eq("article_id", articleId);

    if (likesError) {
      console.error("Error fetching article likes:", likesError.message);
    }

    const likesCount =
      likesData?.filter(
        (r: { reaction_type: string }) => r.reaction_type === "like"
      ).length || 0;
    const dislikesCount =
      likesData?.filter(
        (r: { reaction_type: string }) => r.reaction_type === "dislike"
      ).length || 0;

    // Fetch comments count (only approved comments)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: commentsCount, error: commentsError } = await (
      supabase as any
    )
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("article_id", articleId)
      .eq("is_approved", true);

    if (commentsError) {
      console.error("Error fetching comments count:", commentsError.message);
    }

    // Fetch user's reaction if logged in
    let userReaction: "like" | "dislike" | null = null;
    if (userId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: reactionData, error: reactionError } = await (
        supabase as any
      )
        .from("article_likes")
        .select("reaction_type")
        .eq("article_id", articleId)
        .eq("user_id", userId)
        .single();

      if (!reactionError && reactionData) {
        userReaction = reactionData.reaction_type;
      }
    }

    // Calculate trending rank based on views_count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: trendingData, error: trendingError } = await (supabase as any)
      .from("articles")
      .select("id, views_count")
      .eq("status", "published")
      .order("views_count", { ascending: false })
      .limit(100);

    if (trendingError) {
      console.error("Error fetching trending data:", trendingError.message);
    }

    let trendingRank: number | null = null;
    if (trendingData) {
      const index = trendingData.findIndex(
        (a: { id: string }) => a.id === articleId
      );
      if (index !== -1) {
        trendingRank = index + 1;
      }
    }

    return {
      likesCount,
      dislikesCount,
      commentsCount: commentsCount || 0,
      trendingRank,
      userReaction,
    };
  } catch (error) {
    console.error("Error fetching article engagement:", error);
    return {
      likesCount: 0,
      dislikesCount: 0,
      commentsCount: 0,
      trendingRank: null,
      userReaction: null,
    };
  }
}

/**
 * Toggle article reaction (like/dislike) - Server-side version
 * Uses RPC function with SECURITY DEFINER to bypass RLS
 */
export async function toggleArticleReaction(
  articleId: string,
  userId: string,
  reactionType: "like" | "dislike"
): Promise<{
  success: boolean;
  newReaction: "like" | "dislike" | null;
  likesCount: number;
  dislikesCount: number;
  error?: string;
}> {
  const supabase = await createClient();

  try {
    // Use RPC function with SECURITY DEFINER to bypass RLS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc(
      "toggle_article_reaction",
      {
        p_article_id: articleId,
        p_user_id: userId,
        p_reaction_type: reactionType,
      }
    );

    if (error) {
      console.error("Error toggling reaction via RPC:", error);
      // Fallback to direct table operations if RPC fails
      return await toggleArticleReactionDirect(
        supabase,
        articleId,
        userId,
        reactionType
      );
    }

    // RPC returns array with single row
    const result = Array.isArray(data) ? data[0] : data;

    return {
      success: result?.success ?? false,
      newReaction: result?.new_reaction as "like" | "dislike" | null,
      likesCount: Number(result?.likes_count) || 0,
      dislikesCount: Number(result?.dislikes_count) || 0,
    };
  } catch (error) {
    console.error("Error toggling reaction:", error);
    return {
      success: false,
      newReaction: null,
      likesCount: 0,
      dislikesCount: 0,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Fallback: Direct table operations for toggling reaction
 * Used when RPC function is not available
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function toggleArticleReactionDirect(
  supabase: any,
  articleId: string,
  userId: string,
  reactionType: "like" | "dislike"
): Promise<{
  success: boolean;
  newReaction: "like" | "dislike" | null;
  likesCount: number;
  dislikesCount: number;
  error?: string;
}> {
  try {
    // Check if user already has a reaction
    const { data: existingReaction, error: fetchError } = await supabase
      .from("article_likes")
      .select("reaction_type")
      .eq("article_id", articleId)
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      return {
        success: false,
        newReaction: null,
        likesCount: 0,
        dislikesCount: 0,
        error: fetchError.message,
      };
    }

    let newReaction: "like" | "dislike" | null = null;

    if (existingReaction) {
      if (existingReaction.reaction_type === reactionType) {
        // Same reaction - toggle off (delete)
        const { error: deleteError } = await supabase
          .from("article_likes")
          .delete()
          .eq("article_id", articleId)
          .eq("user_id", userId);

        if (deleteError) {
          return {
            success: false,
            newReaction: existingReaction.reaction_type,
            likesCount: 0,
            dislikesCount: 0,
            error: deleteError.message,
          };
        }
        newReaction = null;
      } else {
        // Different reaction - update
        const { error: updateError } = await supabase
          .from("article_likes")
          .update({ reaction_type: reactionType })
          .eq("article_id", articleId)
          .eq("user_id", userId);

        if (updateError) {
          return {
            success: false,
            newReaction: existingReaction.reaction_type,
            likesCount: 0,
            dislikesCount: 0,
            error: updateError.message,
          };
        }
        newReaction = reactionType;
      }
    } else {
      // No existing reaction - insert new
      const { error: insertError } = await supabase
        .from("article_likes")
        .insert({
          article_id: articleId,
          user_id: userId,
          reaction_type: reactionType,
        });

      if (insertError) {
        return {
          success: false,
          newReaction: null,
          likesCount: 0,
          dislikesCount: 0,
          error: insertError.message,
        };
      }
      newReaction = reactionType;
    }

    // Fetch updated counts
    const { data: likesData } = await supabase
      .from("article_likes")
      .select("reaction_type")
      .eq("article_id", articleId);

    const likesCount =
      likesData?.filter(
        (r: { reaction_type: string }) => r.reaction_type === "like"
      ).length || 0;
    const dislikesCount =
      likesData?.filter(
        (r: { reaction_type: string }) => r.reaction_type === "dislike"
      ).length || 0;

    return {
      success: true,
      newReaction,
      likesCount,
      dislikesCount,
    };
  } catch (error) {
    console.error("Error in direct reaction toggle:", error);
    return {
      success: false,
      newReaction: null,
      likesCount: 0,
      dislikesCount: 0,
      error: "An unexpected error occurred",
    };
  }
}
