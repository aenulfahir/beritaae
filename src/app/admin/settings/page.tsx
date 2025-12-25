"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Settings,
    Globe,
    Bell,
    Mail,
    Shield,
    Palette,
    Database,
    Code,
    Save,
    RefreshCw,
    CheckCircle,
} from "lucide-react";

export default function SettingsPage() {
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
                        <Settings className="h-6 w-6" />
                        Pengaturan
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola konfigurasi dan preferensi portal berita
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

            {/* Settings Tabs */}
            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid grid-cols-2 lg:grid-cols-6 w-full">
                    <TabsTrigger value="general" className="gap-2">
                        <Globe className="h-4 w-4" />
                        <span className="hidden sm:inline">Umum</span>
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="gap-2">
                        <Palette className="h-4 w-4" />
                        <span className="hidden sm:inline">Tampilan</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="h-4 w-4" />
                        <span className="hidden sm:inline">Notifikasi</span>
                    </TabsTrigger>
                    <TabsTrigger value="email" className="gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="hidden sm:inline">Email</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="hidden sm:inline">Keamanan</span>
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="gap-2">
                        <Code className="h-4 w-4" />
                        <span className="hidden sm:inline">Advanced</span>
                    </TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Informasi Website</CardTitle>
                            <CardDescription>Pengaturan dasar portal berita</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Nama Website</Label>
                                    <Input defaultValue="Berita AE" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tagline</Label>
                                    <Input defaultValue="Portal Berita Terpercaya" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Deskripsi</Label>
                                <Textarea
                                    defaultValue="BeritaAE adalah portal berita yang menyajikan informasi terkini, akurat, dan terpercaya."
                                    rows={3}
                                />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>URL Website</Label>
                                    <Input defaultValue="https://beritaae.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Timezone</Label>
                                    <Select defaultValue="asia_jakarta">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="asia_jakarta">Asia/Jakarta (WIB)</SelectItem>
                                            <SelectItem value="asia_makassar">Asia/Makassar (WITA)</SelectItem>
                                            <SelectItem value="asia_jayapura">Asia/Jayapura (WIT)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">SEO</CardTitle>
                            <CardDescription>Optimasi mesin pencari</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Meta Title</Label>
                                <Input defaultValue="Berita AE - Portal Berita Terpercaya Indonesia" />
                            </div>
                            <div className="space-y-2">
                                <Label>Meta Description</Label>
                                <Textarea
                                    defaultValue="Baca berita terkini dari Indonesia dan dunia. Politik, ekonomi, olahraga, teknologi, dan hiburan."
                                    rows={2}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Meta Keywords</Label>
                                <Input defaultValue="berita, indonesia, politik, ekonomi, olahraga" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Appearance Settings */}
                <TabsContent value="appearance" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Tema</CardTitle>
                            <CardDescription>Pengaturan tampilan website</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Default Theme</Label>
                                    <Select defaultValue="system">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                            <SelectItem value="system">System</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Primary Color</Label>
                                    <div className="flex gap-2">
                                        <Input defaultValue="#3b82f6" className="flex-1" />
                                        <div className="h-10 w-10 rounded-lg bg-primary" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">Dark Mode Toggle</p>
                                    <p className="text-xs text-muted-foreground">Tampilkan toggle dark mode di header</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">Animasi</p>
                                    <p className="text-xs text-muted-foreground">Aktifkan animasi dan transisi</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Layout</CardTitle>
                            <CardDescription>Pengaturan tata letak</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Artikel per Halaman</Label>
                                    <Select defaultValue="12">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="6">6</SelectItem>
                                            <SelectItem value="12">12</SelectItem>
                                            <SelectItem value="24">24</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Sidebar Position</Label>
                                    <Select defaultValue="right">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="left">Left</SelectItem>
                                            <SelectItem value="right">Right</SelectItem>
                                            <SelectItem value="none">None</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Settings */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Push Notifications</CardTitle>
                            <CardDescription>Pengaturan notifikasi push</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">Breaking News</p>
                                    <p className="text-xs text-muted-foreground">Notifikasi untuk berita breaking</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">Komentar Baru</p>
                                    <p className="text-xs text-muted-foreground">Notifikasi untuk komentar baru</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">User Baru</p>
                                    <p className="text-xs text-muted-foreground">Notifikasi untuk registrasi user baru</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Email Settings */}
                <TabsContent value="email" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">SMTP Configuration</CardTitle>
                            <CardDescription>Pengaturan server email</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>SMTP Host</Label>
                                    <Input placeholder="smtp.gmail.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label>SMTP Port</Label>
                                    <Input placeholder="587" />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Username</Label>
                                    <Input placeholder="your-email@gmail.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <Input type="password" placeholder="••••••••" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>From Email</Label>
                                <Input placeholder="noreply@beritaae.com" />
                            </div>
                            <Button variant="outline" size="sm">
                                Test Connection
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Keamanan</CardTitle>
                            <CardDescription>Pengaturan keamanan website</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">Two-Factor Authentication</p>
                                    <p className="text-xs text-muted-foreground">Wajibkan 2FA untuk admin</p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">reCAPTCHA</p>
                                    <p className="text-xs text-muted-foreground">Aktifkan reCAPTCHA pada form</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">Login Attempts Limit</p>
                                    <p className="text-xs text-muted-foreground">Batasi percobaan login</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Advanced Settings */}
                <TabsContent value="advanced" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Cache & Performance</CardTitle>
                            <CardDescription>Pengaturan performa website</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">Enable Caching</p>
                                    <p className="text-xs text-muted-foreground">Aktifkan caching untuk performa lebih baik</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">Lazy Loading Images</p>
                                    <p className="text-xs text-muted-foreground">Muat gambar secara bertahap</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Clear Cache
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Maintenance</CardTitle>
                            <CardDescription>Mode maintenance website</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">Maintenance Mode</p>
                                    <p className="text-xs text-muted-foreground">Tampilkan halaman maintenance</p>
                                </div>
                                <Switch />
                            </div>
                            <div className="space-y-2">
                                <Label>Maintenance Message</Label>
                                <Textarea
                                    placeholder="Website sedang dalam perbaikan. Silakan kembali nanti."
                                    rows={2}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
