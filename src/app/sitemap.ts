import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://berita.ae";
  const supabase = await createClient();

  // Fetch all published articles
  const { data: articles } = (await supabase
    .from("articles")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })) as {
    data: { slug: string; updated_at: string }[] | null;
  };

  // Fetch all categories
  const { data: categories } = (await supabase
    .from("categories")
    .select("slug, updated_at")) as {
    data: { slug: string; updated_at: string }[] | null;
  };

  // Fetch all tags
  const { data: tags } = (await supabase.from("tags").select("slug")) as {
    data: { slug: string }[] | null;
  };

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${baseUrl}/latest`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/popular`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${baseUrl}/terms`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${baseUrl}/career`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/advertise`, changeFrequency: "monthly", priority: 0.3 },
  ];

  // Article pages
  const articlePages: MetadataRoute.Sitemap = (articles || []).map(
    (article) => ({
      url: `${baseUrl}/news/${article.slug}`,
      lastModified: new Date(article.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }),
  );

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = (categories || []).map(
    (cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(cat.updated_at),
      changeFrequency: "daily" as const,
      priority: 0.6,
    }),
  );

  // Tag pages
  const tagPages: MetadataRoute.Sitemap = (tags || []).map((tag) => ({
    url: `${baseUrl}/tag/${tag.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...articlePages, ...categoryPages, ...tagPages];
}
