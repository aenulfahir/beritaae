"use client";

import { useState } from "react";
import { siteSettings as initialSettings } from "@/data/admin-mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Share2, Facebook, Twitter, Instagram, Youtube, Save, ExternalLink } from "lucide-react";

const socialPlatforms = [
    { id: "facebook", name: "Facebook", icon: Facebook, placeholder: "https://facebook.com/beritaae", color: "#1877F2" },
    { id: "twitter", name: "Twitter / X", icon: Twitter, placeholder: "https://twitter.com/beritaae", color: "#1DA1F2" },
    { id: "instagram", name: "Instagram", icon: Instagram, placeholder: "https://instagram.com/beritaae", color: "#E4405F" },
    { id: "youtube", name: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@beritaae", color: "#FF0000" },
];

export default function SocialSettingsPage() {
    const [links, setLinks] = useState(initialSettings.socialLinks);

    const handleChange = (platform: string, value: string) => {
        setLinks({ ...links, [platform]: value });
    };

    const handleSave = () => {
        console.log("Saving social links:", links);
        alert("Link social media berhasil disimpan! (Demo)");
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
                <Button className="gap-2" onClick={handleSave}>
                    <Save className="h-4 w-4" />
                    Simpan
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
                                            variant="outline"
                                            size="icon"
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
                            value={links.tiktok || ""}
                            onChange={(e) => handleChange("tiktok", e.target.value)}
                            className="flex-1"
                        />
                        {links.tiktok && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => window.open(links.tiktok, "_blank")}
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
                                    className={`p-2 rounded-lg transition-colors ${value
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
