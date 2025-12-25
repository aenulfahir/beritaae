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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    TrendingUp,
    Eye,
    Edit,
    Trash2,
    GripVertical,
    Clock,
    Flame,
    Hash,
    RefreshCw,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import { newsArticles, categories } from "@/data/mock";
import { RelativeTime } from "@/components/ui/RelativeTime";

// Mock trending data
const mockTrending = [...newsArticles]
    .sort((a, b) => b.views_count - a.views_count)
    .slice(0, 8)
    .map((article, i) => ({
        ...article,
        rank: i + 1,
        prevRank: i + Math.floor(Math.random() * 3) - 1,
        isActive: true,
        trendScore: Math.floor(Math.random() * 100) + 50,
    }));

export default function TrendingPage() {
    const [trending, setTrending] = useState(mockTrending);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    const filteredTrending = trending.filter((news) => {
        const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || news.category.slug === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const toggleActive = (id: string) => {
        setTrending((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isActive: !n.isActive } : n))
        );
    };

    const getRankChange = (current: number, prev: number) => {
        if (current < prev) return <ArrowUp className="h-3 w-3 text-green-500" />;
        if (current > prev) return <ArrowDown className="h-3 w-3 text-red-500" />;
        return <span className="text-muted-foreground">-</span>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 text-orange-500" />
                        Trending
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola artikel trending berdasarkan algoritma dan manual
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Recalculate
                    </Button>
                    <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Manual
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                            <TrendingUp className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{trending.length}</p>
                            <p className="text-xs text-muted-foreground">Total Trending</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                            <Eye className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {(trending.reduce((acc, t) => acc + t.views_count, 0) / 1000).toFixed(0)}K
                            </p>
                            <p className="text-xs text-muted-foreground">Total Views</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                            <Flame className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {Math.round(trending.reduce((acc, t) => acc + t.trendScore, 0) / trending.length)}
                            </p>
                            <p className="text-xs text-muted-foreground">Avg. Trend Score</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Cari trending..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Trending List */}
            <div className="space-y-2">
                {filteredTrending.map((news) => (
                    <Card key={news.id} className={`transition-all ${!news.isActive && "opacity-60"}`}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                {/* Drag Handle */}
                                <div className="cursor-grab text-muted-foreground hover:text-foreground">
                                    <GripVertical className="h-5 w-5" />
                                </div>

                                {/* Rank */}
                                <div className="flex items-center gap-1 w-12">
                                    <span className="text-xl font-bold text-muted-foreground">
                                        #{news.rank}
                                    </span>
                                    {getRankChange(news.rank, news.prevRank)}
                                </div>

                                {/* Thumbnail */}
                                <div className="relative h-12 w-16 shrink-0 rounded-lg overflow-hidden">
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
                                    <div className="flex items-center gap-3 mt-1">
                                        <Badge
                                            variant="outline"
                                            className="text-[10px]"
                                            style={{ borderColor: news.category.color, color: news.category.color }}
                                        >
                                            {news.category.name}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {news.views_count.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Flame className="h-3 w-3 text-orange-500" />
                                            {news.trendScore}
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
                                        <DropdownMenuItem className="text-red-600">
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
        </div>
    );
}
