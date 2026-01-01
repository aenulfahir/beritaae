import { getAdminPopularData } from "@/lib/supabase/services/admin-data";
import { PopularClient } from "./PopularClient";

interface PopularPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function PopularPage({ searchParams }: PopularPageProps) {
  const params = await searchParams;
  const period = params.period || "all";
  const { popular, categories } = await getAdminPopularData(period);

  return (
    <PopularClient
      initialPopular={popular}
      initialCategories={categories}
      initialPeriod={period}
    />
  );
}
