"use client";

import { useState } from "react";
import { newsArticles } from "@/data/mock";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { NewsCard } from "@/components/news/NewsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Bookmark,
    Trash2,
    Search,
    FolderPlus,
    MoreHorizontal,
    Grid3X3,
    List
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SavedPage() {
    const [view, setView] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");

    // Mock saved articles (using first 6 news articles)
    const savedArticles = newsArticles.slice(0, 6);

    const collections = [
        { name: "Teknologi", count: 12 },
        { name: "Politik", count: 8 },
        { name: "Ekonomi", count: 5 },
        { name: "Olahraga", count: 3 },
    ];

    const filteredArticles = savedArticles.filter(article =>
        article.title.toLowerCase().includes(search.toLowerCase())
    );

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
                        <Button className="gap-2">
                            <FolderPlus className="h-4 w-4" />
                            Buat Koleksi
                        </Button>
                    </div>
                </ScrollReveal>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar - Collections */}
                    <aside className="lg:col-span-1">
                        <ScrollReveal>
                            <Card className="border-0 shadow-lg sticky top-24">
                                <CardContent className="p-4">
                                    <h3 className="font-semibold mb-4">Koleksi</h3>
                                    <div className="space-y-1">
                                        <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium">
                                            <span>Semua</span>
                                            <Badge variant="secondary">{savedArticles.length}</Badge>
                                        </button>
                                        {collections.map((collection) => (
                                            <button
                                                key={collection.name}
                                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                                            >
                                                <span>{collection.name}</span>
                                                <Badge variant="outline">{collection.count}</Badge>
                                            </button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollReveal>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
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
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={view === "list" ? "default" : "outline"}
                                        size="icon"
                                        onClick={() => setView("list")}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Articles Grid/List */}
                        {filteredArticles.length > 0 ? (
                            view === "grid" ? (
                                <StaggerContainer className="grid sm:grid-cols-2 gap-6">
                                    {filteredArticles.map((article) => (
                                        <StaggerItem key={article.id}>
                                            <div className="relative group">
                                                <NewsCard article={article} showExcerpt={false} />
                                                {/* Remove Button */}
                                                <button className="absolute top-2 right-2 p-2 rounded-full bg-background/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </StaggerItem>
                                    ))}
                                </StaggerContainer>
                            ) : (
                                <div className="space-y-4">
                                    {filteredArticles.map((article, index) => (
                                        <ScrollReveal key={article.id} delay={index * 0.05}>
                                            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                                <CardContent className="p-4">
                                                    <div className="flex gap-4">
                                                        <div className="relative h-24 w-32 rounded-lg overflow-hidden shrink-0">
                                                            <Image
                                                                src={article.image_url}
                                                                alt={article.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <Badge
                                                                className="mb-2 text-xs border-0"
                                                                style={{
                                                                    backgroundColor: `${article.category.color}20`,
                                                                    color: article.category.color,
                                                                }}
                                                            >
                                                                {article.category.name}
                                                            </Badge>
                                                            <Link href={`/news/${article.slug}`}>
                                                                <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                                                                    {article.title}
                                                                </h3>
                                                            </Link>
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                Disimpan 2 hari lalu
                                                            </p>
                                                        </div>
                                                        <div className="flex items-start gap-2 shrink-0">
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                                <Trash2 className="h-4 w-4" />
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
                                <p className="text-muted-foreground">Tidak ada artikel yang cocok</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
