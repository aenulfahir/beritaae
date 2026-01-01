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
  Newspaper,
  Eye,
  MessageSquare,
  Users,
  Plus,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
} from "lucide-react";
import { RelativeTime } from "@/components/ui/RelativeTime";

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
  iconBg,
}: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            <div className="flex items-center gap-1 text-xs">
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              )}
              <span className={isPositive ? "text-green-500" : "text-red-500"}>
                {isPositive ? "+" : ""}
                {change}%
              </span>
              <span className="text-muted-foreground">vs minggu lalu</span>
            </div>
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AdminDashboard() {
  const data = await getAdminDashboardData();
  const { stats, recentArticles, popularArticles, categoryDistribution } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Selamat datang! Berikut ringkasan portal berita Anda.
          </p>
        </div>
        <Link href="/admin/articles/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Artikel Baru
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Artikel"
          value={stats.totalArticles}
          change={stats.articlesChange}
          icon={Newspaper}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews}
          change={stats.viewsChange}
          icon={Eye}
          iconColor="text-green-500"
          iconBg="bg-green-500/10"
        />
        <StatCard
          title="Komentar"
          value={stats.totalComments}
          change={stats.commentsChange}
          icon={MessageSquare}
          iconColor="text-orange-500"
          iconBg="bg-orange-500/10"
        />
        <StatCard
          title="Pengguna"
          value={stats.totalUsers}
          change={stats.usersChange}
          icon={Users}
          iconColor="text-purple-500"
          iconBg="bg-purple-500/10"
        />
      </div>

      {/* Content Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Top Articles */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Artikel Terpopuler</CardTitle>
                <CardDescription className="text-xs">
                  Berdasarkan views
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
              <div className="space-y-3">
                {popularArticles.map((article: any, i: number) => (
                  <div key={article.id} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {i + 1}
                    </span>
                    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded">
                      <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/admin/articles/${article.id}/edit`}>
                        <p className="text-xs font-medium line-clamp-1 hover:text-primary">
                          {article.title}
                        </p>
                      </Link>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views_count.toLocaleString()} views
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Belum ada artikel
              </p>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Kategori</CardTitle>
            <CardDescription className="text-xs">
              Distribusi artikel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryDistribution.slice(0, 6).map((cat: any) => (
                <div
                  key={cat.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-muted-foreground">{cat.name}</span>
                  </div>
                  <span className="font-medium">{cat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Artikel Terbaru</CardTitle>
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
              {recentArticles.map((article: any) => (
                <div
                  key={article.id}
                  className="flex items-center gap-3 rounded-lg border p-2"
                >
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded">
                    <Image
                      src={article.image_url}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="text-xs font-medium hover:text-primary line-clamp-1"
                    >
                      {article.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className="text-[10px] h-4 px-1"
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
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {article.is_breaking && (
                      <Badge
                        variant="destructive"
                        className="text-[10px] h-4 px-1"
                      >
                        <Zap className="h-3 w-3" />
                      </Badge>
                    )}
                  </div>
                </div>
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
