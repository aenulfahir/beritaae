// TypeScript types for the News Portal

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: Category;
  author: {
    name: string;
    avatar: string;
  };
  is_breaking: boolean;
  is_featured: boolean;
  views_count: number;
  read_time: string;
  created_at: string;
  updated_at: string;
}
