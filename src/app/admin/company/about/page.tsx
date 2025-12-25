"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Building2,
    Save,
    CheckCircle,
    Upload,
    MapPin,
    Phone,
    Mail,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Globe,
    Calendar,
} from "lucide-react";

export default function CompanyAboutPage() {
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Building2 className="h-6 w-6" />
                        Tentang Perusahaan
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola informasi profil perusahaan
                    </p>
                </div>
                <Button onClick={handleSave} className="gap-2">
                    {saved ? (
                        <>
                            <CheckCircle className="h-4 w-4" />
                            Tersimpan
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Simpan Perubahan
                        </>
                    )}
                </Button>
            </div>

            {/* Company Profile */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Profil Perusahaan</CardTitle>
                    <CardDescription>Informasi dasar tentang perusahaan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Nama Perusahaan</Label>
                            <Input defaultValue="PT Berita Aktual Indonesia" />
                        </div>
                        <div className="space-y-2">
                            <Label>Tahun Didirikan</Label>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <Input defaultValue="2020" type="number" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Tagline</Label>
                        <Input defaultValue="Portal Berita Terpercaya Indonesia" />
                    </div>
                    <div className="space-y-2">
                        <Label>Deskripsi Singkat</Label>
                        <Textarea
                            defaultValue="BeritaAE adalah portal berita digital yang berkomitmen menyajikan informasi terkini, akurat, dan berimbang kepada masyarakat Indonesia."
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Logo & Branding */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Logo & Branding</CardTitle>
                    <CardDescription>Upload logo dan aset visual perusahaan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Logo Utama</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                <div className="h-16 w-16 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                                    <Building2 className="h-8 w-8 text-primary" />
                                </div>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Upload className="h-4 w-4" />
                                    Upload Logo
                                </Button>
                                <p className="text-xs text-muted-foreground mt-2">PNG, SVG • Max 2MB</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Favicon</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                <div className="h-12 w-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                                    <Globe className="h-6 w-6 text-primary" />
                                </div>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Upload className="h-4 w-4" />
                                    Upload Favicon
                                </Button>
                                <p className="text-xs text-muted-foreground mt-2">ICO, PNG • 32x32px</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* About Content */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Tentang Kami</CardTitle>
                    <CardDescription>Konten lengkap halaman About</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Visi</Label>
                        <Textarea
                            defaultValue="Menjadi portal berita digital terdepan dan terpercaya di Indonesia, menyajikan informasi yang akurat dan berimbang untuk seluruh lapisan masyarakat."
                            rows={2}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Misi</Label>
                        <Textarea
                            defaultValue="1. Menyajikan berita yang akurat dan terverifikasi
2. Menjunjung tinggi etika jurnalistik
3. Memberikan informasi yang bermanfaat bagi masyarakat
4. Mengembangkan platform berita digital yang inovatif"
                            rows={4}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Sejarah Perusahaan</Label>
                        <Textarea
                            defaultValue="BeritaAE didirikan pada tahun 2020 oleh sekelompok jurnalis profesional dengan visi menciptakan platform berita digital yang terpercaya. Dimulai sebagai portal berita lokal, BeritaAE berkembang menjadi salah satu sumber berita terpopuler di Indonesia dengan jutaan pembaca setiap bulan."
                            rows={4}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Informasi Kontak</CardTitle>
                    <CardDescription>Alamat dan kontak perusahaan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Alamat Kantor
                        </Label>
                        <Textarea
                            defaultValue="Gedung Menara Berita Lt. 15
Jl. Sudirman No. 123
Jakarta Pusat, DKI Jakarta 10220
Indonesia"
                            rows={4}
                        />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Telepon
                            </Label>
                            <Input defaultValue="+62 21 1234 5678" />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email Umum
                            </Label>
                            <Input defaultValue="info@beritaae.com" />
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Email Redaksi</Label>
                            <Input defaultValue="redaksi@beritaae.com" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email Pengaduan</Label>
                            <Input defaultValue="pengaduan@beritaae.com" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Media Sosial</CardTitle>
                    <CardDescription>Link akun media sosial resmi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Facebook className="h-4 w-4 text-blue-600" />
                                Facebook
                            </Label>
                            <Input defaultValue="https://facebook.com/beritaae" />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Twitter className="h-4 w-4" />
                                Twitter/X
                            </Label>
                            <Input defaultValue="https://twitter.com/beritaae" />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Instagram className="h-4 w-4 text-pink-600" />
                                Instagram
                            </Label>
                            <Input defaultValue="https://instagram.com/beritaae" />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Youtube className="h-4 w-4 text-red-600" />
                                YouTube
                            </Label>
                            <Input defaultValue="https://youtube.com/@beritaae" />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Linkedin className="h-4 w-4 text-blue-700" />
                                LinkedIn
                            </Label>
                            <Input defaultValue="https://linkedin.com/company/beritaae" />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                TikTok
                            </Label>
                            <Input defaultValue="https://tiktok.com/@beritaae" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
