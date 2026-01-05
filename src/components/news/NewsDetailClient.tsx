"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { NewsCard } from "@/components/news/NewsCard";
import { CommentSection } from "@/components/news/CommentSection";
import { ArticleActions } from "@/components/news/ArticleActions";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import {
  Clock,
  Eye,
  Calendar,
  ArrowLeft,
  ChevronUp,
  User,
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
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Add click handlers to images in article content
  useEffect(() => {
    // Use a small delay to ensure content is rendered
    const timeoutId = setTimeout(() => {
      if (!contentRef.current) return;

      const images = contentRef.current.querySelectorAll("img");

      images.forEach((img) => {
        // Add cursor style
        img.style.cursor = "zoom-in";
        // Add click handler directly
        img.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          setLightboxImage({
            src: img.src,
            alt: img.alt || article.title,
          });
        };
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [article.content, article.title]);

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

      <article className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <ScrollReveal>
          <Link href="/">
            <Button variant="ghost" className="mb-6 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </Link>
        </ScrollReveal>

        {/* Article Header */}
        <ScrollReveal>
          <header className="max-w-4xl mx-auto mb-8">
            {/* Category & Breaking Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge
                className="text-white border-0"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </Badge>
              {article.is_breaking && (
                <Badge variant="destructive" className="animate-pulse">
                  🔴 Breaking News
                </Badge>
              )}
              {article.is_featured && (
                <Badge className="bg-amber-500 text-white border-0">
                  ⭐ Featured
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-lg text-muted-foreground mb-6">
                {article.excerpt}
              </p>
            )}

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center gap-6 pb-6 border-b">
              <Link href="#" className="flex items-center gap-3 group">
                <div className="relative">
                  <Image
                    src={authorAvatar}
                    alt={author.name}
                    width={48}
                    height={48}
                    className="rounded-full ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-background">
                    <User className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold group-hover:text-primary transition-colors">
                    {author.name}
                  </p>
                  <p className="text-xs text-muted-foreground">Penulis</p>
                </div>
              </Link>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.created_at)}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {article.read_time || "3 min"}
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {(article.views_count || 0).toLocaleString()} views
                </div>
              </div>
            </div>
          </header>
        </ScrollReveal>

        {/* Featured Image */}
        <ScrollReveal delay={0.1}>
          <div
            className="relative aspect-video max-w-4xl mx-auto mb-8 rounded-3xl overflow-hidden shadow-2xl cursor-zoom-in group"
            onClick={handleFeaturedImageClick}
          >
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            {/* Zoom icon on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-black/50 rounded-full p-4">
                <Eye className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Article Content */}
        <ScrollReveal delay={0.2}>
          <div
            ref={contentRef}
            className="max-w-3xl mx-auto prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: article.content || "" }}
          />
        </ScrollReveal>

        {/* Share & Engagement Stats */}
        <ScrollReveal delay={0.3}>
          <Card className="max-w-3xl mx-auto mt-12 border-0 shadow-lg bg-gradient-to-r from-muted/50 via-background to-muted/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-background shadow-sm">
                  <Eye className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">
                    {(article.views_count || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
                <div className="p-4 rounded-xl bg-background shadow-sm">
                  <MessageCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">
                    {engagement.commentsCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Komentar</p>
                </div>
                <div className="p-4 rounded-xl bg-background shadow-sm">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                  <p className="text-2xl font-bold">
                    {engagement.trendingRank
                      ? `#${engagement.trendingRank}`
                      : "-"}
                  </p>
                  <p className="text-xs text-muted-foreground">Trending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Tags / Category Links */}
        <ScrollReveal delay={0.3}>
          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Kategori Terkait
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/category/${cat.slug}`}>
                  <Badge
                    variant="outline"
                    className="hover:scale-105 transition-transform cursor-pointer px-4 py-1.5"
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

        {/* Comment Section */}
        <div id="comments-section">
          <CommentSection articleId={article.id} />
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="max-w-6xl mx-auto mt-16">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold">Berita Terkait</h2>
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
            className="fixed bottom-24 right-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
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
