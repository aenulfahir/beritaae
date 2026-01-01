// TypeScript types for the News Portal
// These types are designed to work with both mock data and Supabase

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Author {
  id?: string;
  name: string;
  avatar: string;
  email?: string;
  bio?: string | null;
  role?: "member" | "author" | "editor" | "admin";
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: Category;
  category_id?: string;
  author: Author;
  author_id?: string;
  status?: "draft" | "published" | "archived";
  is_breaking: boolean;
  is_featured: boolean;
  views_count: number;
  read_time: string;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  parent_id?: string | null;
  content: string;
  likes_count: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  author?: Author;
  replies?: Comment[];
  is_liked?: boolean;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "member" | "author" | "editor" | "admin";
  bio: string | null;
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
}
