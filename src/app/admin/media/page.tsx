import { getAdminMediaData } from "@/lib/supabase/services/admin-data";
import { MediaClient } from "./MediaClient";

export default async function MediaPage() {
  const { media } = await getAdminMediaData();

  return <MediaClient initialMedia={media} />;
}
