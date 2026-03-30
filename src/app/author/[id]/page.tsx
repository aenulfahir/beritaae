import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { NewsCard } from "@/components/news/NewsCard";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/ScrollReveal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Calendar, Globe, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface AuthorPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = (await supabase
    .from("profiles")
    .select("full_name, bio")
    .eq("id", id)
    .single()) as { data: any };

  if (!profile) return { title: "Penulis Tidak Ditemukan" };

  return {
    title: `${profile.full_name} - Penulis di Berita.AE`,
    description: profile.bio || `Artikel-artikel dari ${profile.full_name}`,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch author profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = (await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single()) as { data: any };

  if (!profile) notFound();

  // Fetch author's articles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: articles } = (await supabase
    .from("articles")
    .select("*, categories(*), profiles!articles_author_id_fkey(*)")
    .eq("author_id", id)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(20)) as { data: any[] | null };

  const totalViews = (articles || []).reduce(
    (sum, a) => sum + (a.views_count || 0),
    0,
  );

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const transformArticle = (row: any) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || "",
    content: "",
    image_url: row.image_url || "",
    category: row.categories || {
      id: "",
      name: "Umum",
      slug: "umum",
      color: "#6B7280",
    },
    author: row.profiles
      ? {
          id: row.profiles.id,
          name: row.profiles.full_name || "Anonymous",
          avatar: row.profiles.avatar_url || "",
        }
      : { name: "Anonymous", avatar: "" },
    is_breaking: row.is_breaking || false,
    is_featured: row.is_featured || false,
    views_count: row.views_count || 0,
    read_time: row.read_time || "5 menit",
    created_at: row.created_at,
    updated_at: row.updated_at,
  });

  const socialLinks = profile.social_links || {};
  const activeSocials = Object.entries(socialLinks).filter(
    ([, v]) => v && String(v).trim(),
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </Link>

        {/* Author Header */}
        <ScrollReveal>
          <div className="max-w-4xl mx-auto mb-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-background rounded-2xl shadow-sm border">
              <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold mb-1">
                  {profile.full_name || "Penulis"}
                </h1>
                <Badge variant="outline" className="capitalize mb-3">
                  {profile.role}
                </Badge>
                {profile.bio && (
                  <p className="text-muted-foreground text-sm mb-4">
                    {profile.bio}
                  </p>
                )}
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    {(articles || []).length} artikel
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    {totalViews.toLocaleString()} views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Sejak{" "}
                    {new Date(profile.created_at).toLocaleDateString("id-ID", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {activeSocials.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {activeSocials.map(([key, value]) => (
                      <a
                        key={key}
                        href={String(value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-xs bg-muted rounded-full hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <Globe className="h-3 w-3" />
                        {key}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Articles */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-bold mb-6">
            Artikel oleh {profile.full_name}
          </h2>
          {(articles || []).length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(articles || []).map((article) => (
                <StaggerItem key={article.id}>
                  <NewsCard article={transformArticle(article) as any} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              Belum ada artikel
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
