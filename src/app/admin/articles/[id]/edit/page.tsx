"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { newsArticles, categories } from "@/data/mock";
import { authors } from "@/data/admin-mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
    Image as ImageIcon,
    X,
    Zap,
    Star,
    Trash2,
} from "lucide-react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditArticlePage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const article = newsArticles.find((a) => a.id === id);

    const [formData, setFormData] = useState({
        title: article?.title || "",
        slug: article?.slug || "",
        excerpt: article?.excerpt || "",
        content: article?.content || "",
        categoryId: article?.category.id || "",
        authorId: "1", // Default to first author
        imageUrl: article?.image_url || "",
        isBreaking: article?.is_breaking || false,
        isFeatured: article?.is_featured || false,
    });

    if (!article) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <h1 className="text-2xl font-bold">Artikel Tidak Ditemukan</h1>
                <Link href="/admin/articles">
                    <Button>Kembali ke Daftar Artikel</Button>
                </Link>
            </div>
        );
    }

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Updating article:", formData);
        alert("Artikel berhasil diperbarui! (Demo: data tidak tersimpan ke database)");
        router.push("/admin/articles");
    };

    const handleDelete = () => {
        if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
            console.log("Deleting article:", id);
            alert("Artikel berhasil dihapus! (Demo)");
            router.push("/admin/articles");
        }
    };

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
                        <h1 className="text-3xl font-bold">Edit Artikel</h1>
                        <p className="text-muted-foreground line-clamp-1">
                            {article.title}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={`/news/${article.slug}`} target="_blank">
                        <Button variant="outline" className="gap-2">
                            <Eye className="h-4 w-4" />
                            Lihat
                        </Button>
                    </Link>
                    <Button className="gap-2" onClick={handleSubmit}>
                        <Save className="h-4 w-4" />
                        Simpan
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
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
                                        <span className="text-sm text-muted-foreground">/news/</span>
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
                                    <Label htmlFor="excerpt">Ringkasan *</Label>
                                    <Textarea
                                        id="excerpt"
                                        placeholder="Tulis ringkasan singkat artikel..."
                                        rows={3}
                                        value={formData.excerpt}
                                        onChange={(e) =>
                                            setFormData({ ...formData, excerpt: e.target.value })
                                        }
                                        required
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
                                    <Label htmlFor="content">Konten *</Label>
                                    <Textarea
                                        id="content"
                                        placeholder="Tulis konten artikel di sini..."
                                        rows={15}
                                        value={formData.content}
                                        onChange={(e) =>
                                            setFormData({ ...formData, content: e.target.value })
                                        }
                                        className="font-mono text-sm"
                                        required
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

                                    {formData.imageUrl && (
                                        <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                            <img
                                                src={formData.imageUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2"
                                                onClick={() => setFormData({ ...formData, imageUrl: "" })}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Category & Author */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Kategori & Penulis</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Kategori *</Label>
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

                                <div className="space-y-2">
                                    <Label>Penulis *</Label>
                                    <Select
                                        value={formData.authorId}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, authorId: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih penulis" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {authors.map((author) => (
                                                <SelectItem key={author.id} value={author.id}>
                                                    {author.name}
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
                                    <span className="font-medium">{article.views_count.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Waktu Baca</span>
                                    <span className="font-medium">{article.read_time}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardContent className="pt-6 space-y-2">
                                <Button type="submit" className="w-full gap-2">
                                    <Save className="h-4 w-4" />
                                    Simpan Perubahan
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="w-full gap-2"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Hapus Artikel
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
