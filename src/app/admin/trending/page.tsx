import { getAdminTrendingData } from "@/lib/supabase/services/admin-data";
import { TrendingClient } from "./TrendingClient";

interface TrendingPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function TrendingPage({
  searchParams,
}: TrendingPageProps) {
  const params = await searchParams;
  const period = params.period || "week";
  const { trending, categories } = await getAdminTrendingData(period);

  return (
    <TrendingClient
      initialTrending={trending}
      initialCategories={categories}
      initialPeriod={period}
    />
  );
}
