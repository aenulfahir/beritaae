import { Metadata } from "next";
import {
  getTrendingTagsServer,
  getTrendingArticlesServer,
} from "@/lib/supabase/services/tags-server";
import TrendingClient from "./TrendingClient";

export const metadata: Metadata = {
  title: "Trending",
  description: "Berita trending dan paling banyak dibicarakan di BeritaKita.",
};

export const revalidate = 300; // Revalidate every 5 minutes

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
