import { newsArticles, categories } from "@/data/mock";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { NewsDetailClient } from "@/components/news/NewsDetailClient";

interface NewsPageProps {
    params: Promise<{ slug: string }>;
}

// Generate static params for all news articles
export async function generateStaticParams() {
    return newsArticles.map((article) => ({
        slug: article.slug,
    }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
    const { slug } = await params;
    const article = newsArticles.find((a) => a.slug === slug);

    if (!article) {
        return {
            title: "Berita Tidak Ditemukan",
        };
    }

    return {
        title: article.title,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            type: "article",
            publishedTime: article.created_at,
            authors: [article.author.name],
            images: [
                {
                    url: article.image_url,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: article.excerpt,
            images: [article.image_url],
        },
    };
}

export default async function NewsPage({ params }: NewsPageProps) {
    const { slug } = await params;
    const article = newsArticles.find((a) => a.slug === slug);

    if (!article) {
        notFound();
    }

    // Get related articles from the same category
    const relatedArticles = newsArticles
        .filter((a) => a.category.id === article.category.id && a.id !== article.id)
        .slice(0, 3);

    return (
        <NewsDetailClient
            article={article}
            relatedArticles={relatedArticles}
            categories={categories}
        />
    );
}
