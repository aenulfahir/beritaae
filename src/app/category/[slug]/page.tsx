import { notFound } from "next/navigation";
import { NewsList } from "@/components/news/NewsList";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Metadata } from "next";
import {
  getCategories,
  getCategoryBySlug,
} from "@/lib/supabase/services/categories";
import { getArticlesByCategory } from "@/lib/supabase/services/articles";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Kategori Tidak Ditemukan",
    };
  }

  return {
    title: `Berita ${category.name}`,
    description: `Kumpulan berita terkini seputar ${category.name.toLowerCase()} dari BeritaAE.`,
    openGraph: {
      title: `Berita ${category.name} | BeritaAE`,
      description: `Kumpulan berita terkini seputar ${category.name.toLowerCase()} dari BeritaAE.`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Fetch category and articles in parallel
  const [category, categories, categoryArticles] = await Promise.all([
    getCategoryBySlug(slug),
    getCategories(),
    getArticlesByCategory(slug, 20),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <ScrollReveal>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <h1 className="text-3xl md:text-4xl font-bold">{category.name}</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Berita terkini seputar {category.name.toLowerCase()} dari Indonesia
            dan dunia.
          </p>
        </div>
      </ScrollReveal>

      {/* Other Categories */}
      <ScrollReveal delay={0.1}>
        <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`}>
              <Badge
                variant={cat.slug === slug ? "default" : "outline"}
                className="px-4 py-2 text-sm font-medium hover:scale-105 transition-transform cursor-pointer"
                style={
                  cat.slug === slug
                    ? { backgroundColor: cat.color }
                    : { borderColor: cat.color, color: cat.color }
                }
              >
                {cat.name}
              </Badge>
            </Link>
          ))}
        </div>
      </ScrollReveal>

      {/* Articles */}
      {categoryArticles.length > 0 ? (
        <NewsList articles={categoryArticles} />
      ) : (
        <ScrollReveal>
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Belum ada berita untuk kategori ini.
            </p>
            <Link
              href="/"
              className="text-primary hover:underline mt-4 inline-block"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
