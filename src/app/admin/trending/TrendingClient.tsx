"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  MoreHorizontal,
  TrendingUp,
  Eye,
  Edit,
  MessageSquare,
  Flame,
  RefreshCw,
  Info,
  Clock,
} from "lucide-react";
import { RelativeTime } from "@/components/ui/RelativeTime";

interface TrendingArticle {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
  views_count: number;
  published_at: string | null;
  commentsCount: number;
  trendScore: number;
  scoreBreakdown: {
    viewsScore: number;
    commentsScore: number;
    recencyScore: number;
  };
  rank: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface TrendingClientProps {
  initialTrending: TrendingArticle[];
  initialCategories: Category[];
  initialPeriod: string;
}

export function TrendingClient({
  initialTrending,
  initialCategories,
  initialPeriod,
}: TrendingClientProps) {
  const [trending] = useState<TrendingArticle[]>(initialTrending);
  const [categories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [periodFilter, setPeriodFilter] = useState<string>(initialPeriod);

  const filteredTrending = trending.filter((news) => {
    const matchesSearch = news.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || news.category.slug === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: trending.length,
    totalViews: trending.reduce((acc, t) => acc + t.views_count, 0),
    avgScore:
      trending.length > 0
        ? Math.round(
            trending.reduce((acc, t) => acc + t.trendScore, 0) / trending.length
          )
        : 0,
    totalComments: trending.reduce((acc, t) => acc + t.commentsCount, 0),
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500 text-white";
    if (rank === 2) return "bg-gray-400 text-white";
    if (rank === 3) return "bg-amber-600 text-white";
    return "bg-muted text-muted-foreground";
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    if (score >= 30) return "text-orange-600";
    return "text-red-600";
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handlePeriodChange = (value: string) => {
    setPeriodFilter(value);
    // Navigate to same page with new period param
    window.location.href = `/admin/trending?period=${value}`;
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-orange-500" />
              Trending
            </h1>
            <p className="text-sm text-muted-foreground">
              Artikel trending berdasarkan views, komentar, dan waktu publikasi
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Algorithm Info */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Algoritma Trending Score</p>
                <p className="text-muted-foreground">
                  Score dihitung dari:{" "}
                  <span className="text-blue-600">Views (40%)</span> +{" "}
                  <span className="text-green-600">Komentar (30%)</span> +{" "}
                  <span className="text-purple-600">Recency (30%)</span>.
                  Artikel dengan score tertinggi akan muncul di posisi teratas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Artikel</p>
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
                  {stats.totalViews >= 1000
                    ? `${(stats.totalViews / 1000).toFixed(1)}K`
                    : stats.totalViews}
                </p>
                <p className="text-xs text-muted-foreground">Total Views</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <MessageSquare className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalComments}</p>
                <p className="text-xs text-muted-foreground">Total Komentar</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Flame className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgScore}</p>
                <p className="text-xs text-muted-foreground">Avg. Score</p>
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
                  placeholder="Cari artikel..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={periodFilter} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">24 Jam</SelectItem>
                  <SelectItem value="week">7 Hari</SelectItem>
                  <SelectItem value="month">30 Hari</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Trending List */}
        {filteredTrending.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {trending.length === 0
                  ? "Belum ada artikel trending dalam periode ini"
                  : "Tidak ada artikel ditemukan"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredTrending.map((news) => (
              <Card key={news.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${getRankBadgeColor(
                        news.rank
                      )}`}
                    >
                      {news.rank}
                    </div>

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
                      <Link
                        href={`/news/${news.slug}`}
                        target="_blank"
                        className="font-medium text-sm hover:text-primary line-clamp-1"
                      >
                        {news.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <Badge
                          variant="outline"
                          className="text-[10px]"
                          style={{
                            borderColor: news.category.color,
                            color: news.category.color,
                          }}
                        >
                          {news.category.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {news.views_count.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {news.commentsCount}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <RelativeTime date={news.published_at || ""} />
                        </span>
                      </div>
                    </div>

                    {/* Trend Score with Tooltip */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-help">
                          <Flame
                            className={`h-4 w-4 ${getScoreColor(
                              news.trendScore
                            )}`}
                          />
                          <span
                            className={`font-bold text-lg ${getScoreColor(
                              news.trendScore
                            )}`}
                          >
                            {news.trendScore}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="p-3">
                        <div className="space-y-2 text-xs">
                          <p className="font-medium">Score Breakdown</p>
                          <div className="space-y-1">
                            <div className="flex justify-between gap-4">
                              <span className="text-blue-600">Views:</span>
                              <span>{news.scoreBreakdown.viewsScore}/40</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-green-600">Komentar:</span>
                              <span>
                                {news.scoreBreakdown.commentsScore}/30
                              </span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-purple-600">Recency:</span>
                              <span>{news.scoreBreakdown.recencyScore}/30</span>
                            </div>
                            <div className="border-t pt-1 flex justify-between gap-4 font-medium">
                              <span>Total:</span>
                              <span>{news.trendScore}/100</span>
                            </div>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>

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
                        <DropdownMenuItem asChild>
                          <Link href={`/news/${news.slug}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Artikel
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
