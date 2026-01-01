"use client";

import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, Eye, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TagArticle } from "@/lib/supabase/services/tags-server";
import { formatTagCount } from "@/lib/supabase/services/tags";

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  usage_count: number;
}

interface TagPageClientProps {
  tag: Tag;
  articles: TagArticle[];
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export default function TagPageClient({ tag, articles }: TagPageClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Hero */}
      <section
        className="py-12 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${tag.color}10 0%, transparent 50%)`,
        }}
      >
        <div
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: tag.color }}
        />

        <div className="container mx-auto px-4 relative">
          <ScrollReveal>
            <Link
              href="/trending"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Trending
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <div
                className="p-4 rounded-2xl"
                style={{ backgroundColor: `${tag.color}20` }}
              >
                <Hash className="h-8 w-8" style={{ color: tag.color }} />
              </div>
              <div>
                <h1
                  className="text-3xl md:text-4xl font-bold"
                  style={{ color: tag.color }}
                >
                  #{tag.name}
                </h1>
                {tag.description && (
                  <p className="text-muted-foreground mt-1">
                    {tag.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {formatTagCount(tag.usage_count)} artikel
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        {articles.length > 0 ? (
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {articles.map((article) => (
              <StaggerItem key={article.article_id}>
                <Link href={`/news/${article.slug}`} className="group block">
                  <Card className="border-0 shadow-sm hover:shadow-lg transition-all overflow-hidden h-full">
                    <div className="relative h-40">
                      <Image
                        src={article.image_url || "/placeholder.jpg"}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    <CardContent className="p-4">
                      {article.category_name && (
                        <Badge
                          className="mb-2 text-xs border-0"
                          style={{
                            backgroundColor: `${article.category_color}20`,
                            color: article.category_color,
                          }}
                        >
                          {article.category_name}
                        </Badge>
                      )}

                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {article.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(article.published_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{article.views_count.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="text-center py-16">
            <Hash className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">Belum ada artikel</h3>
            <p className="text-muted-foreground">
              Belum ada artikel dengan tag #{tag.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
