import { Metadata } from "next";
import { newsArticles } from "@/data/mock";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { NewsCard } from "@/components/news/NewsCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Flame, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Trending",
    description: "Berita trending dan paling banyak dibicarakan di BeritaAE.",
};

export default function TrendingPage() {
    // Sort by views for trending
    const trendingNews = [...newsArticles].sort((a, b) => b.views_count - a.views_count);
    const topTrending = trendingNews.slice(0, 3);
    const restTrending = trendingNews.slice(3);

    const trendingTopics = [
        { tag: "#CPNS2025", count: "25.4K" },
        { tag: "#PialaAFF", count: "18.2K" },
        { tag: "#UMK2025", count: "15.8K" },
        { tag: "#Nataru", count: "12.1K" },
        { tag: "#IKN", count: "9.5K" },
        { tag: "#APBN2025", count: "8.3K" },
    ];

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
                                <p className="text-muted-foreground">Berita paling banyak dibicarakan</p>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Trending Topics */}
                    <ScrollReveal delay={0.1}>
                        <div className="flex flex-wrap gap-3 mb-8">
                            {trendingTopics.map((topic) => (
                                <Link key={topic.tag} href={`/search?q=${topic.tag}`}>
                                    <Badge
                                        variant="outline"
                                        className="px-4 py-2 text-sm hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors cursor-pointer"
                                    >
                                        {topic.tag}
                                        <span className="ml-2 text-xs opacity-70">{topic.count}</span>
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <div className="container mx-auto px-4 pb-16">
                {/* Top 3 Trending */}
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
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                                                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                                                        'bg-gradient-to-br from-amber-600 to-amber-700'
                                                }`}>
                                                {index + 1}
                                            </div>
                                        </div>

                                        <div className="relative h-48">
                                            <Image
                                                src={article.image_url}
                                                alt={article.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        </div>

                                        <CardContent className="p-4">
                                            <Badge
                                                className="mb-2 text-xs border-0"
                                                style={{
                                                    backgroundColor: `${article.category.color}20`,
                                                    color: article.category.color,
                                                }}
                                            >
                                                {article.category.name}
                                            </Badge>
                                            <h3 className="font-bold line-clamp-2 group-hover:text-orange-500 transition-colors mb-2">
                                                {article.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <TrendingUp className="h-4 w-4 text-orange-500" />
                                                <span className="font-medium">{article.views_count.toLocaleString()} views</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                </section>

                {/* Rest of Trending */}
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
                                <NewsCard article={article} showExcerpt={false} />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </section>
            </div>
        </div>
    );
}
