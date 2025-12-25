"use client";

import { useState } from "react";
import { siteSettings as initialSettings } from "@/data/admin-mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Palette, Upload, Image as ImageIcon, Save, Eye, Trash2 } from "lucide-react";
import Link from "next/link";

export default function BrandingSettingsPage() {
    const [settings, setSettings] = useState({
        brandName: initialSettings.brandName,
        tagline: initialSettings.tagline,
        logoUrl: initialSettings.logoUrl || "",
        faviconUrl: initialSettings.faviconUrl || "",
    });

    const handleSave = () => {
        console.log("Saving branding settings:", settings);
        alert("Pengaturan branding berhasil disimpan! (Demo)");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Branding</h1>
                    <p className="text-muted-foreground">
                        Kelola identitas visual portal berita Anda
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/" target="_blank">
                        <Button variant="outline" className="gap-2">
                            <Eye className="h-4 w-4" />
                            Preview
                        </Button>
                    </Link>
                    <Button className="gap-2" onClick={handleSave}>
                        <Save className="h-4 w-4" />
                        Simpan
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Brand Identity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Identitas Brand
                        </CardTitle>
                        <CardDescription>
                            Nama dan tagline yang mewakili portal berita Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="brandName">Nama Brand *</Label>
                            <Input
                                id="brandName"
                                value={settings.brandName}
                                onChange={(e) =>
                                    setSettings({ ...settings, brandName: e.target.value })
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                Nama ini akan ditampilkan di header dan footer website
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tagline">Tagline</Label>
                            <Textarea
                                id="tagline"
                                value={settings.tagline}
                                onChange={(e) =>
                                    setSettings({ ...settings, tagline: e.target.value })
                                }
                                rows={3}
                            />
                            <p className="text-xs text-muted-foreground">
                                Deskripsi singkat tentang portal berita Anda
                            </p>
                        </div>

                        {/* Preview */}
                        <div className="mt-6 p-4 rounded-lg bg-muted">
                            <p className="text-xs text-muted-foreground mb-2">Preview Header:</p>
                            <div className="flex items-center gap-1">
                                <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                    {settings.brandName.slice(0, -2) || "BERITA"}
                                </span>
                                <span className="text-xl font-black tracking-tighter">
                                    {settings.brandName.slice(-2) || "AE"}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Logo */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Logo
                        </CardTitle>
                        <CardDescription>
                            Upload logo untuk header website. Gunakan format PNG dengan latar transparan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="logoUrl">URL Logo</Label>
                            <Input
                                id="logoUrl"
                                placeholder="https://example.com/logo.png"
                                value={settings.logoUrl}
                                onChange={(e) =>
                                    setSettings({ ...settings, logoUrl: e.target.value })
                                }
                            />
                        </div>

                        {settings.logoUrl ? (
                            <div className="relative">
                                <div className="p-8 rounded-lg border bg-muted/50 flex items-center justify-center">
                                    <img
                                        src={settings.logoUrl}
                                        alt="Logo Preview"
                                        className="max-h-20 object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                "https://via.placeholder.com/200x80?text=Invalid+Image";
                                        }}
                                    />
                                </div>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8"
                                    onClick={() => setSettings({ ...settings, logoUrl: "" })}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="p-8 rounded-lg border-2 border-dashed bg-muted/50 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                <Upload className="h-8 w-8" />
                                <p className="text-sm">Masukkan URL logo di atas</p>
                                <p className="text-xs">Atau upload ke media library terlebih dahulu</p>
                            </div>
                        )}

                        <p className="text-xs text-muted-foreground">
                            Ukuran yang disarankan: 200x50 piksel, format PNG
                        </p>
                    </CardContent>
                </Card>

                {/* Favicon */}
                <Card>
                    <CardHeader>
                        <CardTitle>Favicon</CardTitle>
                        <CardDescription>
                            Ikon kecil yang muncul di tab browser
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="faviconUrl">URL Favicon</Label>
                            <Input
                                id="faviconUrl"
                                placeholder="https://example.com/favicon.ico"
                                value={settings.faviconUrl}
                                onChange={(e) =>
                                    setSettings({ ...settings, faviconUrl: e.target.value })
                                }
                            />
                        </div>

                        {settings.faviconUrl ? (
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-lg border bg-muted/50">
                                    <img
                                        src={settings.faviconUrl}
                                        alt="Favicon Preview"
                                        className="h-8 w-8 object-contain"
                                    />
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-muted">
                                        <img
                                            src={settings.faviconUrl}
                                            alt=""
                                            className="h-4 w-4"
                                        />
                                        <span>{settings.brandName}</span>
                                    </div>
                                    <span>← Preview di tab browser</span>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 rounded-lg border-2 border-dashed bg-muted/50 flex items-center justify-center gap-2 text-muted-foreground">
                                <ImageIcon className="h-5 w-5" />
                                <p className="text-sm">Belum ada favicon</p>
                            </div>
                        )}

                        <p className="text-xs text-muted-foreground">
                            Ukuran yang disarankan: 32x32 atau 64x64 piksel, format ICO atau PNG
                        </p>
                    </CardContent>
                </Card>

                {/* Color Theme */}
                <Card>
                    <CardHeader>
                        <CardTitle>Warna Tema</CardTitle>
                        <CardDescription>
                            Pengaturan warna tema akan tersedia di versi berikutnya
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="p-8 rounded-lg border-2 border-dashed bg-muted/50 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <Palette className="h-8 w-8" />
                            <p className="text-sm">Coming Soon</p>
                            <p className="text-xs">Fitur ini sedang dalam pengembangan</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
