import { getAdminUsersData } from "@/lib/supabase/services/admin-data";
import AdminsClient from "./AdminsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminsPage() {
  const { users, stats } = await getAdminUsersData();

  return <AdminsClient initialUsers={users} initialStats={stats} />;
}
