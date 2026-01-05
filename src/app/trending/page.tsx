import { Metadata } from "next";
import {
  getTrendingTagsServer,
  getTrendingArticlesServer,
} from "@/lib/supabase/services/tags-server";
import TrendingClient from "./TrendingClient";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trending",
  description: "Berita trending dan paling banyak dibicarakan di BeritaKita.",
};

export default async function TrendingPage() {
  // Fetch data server-side
  const [trendingTags, trendingArticles] = await Promise.all([
    getTrendingTagsServer(10),
    getTrendingArticlesServer(20),
  ]);

  return (
    <TrendingClient
      initialTags={trendingTags}
      initialArticles={trendingArticles}
    />
  );
}
