import { createClient } from "../client";

function getSupabase() {
  return createClient();
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  is_read: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Get user's notifications
export async function getUserNotifications(
  userId: string,
  options?: { limit?: number; unreadOnly?: boolean }
): Promise<Notification[]> {
  const supabase = getSupabase();
  const { limit = 50, unreadOnly = false } = options || {};

  try {
    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (unreadOnly) {
      query = query.eq("is_read", false);
    }

    const { data, error } = await query;

    if (error) {
      // Handle RLS/permission errors silently
      if (
        error.code === "42501" ||
        error.code === "PGRST116" ||
        error.message?.includes("permission")
      ) {
        console.log("RLS policy may not be configured for notifications");
        return [];
      }
      console.error("Error fetching notifications:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Exception fetching notifications:", err);
    return [];
  }
}

// Get unread notification count
export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = getSupabase();

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("Error getting unread count:", error.message);
    return 0;
  }

  return count || 0;
}

// Create a notification
export async function createNotification(data: {
  user_id: string;
  type: string;
  title: string;
  message?: string;
  link?: string;
  metadata?: Record<string, unknown>;
}): Promise<Notification | null> {
  const supabase = getSupabase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: notification, error } = await (supabase as any)
    .from("notifications")
    .insert({
      user_id: data.user_id,
      type: data.type,
      title: data.title,
      message: data.message || null,
      link: data.link || null,
      metadata: data.metadata || {},
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating notification:", error.message);
    return null;
  }

  return notification;
}

// Mark notification as read
export async function markAsRead(notificationId: string): Promise<boolean> {
  const supabase = getSupabase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) {
    console.error("Error marking notification as read:", error.message);
    return false;
  }

  return true;
}

// Mark all notifications as read for a user
export async function markAllAsRead(userId: string): Promise<boolean> {
  const supabase = getSupabase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("Error marking all as read:", error.message);
    return false;
  }

  return true;
}

// Delete a notification
export async function deleteNotification(
  notificationId: string
): Promise<boolean> {
  const supabase = getSupabase();

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId);

  if (error) {
    console.error("Error deleting notification:", error.message);
    return false;
  }

  return true;
}

// Delete all read notifications for a user
export async function deleteReadNotifications(
  userId: string
): Promise<boolean> {
  const supabase = getSupabase();

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("user_id", userId)
    .eq("is_read", true);

  if (error) {
    console.error("Error deleting read notifications:", error.message);
    return false;
  }

  return true;
}

// Helper to format time ago
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
