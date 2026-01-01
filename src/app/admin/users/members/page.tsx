import { getMembersData } from "@/lib/supabase/services/admin-data";
import MembersClient from "./MembersClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MembersPage() {
  const { users, stats } = await getMembersData();

  return <MembersClient initialUsers={users} initialStats={stats} />;
}
