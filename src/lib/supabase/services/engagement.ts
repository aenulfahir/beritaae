import { createClient } from "../client";

export interface ArticleEngagement {
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  trendingRank: number | null;
  userReaction: "like" | "dislike" | null;
}

function getSupabase() {
  return createClient();
}

/**
 * Get all engagement data for an article
 * Fetches likes count, dislikes count, comments count, trending rank, and user's reaction
 */
export async function getArticleEngagement(
  articleId: string,
  userId?: string
): Promise<ArticleEngagement> {
  const supabase = getSupabase();

  try {
    // Fetch likes and dislikes counts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: likesData, error: likesError } = await (supabase as any)
      .from("article_likes")
      .select("reaction_type")
      .eq("article_id", articleId);

    if (likesError) {
      console.error("Error fetching article likes:", likesError);
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
      console.error("Error fetching comments count:", commentsError);
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
      console.error("Error fetching trending data:", trendingError);
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
 * Toggle article reaction (like/dislike)
 * - If no reaction exists, insert new reaction
 * - If same reaction exists, delete it (toggle off)
 * - If opposite reaction exists, update to new reaction
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
  const supabase = getSupabase();

  try {
    // Check if user already has a reaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingReaction, error: fetchError } = await (
      supabase as any
    )
      .from("article_likes")
      .select("reaction_type")
      .eq("article_id", articleId)
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error fetching existing reaction:", fetchError);
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: deleteError } = await (supabase as any)
          .from("article_likes")
          .delete()
          .eq("article_id", articleId)
          .eq("user_id", userId);

        if (deleteError) {
          console.error("Error deleting reaction:", deleteError);
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("article_likes")
          .update({ reaction_type: reactionType })
          .eq("article_id", articleId)
          .eq("user_id", userId);

        if (updateError) {
          console.error("Error updating reaction:", updateError);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase as any)
        .from("article_likes")
        .insert({
          article_id: articleId,
          user_id: userId,
          reaction_type: reactionType,
        });

      if (insertError) {
        console.error("Error inserting reaction:", insertError);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: likesData } = await (supabase as any)
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
