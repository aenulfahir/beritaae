import { getSiteSettings } from "@/lib/supabase/services/settings";
import ContactClient from "./ContactClient";

export default async function ContactSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <ContactClient
      initialSettings={{
        email: settings?.email || "",
        phone: settings?.phone || "",
        address: settings?.address || "",
        email_editorial: settings?.email_editorial || "",
        email_complaints: settings?.email_complaints || "",
      }}
    />
  );
}
