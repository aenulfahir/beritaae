import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://berita.ae";
  const supabase = await createClient();

  const { data: articles } = (await supabase
    .from("articles")
    .select("title, slug, excerpt, image_url, published_at, categories(name)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50)) as {
    data:
      | {
          title: string;
          slug: string;
          excerpt: string | null;
          image_url: string | null;
          published_at: string | null;
          categories: { name: string } | { name: string }[] | null;
        }[]
      | null;
  };

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const items = (articles || [])
    .map((article) => {
      const cat = Array.isArray(article.categories)
        ? article.categories[0]
        : article.categories;
      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${baseUrl}/news/${article.slug}</link>
      <description>${escapeXml(article.excerpt || "")}</description>
      <pubDate>${new Date(article.published_at || "").toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/news/${article.slug}</guid>
      ${cat ? `<category>${escapeXml((cat as { name: string }).name)}</category>` : ""}
      ${article.image_url ? `<enclosure url="${escapeXml(article.image_url)}" type="image/jpeg" />` : ""}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Berita.AE - Portal Berita Terkini</title>
    <link>${baseUrl}</link>
    <description>Portal berita terkini dan terpercaya dari Berita.AE</description>
    <language>id</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=600",
    },
  });
}
