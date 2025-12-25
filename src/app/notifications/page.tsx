"use client";

import { useState } from "react";
import { newsArticles } from "@/data/mock";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Bell,
    Check,
    Trash2,
    Settings,
    MessageSquare,
    TrendingUp,
    Newspaper,
    Users,
    Clock
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NotificationsPage() {
    const [filter, setFilter] = useState("all");

    // Mock notifications
    const notifications = [
        {
            id: 1,
            type: "breaking",
            title: "Breaking News: Pemerintah Luncurkan Program Baru",
            message: "Berita terbaru tentang kebijakan ekonomi telah dipublikasikan.",
            time: "5 menit lalu",
            read: false,
            image: newsArticles[0].image_url,
        },
        {
            id: 2,
            type: "comment",
            title: "Seseorang membalas komentar Anda",
            message: "Ahmad: 'Setuju dengan pendapat Anda tentang...'",
            time: "1 jam lalu",
            read: false,
        },
        {
            id: 3,
            type: "trending",
            title: "Artikel Anda masuk Top 10 Trending",
            message: "Selamat! Artikel yang Anda simpan sedang viral.",
            time: "3 jam lalu",
            read: true,
        },
        {
            id: 4,
            type: "news",
            title: "Berita baru dari kategori favorit Anda",
            message: "5 artikel baru di kategori Teknologi",
            time: "5 jam lalu",
            read: true,
        },
        {
            id: 5,
            type: "follow",
            title: "Penulis favorit Anda memposting artikel baru",
            message: "Siti Rahayu baru saja mempublikasikan artikel.",
            time: "1 hari lalu",
            read: true,
        },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case "breaking": return <Newspaper className="h-5 w-5 text-red-500" />;
            case "comment": return <MessageSquare className="h-5 w-5 text-blue-500" />;
            case "trending": return <TrendingUp className="h-5 w-5 text-orange-500" />;
            case "news": return <Bell className="h-5 w-5 text-primary" />;
            case "follow": return <Users className="h-5 w-5 text-green-500" />;
            default: return <Bell className="h-5 w-5" />;
        }
    };

    const filteredNotifications = filter === "all"
        ? notifications
        : filter === "unread"
            ? notifications.filter(n => !n.read)
            : notifications.filter(n => n.type === filter);

    return (
        <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <ScrollReveal>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-primary/10">
                                    <Bell className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">Notifikasi</h1>
                                    <p className="text-sm text-muted-foreground">
                                        {notifications.filter(n => !n.read).length} belum dibaca
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Check className="h-4 w-4" />
                                    Tandai Semua Dibaca
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Filters */}
                    <ScrollReveal delay={0.1}>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {[
                                { key: "all", label: "Semua" },
                                { key: "unread", label: "Belum Dibaca" },
                                { key: "breaking", label: "Breaking" },
                                { key: "news", label: "Berita" },
                                { key: "comment", label: "Komentar" },
                            ].map((f) => (
                                <Button
                                    key={f.key}
                                    variant={filter === f.key ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setFilter(f.key)}
                                >
                                    {f.label}
                                </Button>
                            ))}
                        </div>
                    </ScrollReveal>

                    {/* Notifications List */}
                    <div className="space-y-3">
                        {filteredNotifications.map((notification, index) => (
                            <ScrollReveal key={notification.id} delay={index * 0.05}>
                                <Card className={`border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${!notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}>
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            {/* Icon or Image */}
                                            {notification.image ? (
                                                <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0">
                                                    <Image
                                                        src={notification.image}
                                                        alt=""
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                                                    {getIcon(notification.type)}
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className={`font-semibold text-sm ${!notification.read ? '' : 'text-muted-foreground'}`}>
                                                        {notification.title}
                                                    </h3>
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <Button variant="ghost" size="icon" className="shrink-0 opacity-0 group-hover:opacity-100">
                                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </ScrollReveal>
                        ))}
                    </div>

                    {filteredNotifications.length === 0 && (
                        <div className="text-center py-16">
                            <Bell className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                            <p className="text-muted-foreground">Tidak ada notifikasi</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
