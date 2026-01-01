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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Megaphone,
  Plus,
  Save,
  CheckCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  DollarSign,
  Eye,
  LayoutGrid,
  Monitor,
  Smartphone,
  RectangleHorizontal,
  Square,
  Mail,
  Phone,
} from "lucide-react";

interface AdPlacement {
  id: string;
  name: string;
  position: string;
  size?: string;
  price_monthly: number;
  price_weekly: number;
  price_daily?: number;
  description?: string;
  impressions: number;
  clicks: number;
  is_active: boolean;
  display_order: number;
}

interface AdSettings {
  id: string;
  page_title: string;
  page_description?: string;
  contact_email?: string;
  whatsapp?: string;
}

interface AdsStats {
  total: number;
  active: number;
  totalImpressions: number;
  totalClicks: number;
}

interface AdsClientProps {
  initialPlacements: AdPlacement[];
  initialSettings: AdSettings | null;
  initialStats: AdsStats;
}

const adSizes = [
  "970x250 (Leaderboard)",
  "728x90 (Banner)",
  "300x250 (Medium Rectangle)",
  "336x280 (Large Rectangle)",
  "320x50 (Mobile Banner)",
  "300x600 (Half Page)",
  "600x400 (Interstitial)",
];

const positions = [
  "Homepage - Top",
  "Homepage - Middle",
  "Homepage - Bottom",
  "Sidebar - All Pages",
  "Within Article Content",
  "Article - Bottom",
  "Mobile - Bottom Sticky",
  "Popup - Entry/Exit",
];

async function createPlacement(data: Partial<AdPlacement>) {
  const res = await fetch("/api/admin/company", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table: "ad_placements", data }),
  });
  return res.json();
}

async function updatePlacement(id: string, data: Partial<AdPlacement>) {
  const res = await fetch("/api/admin/company", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table: "ad_placements", id, data }),
  });
  return res.json();
}

async function deletePlacement(id: string) {
  const res = await fetch(`/api/admin/company?table=ad_placements&id=${id}`, {
    method: "DELETE",
  });
  return res.json();
}

async function updateSettings(id: string, data: Partial<AdSettings>) {
  const res = await fetch("/api/admin/company", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table: "ad_settings", id, data }),
  });
  return res.json();
}

export default function AdsClient({
  initialPlacements,
  initialSettings,
  initialStats,
}: AdsClientProps) {
  const [placements, setPlacements] = useState(initialPlacements);
  const [settings, setSettings] = useState(initialSettings);
  const [stats, setStats] = useState(initialStats);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState<AdPlacement | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    size: "",
    price_monthly: 0,
    price_weekly: 0,
    description: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      size: "",
      price_monthly: 0,
      price_weekly: 0,
      description: "",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.position) return;
    setSaving(true);

    const result = await createPlacement({
      ...formData,
      is_active: true,
      impressions: 0,
      clicks: 0,
      display_order: placements.length + 1,
    });

    if (result.success && result.data) {
      setPlacements([...placements, result.data]);
      setStats({ ...stats, total: stats.total + 1, active: stats.active + 1 });
      setIsAddDialogOpen(false);
      resetForm();
    } else {
      alert("Gagal menambah paket: " + result.error);
    }

    setSaving(false);
  };

  const handleEdit = (placement: AdPlacement) => {
    setEditingPlacement(placement);
    setFormData({
      name: placement.name,
      position: placement.position,
      size: placement.size || "",
      price_monthly: placement.price_monthly,
      price_weekly: placement.price_weekly,
      description: placement.description || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingPlacement) return;
    setSaving(true);

    const result = await updatePlacement(editingPlacement.id, formData);

    if (result.success) {
      setPlacements(
        placements.map((p) =>
          p.id === editingPlacement.id ? { ...p, ...formData } : p
        )
      );
      setEditingPlacement(null);
      resetForm();
    } else {
      alert("Gagal mengupdate paket: " + result.error);
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus paket ini?")) return;

    const result = await deletePlacement(id);

    if (result.success) {
      const deletedPlacement = placements.find((p) => p.id === id);
      setPlacements(placements.filter((p) => p.id !== id));
      setStats({
        ...stats,
        total: stats.total - 1,
        active: deletedPlacement?.is_active ? stats.active - 1 : stats.active,
        totalImpressions:
          stats.totalImpressions - (deletedPlacement?.impressions || 0),
        totalClicks: stats.totalClicks - (deletedPlacement?.clicks || 0),
      });
    } else {
      alert("Gagal menghapus paket: " + result.error);
    }
  };

  const handleToggleActive = async (placement: AdPlacement) => {
    const result = await updatePlacement(placement.id, {
      is_active: !placement.is_active,
    });

    if (result.success) {
      setPlacements(
        placements.map((p) =>
          p.id === placement.id ? { ...p, is_active: !p.is_active } : p
        )
      );
      setStats({
        ...stats,
        active: placement.is_active ? stats.active - 1 : stats.active + 1,
      });
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);

    const result = await updateSettings(settings.id, settings);

    if (result.success) {
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
    } else {
      alert("Gagal menyimpan pengaturan: " + result.error);
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="h-6 w-6" />
            Iklan
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola paket iklan dan halaman pasang iklan
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Tambah Paket
        </Button>
      </div>

      {/* Ads Page Settings */}
      {settings && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Pengaturan Halaman Pasang Iklan
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveSettings}
                disabled={saving}
                className="gap-2"
              >
                {settingsSaved ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {settingsSaved ? "Tersimpan" : "Simpan"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Judul Halaman</Label>
              <Input
                value={settings.page_title || ""}
                onChange={(e) =>
                  setSettings({ ...settings, page_title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={settings.page_description || ""}
                onChange={(e) =>
                  setSettings({ ...settings, page_description: e.target.value })
                }
                rows={2}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Kontak
                </Label>
                <Input
                  value={settings.contact_email || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, contact_email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </Label>
                <Input
                  value={settings.whatsapp || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, whatsapp: e.target.value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <LayoutGrid className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Paket</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Aktif</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Eye className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {(stats.totalImpressions / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-muted-foreground">Impressions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <DollarSign className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {stats.totalClicks.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Clicks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ad Placements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Paket Iklan</CardTitle>
          <CardDescription>Daftar paket iklan yang tersedia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {placements.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Belum ada paket iklan. Klik "Tambah Paket" untuk menambahkan.
              </p>
            ) : (
              placements.map((placement) => (
                <div
                  key={placement.id}
                  className={`p-4 rounded-lg border transition-all ${
                    !placement.is_active && "opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-16 rounded bg-muted flex items-center justify-center shrink-0">
                        {placement.position.includes("Mobile") ? (
                          <Smartphone className="h-6 w-6 text-muted-foreground" />
                        ) : placement.size?.includes("Rectangle") ? (
                          <Square className="h-6 w-6 text-muted-foreground" />
                        ) : (
                          <RectangleHorizontal className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{placement.name}</h3>
                          <Badge
                            variant={
                              placement.is_active ? "default" : "outline"
                            }
                          >
                            {placement.is_active ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {placement.position} • {placement.size}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="font-medium text-primary">
                            {formatPrice(placement.price_monthly)}
                            <span className="text-xs text-muted-foreground">
                              /bulan
                            </span>
                          </span>
                          <span className="text-muted-foreground">
                            {formatPrice(placement.price_weekly)}
                            <span className="text-xs">/minggu</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {placement.impressions.toLocaleString()} impressions
                          </span>
                          <span>
                            {placement.clicks.toLocaleString()} clicks
                            {placement.impressions > 0 &&
                              ` (CTR: ${(
                                (placement.clicks / placement.impressions) *
                                100
                              ).toFixed(2)}%)`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={placement.is_active}
                        onCheckedChange={() => handleToggleActive(placement)}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(placement)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(placement.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAddDialogOpen || !!editingPlacement}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingPlacement(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPlacement ? "Edit Paket Iklan" : "Tambah Paket Iklan"}
            </DialogTitle>
            <DialogDescription>
              {editingPlacement
                ? "Edit informasi paket iklan"
                : "Buat paket iklan baru untuk pengiklan"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Paket *</Label>
              <Input
                placeholder="Contoh: Homepage Banner"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Posisi *</Label>
              <Select
                value={formData.position}
                onValueChange={(v) => setFormData({ ...formData, position: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih posisi" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ukuran Banner</Label>
              <Select
                value={formData.size}
                onValueChange={(v) => setFormData({ ...formData, size: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih ukuran" />
                </SelectTrigger>
                <SelectContent>
                  {adSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Harga/Bulan (Rp)</Label>
                <Input
                  type="number"
                  placeholder="5000000"
                  value={formData.price_monthly || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_monthly: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Harga/Minggu (Rp)</Label>
                <Input
                  type="number"
                  placeholder="1500000"
                  value={formData.price_weekly || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_weekly: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                placeholder="Deskripsi paket iklan..."
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setEditingPlacement(null);
                resetForm();
              }}
            >
              Batal
            </Button>
            <Button
              onClick={editingPlacement ? handleUpdate : handleAdd}
              disabled={saving}
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
