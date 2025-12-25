"use client";

import { useState, useMemo } from "react";
import { newsArticles, categories } from "@/data/mock";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { NewsCard } from "@/components/news/NewsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Newspaper,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Filter,
    Clock,
    Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 8;

export default function LatestNewsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Sort by date (newest first)
    const sortedNews = useMemo(() => {
        return [...newsArticles].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }, []);

    // Filter by category
    const filteredNews = useMemo(() => {
        if (!selectedCategory) return sortedNews;
        return sortedNews.filter((article) => article.category.slug === selectedCategory);
    }, [sortedNews, selectedCategory]);

    // Pagination
    const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedNews = filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Handle page change with animation
    const handlePageChange = (page: number) => {
        if (page === currentPage || isAnimating) return;
        setIsAnimating(true);
        setCurrentPage(page);

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });

        setTimeout(() => setIsAnimating(false), 300);
    };

    // Reset to page 1 when category changes
    const handleCategoryChange = (slug: string | null) => {
        setSelectedCategory(slug);
        setCurrentPage(1);
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        pages.push(1);

        if (currentPage > 3) {
            pages.push("...");
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push("...");
        }

        if (!pages.includes(totalPages)) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/50 dark:from-blue-950/10 to-background">
            {/* Hero */}
            <section className="py-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10" />
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 relative">
                    <ScrollReveal>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
                                    <Newspaper className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold">Berita Terbaru</h1>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Update setiap saat
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-full shadow-sm">
                                    <Sparkles className="h-4 w-4 text-blue-500" />
                                    <span className="font-medium">{filteredNews.length}</span>
                                    <span className="text-muted-foreground">artikel</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-full shadow-sm">
                                    <span className="text-muted-foreground">Halaman</span>
                                    <span className="font-medium">{currentPage}</span>
                                    <span className="text-muted-foreground">dari {totalPages}</span>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <div className="container mx-auto px-4 pb-16">
                {/* Category Filters */}
                <ScrollReveal>
                    <div className="flex flex-wrap items-center gap-2 mb-8">
                        <Filter className="h-4 w-4 text-muted-foreground mr-1" />
                        <Button
                            variant={selectedCategory === null ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleCategoryChange(null)}
                            className="rounded-full"
                        >
                            Semua
                        </Button>
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={selectedCategory === cat.slug ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleCategoryChange(cat.slug)}
                                className="rounded-full"
                                style={selectedCategory === cat.slug ? { backgroundColor: cat.color } : {}}
                            >
                                {cat.name}
                            </Button>
                        ))}
                    </div>
                </ScrollReveal>

                {/* News Grid with Animation */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`page-${currentPage}-${selectedCategory}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {paginatedNews.map((article, index) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <NewsCard article={article} showExcerpt={false} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                {totalPages > 1 && (
                    <ScrollReveal>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
                            {/* Pagination Controls */}
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-2 flex items-center gap-1">
                                    {/* First Page */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>

                                    {/* Previous */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    {/* Page Numbers */}
                                    <div className="flex items-center gap-1 px-2">
                                        {getPageNumbers().map((page, index) => (
                                            <motion.div
                                                key={`${page}-${index}`}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {page === "..." ? (
                                                    <span className="px-2 text-muted-foreground">...</span>
                                                ) : (
                                                    <Button
                                                        variant={currentPage === page ? "default" : "ghost"}
                                                        size="icon"
                                                        className={`h-9 w-9 font-medium ${currentPage === page
                                                                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                                                                : ""
                                                            }`}
                                                        onClick={() => handlePageChange(page as number)}
                                                    >
                                                        {page}
                                                    </Button>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Next */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>

                                    {/* Last Page */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Quick Jump */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Lompat ke halaman:</span>
                                <select
                                    value={currentPage}
                                    onChange={(e) => handlePageChange(Number(e.target.value))}
                                    className="h-9 px-3 rounded-lg border bg-background font-medium"
                                >
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <option key={page} value={page}>
                                            {page}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </ScrollReveal>
                )}

                {/* Empty State */}
                {paginatedNews.length === 0 && (
                    <div className="text-center py-20">
                        <Newspaper className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Tidak ada berita</h3>
                        <p className="text-muted-foreground">
                            Tidak ditemukan berita untuk kategori ini.
                        </p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => handleCategoryChange(null)}
                        >
                            Lihat Semua Berita
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
