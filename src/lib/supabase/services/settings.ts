import { createClient } from "../server";

export interface SiteSettings {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  logo_url?: string;
  favicon_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  email_editorial?: string;
  email_complaints?: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
  tiktok_url?: string;
  vision?: string;
  mission?: string;
  history?: string;
  founded_year?: number;
}

// Get site settings (company profile)
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("company_profile")
      .select("*")
      .single();

    if (error) {
      console.error("Error fetching site settings:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getSiteSettings:", error);
    return null;
  }
}

// Update branding settings
export async function updateBrandingSettings(settings: {
  name?: string;
  tagline?: string;
  logo_url?: string;
  favicon_url?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("company_profile")
      .update({
        name: settings.name,
        tagline: settings.tagline,
        logo_url: settings.logo_url,
        favicon_url: settings.favicon_url,
        updated_at: new Date().toISOString(),
      })
      .not("id", "is", null);

    if (error) {
      console.error("Error updating branding:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updateBrandingSettings:", error);
    return { success: false, error: "Terjadi kesalahan saat menyimpan" };
  }
}

// Update contact settings
export async function updateContactSettings(settings: {
  email?: string;
  phone?: string;
  address?: string;
  email_editorial?: string;
  email_complaints?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("company_profile")
      .update({
        email: settings.email,
        phone: settings.phone,
        address: settings.address,
        email_editorial: settings.email_editorial,
        email_complaints: settings.email_complaints,
        updated_at: new Date().toISOString(),
      })
      .not("id", "is", null);

    if (error) {
      console.error("Error updating contact:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updateContactSettings:", error);
    return { success: false, error: "Terjadi kesalahan saat menyimpan" };
  }
}

// Update social media settings
export async function updateSocialSettings(settings: {
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
  tiktok_url?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("company_profile")
      .update({
        facebook_url: settings.facebook_url,
        twitter_url: settings.twitter_url,
        instagram_url: settings.instagram_url,
        youtube_url: settings.youtube_url,
        linkedin_url: settings.linkedin_url,
        tiktok_url: settings.tiktok_url,
        updated_at: new Date().toISOString(),
      })
      .not("id", "is", null);

    if (error) {
      console.error("Error updating social:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updateSocialSettings:", error);
    return { success: false, error: "Terjadi kesalahan saat menyimpan" };
  }
}
