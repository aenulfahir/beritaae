"use client";

import { NewsArticle } from "@/types";
import { NewsCard } from "./NewsCard";
import { StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";

interface NewsListProps {
    articles: NewsArticle[];
    title?: string;
}

export function NewsList({ articles, title }: NewsListProps) {
    return (
        <section className="py-8">
            {title && (
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <div className="flex-1 h-px bg-border" />
                </div>
            )}

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {articles.map((article) => (
                    <StaggerItem key={article.id}>
                        <NewsCard article={article} />
                    </StaggerItem>
                ))}
            </StaggerContainer>
        </section>
    );
}
