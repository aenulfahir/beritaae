"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dashboardStats, recentActivity } from "@/data/admin-mock";
import { newsArticles, categories } from "@/data/mock";
import {
    Newspaper,
    Eye,
    MessageSquare,
    Users,
    Plus,
    ArrowRight,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Clock,
    Zap,
    MoreHorizontal,
} from "lucide-react";
import { RelativeTime } from "@/components/ui/RelativeTime";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts";

// Mock data for charts
const viewsData = [
    { name: "Sen", views: 4000, articles: 12 },
    { name: "Sel", views: 3000, articles: 8 },
    { name: "Rab", views: 5000, articles: 15 },
    { name: "Kam", views: 2780, articles: 10 },
    { name: "Jum", views: 1890, articles: 6 },
    { name: "Sab", views: 2390, articles: 9 },
    { name: "Min", views: 3490, articles: 11 },
];

const trafficData = [
    { name: "00:00", value: 400 },
    { name: "03:00", value: 300 },
    { name: "06:00", value: 600 },
    { name: "09:00", value: 1400 },
    { name: "12:00", value: 1800 },
    { name: "15:00", value: 2200 },
    { name: "18:00", value: 1900 },
    { name: "21:00", value: 1200 },
];

const categoryData = categories.map((cat) => ({
    name: cat.name,
    value: newsArticles.filter((a) => a.category.id === cat.id).length,
    color: cat.color,
}));

const deviceData = [
    { name: "Mobile", value: 58, color: "#3b82f6" },
    { name: "Desktop", value: 32, color: "#10b981" },
    { name: "Tablet", value: 10, color: "#f59e0b" },
];

interface StatCardProps {
    title: string;
    value: string | number;
    change: number;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    iconBg: string;
}

function StatCard({ title, value, change, icon: Icon, iconColor, iconBg }: StatCardProps) {
    const isPositive = change >= 0;
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</p>
                        <div className="flex items-center gap-1 text-xs">
                            {isPositive ? (
                                <ArrowUpRight className="h-3 w-3 text-green-500" />
                            ) : (
                                <ArrowDownRight className="h-3 w-3 text-red-500" />
                            )}
                            <span className={isPositive ? "text-green-500" : "text-red-500"}>
                                {isPositive ? "+" : ""}{change}%
                            </span>
                            <span className="text-muted-foreground">vs minggu lalu</span>
                        </div>
                    </div>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminDashboard() {
    const recentArticles = newsArticles.slice(0, 5);
    const topArticles = [...newsArticles].sort((a, b) => b.views_count - a.views_count).slice(0, 5);

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
                    value={dashboardStats.totalArticles}
                    change={12}
                    icon={Newspaper}
                    iconColor="text-blue-500"
                    iconBg="bg-blue-500/10"
                />
                <StatCard
                    title="Total Views"
                    value={dashboardStats.totalViews}
                    change={8}
                    icon={Eye}
                    iconColor="text-green-500"
                    iconBg="bg-green-500/10"
                />
                <StatCard
                    title="Komentar"
                    value={dashboardStats.totalComments}
                    change={-5}
                    icon={MessageSquare}
                    iconColor="text-orange-500"
                    iconBg="bg-orange-500/10"
                />
                <StatCard
                    title="Pengguna"
                    value={dashboardStats.totalUsers}
                    change={15}
                    icon={Users}
                    iconColor="text-purple-500"
                    iconBg="bg-purple-500/10"
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-4 lg:grid-cols-3">
                {/* Views Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Views Overview</CardTitle>
                                <CardDescription className="text-xs">Statistik views 7 hari terakhir</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs">
                                Lihat Detail
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={viewsData}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 11 }} />
                                    <YAxis className="text-xs" tick={{ fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--background))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                            fontSize: "12px"
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="views"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorViews)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Traffic by Hour */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Traffic Harian</CardTitle>
                        <CardDescription className="text-xs">Berdasarkan jam</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trafficData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--background))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                            fontSize: "12px"
                                        }}
                                    />
                                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid gap-4 lg:grid-cols-4">
                {/* Category Distribution */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Kategori</CardTitle>
                        <CardDescription className="text-xs">Distribusi artikel</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[180px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={70}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--background))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                            fontSize: "12px"
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2 space-y-1">
                            {categoryData.slice(0, 4).map((cat) => (
                                <div key={cat.name} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="text-muted-foreground">{cat.name}</span>
                                    </div>
                                    <span className="font-medium">{cat.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Device Distribution */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Perangkat</CardTitle>
                        <CardDescription className="text-xs">Trafik berdasarkan device</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[180px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deviceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={70}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {deviceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--background))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                            fontSize: "12px"
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2 space-y-1">
                            {deviceData.map((device) => (
                                <div key={device.name} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: device.color }} />
                                        <span className="text-muted-foreground">{device.name}</span>
                                    </div>
                                    <span className="font-medium">{device.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Articles */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Artikel Terpopuler</CardTitle>
                                <CardDescription className="text-xs">Berdasarkan views</CardDescription>
                            </div>
                            <Link href="/admin/popular">
                                <Button variant="ghost" size="sm" className="text-xs gap-1">
                                    Lihat Semua <ArrowRight className="h-3 w-3" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topArticles.map((article, i) => (
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
                                        <p className="text-xs font-medium line-clamp-1">{article.title}</p>
                                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {article.views_count.toLocaleString()} views
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid gap-4 lg:grid-cols-3">
                {/* Recent Articles */}
                <Card className="lg:col-span-2">
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
                        <div className="space-y-3">
                            {recentArticles.map((article) => (
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
                                            <Badge variant="destructive" className="text-[10px] h-4 px-1">
                                                <Zap className="h-3 w-3" />
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Feed */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Aktivitas Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentActivity.slice(0, 6).map((activity) => (
                                <div key={activity.id} className="flex items-start gap-2">
                                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs">
                                            <span className="font-medium">{activity.action}</span>
                                            {activity.target && (
                                                <span className="text-muted-foreground"> - {activity.target}</span>
                                            )}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {activity.user} • <RelativeTime date={activity.timestamp} />
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
