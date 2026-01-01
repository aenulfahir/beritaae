import { getAdminCategoriesData } from "@/lib/supabase/services/admin-data";
import { CategoriesClient } from "./CategoriesClient";

export default async function CategoriesPage() {
  const { categories, totalArticles } = await getAdminCategoriesData();

  return (
    <CategoriesClient
      initialCategories={categories}
      totalArticles={totalArticles}
    />
  );
}
