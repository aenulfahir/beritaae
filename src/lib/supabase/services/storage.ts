import { createClient } from "../client";

const supabase = createClient();

export async function uploadArticleImage(
  file: File,
  articleId: string
): Promise<string | null> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${articleId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from("article-thumbnails")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading article image:", error);
    return null;
  }

  return getPublicUrl("article-thumbnails", filePath);
}

export async function uploadUserAvatar(
  file: File,
  userId: string
): Promise<string | null> {
  const fileExt = file.name.split(".").pop();
  const fileName = `avatar.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error } = await supabase.storage
    .from("user-avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true, // Allow overwriting existing avatar
    });

  if (error) {
    console.error("Error uploading avatar:", error);
    return null;
  }

  return getPublicUrl("user-avatars", filePath);
}

export async function deleteImage(
  bucket: "article-thumbnails" | "user-avatars",
  path: string
): Promise<boolean> {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error("Error deleting image:", error);
    return false;
  }

  return true;
}

export function getPublicUrl(
  bucket: "article-thumbnails" | "user-avatars",
  path: string
): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function listArticleImages(): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from("article-thumbnails")
    .list();

  if (error) {
    console.error("Error listing article images:", error);
    return [];
  }

  return (data || []).map((file) =>
    getPublicUrl("article-thumbnails", file.name)
  );
}
