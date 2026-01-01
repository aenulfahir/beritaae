import { getCompanyAdsData } from "@/lib/supabase/services/admin-data";
import AdsClient from "./AdsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CompanyAdsPage() {
  const { placements, settings, stats } = await getCompanyAdsData();

  return (
    <AdsClient
      initialPlacements={placements}
      initialSettings={settings}
      initialStats={stats}
    />
  );
}
