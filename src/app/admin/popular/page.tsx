"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    Eye,
    Edit,
    Trash2,
    GripVertical,
    Flame,
    Star,
    Crown,
    Medal,
    Trophy,
    RefreshCw,
    Calendar,
} from "lucide-react";
import { newsArticles, categories } from "@/data/mock";
import { RelativeTime } from "@/components/ui/RelativeTime";

// Mock popular data
const mockPopular = [...newsArticles]
    .sort((a, b) => b.views_count - a.views_count)
    .slice(0, 10)
    .map((article, i) => ({
        ...article,
        rank: i + 1,
        isActive: true,
        period: "weekly" as "daily" | "weekly" | "monthly",
    }));

export default function PopularPage() {
    const [popular, setPopular] = useState(mockPopular);
    const [searchQuery, setSearchQuery] = useState("");
    const [periodFilter, setPeriodFilter] = useState<string>("weekly");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    const filteredPopular = popular.filter((news) => {
        const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || news.category.slug === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const toggleActive = (id: string) => {
        setPopular((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isActive: !n.isActive } : n))
        );
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
        if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
        if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
        return <span className="text-lg font-bold text-muted-foreground">{rank}</span>;
    };

    const stats = {
        totalViews: popular.reduce((acc, p) => acc + p.views_count, 0),
        topCategory: categories.find((c) => c.slug === popular[0]?.category.slug)?.name || "-",
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Flame className="h-6 w-6 text-red-500" />
                        Popular
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola artikel populer berdasarkan views dan engagement
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                    <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Manual
                    </Button>
                </div>
            </div>

            {/* Period Tabs */}
            <div className="flex gap-2">
                {["daily", "weekly", "monthly"].map((period) => (
                    <Button
                        key={period}
                        variant={periodFilter === period ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPeriodFilter(period)}
                        className="capitalize"
                    >
                        <Calendar className="h-4 w-4 mr-2" />
                        {period === "daily" ? "Hari Ini" : period === "weekly" ? "Minggu Ini" : "Bulan Ini"}
                    </Button>
                ))}
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                            <Flame className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{popular.length}</p>
                            <p className="text-xs text-muted-foreground">Total Popular</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                            <Eye className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{(stats.totalViews / 1000).toFixed(0)}K</p>
                            <p className="text-xs text-muted-foreground">Total Views</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                            <Crown className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.topCategory}</p>
                            <p className="text-xs text-muted-foreground">Top Category</p>
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
                                placeholder="Cari artikel popular..."
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

            {/* Top 3 Highlight */}
            <div className="grid gap-4 sm:grid-cols-3">
                {filteredPopular.slice(0, 3).map((news, i) => (
                    <Card key={news.id} className={`overflow-hidden ${i === 0 ? "border-yellow-200 dark:border-yellow-900/50 bg-gradient-to-br from-yellow-50/50 to-transparent dark:from-yellow-950/20" : ""}`}>
                        <div className="relative aspect-video">
                            <Image
                                src={news.image_url}
                                alt={news.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm">
                                {getRankIcon(i + 1)}
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <Badge
                                variant="outline"
                                className="text-[10px] mb-2"
                                style={{ borderColor: news.category.color, color: news.category.color }}
                            >
                                {news.category.name}
                            </Badge>
                            <Link href={`/news/${news.slug}`} target="_blank" className="font-medium text-sm hover:text-primary line-clamp-2 block">
                                {news.title}
                            </Link>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <Eye className="h-3 w-3" />
                                {news.views_count.toLocaleString()} views
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Rest of Popular List */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Ranking #4 - #10</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {filteredPopular.slice(3).map((news) => (
                            <div key={news.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                {/* Drag Handle */}
                                <div className="cursor-grab text-muted-foreground hover:text-foreground">
                                    <GripVertical className="h-4 w-4" />
                                </div>

                                {/* Rank */}
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold text-sm">
                                    {news.rank}
                                </div>

                                {/* Thumbnail */}
                                <div className="relative h-10 w-14 shrink-0 rounded overflow-hidden">
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
                                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                                        <Badge variant="outline" className="text-[10px] h-4 px-1">
                                            {news.category.name}
                                        </Badge>
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {news.views_count.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Toggle */}
                                <Switch
                                    checked={news.isActive}
                                    onCheckedChange={() => toggleActive(news.id)}
                                />

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
                                                Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Remove
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
