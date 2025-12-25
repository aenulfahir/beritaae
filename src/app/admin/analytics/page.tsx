"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { dashboardStats } from "@/data/admin-mock";
import { newsArticles, categories } from "@/data/mock";
import {
    Eye,
    Users,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Globe,
    Smartphone,
    Monitor,
    Tablet,
    Clock,
    Calendar,
    BarChart3,
    PieChartIcon,
    Activity,
    MousePointer,
    Timer,
    FileText,
} from "lucide-react";
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
    Legend,
} from "recharts";

// Mock data for analytics
const weeklyViews = [
    { name: "Sen", views: 12400, unique: 8200, returning: 4200 },
    { name: "Sel", views: 15600, unique: 10400, returning: 5200 },
    { name: "Rab", views: 18200, unique: 12100, returning: 6100 },
    { name: "Kam", views: 14800, unique: 9800, returning: 5000 },
    { name: "Jum", views: 16500, unique: 11000, returning: 5500 },
    { name: "Sab", views: 21000, unique: 14000, returning: 7000 },
    { name: "Min", views: 19500, unique: 13000, returning: 6500 },
];

const monthlyViews = [
    { name: "Jan", views: 450000 },
    { name: "Feb", views: 420000 },
    { name: "Mar", views: 510000 },
    { name: "Apr", views: 480000 },
    { name: "Mei", views: 520000 },
    { name: "Jun", views: 550000 },
    { name: "Jul", views: 580000 },
    { name: "Agu", views: 620000 },
    { name: "Sep", views: 590000 },
    { name: "Okt", views: 640000 },
    { name: "Nov", views: 680000 },
    { name: "Des", views: 720000 },
];

const hourlyTraffic = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, "0")}:00`,
    views: Math.floor(Math.random() * 3000) + 500,
}));

const deviceData = [
    { name: "Mobile", value: 58, color: "#3b82f6", icon: Smartphone },
    { name: "Desktop", value: 32, color: "#10b981", icon: Monitor },
    { name: "Tablet", value: 10, color: "#f59e0b", icon: Tablet },
];

const topPages = [
    { path: "/news/pemerintah-luncurkan-program", views: 45200, change: 12.5 },
    { path: "/news/ekonomi-indonesia-tumbuh", views: 38400, change: -5.2 },
    { path: "/category/teknologi", views: 32100, change: 8.7 },
    { path: "/news/timnas-lolos-piala-dunia", views: 28900, change: 24.3 },
    { path: "/category/politik", views: 25600, change: 3.1 },
];

const trafficSources = [
    { name: "Organic Search", value: 45, color: "#3b82f6" },
    { name: "Direct", value: 25, color: "#10b981" },
    { name: "Social Media", value: 18, color: "#8b5cf6" },
    { name: "Referral", value: 8, color: "#f59e0b" },
    { name: "Email", value: 4, color: "#ef4444" },
];

const categoryPerformance = categories.map((cat) => ({
    name: cat.name,
    articles: newsArticles.filter((a) => a.category.id === cat.id).length,
    views: Math.floor(Math.random() * 50000) + 10000,
    color: cat.color,
}));

interface MetricCardProps {
    title: string;
    value: string | number;
    change: number;
    icon: React.ComponentType<{ className?: string }>;
    subtitle?: string;
}

function MetricCard({ title, value, change, icon: Icon, subtitle }: MetricCardProps) {
    const isPositive = change >= 0;
    return (
        <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
                        <p className="text-3xl font-bold tracking-tight">
                            {typeof value === "number" ? value.toLocaleString() : value}
                        </p>
                        <div className="flex items-center gap-2">
                            <Badge variant={isPositive ? "default" : "destructive"} className="gap-1 px-1.5 py-0.5 text-[10px]">
                                {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {Math.abs(change)}%
                            </Badge>
                            <span className="text-xs text-muted-foreground">{subtitle || "vs periode lalu"}</span>
                        </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AnalyticsPage() {
    const [period, setPeriod] = useState("7d");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Analitik</h1>
                    <p className="text-sm text-muted-foreground">
                        Pantau performa dan statistik portal berita Anda
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[140px] h-9">
                            <Calendar className="h-4 w-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">24 Jam</SelectItem>
                            <SelectItem value="7d">7 Hari</SelectItem>
                            <SelectItem value="30d">30 Hari</SelectItem>
                            <SelectItem value="90d">90 Hari</SelectItem>
                            <SelectItem value="1y">1 Tahun</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Pageviews"
                    value="156.4K"
                    change={12.5}
                    icon={Eye}
                />
                <MetricCard
                    title="Unique Visitors"
                    value="89.2K"
                    change={8.3}
                    icon={Users}
                />
                <MetricCard
                    title="Avg. Session Duration"
                    value="4m 32s"
                    change={-2.1}
                    icon={Timer}
                />
                <MetricCard
                    title="Bounce Rate"
                    value="42.3%"
                    change={-5.4}
                    icon={MousePointer}
                    subtitle="lebih rendah lebih baik"
                />
            </div>

            {/* Main Chart */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base">Traffic Overview</CardTitle>
                            <CardDescription>Pageviews dan unique visitors</CardDescription>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                                <span className="text-muted-foreground">Total Views</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                <span className="text-muted-foreground">Unique</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                                <span className="text-muted-foreground">Returning</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyViews}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--background))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                    }}
                                />
                                <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                                <Area type="monotone" dataKey="unique" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorUnique)" />
                                <Area type="monotone" dataKey="returning" stroke="#f59e0b" strokeWidth={2} fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Secondary Charts Row */}
            <div className="grid gap-4 lg:grid-cols-3">
                {/* Device Breakdown */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            Perangkat
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[180px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deviceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {deviceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-2 mt-2">
                            {deviceData.map((device) => {
                                const Icon = device.icon;
                                return (
                                    <div key={device.name} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <Icon className="h-4 w-4" style={{ color: device.color }} />
                                            <span>{device.name}</span>
                                        </div>
                                        <span className="font-medium">{device.value}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Traffic Sources */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Sumber Traffic
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[180px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={trafficSources}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {trafficSources.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-2 mt-2">
                            {trafficSources.slice(0, 4).map((source) => (
                                <div key={source.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                                        <span className="text-muted-foreground">{source.name}</span>
                                    </div>
                                    <span className="font-medium">{source.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Hourly Traffic */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Traffic per Jam
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={hourlyTraffic.slice(0, 12)}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                                    <XAxis dataKey="hour" tick={{ fontSize: 9 }} interval={1} />
                                    <YAxis tick={{ fontSize: 10 }} width={40} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--background))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                        }}
                                    />
                                    <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Pages & Category Performance */}
            <div className="grid gap-4 lg:grid-cols-2">
                {/* Top Pages */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Halaman Terpopuler
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topPages.map((page, i) => (
                                <div key={page.path} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                                        {i + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{page.path}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {page.views.toLocaleString()} views
                                        </p>
                                    </div>
                                    <Badge variant={page.change >= 0 ? "default" : "destructive"} className="text-[10px]">
                                        {page.change >= 0 ? "+" : ""}{page.change}%
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Category Performance */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <PieChartIcon className="h-4 w-4" />
                            Performa Kategori
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryPerformance} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                                    <XAxis type="number" tick={{ fontSize: 10 }} />
                                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--background))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                        }}
                                    />
                                    <Bar dataKey="views" radius={[0, 4, 4, 0]}>
                                        {categoryPerformance.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Real-time Stats */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                            Real-time
                        </CardTitle>
                        <Badge variant="outline" className="gap-1.5 text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            Live
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-4">
                        <div className="text-center p-4 rounded-xl bg-muted/50">
                            <p className="text-3xl font-bold text-green-500">247</p>
                            <p className="text-xs text-muted-foreground mt-1">Pengunjung aktif</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-muted/50">
                            <p className="text-3xl font-bold">1,234</p>
                            <p className="text-xs text-muted-foreground mt-1">Pageviews (1 jam)</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-muted/50">
                            <p className="text-3xl font-bold">89</p>
                            <p className="text-xs text-muted-foreground mt-1">New visitors</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-muted/50">
                            <p className="text-3xl font-bold">3m 45s</p>
                            <p className="text-xs text-muted-foreground mt-1">Avg. time on page</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
