"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Save,
  CheckCircle,
  Upload,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Calendar,
} from "lucide-react";

interface CompanyProfile {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  vision?: string;
  mission?: string;
  history?: string;
  founded_year?: number;
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
}

interface AboutClientProps {
  initialProfile: CompanyProfile | null;
}

async function updateProfile(id: string, data: Partial<CompanyProfile>) {
  const res = await fetch("/api/admin/company", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table: "company_profile", id, data }),
  });
  return res.json();
}

export default function AboutClient({ initialProfile }: AboutClientProps) {
  const [profile, setProfile] = useState<CompanyProfile | null>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (
    field: keyof CompanyProfile,
    value: string | number
  ) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    const result = await updateProfile(profile.id, profile);

    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      alert("Gagal menyimpan: " + result.error);
    }

    setSaving(false);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Data profil tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Tentang Perusahaan
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola informasi profil perusahaan
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Tersimpan
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </>
          )}
        </Button>
      </div>

      {/* Company Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profil Perusahaan</CardTitle>
          <CardDescription>Informasi dasar tentang perusahaan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nama Perusahaan</Label>
              <Input
                value={profile.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tahun Didirikan</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={profile.founded_year || ""}
                  onChange={(e) =>
                    handleChange("founded_year", parseInt(e.target.value))
                  }
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input
              value={profile.tagline || ""}
              onChange={(e) => handleChange("tagline", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Deskripsi Singkat</Label>
            <Textarea
              value={profile.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Logo & Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Logo & Branding</CardTitle>
          <CardDescription>
            Upload logo dan aset visual perusahaan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Logo Utama</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <div className="h-16 w-16 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  {profile.logo_url ? (
                    <img
                      src={profile.logo_url}
                      alt="Logo"
                      className="h-12 w-12 object-contain"
                    />
                  ) : (
                    <Building2 className="h-8 w-8 text-primary" />
                  )}
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, SVG • Max 2MB
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Favicon</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <div className="h-12 w-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Favicon
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  ICO, PNG • 32x32px
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tentang Kami</CardTitle>
          <CardDescription>Konten lengkap halaman About</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Visi</Label>
            <Textarea
              value={profile.vision || ""}
              onChange={(e) => handleChange("vision", e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Misi</Label>
            <Textarea
              value={profile.mission || ""}
              onChange={(e) => handleChange("mission", e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>Sejarah Perusahaan</Label>
            <Textarea
              value={profile.history || ""}
              onChange={(e) => handleChange("history", e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informasi Kontak</CardTitle>
          <CardDescription>Alamat dan kontak perusahaan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Alamat Kantor
            </Label>
            <Textarea
              value={profile.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              rows={4}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telepon
              </Label>
              <Input
                value={profile.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Umum
              </Label>
              <Input
                value={profile.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Email Redaksi</Label>
              <Input
                value={profile.email_editorial || ""}
                onChange={(e) =>
                  handleChange("email_editorial", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email Pengaduan</Label>
              <Input
                value={profile.email_complaints || ""}
                onChange={(e) =>
                  handleChange("email_complaints", e.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Media Sosial</CardTitle>
          <CardDescription>Link akun media sosial resmi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Label>
              <Input
                value={profile.facebook_url || ""}
                onChange={(e) => handleChange("facebook_url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter/X
              </Label>
              <Input
                value={profile.twitter_url || ""}
                onChange={(e) => handleChange("twitter_url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-pink-600" />
                Instagram
              </Label>
              <Input
                value={profile.instagram_url || ""}
                onChange={(e) => handleChange("instagram_url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Youtube className="h-4 w-4 text-red-600" />
                YouTube
              </Label>
              <Input
                value={profile.youtube_url || ""}
                onChange={(e) => handleChange("youtube_url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-blue-700" />
                LinkedIn
              </Label>
              <Input
                value={profile.linkedin_url || ""}
                onChange={(e) => handleChange("linkedin_url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                TikTok
              </Label>
              <Input
                value={profile.tiktok_url || ""}
                onChange={(e) => handleChange("tiktok_url", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
