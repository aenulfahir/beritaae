import { getCompanyTeamData } from "@/lib/supabase/services/admin-data";
import TeamClient from "./TeamClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CompanyTeamPage() {
  const { members, departments, stats } = await getCompanyTeamData();

  return (
    <TeamClient
      initialMembers={members}
      initialDepartments={departments}
      initialStats={stats}
    />
  );
}
