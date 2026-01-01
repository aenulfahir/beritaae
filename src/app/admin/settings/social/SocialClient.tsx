"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Save,
  ExternalLink,
  Loader2,
  Check,
} from "lucide-react";

const socialPlatforms = [
  {
    id: "facebook_url",
    name: "Facebook",
    icon: Facebook,
    placeholder: "https://facebook.com/beritaae",
    color: "#1877F2",
  },
  {
    id: "twitter_url",
    name: "Twitter / X",
    icon: Twitter,
    placeholder: "https://twitter.com/beritaae",
    color: "#1DA1F2",
  },
  {
    id: "instagram_url",
    name: "Instagram",
    icon: Instagram,
    placeholder: "https://instagram.com/beritaae",
    color: "#E4405F",
  },
  {
    id: "youtube_url",
    name: "YouTube",
    icon: Youtube,
    placeholder: "https://youtube.com/@beritaae",
    color: "#FF0000",
  },
];

interface SocialClientProps {
  initialSettings: {
    facebook_url: string;
    twitter_url: string;
    instagram_url: string;
    youtube_url: string;
    linkedin_url: string;
    tiktok_url: string;
  };
}

export default function SocialClient({ initialSettings }: SocialClientProps) {
  const [links, setLinks] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (platform: string, value: string) => {
    setLinks({ ...links, [platform]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "social",
          ...links,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Gagal menyimpan pengaturan");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Social Media</h1>
          <p className="text-muted-foreground">
            Kelola link akun social media portal berita
          </p>
        </div>
        <Button className="gap-2" onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saved ? "Tersimpan" : "Simpan"}
        </Button>
      </div>

      {/* Social Links */}
      <div className="grid gap-4 md:grid-cols-2">
        {socialPlatforms.map((platform) => {
          const Icon = platform.icon;
          const value = links[platform.id as keyof typeof links] || "";

          return (
            <Card key={platform.id}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-5 w-5" style={{ color: platform.color }} />
                  {platform.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder={platform.placeholder}
                    value={value}
                    onChange={(e) => handleChange(platform.id, e.target.value)}
                    className="flex-1"
                  />
                  {value && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      title={`Buka ${platform.name}`}
                      onClick={() => window.open(value, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {value && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Terhubung
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* TikTok */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
            TikTok
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="https://tiktok.com/@beritaae"
              value={links.tiktok_url || ""}
              onChange={(e) => handleChange("tiktok_url", e.target.value)}
              className="flex-1"
            />
            {links.tiktok_url && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                title="Buka TikTok"
                onClick={() => window.open(links.tiktok_url, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* LinkedIn */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="https://linkedin.com/company/beritaae"
              value={links.linkedin_url || ""}
              onChange={(e) => handleChange("linkedin_url", e.target.value)}
              className="flex-1"
            />
            {links.linkedin_url && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                title="Buka LinkedIn"
                onClick={() => window.open(links.linkedin_url, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Preview di Footer
          </CardTitle>
          <CardDescription>
            Ikon social media yang akan ditampilkan di footer website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              const value = links[platform.id as keyof typeof links];
              return (
                <button
                  key={platform.id}
                  type="button"
                  title={platform.name}
                  className={`p-2 rounded-lg transition-colors ${
                    value
                      ? "bg-background hover:bg-primary/10"
                      : "opacity-30 cursor-not-allowed"
                  }`}
                  disabled={!value}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: value ? platform.color : undefined }}
                  />
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Platform tanpa link akan disembunyikan di footer
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
