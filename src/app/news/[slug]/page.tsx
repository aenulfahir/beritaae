import { notFound } from "next/navigation";
import { Metadata } from "next";
import { NewsDetailClient } from "@/components/news/NewsDetailClient";
import {
  getArticleBySlug,
  getArticlesByCategory,
  incrementViewCount,
} from "@/lib/supabase/services/articles-server";
import { getCategories } from "@/lib/supabase/services/categories-server";
import { getArticleEngagement } from "@/lib/supabase/services/engagement-server";
import { createClient } from "@/lib/supabase/server";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

interface NewsPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

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
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Increment view count
  await incrementViewCount(article.id);

  // Get current user for engagement data
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get related articles, categories, and engagement data in parallel
  const [relatedArticles, categories, engagement] = await Promise.all([
    getArticlesByCategory(article.category.slug, 4),
    getCategories(),
    getArticleEngagement(article.id, user?.id),
  ]);

  // Filter out current article from related
  const filteredRelated = relatedArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.image_url,
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at,
    author: {
      "@type": "Person",
      name: article.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Berita.AE",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || ""}/news/${article.slug}`,
    },
    articleSection: article.category.name,
    wordCount: article.content?.split(/\s+/).length || 0,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsDetailClient
        article={article}
        relatedArticles={filteredRelated}
        categories={categories}
        engagement={engagement}
      />
    </>
  );
}
