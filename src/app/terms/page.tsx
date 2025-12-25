import { Metadata } from "next";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, Scale, AlertCircle, Ban, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
    title: "Syarat & Ketentuan",
    description: "Syarat dan ketentuan penggunaan BeritaAE.",
};

export default function TermsPage() {
    const sections = [
        {
            icon: Users,
            title: "1. Ketentuan Umum",
            content: `Dengan mengakses dan menggunakan website BeritaAE, Anda menyetujui untuk terikat dengan syarat dan ketentuan ini. Jika Anda tidak menyetujui salah satu ketentuan, Anda tidak diperkenankan menggunakan layanan kami. Kami berhak mengubah ketentuan ini kapan saja tanpa pemberitahuan sebelumnya.`,
        },
        {
            icon: FileText,
            title: "2. Hak Cipta & Konten",
            content: `Seluruh konten di BeritaAE, termasuk teks, gambar, video, dan grafis, dilindungi hak cipta. Anda dilarang menyalin, memodifikasi, mendistribusikan, atau menggunakan konten untuk keperluan komersial tanpa izin tertulis dari kami. Penggunaan untuk keperluan pribadi dan non-komersial diperbolehkan dengan menyertakan atribusi.`,
        },
        {
            icon: Scale,
            title: "3. Komentar & Kontribusi",
            content: `Pengguna dapat memberikan komentar pada artikel dengan ketentuan: tidak mengandung SARA, pornografi, atau konten ilegal; tidak melanggar hak pihak lain; dan bersifat konstruktif. Kami berhak menghapus komentar yang melanggar ketentuan tanpa pemberitahuan.`,
        },
        {
            icon: AlertCircle,
            title: "4. Disclaimer",
            content: `BeritaAE menyajikan informasi berdasarkan sumber yang kami yakini akurat. Namun, kami tidak menjamin keakuratan, kelengkapan, atau kegunaan informasi tersebut. Pengguna bertanggung jawab atas penggunaan informasi dan keputusan yang diambil berdasarkan konten kami.`,
        },
        {
            icon: Ban,
            title: "5. Pembatasan Penggunaan",
            content: `Anda dilarang: menggunakan robot, spider, atau scraper untuk mengakses website; mencoba mengakses sistem kami secara tidak sah; menyebarkan malware atau virus; menggunakan layanan untuk spam atau phishing; serta melakukan tindakan yang dapat merusak reputasi BeritaAE.`,
        },
        {
            icon: RefreshCw,
            title: "6. Perubahan Layanan",
            content: `BeritaAE berhak mengubah, menangguhkan, atau menghentikan layanan atau fitur tertentu kapan saja. Kami akan berusaha memberikan pemberitahuan untuk perubahan signifikan. Penggunaan berkelanjutan setelah perubahan dianggap sebagai penerimaan terhadap ketentuan baru.`,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
            {/* Hero */}
            <section className="py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-blue-500/10" />
                <div className="container mx-auto px-4 relative">
                    <ScrollReveal>
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <FileText className="h-8 w-8 text-primary" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">Syarat & Ketentuan</h1>
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
                                        Selamat datang di BeritaAE. Dokumen ini mengatur hubungan hukum antara Anda sebagai
                                        pengguna dan PT BeritaAE Media sebagai penyedia layanan. Harap baca dengan seksama
                                        sebelum menggunakan layanan kami.
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
                                    <h3 className="font-bold mb-2">Pertanyaan tentang Syarat & Ketentuan?</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Hubungi tim legal kami untuk klarifikasi:
                                    </p>
                                    <p className="font-medium text-primary">legal@beritaae.com</p>
                                </CardContent>
                            </Card>
                        </ScrollReveal>
                    </div>
                </div>
            </section>
        </div>
    );
}
