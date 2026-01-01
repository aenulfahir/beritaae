"use client";

import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/ScrollReveal";
import { NewsCard } from "@/components/news/NewsCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Flame, Clock, Hash, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TrendingTag } from "@/lib/supabase/services/tags-server";
import { formatTagCount } from "@/lib/supabase/services/tags";

interface TrendingArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image_url?: string;
  views_count: number;
  published_at?: string;
  created_at?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
  author?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

interface TrendingClientProps {
  initialTags: TrendingTag[];
  initialArticles: TrendingArticle[];
}

export default function TrendingClient({
  initialTags,
  initialArticles,
}: TrendingClientProps) {
  const topTrending = initialArticles.slice(0, 3);
  const restTrending = initialArticles.slice(3);

  // Transform articles to NewsCard format
  const transformArticle = (article: TrendingArticle) => {
    // Ensure dates are valid - use multiple fallbacks
    const now = new Date().toISOString();

    // Try published_at first, then created_at, then fallback to now
    let validDate = now;
    const dateToTry = article.published_at || article.created_at;

    if (dateToTry) {
      const parsed = new Date(dateToTry);
      if (!isNaN(parsed.getTime())) {
        validDate = parsed.toISOString();
      }
    }

    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || "",
      image_url: article.image_url || "/placeholder.jpg",
      views_count: article.views_count || 0,
      published_at: validDate,
      created_at: validDate, // NewsCard uses created_at for TimeAgo
      category: article.category || {
        id: "",
        name: "Umum",
        slug: "umum",
        color: "#6366f1",
      },
      author: article.author
        ? {
            id: article.author.id,
            name: article.author.full_name || "Anonymous",
            avatar: article.author.avatar_url || "",
          }
        : { id: "", name: "Anonymous", avatar: "" },
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 dark:from-orange-950/10 to-background">
      {/* Hero */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-amber-500/10" />
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Trending</h1>
                <p className="text-muted-foreground">
                  Berita paling banyak dibicarakan
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Trending Topics/Hashtags */}
          {initialTags.length > 0 && (
            <ScrollReveal delay={0.1}>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Hash className="h-5 w-5 text-orange-500" />
                  <span className="font-semibold text-sm text-muted-foreground">
                    TRENDING TOPICS
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {initialTags.map((tag, index) => (
                    <Link key={tag.id} href={`/tag/${tag.slug}`}>
                      <Badge
                        variant="outline"
                        className="px-4 py-2.5 text-sm hover:scale-105 transition-all cursor-pointer group"
                        style={{
                          borderColor: tag.color,
                          backgroundColor: `${tag.color}10`,
                        }}
                      >
                        <span
                          className="font-semibold group-hover:text-white transition-colors"
                          style={{ color: tag.color }}
                        >
                          #{tag.name}
                        </span>
                        <span className="ml-2 text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatTagCount(tag.total_views)}
                        </span>
                        {index < 3 && (
                          <Flame className="ml-1 h-3 w-3 text-orange-500" />
                        )}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        {/* Top 3 Trending */}
        {topTrending.length > 0 && (
          <section className="mb-12">
            <ScrollReveal>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Top Trending
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6">
              {topTrending.map((article, index) => (
                <ScrollReveal key={article.id} delay={index * 0.1}>
                  <Link href={`/news/${article.slug}`} className="group block">
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden relative">
                      {/* Rank Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                            index === 0
                              ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                              : index === 1
                              ? "bg-gradient-to-br from-gray-300 to-gray-400"
                              : "bg-gradient-to-br from-amber-600 to-amber-700"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>

                      <div className="relative h-48">
                        <Image
                          src={article.image_url || "/placeholder.jpg"}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      </div>

                      <CardContent className="p-4">
                        {article.category && (
                          <Badge
                            className="mb-2 text-xs border-0"
                            style={{
                              backgroundColor: `${article.category.color}20`,
                              color: article.category.color,
                            }}
                          >
                            {article.category.name}
                          </Badge>
                        )}
                        <h3 className="font-bold line-clamp-2 group-hover:text-orange-500 transition-colors mb-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="h-4 w-4 text-orange-500" />
                          <span className="font-medium">
                            {article.views_count.toLocaleString()} views
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* Rest of Trending */}
        {restTrending.length > 0 && (
          <section>
            <ScrollReveal>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Trending Lainnya
              </h2>
            </ScrollReveal>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {restTrending.map((article) => (
                <StaggerItem key={article.id}>
                  <NewsCard
                    article={transformArticle(article) as any}
                    showExcerpt={false}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        )}

        {/* Empty State */}
        {initialArticles.length === 0 && (
          <div className="text-center py-16">
            <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Belum ada artikel trending
            </h3>
            <p className="text-muted-foreground">
              Artikel trending akan muncul berdasarkan jumlah views
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
