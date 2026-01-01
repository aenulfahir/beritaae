export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole =
  | "superadmin"
  | "admin"
  | "moderator"
  | "editor"
  | "author"
  | "member";
export type UserStatus = "active" | "inactive" | "banned";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          status: UserStatus;
          bio: string | null;
          phone: string | null;
          social_links: Json;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          status?: UserStatus;
          bio?: string | null;
          phone?: string | null;
          social_links?: Json;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          status?: UserStatus;
          bio?: string | null;
          phone?: string | null;
          social_links?: Json;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          color: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          color?: string;
          description?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          color?: string;
          description?: string | null;
        };
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          image_url: string | null;
          category_id: string | null;
          author_id: string | null;
          status: "draft" | "published" | "archived";
          is_breaking: boolean;
          is_featured: boolean;
          views_count: number;
          read_time: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string | null;
          image_url?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          status?: "draft" | "published" | "archived";
          is_breaking?: boolean;
          is_featured?: boolean;
          views_count?: number;
          read_time?: string | null;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string | null;
          image_url?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          status?: "draft" | "published" | "archived";
          is_breaking?: boolean;
          is_featured?: boolean;
          views_count?: number;
          read_time?: string | null;
          published_at?: string | null;
        };
      };
      comments: {
        Row: {
          id: string;
          article_id: string;
          user_id: string;
          parent_id: string | null;
          content: string;
          likes_count: number;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          user_id: string;
          parent_id?: string | null;
          content: string;
          likes_count?: number;
          is_approved?: boolean;
        };
        Update: {
          id?: string;
          article_id?: string;
          user_id?: string;
          parent_id?: string | null;
          content?: string;
          likes_count?: number;
          is_approved?: boolean;
        };
      };
      comment_likes: {
        Row: {
          comment_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          comment_id: string;
          user_id: string;
        };
        Update: {
          comment_id?: string;
          user_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_view_count: {
        Args: { article_id: string };
        Returns: void;
      };
      toggle_comment_like: {
        Args: { p_comment_id: string; p_user_id: string };
        Returns: boolean;
      };
      generate_slug: {
        Args: { title: string };
        Returns: string;
      };
      get_user_role: {
        Args: { user_id: string };
        Returns: UserRole;
      };
      is_admin_user: {
        Args: { user_id: string };
        Returns: boolean;
      };
      can_manage_users: {
        Args: { user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      article_status: "draft" | "published" | "archived";
    };
  };
};

// Helper types for easier usage
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Profile = Tables<"profiles">;
export type Category = Tables<"categories">;
export type Article = Tables<"articles">;
export type Comment = Tables<"comments">;
export type CommentLike = Tables<"comment_likes">;
