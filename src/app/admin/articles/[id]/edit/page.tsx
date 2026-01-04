"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Eye,
  X,
  Zap,
  Star,
  Trash2,
  Loader2,
  ExternalLink,
  Upload,
  ImageIcon,
} from "lucide-react";
import { getCategories } from "@/lib/supabase/services/categories";
import {
  getArticleById,
  updateArticle,
  deleteArticle,
} from "@/lib/supabase/services/articles";
import { createClient } from "@/lib/supabase/client";
import { formatFileSize } from "@/lib/utils/image-compressor";
import { ImageCropper } from "@/components/ui/ImageCropper";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { Category, NewsArticle } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditArticlePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryId: "",
    imageUrl: "",
    isBreaking: false,
    isFeatured: false,
    status: "draft" as "draft" | "published" | "archived",
    readTime: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [articleData, categoriesData] = await Promise.all([
          getArticleById(id),
          getCategories(),
        ]);

        if (articleData) {
          setArticle(articleData);
          setFormData({
            title: articleData.title,
            slug: articleData.slug,
            excerpt: articleData.excerpt || "",
            content: articleData.content || "",
            categoryId: articleData.category_id || "",
            imageUrl: articleData.image_url || "",
            isBreaking: articleData.is_breaking || false,
            isFeatured: articleData.is_featured || false,
            status: articleData.status || "draft",
            readTime: articleData.read_time || "",
          });
        }
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();

    if (!formData.title || !formData.slug) {
      alert("Judul dan slug harus diisi");
      return;
    }

    setIsSaving(true);
    try {
      const updatedArticle = await updateArticle(id, {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        image_url: formData.imageUrl,
        category_id: formData.categoryId || undefined,
        status: publish ? "published" : formData.status,
        is_breaking: formData.isBreaking,
        is_featured: formData.isFeatured,
        read_time: formData.readTime || undefined,
      });

      if (updatedArticle) {
        alert(
          publish
            ? "Artikel berhasil dipublikasikan!"
            : "Artikel berhasil diperbarui!"
        );
        router.push("/admin/articles");
      } else {
        alert("Gagal memperbarui artikel. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      alert("Terjadi kesalahan saat memperbarui artikel");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const success = await deleteArticle(id);
      if (success) {
        alert("Artikel berhasil dihapus!");
        router.push("/admin/articles");
      } else {
        alert("Gagal menghapus artikel. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Terjadi kesalahan saat menghapus artikel");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB");
      return;
    }

    // Create object URL for cropper
    const imageUrl = URL.createObjectURL(file);
    setCropImageSrc(imageUrl);
    setShowCropper(true);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsUploading(true);
    setUploadProgress("Mengunggah ke server...");

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileName = `${timestamp}-${randomStr}.jpg`;

      // Upload to Supabase Storage
      const supabase = createClient();

      setUploadProgress(`Ukuran: ${formatFileSize(croppedBlob.size)}`);

      const { data, error } = await supabase.storage
        .from("media")
        .upload(fileName, croppedBlob, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        if (error.message.includes("Bucket not found")) {
          alert(
            "Bucket 'media' belum dibuat. Silakan buat bucket di Supabase Dashboard > Storage."
          );
        } else {
          alert("Gagal mengunggah gambar: " + error.message);
        }
        return;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(data.path);

      setFormData({ ...formData, imageUrl: publicUrl });
      setUploadProgress("Berhasil!");

      // Clear progress after 2 seconds
      setTimeout(() => setUploadProgress(""), 2000);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(
        "Terjadi kesalahan saat mengunggah gambar: " +
        (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setIsUploading(false);
      // Clean up object URL
      if (cropImageSrc) {
        URL.revokeObjectURL(cropImageSrc);
        setCropImageSrc("");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h1 className="text-2xl font-bold">Artikel Tidak Ditemukan</h1>
        <p className="text-muted-foreground">
          Artikel dengan ID tersebut tidak ditemukan.
        </p>
        <Link href="/admin/articles">
          <Button>Kembali ke Daftar Artikel</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/articles">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Artikel</h1>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {article.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/news/${article.slug}`} target="_blank">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Lihat
            </Button>
          </Link>
          <Button
            className="gap-2"
            onClick={(e) => handleSubmit(e, false)}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Simpan
          </Button>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Dasar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Artikel *</Label>
                  <Input
                    id="title"
                    placeholder="Masukkan judul artikel..."
                    value={formData.title}
                    onChange={handleTitleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug URL</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      /news/
                    </span>
                    <Input
                      id="slug"
                      placeholder="slug-artikel"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Ringkasan</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Tulis ringkasan singkat artikel..."
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>Konten Artikel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Konten</Label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) =>
                      setFormData({ ...formData, content })
                    }
                    placeholder="Tulis konten artikel di sini..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Gambar Utama</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Upload from computer */}
                  <div className="space-y-2">
                    <Label>Upload Gambar</Label>
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading}
                        aria-label="Upload gambar artikel"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        {isUploading ? "Mengunggah..." : "Pilih Gambar"}
                      </Button>
                      {uploadProgress && (
                        <span className="text-sm text-muted-foreground">
                          {uploadProgress}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Gambar akan dikompres otomatis. Maks 10MB.
                    </p>
                  </div>

                  {/* Or use URL */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Atau gunakan URL
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">URL Gambar</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                    />
                  </div>

                  {/* Preview */}
                  {formData.imageUrl ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder-image.jpg";
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          setFormData({ ...formData, imageUrl: "" })
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="aspect-video rounded-lg border-2 border-dashed bg-muted/50 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <ImageIcon className="h-8 w-8" />
                      <p className="text-sm">Upload atau masukkan URL gambar</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Kategori</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoryId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status Artikel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status Publikasi</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(
                      value: "draft" | "published" | "archived"
                    ) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-red-500" />
                    <div>
                      <Label htmlFor="breaking">Breaking News</Label>
                      <p className="text-xs text-muted-foreground">
                        Tampil di ticker
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="breaking"
                    checked={formData.isBreaking}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isBreaking: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    <div>
                      <Label htmlFor="featured">Featured</Label>
                      <p className="text-xs text-muted-foreground">
                        Artikel utama
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="featured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isFeatured: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Article Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-medium">
                    {article.views_count.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Waktu Baca</span>
                  <span className="font-medium">{article.read_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Penulis</span>
                  <span className="font-medium">{article.author.name}</span>
                </div>
              </CardContent>
            </Card>

            {/* Reading Time */}
            <Card>
              <CardHeader>
                <CardTitle>Waktu Baca</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="readTime">Estimasi Waktu Baca</Label>
                  <Input
                    id="readTime"
                    placeholder="Contoh: 5 menit"
                    value={formData.readTime}
                    onChange={(e) =>
                      setFormData({ ...formData, readTime: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Jika kosong, akan menggunakan "5 menit" sebagai default.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Simpan Perubahan
                </Button>
                {formData.status !== "published" && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={isSaving}
                  >
                    <Eye className="h-4 w-4" />
                    Publikasikan
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full gap-2"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Hapus Artikel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Image Cropper Modal */}
      <ImageCropper
        open={showCropper}
        onClose={() => setShowCropper(false)}
        imageSrc={cropImageSrc}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
