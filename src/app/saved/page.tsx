"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  getSavedArticles,
  unsaveArticle,
  SavedArticle,
} from "@/lib/supabase/services/bookmarks";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  Trash2,
  Search,
  Grid3X3,
  List,
  Loader2,
  LogIn,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SavedPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;

    async function fetchSavedArticles() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getSavedArticles(user.id);
        setSavedArticles(data);
      } catch (error) {
        console.error("Error fetching saved articles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSavedArticles();
  }, [user, authLoading]);

  const handleRemove = async (articleId: string) => {
    if (!user) return;

    setRemovingId(articleId);
    try {
      const result = await unsaveArticle(user.id, articleId);
      if (result.success) {
        setSavedArticles((prev) =>
          prev.filter((item) => item.article_id !== articleId)
        );
      }
    } catch (error) {
      console.error("Error removing article:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const filteredArticles = savedArticles.filter((item) =>
    item.article?.title.toLowerCase().includes(search.toLowerCase())
  );

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays < 1) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  // Show login prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background flex items-center justify-center">
        <Card className="border-0 shadow-lg max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
              <Bookmark className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">
              Masuk untuk Melihat Artikel Tersimpan
            </h2>
            <p className="text-muted-foreground mb-6">
              Simpan artikel favorit Anda dan akses kapan saja
            </p>
            <Link href="/login">
              <Button className="gap-2">
                <LogIn className="h-4 w-4" />
                Masuk Sekarang
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Bookmark className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Tersimpan</h1>
                <p className="text-sm text-muted-foreground">
                  {savedArticles.length} artikel disimpan
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          {/* Controls */}
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari artikel tersimpan..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={view === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setView("grid")}
                  aria-label="Tampilan grid"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setView("list")}
                  aria-label="Tampilan list"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredArticles.length > 0 ? (
            view === "grid" ? (
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((item) => (
                  <StaggerItem key={item.id}>
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                      <div className="relative aspect-video">
                        <Image
                          src={item.article?.image_url || "/placeholder.jpg"}
                          alt={item.article?.title || ""}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemove(item.article_id)}
                          disabled={removingId === item.article_id}
                          className="absolute top-2 right-2 p-2 rounded-full bg-background/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                          aria-label="Hapus dari tersimpan"
                        >
                          {removingId === item.article_id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <CardContent className="p-4">
                        {item.article?.category && (
                          <Badge
                            className="mb-2 text-xs border-0"
                            style={{
                              backgroundColor: `${item.article.category.color}20`,
                              color: item.article.category.color,
                            }}
                          >
                            {item.article.category.name}
                          </Badge>
                        )}
                        <Link href={`/news/${item.article?.slug}`}>
                          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                            {item.article?.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted-foreground mt-2">
                          Disimpan {formatTimeAgo(item.created_at)}
                        </p>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <div className="space-y-4">
                {filteredArticles.map((item, index) => (
                  <ScrollReveal key={item.id} delay={index * 0.05}>
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative h-24 w-32 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={
                                item.article?.image_url || "/placeholder.jpg"
                              }
                              alt={item.article?.title || ""}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            {item.article?.category && (
                              <Badge
                                className="mb-2 text-xs border-0"
                                style={{
                                  backgroundColor: `${item.article.category.color}20`,
                                  color: item.article.category.color,
                                }}
                              >
                                {item.article.category.name}
                              </Badge>
                            )}
                            <Link href={`/news/${item.article?.slug}`}>
                              <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                                {item.article?.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">
                              Disimpan {formatTimeAgo(item.created_at)}
                            </p>
                          </div>
                          <div className="flex items-start shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemove(item.article_id)}
                              disabled={removingId === item.article_id}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              aria-label="Hapus dari tersimpan"
                            >
                              {removingId === item.article_id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <Bookmark className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">
                {search
                  ? "Tidak ada artikel yang cocok"
                  : "Belum ada artikel tersimpan"}
              </p>
              {!search && (
                <Link href="/">
                  <Button variant="outline" className="mt-4">
                    Jelajahi Artikel
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
