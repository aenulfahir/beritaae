import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/ScrollReveal";
import { NewsCard } from "@/components/news/NewsCard";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp,
  Zap,
  Eye,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Flame } from "lucide-react";
import {
  getPublishedArticles,
  getFeaturedArticles,
  getTrendingArticles,
  getArticlesByCategory,
  getBreakingNews,
} from "@/lib/supabase/services/articles-server";
import { getCategories } from "@/lib/supabase/services/categories-server";
import { getTrendingTagsServer } from "@/lib/supabase/services/tags-server";
import { NewsArticle } from "@/types";

// Category Section Component
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800";

interface CategorySectionProps {
  categorySlug: string;
  title: string;
  emoji: string;
  gradient: string;
  textColor?: string;
  articles: NewsArticle[];
}

function CategorySection({
  categorySlug,
  title,
  emoji,
  gradient,
  textColor = "text-white",
  articles,
}: CategorySectionProps) {
  const categoryArticles = articles.slice(0, 3);

  if (categoryArticles.length === 0) return null;

  return (
    <div
      className={`${gradient} rounded-2xl p-4 ${textColor} overflow-hidden relative`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <span className="text-base">{emoji}</span>
            {title}
          </h3>
          <Link
            href={`/category/${categorySlug}`}
            className="text-xs opacity-70 hover:opacity-100 transition-opacity flex items-center gap-0.5"
          >
            Semua <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {categoryArticles.map((article, i) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className={`flex gap-2.5 p-2 ${
                i === 0 ? "bg-white/15" : "bg-white/5"
              } backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors group`}
            >
              {i === 0 && (
                <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={article.image_url || PLACEHOLDER_IMAGE}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4
                  className={`font-medium ${
                    i === 0 ? "text-sm" : "text-xs"
                  } line-clamp-2 leading-snug`}
                >
                  {article.title}
                </h4>
                {i === 0 && (
                  <span className="text-[10px] opacity-60 mt-0.5 block">
                    {article.read_time || "3 min"}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  // Fetch data from Supabase
  const [
    allArticles,
    featuredArticles,
    trendingArticles,
    breakingNewsArticles,
    categories,
    trendingTags,
    politikArticles,
    ekonomiArticles,
    teknologiArticles,
    olahragaArticles,
    hiburanArticles,
  ] = await Promise.all([
    getPublishedArticles({ limit: 20 }),
    getFeaturedArticles(),
    getTrendingArticles(5),
    getBreakingNews(),
    getCategories(),
    getTrendingTagsServer(5),
    getArticlesByCategory("politik", 3),
    getArticlesByCategory("ekonomi", 3),
    getArticlesByCategory("teknologi", 3),
    getArticlesByCategory("olahraga", 3),
    getArticlesByCategory("hiburan", 3),
  ]);

  const featured = featuredArticles[0] || allArticles[0];
  const sideNews = allArticles.filter((n) => n.id !== featured?.id).slice(0, 4);
  const latestNews = allArticles.slice(0, 4);

  // Use breaking news for flash strip, fallback to latest articles if no breaking news
  const flashNewsItems =
    breakingNewsArticles.length > 0
      ? breakingNewsArticles
      : allArticles.slice(0, 4);

  return (
    <div className="bg-gradient-to-b from-muted/50 via-background to-muted/30 min-h-screen">
      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Categories & Trending */}
          <aside className="hidden lg:block lg:col-span-2">
            <ScrollReveal>
              <div className="sticky top-36 space-y-6">
                {/* Categories */}
                <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-border/50">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-primary" />
                    Kategori
                  </h3>
                  <nav className="space-y-0.5">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-lg hover:bg-accent transition-all duration-200 group"
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full ring-2 ring-offset-2 ring-offset-background transition-all duration-200 group-hover:scale-110"
                          style={{
                            backgroundColor: cat.color,
                          }}
                        />
                        <span className="group-hover:text-foreground text-muted-foreground transition-colors font-medium">
                          {cat.name}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Trending Topics */}
                <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-2xl p-4 border border-orange-200/30 dark:border-orange-900/30">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-orange-600 dark:text-orange-400">
                    <TrendingUp className="h-3 w-3" />
                    Trending
                  </h3>
                  <div className="space-y-2">
                    {trendingTags.length > 0
                      ? trendingTags.map((tag, i) => (
                          <Link
                            key={tag.id}
                            href={`/tag/${tag.slug}`}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors group"
                          >
                            <span className="text-xs font-bold text-orange-500/50 w-4">
                              {i + 1}
                            </span>
                            <span className="group-hover:translate-x-0.5 transition-transform">
                              #{tag.name}
                            </span>
                          </Link>
                        ))
                      : // Fallback jika tidak ada tags
                        ["Trending", "Berita", "Terkini", "Update", "Hot"].map(
                          (tag, i) => (
                            <Link
                              key={tag}
                              href="/trending"
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors group"
                            >
                              <span className="text-xs font-bold text-orange-500/50 w-4">
                                {i + 1}
                              </span>
                              <span className="group-hover:translate-x-0.5 transition-transform">
                                #{tag}
                              </span>
                            </Link>
                          )
                        )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-7 space-y-6">
            {/* Hero Section */}
            {featured && (
              <ScrollReveal>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Featured Big Card */}
                  <div className="md:col-span-3">
                    <NewsCard article={featured} variant="featured" />
                  </div>

                  {/* Side Stack */}
                  <div className="md:col-span-2 space-y-4">
                    {sideNews.slice(0, 2).map((article) => (
                      <NewsCard
                        key={article.id}
                        article={article}
                        variant="horizontal"
                      />
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Flash News Strip */}
            <ScrollReveal>
              <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="font-bold text-xs text-primary">
                    {breakingNewsArticles.length > 0 ? "Breaking" : "Flash"}
                  </span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex gap-8 animate-marquee whitespace-nowrap">
                    {flashNewsItems.map((article) => (
                      <Link
                        key={article.id}
                        href={`/news/${article.slug}`}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        • {article.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Category Grid - 2 columns */}
            <ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CategorySection
                  categorySlug="politik"
                  title="Politik"
                  emoji="🏛️"
                  gradient="bg-gradient-to-br from-red-600 to-rose-700"
                  articles={politikArticles}
                />
                <CategorySection
                  categorySlug="ekonomi"
                  title="Ekonomi"
                  emoji="💰"
                  gradient="bg-gradient-to-br from-emerald-600 to-teal-700"
                  articles={ekonomiArticles}
                />
              </div>
            </ScrollReveal>

            {/* Latest News Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <span className="w-1 h-5 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                  Berita Terbaru
                </h2>
                <Link
                  href="/latest"
                  className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 group"
                >
                  Lihat Semua
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {latestNews.map((article) => (
                  <StaggerItem key={article.id}>
                    <NewsCard article={article} showExcerpt={false} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </section>

            {/* Category Grid - More Categories */}
            <ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <CategorySection
                  categorySlug="teknologi"
                  title="Teknologi"
                  emoji="💻"
                  gradient="bg-gradient-to-br from-blue-600 to-indigo-700"
                  articles={teknologiArticles}
                />
                <CategorySection
                  categorySlug="olahraga"
                  title="Olahraga"
                  emoji="⚽"
                  gradient="bg-gradient-to-br from-orange-500 to-amber-600"
                  articles={olahragaArticles}
                />
                <CategorySection
                  categorySlug="hiburan"
                  title="Hiburan"
                  emoji="🎬"
                  gradient="bg-gradient-to-br from-purple-600 to-pink-600"
                  articles={hiburanArticles}
                />
              </div>
            </ScrollReveal>

            {/* Nasional Full Width */}
            <ScrollReveal>
              <div className="bg-gradient-to-r from-slate-800 to-zinc-900 rounded-2xl p-4 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm flex items-center gap-2">
                      <span className="text-base">🇮🇩</span>
                      Nasional
                    </h3>
                    <Link
                      href="/category/nasional"
                      className="text-xs opacity-70 hover:opacity-100 transition-opacity flex items-center gap-0.5"
                    >
                      Semua <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {allArticles.slice(0, 4).map((article) => (
                      <Link
                        key={article.id}
                        href={`/news/${article.slug}`}
                        className="p-2.5 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-colors group"
                      >
                        <div className="relative h-20 w-full rounded-lg overflow-hidden mb-2">
                          <Image
                            src={article.image_url || PLACEHOLDER_IMAGE}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h4 className="font-medium text-xs line-clamp-2 leading-snug">
                          {article.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </main>

          {/* Right Sidebar - Popular & Ads */}
          <aside className="lg:col-span-3">
            <div className="sticky top-36 space-y-5">
              {/* Most Popular */}
              <ScrollReveal>
                <div className="bg-background rounded-2xl shadow-lg border border-border/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3">
                    <h3 className="text-xs font-bold flex items-center gap-2 text-white">
                      <Flame className="h-3.5 w-3.5" />
                      Terpopuler
                    </h3>
                  </div>
                  <div className="p-3 space-y-0.5">
                    {trendingArticles.map((article, index) => (
                      <Link
                        key={article.id}
                        href={`/news/${article.slug}`}
                        className="flex gap-2.5 p-2 rounded-xl hover:bg-accent/50 transition-all duration-200 group"
                      >
                        <span className="text-xl font-black bg-gradient-to-br from-muted-foreground/20 to-muted-foreground/5 bg-clip-text text-transparent group-hover:from-primary/40 group-hover:to-primary/20 transition-all w-6 shrink-0">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-medium line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                            {article.title}
                          </h4>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Eye className="h-2.5 w-2.5" />
                            {article.views_count.toLocaleString()}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Newsletter CTA */}
              <ScrollReveal delay={0.1}>
                <div className="bg-gradient-to-br from-primary via-primary to-primary/80 rounded-2xl p-4 text-primary-foreground relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="text-2xl mb-1.5">📰</div>
                    <h3 className="font-bold text-base mb-0.5">Newsletter</h3>
                    <p className="text-xs text-primary-foreground/70 mb-3">
                      Berita terbaru langsung di inbox Anda.
                    </p>
                    <input
                      type="email"
                      placeholder="Email Anda"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-white/50 mb-2"
                    />
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-xs bg-white text-primary rounded-lg font-bold hover:bg-white/90 transition-colors shadow-lg"
                    >
                      Berlangganan Gratis
                    </button>
                  </div>
                </div>
              </ScrollReveal>

              {/* Quick Links */}
              <ScrollReveal delay={0.2}>
                <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-3 border border-border/50">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Baca Juga
                  </h3>
                  <div className="space-y-0.5">
                    {allArticles.slice(5, 8).map((article) => (
                      <Link
                        key={article.id}
                        href={`/news/${article.slug}`}
                        className="flex items-start gap-1.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
                      >
                        <ChevronRight className="h-3 w-3 shrink-0 mt-0.5 text-primary/50 group-hover:text-primary transition-colors" />
                        <span className="line-clamp-2 leading-snug">
                          {article.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
