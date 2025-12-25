import { Metadata } from "next";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, UserCheck, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
    title: "Kebijakan Privasi",
    description: "Kebijakan privasi BeritaAE - Bagaimana kami melindungi data dan privasi Anda.",
};

export default function PrivacyPage() {
    const sections = [
        {
            icon: Database,
            title: "Data yang Kami Kumpulkan",
            content: `Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti nama, email, dan preferensi berita saat Anda mendaftar akun. Kami juga mengumpulkan data penggunaan secara otomatis, termasuk informasi perangkat, alamat IP, dan perilaku browsing untuk meningkatkan layanan kami.`,
        },
        {
            icon: Eye,
            title: "Penggunaan Data",
            content: `Data Anda digunakan untuk mempersonalisasi pengalaman membaca, mengirimkan newsletter yang relevan, meningkatkan layanan kami, dan untuk keperluan analisis internal. Kami tidak menjual data pribadi Anda kepada pihak ketiga.`,
        },
        {
            icon: Shield,
            title: "Perlindungan Data",
            content: `Kami menerapkan langkah-langkah keamanan teknis dan organisasional untuk melindungi data Anda, termasuk enkripsi SSL, firewall, dan pembatasan akses. Data sensitif disimpan dalam server yang aman dengan backup rutin.`,
        },
        {
            icon: UserCheck,
            title: "Hak Pengguna",
            content: `Anda memiliki hak untuk mengakses, memperbaiki, atau menghapus data pribadi Anda. Anda juga dapat menarik persetujuan untuk penggunaan tertentu dan meminta portabilitas data. Hubungi kami untuk menggunakan hak-hak ini.`,
        },
        {
            icon: Lock,
            title: "Cookies & Tracking",
            content: `Kami menggunakan cookies untuk mengingat preferensi Anda, menganalisis trafik website, dan menyediakan iklan yang relevan. Anda dapat mengatur preferensi cookies melalui browser Anda atau pengaturan akun.`,
        },
        {
            icon: AlertTriangle,
            title: "Perubahan Kebijakan",
            content: `Kebijakan privasi ini dapat diperbarui dari waktu ke waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi di website. Versi terbaru selalu tersedia di halaman ini.`,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
            {/* Hero */}
            <section className="py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10" />
                <div className="container mx-auto px-4 relative">
                    <ScrollReveal>
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Shield className="h-8 w-8 text-primary" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">Kebijakan Privasi</h1>
                            <p className="text-muted-foreground">
                                Terakhir diperbarui: 25 Desember 2024
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Content */}
            <section className="pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <ScrollReveal>
                            <Card className="border-0 shadow-lg mb-8">
                                <CardContent className="p-8">
                                    <p className="text-muted-foreground leading-relaxed">
                                        BeritaAE berkomitmen untuk melindungi privasi pengunjung dan pengguna website kami.
                                        Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan
                                        melindungi informasi pribadi Anda saat menggunakan layanan kami.
                                    </p>
                                </CardContent>
                            </Card>
                        </ScrollReveal>

                        <div className="space-y-6">
                            {sections.map((section, index) => (
                                <ScrollReveal key={section.title} delay={index * 0.1}>
                                    <Card className="border-0 shadow-lg">
                                        <CardContent className="p-6">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                    <section.icon className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold mb-3">{section.title}</h2>
                                                    <p className="text-muted-foreground leading-relaxed">
                                                        {section.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </ScrollReveal>
                            ))}
                        </div>

                        <ScrollReveal delay={0.6}>
                            <Card className="border-0 shadow-lg mt-8 bg-primary/5">
                                <CardContent className="p-8 text-center">
                                    <h3 className="font-bold mb-2">Ada Pertanyaan?</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Jika Anda memiliki pertanyaan tentang kebijakan privasi kami, silakan hubungi:
                                    </p>
                                    <p className="font-medium text-primary">privacy@beritaae.com</p>
                                </CardContent>
                            </Card>
                        </ScrollReveal>
                    </div>
                </div>
            </section>
        </div>
    );
}
