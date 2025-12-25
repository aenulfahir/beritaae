"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Search,
    Plus,
    MoreHorizontal,
    Zap,
    Eye,
    Edit,
    Trash2,
    GripVertical,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Radio,
    RefreshCw,
} from "lucide-react";
import { newsArticles } from "@/data/mock";
import { RelativeTime } from "@/components/ui/RelativeTime";

// Mock breaking news data
const mockBreakingNews = newsArticles
    .filter((a) => a.is_breaking)
    .concat(newsArticles.slice(0, 3))
    .slice(0, 5)
    .map((article, i) => ({
        ...article,
        priority: i + 1,
        isActive: i < 3,
        expiresAt: new Date(Date.now() + (i + 1) * 3600000).toISOString(),
    }));

export default function BreakingNewsPage() {
    const [breakingNews, setBreakingNews] = useState(mockBreakingNews);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredNews = breakingNews.filter((news) =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleActive = (id: string) => {
        setBreakingNews((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isActive: !n.isActive } : n))
        );
    };

    const removeFromBreaking = (id: string) => {
        setBreakingNews((prev) => prev.filter((n) => n.id !== id));
    };

    const stats = {
        total: breakingNews.length,
        active: breakingNews.filter((n) => n.isActive).length,
        inactive: breakingNews.filter((n) => !n.isActive).length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Zap className="h-6 w-6 text-red-500" />
                        Breaking News
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola berita utama yang ditampilkan di ticker
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                    <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Breaking
                    </Button>
                </div>
            </div>

            {/* Live Preview */}
            <Card className="border-red-200 dark:border-red-900/50 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-red-600 dark:text-red-400">
                        <Radio className="h-4 w-4 animate-pulse" />
                        Live Preview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3 p-3 bg-red-500 text-white rounded-lg overflow-hidden">
                        <Badge className="bg-white/20 shrink-0">BREAKING</Badge>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex gap-8 animate-marquee whitespace-nowrap">
                                {breakingNews
                                    .filter((n) => n.isActive)
                                    .map((news) => (
                                        <span key={news.id} className="text-sm">
                                            • {news.title}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                            <Zap className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.total}</p>
                            <p className="text-xs text-muted-foreground">Total Breaking</p>
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-500/10">
                            <XCircle className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.inactive}</p>
                            <p className="text-xs text-muted-foreground">Nonaktif</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari breaking news..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Breaking News List */}
            <div className="space-y-3">
                {filteredNews.map((news) => (
                    <Card key={news.id} className={`transition-all ${news.isActive ? "border-green-200 dark:border-green-900/50" : "opacity-60"}`}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                {/* Drag Handle */}
                                <div className="cursor-grab text-muted-foreground hover:text-foreground">
                                    <GripVertical className="h-5 w-5" />
                                </div>

                                {/* Priority Badge */}
                                <Badge variant="outline" className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center p-0 font-bold">
                                    {news.priority}
                                </Badge>

                                {/* Thumbnail */}
                                <div className="relative h-14 w-20 shrink-0 rounded-lg overflow-hidden">
                                    <Image
                                        src={news.image_url}
                                        alt={news.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <Link href={`/news/${news.slug}`} target="_blank" className="font-medium text-sm hover:text-primary line-clamp-1">
                                        {news.title}
                                    </Link>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {news.views_count.toLocaleString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            Expires <RelativeTime date={news.expiresAt} />
                                        </span>
                                    </div>
                                </div>

                                {/* Status Toggle */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                        {news.isActive ? "Aktif" : "Nonaktif"}
                                    </span>
                                    <Switch
                                        checked={news.isActive}
                                        onCheckedChange={() => toggleActive(news.id)}
                                    />
                                </div>

                                {/* Actions */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/admin/articles/${news.id}/edit`}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit Artikel
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600" onClick={() => removeFromBreaking(news.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Remove
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredNews.length === 0 && (
                <Card>
                    <CardContent className="p-8 text-center">
                        <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Tidak ada breaking news ditemukan</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
