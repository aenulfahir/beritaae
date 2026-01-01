import { getSiteSettings } from "@/lib/supabase/services/settings";
import BrandingClient from "./BrandingClient";

export default async function BrandingSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <BrandingClient
      initialSettings={{
        name: settings?.name || "BeritaAE",
        tagline: settings?.tagline || "",
        logo_url: settings?.logo_url || "",
        favicon_url: settings?.favicon_url || "",
      }}
    />
  );
}
