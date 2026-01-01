import { createClient } from "../client";
import { Comment, Author } from "@/types";
import { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { createNotification } from "./notifications";

// Create fresh client for each operation to ensure auth token is current
function getSupabase(): SupabaseClient {
  return createClient();
}

// Helper to check if error is meaningful (not empty object or RLS-related)
function isRealError(error: unknown): boolean {
  if (!error) return false;
  if (typeof error === "object") {
    const keys = Object.keys(error);
    // Empty object from RLS
    if (keys.length === 0) return false;
    // Check for common RLS/permission errors that we can ignore
    const err = error as { code?: string; message?: string };
    if (err.code === "PGRST116") return false; // No rows returned
    if (err.code === "42501") return false; // Permission denied
    if (err.message?.includes("permission denied")) return false;
  }
  return true;
}

// Transform database row to Comment type
function transformComment(row: Record<string, unknown>): Comment {
  const profiles = row.profiles as Record<string, unknown> | null;
  const role = profiles?.role as string | undefined;
  const validRoles = ["member", "author", "editor", "admin"] as const;
  const authorRole = validRoles.includes(role as (typeof validRoles)[number])
    ? (role as Author["role"])
    : undefined;

  return {
    id: row.id as string,
    article_id: row.article_id as string,
    user_id: row.user_id as string,
    parent_id: row.parent_id as string | null,
    content: row.content as string,
    likes_count: (row.likes_count as number) || 0,
    is_approved: row.is_approved as boolean,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    author: profiles
      ? {
          id: profiles.id as string,
          name: (profiles.full_name as string) || "Anonymous",
          avatar: (profiles.avatar_url as string) || "",
          email: profiles.email as string,
          role: authorRole,
        }
      : undefined,
    replies: [],
  };
}

// Build nested comment tree
function buildCommentTree(comments: Comment[]): Comment[] {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // First pass: create map of all comments
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: build tree structure
  comments.forEach((comment) => {
    const mappedComment = commentMap.get(comment.id)!;
    if (comment.parent_id) {
      const parent = commentMap.get(comment.parent_id);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(mappedComment);
      }
    } else {
      rootComments.push(mappedComment);
    }
  });

  return rootComments;
}

export async function getArticleComments(
  articleId: string
): Promise<Comment[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        *,
        profiles:user_id (*)
      `
      )
      .eq("article_id", articleId)
      .order("created_at", { ascending: true });

    if (error) {
      // Silently handle error if table doesn't exist yet or RLS blocks access
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return [];
      }
      // Silently ignore RLS/permission errors - they're expected for unauthenticated users
      if (error.code === "42501" || error.code === "PGRST116") {
        return [];
      }
      // Only log meaningful errors (not empty objects from RLS)
      if (isRealError(error)) {
        console.error("Error fetching comments:", error.message || error);
      }
      return [];
    }

    const comments = (data || []).map((row) =>
      transformComment(row as Record<string, unknown>)
    );
    return buildCommentTree(comments);
  } catch (err) {
    // Handle any unexpected errors - only log meaningful ones
    if (isRealError(err)) {
      console.error("Unexpected error fetching comments:", err);
    }
    return [];
  }
}

export async function createComment(commentData: {
  article_id: string;
  user_id: string;
  content: string;
  parent_id?: string;
}): Promise<Comment | null> {
  const supabase = getSupabase();

  // Verify user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("Error creating comment: User not authenticated");
    return null;
  }

  // Ensure user_id matches authenticated user
  if (user.id !== commentData.user_id) {
    console.error("Error creating comment: User ID mismatch");
    return null;
  }

  // Check if profile exists, create if not
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!existingProfile) {
    // Create profile for user
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name:
        user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
      role: "member",
    });

    if (profileError) {
      console.error("Error creating profile:", profileError.message);
      // Continue anyway - trigger might have created it
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: comment, error } = await (supabase as any)
    .from("comments")
    .insert({
      ...commentData,
      is_approved: true, // Auto-approve for immediate visibility
    })
    .select(
      `
      *,
      profiles:user_id (*)
    `
    )
    .single();

  if (error) {
    console.error("Error creating comment:", error.message || error);
    return null;
  }

  const transformedComment = transformComment(
    comment as Record<string, unknown>
  );

  // Send notification if this is a reply to another comment
  if (commentData.parent_id) {
    try {
      // Get the parent comment to find the original commenter
      const { data: parentComment } = await supabase
        .from("comments")
        .select("user_id, article_id, content")
        .eq("id", commentData.parent_id)
        .single();

      // Only notify if the parent comment exists and is from a different user
      if (parentComment && parentComment.user_id !== commentData.user_id) {
        // Get article title for the notification
        const { data: article } = await supabase
          .from("articles")
          .select("title, slug")
          .eq("id", commentData.article_id)
          .single();

        const replierName = transformedComment.author?.name || "Seseorang";
        const replierAvatar = transformedComment.author?.avatar || "";
        const articleTitle = article?.title || "artikel";
        const articleSlug = article?.slug || "";
        const parentContentPreview =
          parentComment.content?.substring(0, 50) +
          (parentComment.content?.length > 50 ? "..." : "");

        // Try using RPC function first (bypasses RLS)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: rpcError } = await (supabase as any).rpc(
          "create_notification",
          {
            p_user_id: parentComment.user_id,
            p_type: "reply",
            p_title: `💬 ${replierName} membalas komentar Anda`,
            p_message: `"${transformedComment.content.substring(0, 120)}${
              transformedComment.content.length > 120 ? "..." : ""
            }"`,
            p_link: `/news/${articleSlug}#comment-${transformedComment.id}`,
            p_metadata: {
              comment_id: transformedComment.id,
              article_id: commentData.article_id,
              article_title: articleTitle,
              article_slug: articleSlug,
              replier_id: commentData.user_id,
              replier_name: replierName,
              replier_avatar: replierAvatar,
              parent_comment_preview: parentContentPreview,
              reply_content: transformedComment.content,
            },
          }
        );

        // If RPC fails, try direct insert (fallback)
        if (rpcError) {
          console.log(
            "RPC notification failed, trying direct insert:",
            rpcError.message
          );
          await createNotification({
            user_id: parentComment.user_id,
            type: "reply",
            title: `💬 ${replierName} membalas komentar Anda`,
            message: `"${transformedComment.content.substring(0, 120)}${
              transformedComment.content.length > 120 ? "..." : ""
            }"`,
            link: `/news/${articleSlug}#comment-${transformedComment.id}`,
            metadata: {
              comment_id: transformedComment.id,
              article_id: commentData.article_id,
              article_title: articleTitle,
              article_slug: articleSlug,
              replier_id: commentData.user_id,
              replier_name: replierName,
              replier_avatar: replierAvatar,
              parent_comment_preview: parentContentPreview,
              reply_content: transformedComment.content,
            },
          });
        }
      }
    } catch (notifError) {
      // Don't fail the comment creation if notification fails
      console.log("Notification creation skipped:", notifError);
    }
  }

  return transformedComment;
}

export async function updateComment(
  id: string,
  content: string
): Promise<Comment | null> {
  const supabase = getSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: comment, error } = await (supabase as any)
    .from("comments")
    .update({ content })
    .eq("id", id)
    .select(
      `
      *,
      profiles:user_id (*)
    `
    )
    .single();

  if (error) {
    console.error("Error updating comment:", error.message || error);
    return null;
  }

  return transformComment(comment as Record<string, unknown>);
}

export async function deleteComment(id: string): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase.from("comments").delete().eq("id", id);

  if (error) {
    console.error("Error deleting comment:", error.message || error);
    return false;
  }

  return true;
}

export async function toggleCommentLike(
  commentId: string,
  userId: string
): Promise<boolean> {
  const supabase = getSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc("toggle_comment_like", {
    p_comment_id: commentId,
    p_user_id: userId,
  });

  if (error) {
    console.error("Error toggling comment like:", error.message || error);
    return false;
  }

  return data as boolean;
}

export async function isCommentLiked(
  commentId: string,
  userId: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("comment_likes")
    .select("comment_id")
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .single();

  if (error) {
    return false;
  }

  return !!data;
}

export function subscribeToComments(
  articleId: string,
  callback: (payload: {
    eventType: string;
    new: Comment | null;
    old: Comment | null;
  }) => void
): RealtimeChannel {
  const supabase = getSupabase();
  return supabase
    .channel(`comments:${articleId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "comments",
        filter: `article_id=eq.${articleId}`,
      },
      async (payload) => {
        let newComment: Comment | null = null;
        let oldComment: Comment | null = null;

        if (payload.new && Object.keys(payload.new).length > 0) {
          // Fetch the full comment with profile
          const { data } = await supabase
            .from("comments")
            .select(`*, profiles:user_id (*)`)
            .eq("id", (payload.new as Record<string, unknown>).id as string)
            .single();

          if (data) {
            newComment = transformComment(data as Record<string, unknown>);
          }
        }

        if (payload.old && Object.keys(payload.old).length > 0) {
          oldComment = payload.old as Comment;
        }

        callback({
          eventType: payload.eventType,
          new: newComment,
          old: oldComment,
        });
      }
    )
    .subscribe();
}

// Admin functions
export async function approveComment(id: string): Promise<boolean> {
  const supabase = getSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("comments")
    .update({ is_approved: true })
    .eq("id", id);

  if (error) {
    console.error("Error approving comment:", error.message || error);
    return false;
  }

  return true;
}

export async function getPendingComments(): Promise<Comment[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      profiles:user_id (*)
    `
    )
    .eq("is_approved", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending comments:", error.message || error);
    return [];
  }

  return (data || []).map((row) =>
    transformComment(row as Record<string, unknown>)
  );
}

// Report comment function
export async function reportComment(reportData: {
  comment_id: string;
  reporter_id: string;
  reason: string;
  description?: string;
}): Promise<boolean> {
  const supabase = getSupabase();

  // Try using RPC function first (handles notification)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc("report_comment", {
    p_comment_id: reportData.comment_id,
    p_reporter_id: reportData.reporter_id,
    p_reason: reportData.reason,
    p_description: reportData.description || null,
  });

  if (error) {
    console.error("Error reporting comment via RPC:", error.message);
    // Fallback to direct insert
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any)
      .from("comment_reports")
      .insert({
        comment_id: reportData.comment_id,
        reporter_id: reportData.reporter_id,
        reason: reportData.reason,
        description: reportData.description,
      });

    if (insertError) {
      console.error("Error reporting comment:", insertError.message);
      return false;
    }
  }

  return true;
}

// Get comment reports (admin)
export interface CommentReport {
  id: string;
  comment_id: string;
  reporter_id: string | null;
  reason: string;
  description: string | null;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  comment?: {
    id: string;
    content: string;
    user_id: string;
    article_id: string;
    profiles?: {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
    };
    articles?: {
      id: string;
      title: string;
      slug: string;
    };
  };
  reporter?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export async function getCommentReports(
  status?: string
): Promise<CommentReport[]> {
  const supabase = getSupabase();

  let query = supabase
    .from("comment_reports")
    .select(
      `
      *,
      comment:comments (
        id,
        content,
        user_id,
        article_id,
        profiles:user_id (id, full_name, avatar_url),
        articles:article_id (id, title, slug)
      ),
      reporter:profiles!comment_reports_reporter_id_fkey (id, full_name, avatar_url)
    `
    )
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (query as any);

  if (error) {
    console.error("Error fetching comment reports:", error.message || error);
    return [];
  }

  return data || [];
}

export async function updateReportStatus(
  reportId: string,
  status: string,
  reviewerId: string
): Promise<boolean> {
  const supabase = getSupabase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).rpc("update_report_status", {
    p_report_id: reportId,
    p_status: status,
    p_reviewer_id: reviewerId,
  });

  if (error) {
    console.error("Error updating report status:", error.message);
    // Fallback to direct update
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from("comment_reports")
      .update({
        status,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", reportId);

    if (updateError) {
      console.error("Error updating report:", updateError.message);
      return false;
    }
  }

  return true;
}
