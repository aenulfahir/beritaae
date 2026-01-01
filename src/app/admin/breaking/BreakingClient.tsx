"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  MoreHorizontal,
  Zap,
  Eye,
  Edit,
  Trash2,
  Clock,
  AlertTriangle,
  CheckCircle,
  Radio,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { createClient } from "@/lib/supabase/client";
import { NewsArticle } from "@/types";

interface BreakingNewsItem extends NewsArticle {
  priority: number;
}

interface BreakingClientProps {
  initialBreakingNews: BreakingNewsItem[];
  initialAvailableArticles: NewsArticle[];
}

export function BreakingClient({
  initialBreakingNews,
  initialAvailableArticles,
}: BreakingClientProps) {
  const [breakingNews, setBreakingNews] =
    useState<BreakingNewsItem[]>(initialBreakingNews);
  const [availableArticles, setAvailableArticles] = useState<NewsArticle[]>(
    initialAvailableArticles
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [articleSearchQuery, setArticleSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredNews = breakingNews.filter((news) =>
    news.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailableArticles = availableArticles.filter((article) =>
    article.title.toLowerCase().includes(articleSearchQuery.toLowerCase())
  );

  const addToBreaking = async (articleId: string) => {
    setIsUpdating(true);
    const supabase = createClient();

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("articles")
        .update({ is_breaking: true })
        .eq("id", articleId);

      if (error) {
        console.error("Error adding to breaking:", error);
        alert("Gagal menambahkan ke breaking news");
        return;
      }

      // Move article from available to breaking
      const article = availableArticles.find((a) => a.id === articleId);
      if (article) {
        const newBreakingItem: BreakingNewsItem = {
          ...article,
          is_breaking: true,
          priority: breakingNews.length + 1,
        };
        setBreakingNews((prev) => [...prev, newBreakingItem]);
        setAvailableArticles((prev) => prev.filter((a) => a.id !== articleId));
      }
      setAddDialogOpen(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan");
    } finally {
      setIsUpdating(false);
    }
  };

  const removeFromBreaking = async (articleId: string) => {
    if (!confirm("Hapus artikel ini dari breaking news?")) return;

    setIsUpdating(true);
    const supabase = createClient();

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("articles")
        .update({ is_breaking: false })
        .eq("id", articleId);

      if (error) {
        console.error("Error removing from breaking:", error);
        alert("Gagal menghapus dari breaking news");
        return;
      }

      // Move article from breaking to available
      const article = breakingNews.find((a) => a.id === articleId);
      if (article) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { priority: _priority, ...articleWithoutPriority } = article;
        const updatedArticle: NewsArticle = {
          ...articleWithoutPriority,
          is_breaking: false,
        };
        setAvailableArticles((prev) => [updatedArticle, ...prev]);
        setBreakingNews((prev) => prev.filter((a) => a.id !== articleId));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const stats = {
    total: breakingNews.length,
    active: breakingNews.length,
    inactive: 0,
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
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Tambah Breaking
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Tambah Breaking News</DialogTitle>
                <DialogDescription>
                  Pilih artikel yang ingin ditampilkan sebagai breaking news
                </DialogDescription>
              </DialogHeader>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari artikel..."
                  className="pl-9"
                  value={articleSearchQuery}
                  onChange={(e) => setArticleSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {filteredAvailableArticles.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {availableArticles.length === 0
                      ? "Tidak ada artikel yang tersedia"
                      : "Tidak ada artikel ditemukan"}
                  </div>
                ) : (
                  filteredAvailableArticles.map((article) => (
                    <div
                      key={article.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                      onClick={() => !isUpdating && addToBreaking(article.id)}
                    >
                      <div className="relative h-12 w-16 shrink-0 rounded overflow-hidden">
                        <Image
                          src={article.image_url}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">
                          {article.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className="text-[10px]"
                            style={{
                              backgroundColor: `${article.category.color}20`,
                              color: article.category.color,
                            }}
                          >
                            {article.category.name}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            <RelativeTime date={article.published_at || ""} />
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToBreaking(article.id);
                        }}
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
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
              {breakingNews.length > 0 ? (
                <div className="flex gap-8 animate-marquee whitespace-nowrap">
                  {breakingNews.map((news) => (
                    <span key={`preview-${news.id}`} className="text-sm">
                      • {news.title}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm opacity-70">
                  Belum ada breaking news
                </span>
              )}
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Eye className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {breakingNews
                  .reduce((acc, n) => acc + n.views_count, 0)
                  .toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total Views</p>
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
      {filteredNews.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {breakingNews.length === 0
                ? "Belum ada breaking news. Tambahkan artikel sebagai breaking news."
                : "Tidak ada breaking news ditemukan"}
            </p>
            {breakingNews.length === 0 && (
              <Button className="mt-4" onClick={() => setAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Breaking News
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNews.map((news) => (
            <Card
              key={news.id}
              className="border-green-200 dark:border-green-900/50"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Priority Badge */}
                  <Badge
                    variant="outline"
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center p-0 font-bold"
                  >
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
                    <Link
                      href={`/news/${news.slug}`}
                      target="_blank"
                      className="font-medium text-sm hover:text-primary line-clamp-1"
                    >
                      {news.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <Badge
                        variant="secondary"
                        className="text-[10px]"
                        style={{
                          backgroundColor: `${news.category.color}20`,
                          color: news.category.color,
                        }}
                      >
                        {news.category.name}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {news.views_count.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <RelativeTime date={news.published_at || ""} />
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <Badge className="bg-green-500/10 text-green-600 gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Aktif
                  </Badge>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={isUpdating}
                      >
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
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => removeFromBreaking(news.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus dari Breaking
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
  );
}
