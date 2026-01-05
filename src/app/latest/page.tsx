import { Metadata } from "next";
import { getPublishedArticles } from "@/lib/supabase/services/articles-server";
import { getCategories } from "@/lib/supabase/services/categories-server";
import LatestClient from "./LatestClient";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Berita Terbaru",
  description: "Berita terbaru dan update terkini di BeritaAE.",
};

export default async function LatestNewsPage() {
  // Fetch data server-side
  const [articles, categories] = await Promise.all([
    getPublishedArticles({ limit: 100 }),
    getCategories(),
  ]);

  return <LatestClient initialArticles={articles} categories={categories} />;
}
