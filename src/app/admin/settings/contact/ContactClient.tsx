"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Save, Loader2, Check } from "lucide-react";

interface ContactClientProps {
  initialSettings: {
    email: string;
    phone: string;
    address: string;
    email_editorial: string;
    email_complaints: string;
  };
}

export default function ContactClient({ initialSettings }: ContactClientProps) {
  const [settings, setSettings] = useState({
    ...initialSettings,
    operationalHours: "Senin - Jumat: 08:00 - 17:00 WIB",
    whatsapp: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          email: settings.email,
          phone: settings.phone,
          address: settings.address,
          email_editorial: settings.email_editorial,
          email_complaints: settings.email_complaints,
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
          <h1 className="text-3xl font-bold">Kontak</h1>
          <p className="text-muted-foreground">
            Kelola informasi kontak yang ditampilkan di website
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Utama</Label>
              <Input
                id="email"
                type="email"
                placeholder="redaksi@example.com"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Email utama untuk dihubungi pembaca dan mitra
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email_editorial">Email Redaksi</Label>
              <Input
                id="email_editorial"
                type="email"
                placeholder="redaksi@example.com"
                value={settings.email_editorial}
                onChange={(e) =>
                  setSettings({ ...settings, email_editorial: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email_complaints">Email Pengaduan</Label>
              <Input
                id="email_complaints"
                type="email"
                placeholder="pengaduan@example.com"
                value={settings.email_complaints}
                onChange={(e) =>
                  setSettings({ ...settings, email_complaints: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Phone */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Telepon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                placeholder="+62 21 1234 5678"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                placeholder="+62 812 3456 7890"
                value={settings.whatsapp}
                onChange={(e) =>
                  setSettings({ ...settings, whatsapp: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Opsional. Untuk fitur &quot;Hubungi via WhatsApp&quot;
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Alamat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Textarea
                id="address"
                placeholder="Jl. Contoh No. 123, Jakarta"
                value={settings.address}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Operational Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Jam Operasional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Jam Operasional</Label>
              <Input
                id="hours"
                placeholder="Senin - Jumat: 08:00 - 17:00 WIB"
                value={settings.operationalHours}
                onChange={(e) =>
                  setSettings({ ...settings, operationalHours: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Ditampilkan di halaman kontak
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview di Halaman Kontak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-lg bg-muted">
              <Mail className="h-5 w-5 text-primary mb-2" />
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">
                {settings.email || "-"}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <Phone className="h-5 w-5 text-primary mb-2" />
              <p className="text-sm font-medium">Telepon</p>
              <p className="text-sm text-muted-foreground">
                {settings.phone || "-"}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <MapPin className="h-5 w-5 text-primary mb-2" />
              <p className="text-sm font-medium">Alamat</p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {settings.address || "-"}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <Clock className="h-5 w-5 text-primary mb-2" />
              <p className="text-sm font-medium">Jam Operasional</p>
              <p className="text-sm text-muted-foreground">
                {settings.operationalHours || "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
