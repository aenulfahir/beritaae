"use client";

import { NewsArticle } from "@/types";
import { NewsCard } from "./NewsCard";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";

interface BentoGridProps {
    featured: NewsArticle;
    sideNews: NewsArticle[];
}

export function BentoGrid({ featured, sideNews }: BentoGridProps) {
    return (
        <section className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Featured Article - Takes 2 columns */}
                <ScrollReveal className="lg:col-span-2 lg:row-span-3">
                    <NewsCard article={featured} variant="featured" />
                </ScrollReveal>

                {/* Side Articles */}
                <div className="space-y-4">
                    <StaggerContainer className="space-y-4">
                        {sideNews.slice(0, 3).map((article, index) => (
                            <StaggerItem key={article.id}>
                                <NewsCard article={article} variant="compact" />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </div>
        </section>
    );
}
