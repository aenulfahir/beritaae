import { createClient } from "../server";

// User role type - expanded hierarchy
export type UserRole =
  | "superadmin"
  | "admin"
  | "moderator"
  | "editor"
  | "author"
  | "member";
export type UserStatus = "active" | "inactive" | "banned";

// Role hierarchy for display and permissions
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  superadmin: 6,
  admin: 5,
  moderator: 4,
  editor: 3,
  author: 2,
  member: 1,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: "Super Admin",
  admin: "Admin",
  moderator: "Moderator",
  editor: "Editor",
  author: "Penulis",
  member: "Member",
};

export const ROLE_COLORS: Record<UserRole, { bg: string; text: string }> = {
  superadmin: { bg: "bg-red-500/10", text: "text-red-600" },
  admin: { bg: "bg-blue-500/10", text: "text-blue-600" },
  moderator: { bg: "bg-amber-500/10", text: "text-amber-600" },
  editor: { bg: "bg-purple-500/10", text: "text-purple-600" },
  author: { bg: "bg-green-500/10", text: "text-green-600" },
  member: { bg: "bg-gray-500/10", text: "text-gray-600" },
};

// Admin roles (can access admin panel)
export const ADMIN_ROLES: UserRole[] = [
  "superadmin",
  "admin",
  "moderator",
  "editor",
];

// Staff roles (can write articles)
export const STAFF_ROLES: UserRole[] = [
  "superadmin",
  "admin",
  "moderator",
  "editor",
  "author",
];

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  status: UserStatus;
  bio: string | null;
  phone: string | null;
  social_links: Record<string, string>;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  // Computed fields
  articles_count?: number;
  comments_count?: number;
  total_views?: number;
}

export interface UsersStats {
  total: number;
  active: number;
  inactive: number;
  banned: number;
  byRole: Record<UserRole, number>;
}

// Get all users with optional filters
export async function getUsers(options?: {
  roles?: UserRole[];
  status?: UserStatus;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = supabase.from("profiles").select("*");

  if (options?.roles && options.roles.length > 0) {
    query = query.in("role", options.roles);
  }

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  if (options?.search) {
    query = query.or(
      `full_name.ilike.%${options.search}%,email.ilike.%${options.search}%`
    );
  }

  query = query.order("created_at", { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 50) - 1
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data as UserProfile[];
}

// Get users by specific roles (for admin pages)
export async function getUsersByRoles(roles: UserRole[]) {
  return getUsers({ roles });
}

// Get admin users (superadmin, admin, moderator)
export async function getAdminUsers() {
  return getUsersByRoles(["superadmin", "admin", "moderator"]);
}

// Get staff/authors (editor, author)
export async function getStaffUsers() {
  return getUsersByRoles(["editor", "author"]);
}

// Get regular members
export async function getMemberUsers() {
  return getUsersByRoles(["member"]);
}

// Get user stats
export async function getUsersStats(): Promise<UsersStats> {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("role, status");

  if (error || !profiles) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
      banned: 0,
      byRole: {
        superadmin: 0,
        admin: 0,
        moderator: 0,
        editor: 0,
        author: 0,
        member: 0,
      },
    };
  }

  const stats: UsersStats = {
    total: profiles.length,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    active: profiles.filter((p: any) => p.status === "active" || !p.status)
      .length,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inactive: profiles.filter((p: any) => p.status === "inactive").length,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    banned: profiles.filter((p: any) => p.status === "banned").length,
    byRole: {
      superadmin: 0,
      admin: 0,
      moderator: 0,
      editor: 0,
      author: 0,
      member: 0,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profiles.forEach((p: any) => {
    const role = p.role as UserRole;
    if (stats.byRole[role] !== undefined) {
      stats.byRole[role]++;
    }
  });

  return stats;
}

// Get users with article counts (for authors page)
export async function getUsersWithArticleCounts(roles: UserRole[]) {
  const supabase = await createClient();

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .in("role", roles)
    .order("created_at", { ascending: false });

  if (profilesError || !profiles) {
    console.error("Error fetching profiles:", profilesError);
    return [];
  }

  // Get article counts per author
  const { data: articles } = await supabase
    .from("articles")
    .select("author_id, views_count");

  // Get comment counts per user
  const { data: comments } = await supabase.from("comments").select("user_id");

  // Calculate stats per user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const articlesByAuthor: Record<string, { count: number; views: number }> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (articles || []).forEach((a: any) => {
    if (a.author_id) {
      if (!articlesByAuthor[a.author_id]) {
        articlesByAuthor[a.author_id] = { count: 0, views: 0 };
      }
      articlesByAuthor[a.author_id].count++;
      articlesByAuthor[a.author_id].views += a.views_count || 0;
    }
  });

  const commentsByUser: Record<string, number> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (comments || []).forEach((c: any) => {
    commentsByUser[c.user_id] = (commentsByUser[c.user_id] || 0) + 1;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return profiles.map((profile: any) => ({
    ...profile,
    articles_count: articlesByAuthor[profile.id]?.count || 0,
    total_views: articlesByAuthor[profile.id]?.views || 0,
    comments_count: commentsByUser[profile.id] || 0,
  })) as UserProfile[];
}

// Update user role
export async function updateUserRole(userId: string, newRole: UserRole) {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("profiles")
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Update user status
export async function updateUserStatus(userId: string, newStatus: UserStatus) {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("profiles")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user status:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  data: Partial<UserProfile>
) {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("profiles")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Delete user (soft delete by setting status to banned, or hard delete)
export async function deleteUser(userId: string, hardDelete: boolean = false) {
  const supabase = await createClient();

  if (hardDelete) {
    // This will cascade delete due to FK constraints
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
      console.error("Error deleting user:", error);
      return { success: false, error: error.message };
    }
  } else {
    // Soft delete - just ban the user
    return updateUserStatus(userId, "banned");
  }

  return { success: true };
}
