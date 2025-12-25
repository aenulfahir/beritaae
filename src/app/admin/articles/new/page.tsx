"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { categories } from "@/data/mock";
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
    Upload,
    X,
    Zap,
    Star,
} from "lucide-react";

export default function NewArticlePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        categoryId: "",
        authorId: "",
        imageUrl: "",
        isBreaking: false,
        isFeatured: false,
    });

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
        // In real app, save to database
        console.log("Saving article:", formData);
        alert("Artikel berhasil disimpan! (Demo: data tidak tersimpan ke database)");
        router.push("/admin/articles");
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
                        <h1 className="text-3xl font-bold">Artikel Baru</h1>
                        <p className="text-muted-foreground">
                            Buat artikel baru untuk portal berita
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Preview
                    </Button>
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
                                    <p className="text-xs text-muted-foreground">
                                        Maksimal 200 karakter. Akan ditampilkan di card preview.
                                    </p>
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
                                        placeholder="Tulis konten artikel di sini... (Mendukung HTML)"
                                        rows={15}
                                        value={formData.content}
                                        onChange={(e) =>
                                            setFormData({ ...formData, content: e.target.value })
                                        }
                                        className="font-mono text-sm"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Gunakan tag HTML seperti &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt; untuk formatting.
                                    </p>
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

                                    {formData.imageUrl ? (
                                        <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                            <img
                                                src={formData.imageUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src =
                                                        "https://via.placeholder.com/800x450?text=Invalid+Image";
                                                }}
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
                                    ) : (
                                        <div className="aspect-video rounded-lg border-2 border-dashed bg-muted/50 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <ImageIcon className="h-8 w-8" />
                                            <p className="text-sm">Masukkan URL gambar di atas</p>
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
                                                Tampil di ticker breaking news
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
                                                Tampil sebagai artikel utama
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

                        {/* Actions */}
                        <Card>
                            <CardContent className="pt-6 space-y-2">
                                <Button type="submit" className="w-full gap-2">
                                    <Save className="h-4 w-4" />
                                    Simpan Artikel
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => router.push("/admin/articles")}
                                >
                                    Batal
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
