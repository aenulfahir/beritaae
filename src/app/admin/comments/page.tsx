import { getAdminCommentsData } from "@/lib/supabase/services/admin-data";
import { CommentsClient } from "./CommentsClient";

export default async function CommentsPage() {
  const { comments } = await getAdminCommentsData();

  return <CommentsClient initialComments={comments} />;
}
