"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Building2,
    Users,
    Briefcase,
    Megaphone,
    Save,
    Plus,
    Trash2,
    MapPin,
    Phone,
    Mail,
    Globe,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    CheckCircle,
    Upload,
} from "lucide-react";

export default function CompanyPage() {
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const teamMembers = [
        { name: "Ahmad Fadillah", role: "CEO & Founder", avatar: "https://i.pravatar.cc/150?img=1" },
        { name: "Siti Nurhaliza", role: "Editor in Chief", avatar: "https://i.pravatar.cc/150?img=5" },
        { name: "Budi Santoso", role: "Tech Lead", avatar: "https://i.pravatar.cc/150?img=12" },
        { name: "Dewi Lestari", role: "Marketing Manager", avatar: "https://i.pravatar.cc/150?img=9" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Building2 className="h-6 w-6" />
                        Perusahaan
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola informasi perusahaan dan tim
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

            {/* Tabs */}
            <Tabs defaultValue="about" className="space-y-6">
                <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="about" className="gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Tentang</span>
                    </TabsTrigger>
                    <TabsTrigger value="team" className="gap-2">
                        <Users className="h-4 w-4" />
                        <span className="hidden sm:inline">Tim</span>
                    </TabsTrigger>
                    <TabsTrigger value="careers" className="gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span className="hidden sm:inline">Karir</span>
                    </TabsTrigger>
                    <TabsTrigger value="ads" className="gap-2">
                        <Megaphone className="h-4 w-4" />
                        <span className="hidden sm:inline">Iklan</span>
                    </TabsTrigger>
                </TabsList>

                {/* About Tab */}
                <TabsContent value="about" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Profil Perusahaan</CardTitle>
                            <CardDescription>Informasi dasar tentang perusahaan</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nama Perusahaan</Label>
                                <Input defaultValue="PT Berita Aktual Indonesia" />
                            </div>
                            <div className="space-y-2">
                                <Label>Deskripsi Singkat</Label>
                                <Textarea
                                    defaultValue="BeritaAE adalah portal berita digital yang berkomitmen menyajikan informasi terkini, akurat, dan berimbang kepada masyarakat Indonesia."
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Logo</Label>
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Building2 className="h-8 w-8 text-primary" />
                                    </div>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Upload className="h-4 w-4" />
                                        Upload Logo
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Tentang Kami (Panjang)</Label>
                                <Textarea
                                    defaultValue="BeritaAE didirikan pada tahun 2020 dengan visi menjadi sumber berita terdepan di Indonesia. Kami berkomitmen untuk menyajikan berita yang akurat, cepat, dan berimbang kepada seluruh lapisan masyarakat. Tim kami terdiri dari jurnalis profesional dengan pengalaman bertahun-tahun di industri media."
                                    rows={5}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Kontak</CardTitle>
                            <CardDescription>Informasi kontak perusahaan</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Alamat
                                    </Label>
                                    <Textarea
                                        defaultValue="Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220"
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-4">
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
                                            Email
                                        </Label>
                                        <Input defaultValue="redaksi@beritaae.com" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Media Sosial</CardTitle>
                            <CardDescription>Link akun media sosial resmi</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Facebook className="h-4 w-4" />
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
                                        <Instagram className="h-4 w-4" />
                                        Instagram
                                    </Label>
                                    <Input defaultValue="https://instagram.com/beritaae" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Linkedin className="h-4 w-4" />
                                        LinkedIn
                                    </Label>
                                    <Input defaultValue="https://linkedin.com/company/beritaae" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Team Tab */}
                <TabsContent value="team" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Tim Kami</CardTitle>
                                    <CardDescription>Anggota tim yang ditampilkan di halaman publik</CardDescription>
                                </div>
                                <Button size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Tambah Anggota
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {teamMembers.map((member) => (
                                    <Card key={member.name} className="overflow-hidden">
                                        <CardContent className="p-4 text-center">
                                            <div className="relative h-20 w-20 mx-auto rounded-full overflow-hidden mb-3">
                                                <Image
                                                    src={member.avatar}
                                                    alt={member.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <h3 className="font-semibold text-sm">{member.name}</h3>
                                            <p className="text-xs text-muted-foreground">{member.role}</p>
                                            <div className="flex justify-center gap-2 mt-3">
                                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Careers Tab */}
                <TabsContent value="careers" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Lowongan Kerja</CardTitle>
                                    <CardDescription>Kelola posisi yang tersedia</CardDescription>
                                </div>
                                <Button size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Tambah Lowongan
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    { title: "Senior Journalist", type: "Full-time", location: "Jakarta" },
                                    { title: "Frontend Developer", type: "Full-time", location: "Remote" },
                                    { title: "Social Media Manager", type: "Contract", location: "Jakarta" },
                                ].map((job) => (
                                    <div key={job.title} className="flex items-center justify-between p-4 rounded-lg border">
                                        <div>
                                            <h3 className="font-semibold text-sm">{job.title}</h3>
                                            <p className="text-xs text-muted-foreground">
                                                {job.type} • {job.location}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Pengaturan Karir</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Email Penerimaan Lamaran</Label>
                                <Input defaultValue="karir@beritaae.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>Deskripsi Halaman Karir</Label>
                                <Textarea
                                    defaultValue="Bergabunglah dengan tim kami dan jadilah bagian dari perubahan di industri media digital Indonesia."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Ads Tab */}
                <TabsContent value="ads" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Informasi Iklan</CardTitle>
                            <CardDescription>Halaman pasang iklan untuk pengiklan</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Judul Halaman</Label>
                                <Input defaultValue="Pasang Iklan di BeritaAE" />
                            </div>
                            <div className="space-y-2">
                                <Label>Deskripsi</Label>
                                <Textarea
                                    defaultValue="Jangkau jutaan pembaca aktif dengan beriklan di BeritaAE. Kami menawarkan berbagai format iklan yang menarik dan efektif untuk brand Anda."
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email Kontak Iklan</Label>
                                <Input defaultValue="iklan@beritaae.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>WhatsApp</Label>
                                <Input defaultValue="+62 812 3456 7890" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Paket Iklan</CardTitle>
                                    <CardDescription>Daftar paket iklan yang ditawarkan</CardDescription>
                                </div>
                                <Button size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Tambah Paket
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    { name: "Banner Homepage", price: "Rp 5.000.000/bulan", position: "Homepage - Top" },
                                    { name: "Sidebar Ads", price: "Rp 2.500.000/bulan", position: "Sidebar - All Pages" },
                                    { name: "In-Article Ads", price: "Rp 3.000.000/bulan", position: "Within Article Content" },
                                ].map((pkg) => (
                                    <div key={pkg.name} className="flex items-center justify-between p-4 rounded-lg border">
                                        <div>
                                            <h3 className="font-semibold text-sm">{pkg.name}</h3>
                                            <p className="text-xs text-muted-foreground">{pkg.position}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-sm text-primary">{pkg.price}</span>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
