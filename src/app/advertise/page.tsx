import { Metadata } from "next";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp,
    Users,
    Eye,
    BarChart3,
    Target,
    Megaphone,
    CheckCircle2,
    ArrowRight,
    Mail
} from "lucide-react";

export const metadata: Metadata = {
    title: "Beriklan",
    description: "Beriklan di BeritaAE - Jangkau jutaan pembaca Indonesia dengan berbagai format iklan.",
};

export default function AdvertisePage() {
    const stats = [
        { icon: Eye, value: "15M+", label: "Pageviews/Bulan" },
        { icon: Users, value: "2.5M+", label: "Unique Visitors" },
        { icon: TrendingUp, value: "8.5 menit", label: "Avg. Time on Site" },
        { icon: BarChart3, value: "4.2", label: "Pages/Session" },
    ];

    const adFormats = [
        {
            name: "Billboard",
            size: "970x250",
            position: "Header Homepage",
            price: "Rp 50.000.000",
            popular: true,
        },
        {
            name: "Medium Rectangle",
            size: "300x250",
            position: "Sidebar Artikel",
            price: "Rp 15.000.000",
            popular: false,
        },
        {
            name: "Leaderboard",
            size: "728x90",
            position: "Footer Artikel",
            price: "Rp 25.000.000",
            popular: false,
        },
        {
            name: "Native Ads",
            size: "Custom",
            position: "Feed Berita",
            price: "Rp 35.000.000",
            popular: true,
        },
    ];

    const benefits = [
        "Targeting berdasarkan kategori berita",
        "Laporan performa real-time",
        "A/B testing untuk optimasi",
        "Brand safety guaranteed",
        "Support 24/7 dari tim kami",
        "Flexible budget & duration",
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
            {/* Hero */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-red-500/10" />
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 relative">
                    <ScrollReveal>
                        <div className="max-w-3xl">
                            <Badge className="mb-4 bg-orange-500">Advertising</Badge>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Jangkau{" "}
                                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                    Jutaan Pembaca
                                </span>{" "}
                                Indonesia
                            </h1>
                            <p className="text-lg text-muted-foreground mb-8">
                                Tingkatkan brand awareness dan konversi bisnis Anda dengan beriklan di
                                platform berita terpercaya dengan engagement tertinggi.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button size="lg" className="gap-2 bg-orange-500 hover:bg-orange-600">
                                    <Megaphone className="h-5 w-5" />
                                    Mulai Beriklan
                                </Button>
                                <Button size="lg" variant="outline" className="gap-2">
                                    <Mail className="h-5 w-5" />
                                    Hubungi Sales
                                </Button>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 border-y bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <ScrollReveal key={stat.label} delay={index * 0.1}>
                                <div className="text-center">
                                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-orange-500" />
                                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ad Formats */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <ScrollReveal>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Format Iklan</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Pilih format yang sesuai dengan kebutuhan kampanye Anda
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {adFormats.map((format, index) => (
                            <ScrollReveal key={format.name} delay={index * 0.1}>
                                <Card className={`border-0 shadow-lg hover:shadow-xl transition-all relative ${format.popular ? 'ring-2 ring-orange-500' : ''}`}>
                                    {format.popular && (
                                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500">
                                            Popular
                                        </Badge>
                                    )}
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold mb-2">{format.name}</h3>
                                        <p className="text-sm text-muted-foreground mb-1">{format.size}</p>
                                        <p className="text-sm text-muted-foreground mb-4">{format.position}</p>
                                        <div className="text-2xl font-bold text-orange-500 mb-4">
                                            {format.price}
                                            <span className="text-sm font-normal text-muted-foreground">/bulan</span>
                                        </div>
                                        <Button className="w-full" variant={format.popular ? "default" : "outline"}>
                                            Pilih Format
                                        </Button>
                                    </CardContent>
                                </Card>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <ScrollReveal>
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Mengapa BeritaAE?</h2>
                                <ul className="space-y-4">
                                    {benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.2}>
                            <Card className="border-0 shadow-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-bold mb-4">Konsultasi Gratis</h3>
                                    <p className="text-white/80 mb-6">
                                        Tim sales kami siap membantu merencanakan kampanye iklan yang efektif untuk bisnis Anda.
                                    </p>
                                    <Button size="lg" variant="secondary" className="w-full gap-2">
                                        Hubungi Kami <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </ScrollReveal>
                    </div>
                </div>
            </section>
        </div>
    );
}
