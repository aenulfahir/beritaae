import { Metadata } from "next";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    MessageSquare,
    Building2,
    Headphones
} from "lucide-react";

export const metadata: Metadata = {
    title: "Hubungi Kami",
    description: "Hubungi tim BeritaAE untuk pertanyaan, saran, atau kerjasama.",
};

export default function ContactPage() {
    const contactInfo = [
        {
            icon: Building2,
            title: "Kantor Pusat",
            details: ["Gedung BeritaAE Tower", "Jl. Sudirman No. 123, Lt. 15", "Jakarta Selatan 12190"],
        },
        {
            icon: Phone,
            title: "Telepon",
            details: ["+62 21 1234 5678", "+62 21 1234 5679 (Fax)"],
        },
        {
            icon: Mail,
            title: "Email",
            details: ["redaksi@beritaae.com", "iklan@beritaae.com", "kerjasama@beritaae.com"],
        },
        {
            icon: Clock,
            title: "Jam Operasional",
            details: ["Senin - Jumat: 08.00 - 17.00 WIB", "Sabtu: 09.00 - 14.00 WIB", "Minggu: Libur"],
        },
    ];

    const departments = [
        { icon: MessageSquare, name: "Redaksi", email: "redaksi@beritaae.com", desc: "Kritik, saran, koreksi berita" },
        { icon: Headphones, name: "Customer Service", email: "cs@beritaae.com", desc: "Bantuan teknis & akun" },
        { icon: Building2, name: "Kemitraan", email: "partner@beritaae.com", desc: "Kerjasama & kolaborasi" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
            {/* Hero */}
            <section className="py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10" />
                <div className="container mx-auto px-4 relative">
                    <ScrollReveal>
                        <div className="text-center max-w-2xl mx-auto">
                            <Badge className="mb-4">Kontak</Badge>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
                            <p className="text-lg text-muted-foreground">
                                Ada pertanyaan atau masukan? Kami senang mendengar dari Anda.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <div className="container mx-auto px-4 pb-16">
                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <ScrollReveal>
                            <Card className="border-0 shadow-xl">
                                <CardContent className="p-8">
                                    <h2 className="text-2xl font-bold mb-6">Kirim Pesan</h2>
                                    <form className="space-y-5">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Nama Lengkap</label>
                                                <Input placeholder="John Doe" className="h-11" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Email</label>
                                                <Input type="email" placeholder="john@example.com" className="h-11" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Subjek</label>
                                            <Input placeholder="Tentang apa pesan Anda?" className="h-11" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Departemen</label>
                                            <select className="w-full h-11 px-3 rounded-md border bg-background">
                                                <option>Pilih Departemen</option>
                                                <option>Redaksi</option>
                                                <option>Customer Service</option>
                                                <option>Iklan & Kemitraan</option>
                                                <option>Karir</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Pesan</label>
                                            <textarea
                                                className="w-full min-h-[150px] px-3 py-2 rounded-md border bg-background resize-none"
                                                placeholder="Tulis pesan Anda di sini..."
                                            />
                                        </div>
                                        <Button size="lg" className="w-full gap-2">
                                            <Send className="h-4 w-4" />
                                            Kirim Pesan
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </ScrollReveal>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {contactInfo.map((info, index) => (
                            <ScrollReveal key={info.title} delay={index * 0.1}>
                                <Card className="border-0 shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                <info.icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-2">{info.title}</h3>
                                                {info.details.map((detail, i) => (
                                                    <p key={i} className="text-sm text-muted-foreground">{detail}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </ScrollReveal>
                        ))}

                        {/* Map Placeholder */}
                        <ScrollReveal delay={0.4}>
                            <Card className="border-0 shadow-lg overflow-hidden">
                                <div className="aspect-video bg-muted relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <MapPin className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">Peta Lokasi</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </ScrollReveal>
                    </div>
                </div>

                {/* Department Cards */}
                <section className="mt-16">
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold mb-8 text-center">Kontak Departemen</h2>
                    </ScrollReveal>
                    <div className="grid md:grid-cols-3 gap-6">
                        {departments.map((dept, index) => (
                            <ScrollReveal key={dept.name} delay={index * 0.1}>
                                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                            <dept.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="font-semibold mb-1">{dept.name}</h3>
                                        <p className="text-sm text-muted-foreground mb-2">{dept.desc}</p>
                                        <p className="text-sm text-primary font-medium">{dept.email}</p>
                                    </CardContent>
                                </Card>
                            </ScrollReveal>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
