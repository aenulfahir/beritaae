"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { NewsCard } from "@/components/news/NewsCard";
import { CommentSection } from "@/components/news/CommentSection";
import { ArticleActions } from "@/components/news/ArticleActions";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { PostArticleAd } from "@/components/ads";
import { ArticleContentWithAd } from "@/components/ads";
import {
  Clock,
  Eye,
  Calendar,
  ArrowLeft,
  ChevronUp,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { NewsArticle, Category } from "@/types";
import { motion } from "framer-motion";
import { ArticleEngagement } from "@/lib/supabase/services/engagement-server";

// Default placeholder images
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800";
const PLACEHOLDER_AVATAR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100";

// Helper functions
function getImageUrl(url: string | null | undefined): string {
  return url && url.trim() !== "" ? url : PLACEHOLDER_IMAGE;
}

function getCategory(article: NewsArticle) {
  return article.category || { name: "Umum", color: "#6B7280", slug: "umum" };
}

function getAuthor(article: NewsArticle) {
  return article.author || { name: "Redaksi", avatar: PLACEHOLDER_AVATAR };
}

interface NewsDetailClientProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
  categories: Category[];
  engagement: ArticleEngagement;
}

export function NewsDetailClient({
  article,
  relatedArticles,
  categories,
  engagement,
}: NewsDetailClientProps) {
  const [readProgress, setReadProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  // Get safe values
  const category = getCategory(article);
  const author = getAuthor(article);
  const imageUrl = getImageUrl(article.image_url);
  const authorAvatar =
    author.avatar && author.avatar.trim() !== ""
      ? author.avatar
      : PLACEHOLDER_AVATAR;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadProgress(progress);
      setShowScrollTop(scrollTop > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click on content images using event delegation
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      const img = target as HTMLImageElement;
      e.preventDefault();
      e.stopPropagation();
      setLightboxImage({
        src: img.src,
        alt: img.alt || article.title,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler for featured image click
  const handleFeaturedImageClick = () => {
    setLightboxImage({
      src: imageUrl,
      alt: article.title,
    });
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-blue-500 to-primary"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      <article className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <ScrollReveal>
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </Link>
        </ScrollReveal>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <ScrollReveal>
            <header className="mb-6">
              {/* Category & Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href={`/category/${category.slug}`}>
                  <Badge
                    className="text-white border-0 text-xs font-medium px-3 py-1"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name}
                  </Badge>
                </Link>
                {article.is_breaking && (
                  <Badge className="bg-red-500 text-white border-0 text-xs font-medium px-3 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse" />
                    Breaking News
                  </Badge>
                )}
                {article.is_featured && (
                  <Badge className="bg-amber-500 text-white border-0 text-xs font-medium px-3 py-1">
                    ⭐ Featured
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4">
                {article.title}
              </h1>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-5">
                  {article.excerpt}
                </p>
              )}

              {/* Author & Meta */}
              <div className="flex items-center gap-4 py-4 border-t border-b border-border">
                <Link href="#" className="flex items-center gap-3 group">
                  <Image
                    src={authorAvatar}
                    alt={author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-sm">{author.name}</p>
                    <p className="text-xs text-muted-foreground">Penulis</p>
                  </div>
                </Link>

                <div className="flex-1" />

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">
                      {formatDate(article.created_at)}
                    </span>
                    <span className="sm:hidden">
                      {new Date(article.created_at).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                        }
                      )}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {article.read_time || "3 min"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {(article.views_count || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </header>
          </ScrollReveal>

          {/* Featured Image */}
          <ScrollReveal delay={0.1}>
            <div
              className="relative mb-8 rounded-xl overflow-hidden cursor-zoom-in group"
              onClick={handleFeaturedImageClick}
            >
              <div className="aspect-video relative">
                <Image
                  src={imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Article Content with In-Article Ad */}
          <ScrollReveal delay={0.2}>
            <ArticleContentWithAd
              content={article.content || ""}
              className="prose prose-base dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl prose-img:cursor-zoom-in"
            />
          </ScrollReveal>

          {/* Engagement Stats */}
          <ScrollReveal delay={0.3}>
            <div className="mt-8 flex items-center justify-center gap-6 py-4 px-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-500" />
                <span className="font-medium">
                  {(article.views_count || 0).toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">views</span>
              </div>
              <div className="w-px h-5 bg-border" />
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">{engagement.commentsCount}</span>
                <span className="text-sm text-muted-foreground">komentar</span>
              </div>
              {engagement.trendingRank && (
                <>
                  <div className="w-px h-5 bg-border" />
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">
                      #{engagement.trendingRank}
                    </span>
                  </div>
                </>
              )}
            </div>
          </ScrollReveal>

          {/* Tags / Category Links */}
          <ScrollReveal delay={0.3}>
            <div className="mt-10 pt-6 border-t">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Kategori Terkait
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link key={cat.id} href={`/category/${cat.slug}`}>
                    <Badge
                      variant="outline"
                      className="cursor-pointer px-3 py-1"
                      style={{
                        borderColor: cat.color,
                        color: cat.color,
                      }}
                    >
                      {cat.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Post-Article Ad */}
          <PostArticleAd />

          {/* Comment Section */}
          <div id="comments-section">
            <CommentSection articleId={article.id} />
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="max-w-6xl mx-auto mt-12">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-bold">Berita Terkait</h2>
                <div className="flex-1 h-px bg-border" />
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle, index) => (
                <ScrollReveal key={relatedArticle.id} delay={index * 0.1}>
                  <NewsCard article={relatedArticle} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* Floating Action Bar */}
        <ArticleActions
          articleId={article.id}
          initialLikes={engagement.likesCount}
          initialDislikes={engagement.dislikesCount}
          commentCount={engagement.commentsCount}
          userReaction={engagement.userReaction}
        />

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </article>

      {/* Image Lightbox */}
      <ImageLightbox
        src={lightboxImage?.src || ""}
        alt={lightboxImage?.alt || ""}
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </>
  );
}
