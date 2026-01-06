"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  MousePointer,
  TrendingUp,
  Calendar,
  ExternalLink,
  ImageIcon,
  Loader2,
  X,
  Crop,
} from "lucide-react";
import {
  Ad,
  AdWithStats,
  AdSlotType,
  AD_SLOT_CONFIGS,
  AdCreateInput,
} from "@/types/ads";
import {
  getAllAds,
  createAd,
  updateAd,
  deleteAd,
  toggleAdStatus,
  isAdActive,
} from "@/lib/supabase/services/ads";
import { uploadMediaFile } from "@/lib/supabase/services/media";
import { AdImageCropper } from "@/components/ads";

export default function AdsManagementClient() {
  const [ads, setAds] = useState<AdWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper state
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string>("");
  const [compressedFileSize, setCompressedFileSize] = useState<number | null>(
    null
  );

  // Form state
  const [formData, setFormData] = useState<AdCreateInput>({
    title: "",
    image_url: "",
    target_url: "",
    slot_type: "in_article",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    is_active: true,
  });

  // Load ads
  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    setLoading(true);
    const data = await getAllAds();
    setAds(data);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      image_url: "",
      target_url: "",
      slot_type: "in_article",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      is_active: true,
    });
    setCompressedFileSize(null);
  };

  const handleAdd = async () => {
    if (!formData.title || !formData.image_url || !formData.target_url) return;
    setSaving(true);

    try {
      const result = await createAd({
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      });

      if (result) {
        await loadAds();
        setIsDialogOpen(false);
        resetForm();
      } else {
        alert("Gagal menambah iklan. Periksa console untuk detail error.");
      }
    } catch (error) {
      console.error("Error adding ad:", error);
      alert("Terjadi kesalahan saat menambah iklan");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      image_url: ad.image_url,
      target_url: ad.target_url,
      slot_type: ad.slot_type,
      start_date: new Date(ad.start_date).toISOString().split("T")[0],
      end_date: new Date(ad.end_date).toISOString().split("T")[0],
      is_active: ad.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingAd) return;
    setSaving(true);

    try {
      const result = await updateAd(editingAd.id, {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      });

      if (result) {
        await loadAds();
        setIsDialogOpen(false);
        setEditingAd(null);
        resetForm();
      } else {
        alert("Gagal mengupdate iklan. Periksa console untuk detail error.");
      }
    } catch (error) {
      console.error("Error updating ad:", error);
      alert("Terjadi kesalahan saat mengupdate iklan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus iklan ini?")) return;

    const success = await deleteAd(id);
    if (success) {
      await loadAds();
    } else {
      alert("Gagal menghapus iklan");
    }
  };

  const handleToggleActive = async (ad: Ad) => {
    const result = await toggleAdStatus(ad.id);
    if (result) {
      await loadAds();
    }
  };

  // Handle image upload - opens cropper first
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar yang diperbolehkan");
      return;
    }

    // Validate file size (max 10MB for source image)
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB");
      return;
    }

    // Create object URL for cropper
    const imageUrl = URL.createObjectURL(file);
    setCropImageSrc(imageUrl);
    setIsCropperOpen(true);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle cropped image
  const handleCropComplete = async (croppedBlob: Blob, fileSize: number) => {
    // Close cropper first
    setIsCropperOpen(false);
    setUploading(true);
    setCompressedFileSize(fileSize);

    // Cleanup object URL immediately
    if (cropImageSrc) {
      URL.revokeObjectURL(cropImageSrc);
      setCropImageSrc("");
    }

    try {
      // Create a File from Blob for upload
      const file = new File([croppedBlob], `ad-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      console.log("Starting upload, file size:", file.size);
      const result = await uploadMediaFile(file, "ads");

      if (result) {
        console.log("Upload success:", result.url);
        setFormData((prev) => ({ ...prev, image_url: result.url }));
      } else {
        alert("Gagal mengupload gambar. Periksa console untuk detail.");
        setCompressedFileSize(null);
      }
    } catch (error) {
      console.error("Error uploading cropped image:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengupload gambar";
      alert(errorMessage);
      setCompressedFileSize(null);
    } finally {
      setUploading(false);
    }
  };

  const handleCropperClose = () => {
    setIsCropperOpen(false);
    if (cropImageSrc) {
      URL.revokeObjectURL(cropImageSrc);
      setCropImageSrc("");
    }
  };

  const clearImage = () => {
    setFormData({ ...formData, image_url: "" });
    setCompressedFileSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // Handle slot type change - clear image if already set
  const handleSlotTypeChange = (newSlotType: AdSlotType) => {
    if (formData.image_url && formData.slot_type !== newSlotType) {
      // Ask user if they want to re-crop for new slot
      if (
        confirm(
          "Mengubah slot akan menghapus gambar yang sudah di-crop. Lanjutkan?"
        )
      ) {
        setFormData({ ...formData, slot_type: newSlotType, image_url: "" });
        setCompressedFileSize(null);
      }
    } else {
      setFormData({ ...formData, slot_type: newSlotType });
    }
  };

  const getStatusBadge = (ad: Ad) => {
    if (!ad.is_active) {
      return <Badge variant="outline">Nonaktif</Badge>;
    }
    const now = new Date();
    const startDate = new Date(ad.start_date);
    const endDate = new Date(ad.end_date);

    if (now < startDate) {
      return <Badge variant="secondary">Terjadwal</Badge>;
    }
    if (now > endDate) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    return <Badge className="bg-green-500">Aktif</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate stats
  const stats = {
    total: ads.length,
    active: ads.filter((ad) => isAdActive(ad)).length,
    totalImpressions: ads.reduce((sum, ad) => sum + ad.impressions, 0),
    totalClicks: ads.reduce((sum, ad) => sum + ad.clicks, 0),
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="h-6 w-6" />
            Kelola Iklan
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola banner iklan yang tampil di website
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => {
            setEditingAd(null);
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Tambah Iklan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <ImageIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Iklan</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <TrendingUp className="h-5 w-5 text-green-500" />
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
                {stats.totalImpressions > 1000
                  ? `${(stats.totalImpressions / 1000).toFixed(1)}K`
                  : stats.totalImpressions}
              </p>
              <p className="text-xs text-muted-foreground">Impressions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <MousePointer className="h-5 w-5 text-amber-500" />
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

      {/* Ads List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Iklan</CardTitle>
          <CardDescription>
            Semua iklan banner yang terdaftar di sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ads.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Belum ada iklan. Klik "Tambah Iklan" untuk menambahkan.
              </p>
            ) : (
              ads.map((ad) => (
                <div
                  key={ad.id}
                  className={`p-4 rounded-lg border transition-all ${
                    !ad.is_active && "opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Preview Image */}
                    <div className="relative h-20 w-32 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={ad.image_url}
                        alt={ad.title}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold truncate">{ad.title}</h3>
                        {getStatusBadge(ad)}
                        <Badge variant="outline" className="text-xs">
                          {AD_SLOT_CONFIGS[ad.slot_type]?.label || ad.slot_type}
                        </Badge>
                      </div>

                      <a
                        href={ad.target_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span className="truncate max-w-xs">
                          {ad.target_url}
                        </span>
                      </a>

                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(ad.start_date)} -{" "}
                          {formatDate(ad.end_date)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-purple-500" />
                          {ad.impressions.toLocaleString()} impressions
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointer className="h-3 w-3 text-amber-500" />
                          {ad.clicks.toLocaleString()} clicks
                        </span>
                        <span className="font-medium text-primary">
                          CTR: {ad.ctr}%
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={ad.is_active}
                        onCheckedChange={() => handleToggleActive(ad)}
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
                          <DropdownMenuItem onClick={() => handleEdit(ad)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(ad.id)}
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
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false);
            setEditingAd(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingAd ? "Edit Iklan" : "Tambah Iklan Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingAd ? "Edit informasi iklan" : "Buat iklan banner baru"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Judul Iklan *</Label>
              <Input
                placeholder="Contoh: Tokopedia - Promo Akhir Tahun"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ad-image-upload">Gambar Iklan *</Label>
              <input
                id="ad-image-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Upload gambar iklan"
              />
              {formData.image_url ? (
                <div className="relative">
                  <div className="relative h-32 w-full rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={formData.image_url}
                      alt="Preview"
                      fill
                      sizes="(max-width: 512px) 100vw, 512px"
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {compressedFileSize && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                      {formatFileSize(compressedFileSize)}
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-32 flex flex-col gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Mengupload...
                      </span>
                    </>
                  ) : (
                    <>
                      <Crop className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Klik untuk upload & crop gambar
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Gambar akan di-crop ke ukuran{" "}
                        {AD_SLOT_CONFIGS[formData.slot_type]?.dimensions?.[0]
                          ?.label ||
                          AD_SLOT_CONFIGS[formData.slot_type]?.desktopSize}
                      </span>
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label>URL Target *</Label>
              <Input
                placeholder="https://example.com"
                value={formData.target_url}
                onChange={(e) =>
                  setFormData({ ...formData, target_url: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Slot Iklan *</Label>
              <Select
                value={formData.slot_type}
                onValueChange={(v) => handleSlotTypeChange(v as AdSlotType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih slot" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AD_SLOT_CONFIGS).map((config) => (
                    <SelectItem key={config.type} value={config.type}>
                      <div>
                        <div className="font-medium">{config.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {config.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Ukuran optimal:{" "}
                {AD_SLOT_CONFIGS[formData.slot_type]?.dimensions?.[0]?.label ||
                  AD_SLOT_CONFIGS[formData.slot_type]?.desktopSize}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tanggal Mulai</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Tanggal Selesai</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setEditingAd(null);
                resetForm();
              }}
            >
              Batal
            </Button>
            <Button
              onClick={editingAd ? handleUpdate : handleAdd}
              disabled={
                saving ||
                !formData.title ||
                !formData.image_url ||
                !formData.target_url
              }
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Cropper Dialog */}
      {cropImageSrc && (
        <AdImageCropper
          open={isCropperOpen}
          onClose={handleCropperClose}
          imageSrc={cropImageSrc}
          slotType={formData.slot_type}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
