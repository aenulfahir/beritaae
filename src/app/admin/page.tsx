import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminDashboardData } from "@/lib/supabase/services/admin-data";
import {
  Plus,
  ArrowRight,
  Clock,
  Zap,
  Eye,
  MessageSquare,
  TrendingUp,
  Flame,
  FileText,
  FolderOpen,
  Megaphone,
  Settings,
} from "lucide-react";
import { RelativeTime } from "@/components/ui/RelativeTime";

interface QuickActionProps {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
}

function QuickAction({
  title,
  description,
  href,
  icon: Icon,
  iconColor,
  iconBg,
}: QuickActionProps) {
  return (
    <Link href={href}>
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
        <CardContent className="p-4 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function AdminDashboard() {
  const data = await getAdminDashboardData();
  const { recentArticles, popularArticles, categoryDistribution } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Selamat datang! Kelola portal berita Anda dari sini.
          </p>
        </div>
        <Link href="/admin/articles/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Artikel Baru
          </Button>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction
          title="Tulis Artikel"
          description="Buat artikel baru"
          href="/admin/articles/new"
          icon={FileText}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
        />
        <QuickAction
          title="Breaking News"
          description="Kelola berita utama"
          href="/admin/breaking"
          icon={Zap}
          iconColor="text-red-500"
          iconBg="bg-red-500/10"
        />
        <QuickAction
          title="Kelola Iklan"
          description="Atur slot iklan"
          href="/admin/ads"
          icon={Megaphone}
          iconColor="text-green-500"
          iconBg="bg-green-500/10"
        />
        <QuickAction
          title="Pengaturan"
          description="Konfigurasi situs"
          href="/admin/settings/branding"
          icon={Settings}
          iconColor="text-purple-500"
          iconBg="bg-purple-500/10"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Articles - Takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Artikel Terbaru</CardTitle>
                <CardDescription className="text-xs">
                  Artikel yang baru dipublikasikan
                </CardDescription>
              </div>
              <Link href="/admin/articles">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  Lihat Semua <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentArticles.length > 0 ? (
              <div className="space-y-3">
                {recentArticles.slice(0, 5).map((article: any) => (
                  <div
                    key={article.id}
                    className="flex items-center gap-3 rounded-lg border p-2 hover:bg-accent/30 transition-colors"
                  >
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded">
                      <Image
                        src={article.image_url || "/placeholder.jpg"}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="text-sm font-medium hover:text-primary line-clamp-2"
                      >
                        {article.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="text-[10px] h-4 px-1.5"
                          style={{
                            borderColor: article.category.color,
                            color: article.category.color,
                          }}
                        >
                          {article.category.name}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <RelativeTime date={article.created_at} />
                        </span>
                        {article.is_breaking && (
                          <Badge
                            variant="destructive"
                            className="text-[10px] h-4 px-1"
                          >
                            <Zap className="h-3 w-3 mr-0.5" />
                            Breaking
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Link href={`/admin/articles/${article.id}/edit`}>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Edit
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-3">
                  Belum ada artikel
                </p>
                <Link href="/admin/articles/new">
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Buat Artikel Pertama
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar - Category & Quick Stats */}
        <div className="space-y-4">
          {/* Category Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Kategori
                </CardTitle>
                <Link href="/admin/categories">
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    Kelola
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categoryDistribution.slice(0, 6).map((cat: any) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-muted-foreground text-xs">
                        {cat.name}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] h-5">
                      {cat.value} artikel
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Kurasi Konten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/admin/trending"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Trending</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="/admin/popular"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Popular</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="/admin/comments"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Komentar</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Popular Articles */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Artikel Terpopuler
              </CardTitle>
              <CardDescription className="text-xs">
                Berdasarkan jumlah views
              </CardDescription>
            </div>
            <Link href="/admin/popular">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                Lihat Semua <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {popularArticles.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {popularArticles.slice(0, 5).map((article: any, i: number) => (
                <Link
                  key={article.id}
                  href={`/admin/articles/${article.id}/edit`}
                  className="group"
                >
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={article.image_url || "/placeholder.jpg"}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-2 left-2">
                      <Badge
                        variant="secondary"
                        className="text-[10px] h-5 bg-black/50 text-white border-0"
                      >
                        #{i + 1}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-medium line-clamp-2">
                        {article.title}
                      </p>
                      <p className="text-white/70 text-[10px] flex items-center gap-1 mt-1">
                        <Eye className="h-3 w-3" />
                        {article.views_count.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Belum ada artikel
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
