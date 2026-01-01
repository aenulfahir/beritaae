import { getAdminArticlesData } from "@/lib/supabase/services/admin-data";
import { ArticlesClient } from "./ArticlesClient";

export default async function ArticlesPage() {
  const { articles, categories } = await getAdminArticlesData();

  return <ArticlesClient initialArticles={articles} categories={categories} />;
}
