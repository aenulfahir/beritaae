import { getCompanyAboutData } from "@/lib/supabase/services/admin-data";
import AboutClient from "./AboutClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CompanyAboutPage() {
  const { profile } = await getCompanyAboutData();

  return <AboutClient initialProfile={profile} />;
}
