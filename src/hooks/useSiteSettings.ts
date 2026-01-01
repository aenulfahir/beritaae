"use client";

import { useState, useEffect } from "react";

export interface SiteSettings {
  id: string;
  name: string;
  tagline?: string;
  logo_url?: string;
  favicon_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
  tiktok_url?: string;
}

// Default settings to show immediately
const defaultSettings: SiteSettings = {
  id: "",
  name: "BERITA.AE",
  tagline:
    "Portal berita terdepan dengan informasi terkini, akurat, dan terpercaya untuk Indonesia.",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Fetch settings from API
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setSettings(data);
        }
        setIsLoaded(true);
      })
      .catch(() => {
        setIsLoaded(true);
      });
  }, []);

  return { settings, isLoaded };
}
