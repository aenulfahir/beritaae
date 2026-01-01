"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Flame,
  Crown,
  Medal,
  Trophy,
  RefreshCw,
  Calendar,
  BarChart3,
  Award,
} from "lucide-react";
import { RelativeTime } from "@/components/ui/RelativeTime";

interface PopularArticle {
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
  rank: number;
  viewsPercentage: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface CategoryStats {
  name: string;
  color: string;
  count: number;
  totalViews: number;
}

interface PopularClientProps {
  initialPopular: PopularArticle[];
  initialCategories: Category[];
  initialPeriod: string;
}

export function PopularClient({
  initialPopular,
  initialCategories,
  initialPeriod,
}: PopularClientProps) {
  const [popular] = useState<PopularArticle[]>(initialPopular);
  const [categories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [periodFilter, setPeriodFilter] = useState<string>(initialPeriod);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredPopular = popular.filter((news) => {
    const matchesSearch = news.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || news.category.slug === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate stats
  const stats = {
    totalArticles: popular.length,
    totalViews: popular.reduce((acc, p) => acc + p.views_count, 0),
    avgViews:
      popular.length > 0
        ? Math.round(
            popular.reduce((acc, p) => acc + p.views_count, 0) / popular.length
          )
        : 0,
  };

  // Calculate category stats
  const categoryStats: CategoryStats[] = categories
    .map((cat) => {
      const catArticles = popular.filter((p) => p.category.slug === cat.slug);
      return {
        name: cat.name,
        color: cat.color,
        count: catArticles.length,
        totalViews: catArticles.reduce((acc, p) => acc + p.views_count, 0),
      };
    })
    .filter((c) => c.count > 0)
    .sort((a, b) => b.totalViews - a.totalViews);

  const topCategory = categoryStats[0];

  const getRankIcon = (rank: number) => {
    if (rank === 1)
      return <Trophy className="h-6 w-6 text-yellow-500 drop-shadow-lg" />;
    if (rank === 2)
      return <Medal className="h-6 w-6 text-gray-400 drop-shadow-lg" />;
    if (rank === 3)
      return <Medal className="h-6 w-6 text-amber-600 drop-shadow-lg" />;
    return null;
  };

  const getRankBgColor = (rank: number) => {
    if (rank === 1)
      return "from-yellow-500/20 to-yellow-500/5 border-yellow-500/30";
    if (rank === 2) return "from-gray-400/20 to-gray-400/5 border-gray-400/30";
    if (rank === 3)
      return "from-amber-600/20 to-amber-600/5 border-amber-600/30";
    return "";
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handlePeriodChange = (value: string) => {
    setPeriodFilter(value);
    window.location.href = `/admin/popular?period=${value}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Flame className="h-6 w-6 text-red-500" />
            Artikel Populer
          </h1>
          <p className="text-sm text-muted-foreground">
            Artikel dengan views tertinggi berdasarkan periode
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

      {/* Period Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: "Semua Waktu" },
          { value: "day", label: "24 Jam" },
          { value: "week", label: "7 Hari" },
          { value: "month", label: "30 Hari" },
        ].map((period) => (
          <Button
            key={period.value}
            variant={periodFilter === period.value ? "default" : "outline"}
            size="sm"
            onClick={() => handlePeriodChange(period.value)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {period.label}
          </Button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <Flame className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalArticles}</p>
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
                {formatViews(stats.totalViews)}
              </p>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <BarChart3 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {formatViews(stats.avgViews)}
              </p>
              <p className="text-xs text-muted-foreground">Rata-rata Views</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Crown className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold truncate max-w-[100px]">
                {topCategory?.name || "-"}
              </p>
              <p className="text-xs text-muted-foreground">Top Kategori</p>
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

      {filteredPopular.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Flame className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {popular.length === 0
                ? "Belum ada artikel dalam periode ini"
                : "Tidak ada artikel ditemukan"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Top 3 Podium */}
          <div className="grid gap-4 md:grid-cols-3">
            {filteredPopular.slice(0, 3).map((news, i) => (
              <Card
                key={news.id}
                className={`overflow-hidden bg-gradient-to-br ${getRankBgColor(
                  i + 1
                )} ${
                  i === 0 ? "md:order-2" : i === 1 ? "md:order-1" : "md:order-3"
                }`}
              >
                <div className="relative aspect-video">
                  <Image
                    src={news.image_url}
                    alt={news.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-lg">
                      {getRankIcon(i + 1)}
                    </div>
                    <Badge className="bg-background/90 text-foreground backdrop-blur-sm">
                      #{i + 1}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <Badge
                      className="mb-2"
                      style={{
                        backgroundColor: `${news.category.color}dd`,
                        color: "white",
                      }}
                    >
                      {news.category.name}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <Link
                    href={`/news/${news.slug}`}
                    target="_blank"
                    className="font-semibold text-sm hover:text-primary line-clamp-2 block mb-3"
                  >
                    {news.title}
                  </Link>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span className="font-bold">
                        {news.views_count.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">views</span>
                    </div>
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
                  {/* Views Progress Bar */}
                  <div className="mt-3">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                        style={{ width: `${news.viewsPercentage}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 text-right">
                      {news.viewsPercentage}% dari tertinggi
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Rest of Popular List */}
          {filteredPopular.length > 3 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  Ranking #{4} - #{Math.min(filteredPopular.length, 20)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {filteredPopular.slice(3).map((news) => (
                    <div
                      key={news.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      {/* Rank */}
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold text-sm shrink-0">
                        {news.rank}
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
                        <Link
                          href={`/news/${news.slug}`}
                          target="_blank"
                          className="font-medium text-sm hover:text-primary line-clamp-1"
                        >
                          {news.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge
                            variant="outline"
                            className="text-[10px] h-5"
                            style={{
                              borderColor: news.category.color,
                              color: news.category.color,
                            }}
                          >
                            {news.category.name}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            <RelativeTime date={news.published_at || ""} />
                          </span>
                        </div>
                      </div>

                      {/* Views with mini progress */}
                      <div className="w-32 shrink-0">
                        <div className="flex items-center gap-2 justify-end">
                          <Eye className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {news.views_count.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${news.viewsPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
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
                          <DropdownMenuItem asChild>
                            <Link href={`/news/${news.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Category Distribution */}
          {categoryStats.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  Distribusi per Kategori
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryStats.slice(0, 5).map((cat) => (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span>{cat.name}</span>
                          <Badge variant="secondary" className="text-[10px]">
                            {cat.count} artikel
                          </Badge>
                        </div>
                        <span className="font-medium">
                          {formatViews(cat.totalViews)} views
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${
                              (cat.totalViews / stats.totalViews) * 100
                            }%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
