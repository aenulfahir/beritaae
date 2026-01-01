import { getAdminBreakingData } from "@/lib/supabase/services/admin-data";
import { BreakingClient } from "./BreakingClient";

export default async function BreakingNewsPage() {
  const { breakingNews, availableArticles } = await getAdminBreakingData();

  return (
    <BreakingClient
      initialBreakingNews={breakingNews}
      initialAvailableArticles={availableArticles}
    />
  );
}
