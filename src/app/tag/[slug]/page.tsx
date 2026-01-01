import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getTagBySlugServer,
  getArticlesByTagServer,
} from "@/lib/supabase/services/tags-server";
import TagPageClient from "./TagPageClient";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlugServer(slug);

  if (!tag) {
    return {
      title: "Tag Tidak Ditemukan",
    };
  }

  return {
    title: `#${tag.name} - Berita Terkait`,
    description: tag.description || `Kumpulan berita dengan tag #${tag.name}`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;

  const [tag, articles] = await Promise.all([
    getTagBySlugServer(slug),
    getArticlesByTagServer(slug, 30),
  ]);

  if (!tag) {
    notFound();
  }

  return <TagPageClient tag={tag} articles={articles} />;
}
