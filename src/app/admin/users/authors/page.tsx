import { getAuthorsData } from "@/lib/supabase/services/admin-data";
import AuthorsClient from "./AuthorsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AuthorsPage() {
  const { users, stats } = await getAuthorsData();

  return <AuthorsClient initialUsers={users} initialStats={stats} />;
}
