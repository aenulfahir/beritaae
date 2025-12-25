import { Metadata } from "next";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Newspaper,
    Camera,
    Video,
    Quote,
    Link2,
    Mail,
    Download,
    CheckCircle2,
    XCircle
} from "lucide-react";

export const metadata: Metadata = {
    title: "Pedoman Media",
    description: "Pedoman penggunaan konten dan aset media BeritaAE.",
};

export default function MediaGuidelinesPage() {
    const allowedUses = [
        "Kutipan singkat dengan atribusi jelas",
        "Link ke artikel dengan judul asli",
        "Screenshot untuk ulasan atau kritik",
        "Konten untuk keperluan pendidikan non-komersial",
        "Berbagi di media sosial pribadi",
    ];

    const prohibitedUses = [
        "Reproduksi artikel penuh tanpa izin",
        "Modifikasi konten yang mengubah makna",
        "Penggunaan komersial tanpa lisensi",
        "Penghapusan watermark atau atribusi",
        "Klaim kepemilikan atas konten kami",
    ];

    const assets = [
        {
            icon: Newspaper,
            title: "Logo BeritaAE",
            desc: "Logo resmi dalam berbagai format dan ukuran",
            formats: ["PNG", "SVG", "PDF"],
        },
        {
            icon: Camera,
            title: "Brand Guidelines",
            desc: "Panduan penggunaan identitas visual",
            formats: ["PDF"],
        },
        {
            icon: Video,
            title: "Media Kit",
            desc: "Informasi perusahaan untuk press release",
            formats: ["PDF", "DOCX"],
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
            {/* Hero */}
            <section className="py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10" />
                <div className="container mx-auto px-4 relative">
                    <ScrollReveal>
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Newspaper className="h-8 w-8 text-primary" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">Pedoman Media</h1>
                            <p className="text-muted-foreground">
                                Panduan penggunaan konten dan aset BeritaAE
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <div className="container mx-auto px-4 pb-16">
                <div className="max-w-4xl mx-auto">
                    {/* Usage Guidelines */}
                    <section className="mb-12">
                        <ScrollReveal>
                            <h2 className="text-2xl font-bold mb-6 text-center">Panduan Penggunaan Konten</h2>
                        </ScrollReveal>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Allowed */}
                            <ScrollReveal delay={0.1}>
                                <Card className="border-0 shadow-lg h-full border-l-4 border-l-green-500">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            <h3 className="font-bold text-green-600">Diperbolehkan</h3>
                                        </div>
                                        <ul className="space-y-3">
                                            {allowedUses.map((use, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                                    <span>{use}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </ScrollReveal>

                            {/* Prohibited */}
                            <ScrollReveal delay={0.2}>
                                <Card className="border-0 shadow-lg h-full border-l-4 border-l-red-500">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <XCircle className="h-5 w-5 text-red-500" />
                                            <h3 className="font-bold text-red-600">Tidak Diperbolehkan</h3>
                                        </div>
                                        <ul className="space-y-3">
                                            {prohibitedUses.map((use, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm">
                                                    <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                                    <span>{use}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </ScrollReveal>
                        </div>
                    </section>

                    {/* Attribution */}
                    <section className="mb-12">
                        <ScrollReveal>
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Quote className="h-6 w-6 text-primary" />
                                        <h2 className="text-xl font-bold">Cara Atribusi yang Benar</h2>
                                    </div>
                                    <div className="bg-muted rounded-xl p-4 font-mono text-sm">
                                        <p>Sumber: BeritaAE (beritaae.com)</p>
                                        <p className="mt-2">atau</p>
                                        <p className="mt-2">"[Judul Artikel]" - BeritaAE, [Tanggal]</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                                        <Link2 className="h-4 w-4" />
                                        <span>Sertakan link ke artikel asli jika memungkinkan</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollReveal>
                    </section>

                    {/* Download Assets */}
                    <section className="mb-12">
                        <ScrollReveal>
                            <h2 className="text-2xl font-bold mb-6 text-center">Download Aset</h2>
                        </ScrollReveal>

                        <div className="grid md:grid-cols-3 gap-6">
                            {assets.map((asset, index) => (
                                <ScrollReveal key={asset.title} delay={index * 0.1}>
                                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                                                <asset.icon className="h-7 w-7 text-primary" />
                                            </div>
                                            <h3 className="font-bold mb-2">{asset.title}</h3>
                                            <p className="text-sm text-muted-foreground mb-4">{asset.desc}</p>
                                            <div className="flex flex-wrap justify-center gap-2 mb-4">
                                                {asset.formats.map((format) => (
                                                    <span key={format} className="text-xs bg-muted px-2 py-1 rounded">
                                                        {format}
                                                    </span>
                                                ))}
                                            </div>
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <Download className="h-4 w-4" />
                                                Download
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </ScrollReveal>
                            ))}
                        </div>
                    </section>

                    {/* Contact */}
                    <ScrollReveal>
                        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/10 to-primary/5">
                            <CardContent className="p-8 text-center">
                                <Mail className="h-8 w-8 mx-auto mb-4 text-primary" />
                                <h3 className="font-bold text-xl mb-2">Perlu Izin Khusus?</h3>
                                <p className="text-muted-foreground mb-4">
                                    Untuk penggunaan komersial atau lisensi konten, hubungi tim media kami.
                                </p>
                                <Button className="gap-2">
                                    <Mail className="h-4 w-4" />
                                    media@beritaae.com
                                </Button>
                            </CardContent>
                        </Card>
                    </ScrollReveal>
                </div>
            </div>
        </div>
    );
}
