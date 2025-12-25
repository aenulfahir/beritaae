"use client";

import Image from "next/image";
import Link from "next/link";
import { NewsArticle } from "@/types";
import { Badge } from "@/components/ui/badge";
import { TimeAgo } from "@/components/shared/TimeAgo";
import { Eye, Clock, Bookmark, Share2, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NewsCardProps {
    article: NewsArticle;
    variant?: "default" | "featured" | "compact" | "horizontal" | "minimal";
    showExcerpt?: boolean;
}

export function NewsCard({ article, variant = "default", showExcerpt = true }: NewsCardProps) {
    if (variant === "featured") {
        return <FeaturedCard article={article} />;
    }

    if (variant === "compact") {
        return <CompactCard article={article} />;
    }

    if (variant === "horizontal") {
        return <HorizontalCard article={article} />;
    }

    if (variant === "minimal") {
        return <MinimalCard article={article} />;
    }

    return <DefaultCard article={article} showExcerpt={showExcerpt} />;
}

// Default Card - Modern glass morphism style
function DefaultCard({ article, showExcerpt }: { article: NewsArticle; showExcerpt: boolean }) {
    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
        >
            <Link href={`/news/${article.slug}`} className="block h-full group">
                <div className="relative h-full bg-background rounded-2xl overflow-hidden shadow-[0_2px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_20px_-4px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] transition-all duration-300 border border-border/50">
                    {/* Image Container */}
                    <div className="relative h-44 overflow-hidden">
                        <Image
                            src={article.image_url}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                        {/* Category Badge - Floating */}
                        <div className="absolute top-3 left-3">
                            <Badge
                                className="backdrop-blur-md bg-white/90 dark:bg-black/70 text-xs font-semibold px-2.5 py-1 shadow-lg border-0"
                                style={{ color: article.category.color }}
                            >
                                <span
                                    className="w-1.5 h-1.5 rounded-full mr-1.5 inline-block"
                                    style={{ backgroundColor: article.category.color }}
                                />
                                {article.category.name}
                            </Badge>
                        </div>

                        {/* Breaking Badge */}
                        {article.is_breaking && (
                            <div className="absolute top-3 right-3">
                                <Badge className="bg-red-500 text-white text-xs font-bold px-2 py-1 animate-pulse border-0">
                                    🔴 LIVE
                                </Badge>
                            </div>
                        )}

                        {/* Quick Actions - Appear on hover */}
                        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            <button className="p-2 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-md shadow-lg hover:scale-110 transition-transform">
                                <Bookmark className="h-3.5 w-3.5 text-foreground" />
                            </button>
                            <button className="p-2 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-md shadow-lg hover:scale-110 transition-transform">
                                <Share2 className="h-3.5 w-3.5 text-foreground" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                        {/* Title */}
                        <h3 className="font-bold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
                            {article.title}
                        </h3>

                        {/* Excerpt */}
                        {showExcerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {article.excerpt}
                            </p>
                        )}

                        {/* Meta Info */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {article.read_time}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {article.views_count.toLocaleString()}
                                </span>
                            </div>
                            <TimeAgo date={article.created_at} className="text-xs text-muted-foreground" />
                        </div>
                    </div>

                    {/* Read More Indicator */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <ArrowUpRight className="h-4 w-4 text-primary" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Featured Card - Large hero style
function FeaturedCard({ article }: { article: NewsArticle }) {
    return (
        <motion.div
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.4 }}
            className="h-full"
        >
            <Link href={`/news/${article.slug}`} className="block h-full group">
                <div className="relative h-full min-h-[350px] rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        priority
                    />

                    {/* Multi-layer gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            {article.is_breaking && (
                                <Badge className="bg-red-500 text-white font-bold animate-pulse border-0 shadow-lg">
                                    <span className="w-2 h-2 rounded-full bg-white mr-2 animate-ping" />
                                    BREAKING NEWS
                                </Badge>
                            )}
                            <Badge
                                className="backdrop-blur-md bg-white/20 text-white font-semibold border-0 shadow-lg"
                            >
                                {article.category.name}
                            </Badge>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3 group-hover:text-primary transition-colors duration-300">
                            {article.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-4 max-w-2xl">
                            {article.excerpt}
                        </p>

                        {/* Author & Meta */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Image
                                    src={article.author.avatar}
                                    alt={article.author.name}
                                    width={36}
                                    height={36}
                                    className="rounded-full ring-2 ring-white/30"
                                />
                                <div>
                                    <p className="text-white font-medium text-sm">{article.author.name}</p>
                                    <p className="text-white/60 text-xs">Penulis</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/20" />
                            <div className="flex items-center gap-4 text-white/70 text-sm">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    {article.read_time}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Eye className="h-4 w-4" />
                                    {article.views_count.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Animated border on hover */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-white/0 group-hover:border-white/20 transition-colors duration-300" />
                </div>
            </Link>
        </motion.div>
    );
}

// Compact Card - Small sidebar style
function CompactCard({ article }: { article: NewsArticle }) {
    return (
        <motion.div
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
        >
            <Link href={`/news/${article.slug}`} className="group">
                <div className="flex gap-3 p-3 rounded-xl hover:bg-accent/50 transition-all duration-200">
                    {/* Thumbnail */}
                    <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden shadow-md">
                        <Image
                            src={article.image_url}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <Badge
                            variant="outline"
                            className="w-fit text-[10px] px-1.5 py-0 h-4 mb-1 border-0 font-medium"
                            style={{
                                backgroundColor: `${article.category.color}15`,
                                color: article.category.color,
                            }}
                        >
                            {article.category.name}
                        </Badge>
                        <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                            {article.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                            <TimeAgo date={article.created_at} />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Horizontal Card - List view style (Clean layout)
function HorizontalCard({ article }: { article: NewsArticle }) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
        >
            <Link href={`/news/${article.slug}`} className="group">
                <div className="flex gap-3 p-3 bg-background rounded-xl shadow-sm hover:shadow-md border border-border/40 transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-20 w-24 shrink-0 rounded-lg overflow-hidden">
                        <Image
                            src={article.image_url}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Breaking indicator on image */}
                        {article.is_breaking && (
                            <div className="absolute top-1 left-1">
                                <span className="flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                        {/* Category */}
                        <div className="flex items-center gap-2 mb-1">
                            <span
                                className="text-[11px] font-semibold"
                                style={{ color: article.category.color }}
                            >
                                {article.category.name}
                            </span>
                            {article.is_breaking && (
                                <span className="text-[10px] font-bold text-red-500">• Breaking</span>
                            )}
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug mb-1">
                            {article.title}
                        </h3>

                        {/* Meta - single line */}
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {article.read_time}
                            </span>
                            <span className="text-border">•</span>
                            <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {(article.views_count / 1000).toFixed(1)}k
                            </span>
                            <span className="text-border">•</span>
                            <TimeAgo date={article.created_at} short />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Minimal Card - Text focused
function MinimalCard({ article }: { article: NewsArticle }) {
    return (
        <Link href={`/news/${article.slug}`} className="group block">
            <div className="py-3 border-b border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-3">
                    <div
                        className="w-1 h-12 rounded-full shrink-0 mt-0.5"
                        style={{ backgroundColor: article.category.color }}
                    />
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                            {article.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                            <span style={{ color: article.category.color }}>{article.category.name}</span>
                            <span>•</span>
                            <TimeAgo date={article.created_at} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
