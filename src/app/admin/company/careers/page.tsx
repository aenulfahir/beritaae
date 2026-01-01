import { getCompanyCareersData } from "@/lib/supabase/services/admin-data";
import CareersClient from "./CareersClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CompanyCareersPage() {
  const { jobs, settings, stats } = await getCompanyCareersData();

  return (
    <CareersClient
      initialJobs={jobs}
      initialSettings={settings}
      initialStats={stats}
    />
  );
}
