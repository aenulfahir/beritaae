"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Scale,
    Save,
    CheckCircle,
    FileText,
    Shield,
    Cookie,
    AlertTriangle,
    ExternalLink,
    Calendar,
} from "lucide-react";

export default function SettingsLegalPage() {
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState("terms");

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
                        <Scale className="h-6 w-6" />
                        Legal & Kebijakan
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola dokumen legal dan kebijakan website
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

            {/* Legal Documents Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
                    <TabsTrigger value="terms" className="gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="hidden sm:inline">Syarat & Ketentuan</span>
                        <span className="sm:hidden">S&K</span>
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="hidden sm:inline">Kebijakan Privasi</span>
                        <span className="sm:hidden">Privasi</span>
                    </TabsTrigger>
                    <TabsTrigger value="cookies" className="gap-2">
                        <Cookie className="h-4 w-4" />
                        <span className="hidden sm:inline">Kebijakan Cookie</span>
                        <span className="sm:hidden">Cookie</span>
                    </TabsTrigger>
                    <TabsTrigger value="disclaimer" className="gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="hidden sm:inline">Disclaimer</span>
                    </TabsTrigger>
                </TabsList>

                {/* Terms of Service */}
                <TabsContent value="terms" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Syarat & Ketentuan
                            </CardTitle>
                            <CardDescription>
                                Dokumen syarat dan ketentuan penggunaan website
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Terakhir diperbarui: 1 Desember 2024
                                </span>
                                <Button variant="ghost" size="sm" className="ml-auto gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    Preview
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <Label>Judul</Label>
                                <Input defaultValue="Syarat dan Ketentuan Penggunaan BeritaAE" />
                            </div>
                            <div className="space-y-2">
                                <Label>Konten</Label>
                                <Textarea
                                    defaultValue={`1. PENDAHULUAN

Selamat datang di BeritaAE. Dengan mengakses dan menggunakan website ini, Anda menyetujui untuk terikat dengan syarat dan ketentuan berikut.

2. PENGGUNAAN LAYANAN

a. Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang sah.
b. Anda tidak diperkenankan untuk menyalin, mendistribusikan, atau memodifikasi konten tanpa izin.
c. Anda bertanggung jawab atas semua aktivitas yang dilakukan melalui akun Anda.

3. KONTEN PENGGUNA

a. Dengan mengirimkan komentar atau konten, Anda memberikan lisensi kepada BeritaAE untuk menggunakan konten tersebut.
b. Anda menjamin bahwa konten yang Anda kirimkan tidak melanggar hak pihak ketiga.

4. HAK KEKAYAAN INTELEKTUAL

Semua konten di BeritaAE, termasuk teks, gambar, logo, dan desain, adalah milik BeritaAE dan dilindungi oleh undang-undang hak cipta.

5. PEMBATASAN TANGGUNG JAWAB

BeritaAE tidak bertanggung jawab atas kerugian yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan kami.

6. PERUBAHAN KETENTUAN

BeritaAE berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan di website.`}
                                    rows={20}
                                    className="font-mono text-sm"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Privacy Policy */}
                <TabsContent value="privacy" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Kebijakan Privasi
                            </CardTitle>
                            <CardDescription>
                                Dokumen kebijakan privasi dan perlindungan data
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Terakhir diperbarui: 15 November 2024
                                </span>
                                <Button variant="ghost" size="sm" className="ml-auto gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    Preview
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <Label>Judul</Label>
                                <Input defaultValue="Kebijakan Privasi BeritaAE" />
                            </div>
                            <div className="space-y-2">
                                <Label>Konten</Label>
                                <Textarea
                                    defaultValue={`1. INFORMASI YANG KAMI KUMPULKAN

Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti:
- Nama dan alamat email saat mendaftar
- Komentar yang Anda kirimkan
- Informasi profil yang Anda pilih untuk dibagikan

2. PENGGUNAAN INFORMASI

Informasi yang kami kumpulkan digunakan untuk:
- Menyediakan dan mengoperasikan layanan
- Mengirimkan newsletter (jika berlangganan)
- Meningkatkan pengalaman pengguna
- Berkomunikasi dengan Anda

3. PERLINDUNGAN DATA

Kami menerapkan langkah-langkah keamanan untuk melindungi informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah.

4. COOKIE

Website kami menggunakan cookie untuk meningkatkan pengalaman browsing. Lihat Kebijakan Cookie untuk informasi lebih lanjut.

5. BERBAGI INFORMASI

Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga.

6. HAK ANDA

Anda memiliki hak untuk:
- Mengakses data pribadi Anda
- Meminta koreksi data yang tidak akurat
- Meminta penghapusan data Anda
- Menarik persetujuan kapan saja`}
                                    rows={20}
                                    className="font-mono text-sm"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Cookie Policy */}
                <TabsContent value="cookies" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Cookie className="h-5 w-5" />
                                Kebijakan Cookie
                            </CardTitle>
                            <CardDescription>
                                Dokumen kebijakan penggunaan cookie
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Terakhir diperbarui: 1 Oktober 2024
                                </span>
                                <Button variant="ghost" size="sm" className="ml-auto gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    Preview
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <Label>Judul</Label>
                                <Input defaultValue="Kebijakan Cookie BeritaAE" />
                            </div>
                            <div className="space-y-2">
                                <Label>Konten</Label>
                                <Textarea
                                    defaultValue={`1. APA ITU COOKIE?

Cookie adalah file teks kecil yang disimpan di perangkat Anda ketika mengunjungi website. Cookie membantu website mengingat preferensi Anda.

2. JENIS COOKIE YANG KAMI GUNAKAN

a. Cookie Esensial
- Diperlukan untuk fungsi dasar website
- Tidak dapat dinonaktifkan

b. Cookie Analitik
- Membantu kami memahami bagaimana pengunjung berinteraksi dengan website
- Data dikumpulkan secara anonim

c. Cookie Preferensi
- Mengingat pilihan Anda seperti tema dan bahasa

d. Cookie Marketing
- Digunakan untuk menampilkan iklan yang relevan

3. MENGELOLA COOKIE

Anda dapat mengontrol cookie melalui pengaturan browser Anda. Perlu diingat bahwa menonaktifkan cookie tertentu dapat mempengaruhi fungsionalitas website.

4. PERUBAHAN KEBIJAKAN

Kami dapat memperbarui kebijakan cookie ini dari waktu ke waktu. Perubahan akan dipublikasikan di halaman ini.`}
                                    rows={18}
                                    className="font-mono text-sm"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Disclaimer */}
                <TabsContent value="disclaimer" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Disclaimer
                            </CardTitle>
                            <CardDescription>
                                Dokumen disclaimer dan penyangkalan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Terakhir diperbarui: 1 September 2024
                                </span>
                                <Button variant="ghost" size="sm" className="ml-auto gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    Preview
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <Label>Judul</Label>
                                <Input defaultValue="Disclaimer BeritaAE" />
                            </div>
                            <div className="space-y-2">
                                <Label>Konten</Label>
                                <Textarea
                                    defaultValue={`1. KETENTUAN UMUM

Informasi yang disajikan di BeritaAE adalah untuk tujuan informasi umum saja. Kami berusaha menjaga keakuratan informasi, namun kami tidak menjamin kelengkapan atau kebenaran konten.

2. TIDAK ADA JAMINAN

Website ini disediakan "sebagaimana adanya" tanpa jaminan apapun. Kami tidak menjamin bahwa website akan selalu tersedia atau bebas dari error.

3. BATASAN TANGGUNG JAWAB

BeritaAE tidak bertanggung jawab atas:
- Kerugian yang timbul dari penggunaan informasi di website ini
- Kerusakan atau hilangnya data
- Gangguan layanan

4. LINK EKSTERNAL

Website kami mungkin berisi link ke website pihak ketiga. Kami tidak bertanggung jawab atas konten atau praktik privasi website tersebut.

5. OPINI DAN PANDANGAN

Opini yang disampaikan dalam artikel atau komentar adalah milik penulis masing-masing dan tidak selalu mencerminkan pandangan BeritaAE.

6. KOREKSI

Jika Anda menemukan kesalahan dalam konten kami, silakan hubungi redaksi@beritaae.com untuk koreksi.`}
                                    rows={18}
                                    className="font-mono text-sm"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
