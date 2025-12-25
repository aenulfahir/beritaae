import { Metadata } from "next";
import { newsArticles } from "@/data/mock";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { NewsCard } from "@/components/news/NewsCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Eye, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Terpopuler",
    description: "Berita paling populer dan banyak dibaca di BeritaAE.",
};

export default function PopularPage() {
    // Sort by views
    const popularNews = [...newsArticles].sort((a, b) => b.views_count - a.views_count);
    const featured = popularNews[0];
    const topList = popularNews.slice(1, 6);
    const morePopular = popularNews.slice(6);

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50/50 dark:from-red-950/10 to-background">
            {/* Hero */}
            <section className="py-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-orange-500/10" />
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 relative">
                    <ScrollReveal>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500">
                                <Flame className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold">Terpopuler</h1>
                                <p className="text-muted-foreground">Berita yang paling banyak dibaca</p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <div className="container mx-auto px-4 pb-16">
                {/* Featured + Top 5 */}
                <section className="mb-12">
                    <div className="grid lg:grid-cols-5 gap-6">
                        {/* Featured */}
                        <div className="lg:col-span-3">
                            <ScrollReveal>
                                <Link href={`/news/${featured.slug}`} className="group block">
                                    <Card className="border-0 shadow-xl overflow-hidden h-full">
                                        <div className="relative h-64 md:h-80">
                                            <Image
                                                src={featured.image_url}
                                                alt={featured.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                priority
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                            {/* Rank */}
                                            <div className="absolute top-4 left-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                                    1
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <Badge className="mb-3 bg-red-500 text-white border-0">
                                                    <Flame className="h-3 w-3 mr-1" />
                                                    Most Popular
                                                </Badge>
                                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">
                                                    {featured.title}
                                                </h2>
                                                <p className="text-white/80 line-clamp-2 mb-4">{featured.excerpt}</p>
                                                <div className="flex items-center gap-4 text-white/70 text-sm">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-4 w-4" />
                                                        {featured.views_count.toLocaleString()} views
                                                    </span>
                                                    <span>{featured.read_time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </ScrollReveal>
                        </div>

                        {/* Top 5 List */}
                        <div className="lg:col-span-2">
                            <ScrollReveal delay={0.1}>
                                <Card className="border-0 shadow-xl h-full">
                                    <CardContent className="p-5">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-red-500" />
                                            Top 5 Minggu Ini
                                        </h3>
                                        <div className="space-y-4">
                                            {topList.map((article, index) => (
                                                <Link
                                                    key={article.id}
                                                    href={`/news/${article.slug}`}
                                                    className="flex gap-3 group"
                                                >
                                                    <span className="text-2xl font-black text-muted-foreground/30 group-hover:text-red-500/50 transition-colors w-8 shrink-0">
                                                        {String(index + 2).padStart(2, "0")}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-red-500 transition-colors mb-1">
                                                            {article.title}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Eye className="h-3 w-3" />
                                                            {article.views_count.toLocaleString()}
                                                            <span>•</span>
                                                            <span>{article.category.name}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* Time Filters */}
                <ScrollReveal>
                    <div className="flex items-center gap-2 mb-8">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground mr-2">Periode:</span>
                        <Button variant="default" size="sm">7 Hari</Button>
                        <Button variant="outline" size="sm">30 Hari</Button>
                        <Button variant="outline" size="sm">Semua</Button>
                    </div>
                </ScrollReveal>

                {/* More Popular */}
                <section>
                    <ScrollReveal>
                        <h2 className="text-xl font-bold mb-6">Populer Lainnya</h2>
                    </ScrollReveal>

                    <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {morePopular.map((article) => (
                            <StaggerItem key={article.id}>
                                <NewsCard article={article} showExcerpt={false} />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </section>
            </div>
        </div>
    );
}
