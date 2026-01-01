import { getSiteSettings } from "@/lib/supabase/services/settings";
import SocialClient from "./SocialClient";

export default async function SocialSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <SocialClient
      initialSettings={{
        facebook_url: settings?.facebook_url || "",
        twitter_url: settings?.twitter_url || "",
        instagram_url: settings?.instagram_url || "",
        youtube_url: settings?.youtube_url || "",
        linkedin_url: settings?.linkedin_url || "",
        tiktok_url: settings?.tiktok_url || "",
      }}
    />
  );
}
