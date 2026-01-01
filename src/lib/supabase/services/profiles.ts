import { createClient } from "../client";
import { Profile } from "@/types";

function getSupabase() {
  return createClient();
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

export async function getProfiles(): Promise<Profile[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }

  return data || [];
}

export async function getProfilesByRole(
  role: "member" | "author" | "editor" | "admin"
): Promise<Profile[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", role)
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Error fetching profiles by role:", error);
    return [];
  }

  return data || [];
}

export async function updateProfile(
  userId: string,
  data: Partial<{
    full_name: string;
    avatar_url: string;
    bio: string;
    social_links: Record<string, string>;
  }>
): Promise<{ data: Profile | null; error: Error | null }> {
  const supabase = getSupabase();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error } = await (supabase as any)
      .from("profiles")
      .update(data)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error.message || error);
      return { data: null, error: new Error(error.message || "Update failed") };
    }

    return { data: profile as Profile, error: null };
  } catch (err) {
    console.error("Exception updating profile:", err);
    return { data: null, error: err as Error };
  }
}

// Upload avatar image to Supabase Storage
export async function uploadAvatar(
  userId: string,
  file: Blob,
  fileName: string
): Promise<{ url: string | null; error: Error | null }> {
  const supabase = getSupabase();

  const fileExt = fileName.split(".").pop() || "jpg";
  const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Error uploading avatar:", uploadError);
    return { url: null, error: uploadError };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  return { url: publicUrl, error: null };
}

// Admin function to update user role
export async function updateUserRole(
  userId: string,
  role: "member" | "author" | "editor" | "admin"
): Promise<Profile | null> {
  const supabase = getSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile, error } = await (supabase as any)
    .from("profiles")
    .update({ role })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user role:", error);
    return null;
  }

  return profile;
}

export async function getAuthors(): Promise<Profile[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .in("role", ["author", "editor", "admin"])
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Error fetching authors:", error);
    return [];
  }

  return data || [];
}
