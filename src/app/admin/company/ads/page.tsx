"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Megaphone,
    Plus,
    Save,
    CheckCircle,
    MoreHorizontal,
    Edit,
    Trash2,
    DollarSign,
    Eye,
    LayoutGrid,
    Monitor,
    Smartphone,
    RectangleHorizontal,
    Square,
    Mail,
    Phone,
} from "lucide-react";

const mockAdPlacements = [
    {
        id: "1",
        name: "Homepage Banner",
        position: "Homepage - Top",
        size: "970x250 (Leaderboard)",
        priceMonthly: 5000000,
        priceWeekly: 1500000,
        isActive: true,
        impressions: 125000,
        clicks: 3200,
    },
    {
        id: "2",
        name: "Sidebar Rectangle",
        position: "Sidebar - All Pages",
        size: "300x250 (Medium Rectangle)",
        priceMonthly: 2500000,
        priceWeekly: 750000,
        isActive: true,
        impressions: 89000,
        clicks: 1800,
    },
    {
        id: "3",
        name: "In-Article Banner",
        position: "Within Article Content",
        size: "728x90 (Banner)",
        priceMonthly: 3000000,
        priceWeekly: 900000,
        isActive: true,
        impressions: 156000,
        clicks: 4500,
    },
    {
        id: "4",
        name: "Mobile Sticky",
        position: "Mobile - Bottom Sticky",
        size: "320x50 (Mobile Banner)",
        priceMonthly: 2000000,
        priceWeekly: 600000,
        isActive: false,
        impressions: 45000,
        clicks: 1200,
    },
    {
        id: "5",
        name: "Popup/Interstitial",
        position: "Popup - Entry/Exit",
        size: "600x400 (Interstitial)",
        priceMonthly: 8000000,
        priceWeekly: 2500000,
        isActive: true,
        impressions: 67000,
        clicks: 2100,
    },
];

const adSizes = [
    "970x250 (Leaderboard)",
    "728x90 (Banner)",
    "300x250 (Medium Rectangle)",
    "336x280 (Large Rectangle)",
    "320x50 (Mobile Banner)",
    "300x600 (Half Page)",
    "600x400 (Interstitial)",
];

const positions = [
    "Homepage - Top",
    "Homepage - Middle",
    "Homepage - Bottom",
    "Sidebar - All Pages",
    "Within Article Content",
    "Article - Bottom",
    "Mobile - Bottom Sticky",
    "Popup - Entry/Exit",
];

export default function CompanyAdsPage() {
    const [placements, setPlacements] = useState(mockAdPlacements);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const toggleActive = (id: string) => {
        setPlacements((prev) =>
            prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
        );
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const stats = {
        totalPlacements: placements.length,
        activePlacements: placements.filter((p) => p.isActive).length,
        totalImpressions: placements.reduce((acc, p) => acc + p.impressions, 0),
        totalClicks: placements.reduce((acc, p) => acc + p.clicks, 0),
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Megaphone className="h-6 w-6" />
                        Iklan
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola paket iklan dan halaman pasang iklan
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleSave} variant="outline" className="gap-2">
                        {saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                        Simpan
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Tambah Paket
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Tambah Paket Iklan</DialogTitle>
                                <DialogDescription>
                                    Buat paket iklan baru untuk pengiklan
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Nama Paket</Label>
                                    <Input placeholder="Contoh: Homepage Banner" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Posisi</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih posisi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {positions.map((pos) => (
                                                <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Ukuran Banner</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih ukuran" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {adSizes.map((size) => (
                                                <SelectItem key={size} value={size}>{size}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Harga/Bulan</Label>
                                        <Input type="number" placeholder="5000000" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Harga/Minggu</Label>
                                        <Input type="number" placeholder="1500000" />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button onClick={() => setIsAddDialogOpen(false)}>
                                    Simpan
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Ads Page Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Pengaturan Halaman Pasang Iklan</CardTitle>
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
                            rows={2}
                        />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email Kontak
                            </Label>
                            <Input defaultValue="iklan@beritaae.com" />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                WhatsApp
                            </Label>
                            <Input defaultValue="+62 812 3456 7890" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-4">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                            <LayoutGrid className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.totalPlacements}</p>
                            <p className="text-xs text-muted-foreground">Total Paket</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.activePlacements}</p>
                            <p className="text-xs text-muted-foreground">Aktif</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                            <Eye className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{(stats.totalImpressions / 1000).toFixed(0)}K</p>
                            <p className="text-xs text-muted-foreground">Impressions</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                            <DollarSign className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Clicks</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Ad Placements */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Paket Iklan</CardTitle>
                    <CardDescription>Daftar paket iklan yang tersedia</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {placements.map((placement) => (
                            <div key={placement.id} className={`p-4 rounded-lg border transition-all ${!placement.isActive && "opacity-60"}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-16 rounded bg-muted flex items-center justify-center shrink-0">
                                            {placement.position.includes("Mobile") ? (
                                                <Smartphone className="h-6 w-6 text-muted-foreground" />
                                            ) : placement.size.includes("Rectangle") ? (
                                                <Square className="h-6 w-6 text-muted-foreground" />
                                            ) : (
                                                <RectangleHorizontal className="h-6 w-6 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold">{placement.name}</h3>
                                                <Badge variant={placement.isActive ? "default" : "outline"}>
                                                    {placement.isActive ? "Aktif" : "Nonaktif"}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                {placement.position} • {placement.size}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2 text-sm">
                                                <span className="font-medium text-primary">
                                                    {formatPrice(placement.priceMonthly)}<span className="text-xs text-muted-foreground">/bulan</span>
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {formatPrice(placement.priceWeekly)}<span className="text-xs">/minggu</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="h-3 w-3" />
                                                    {placement.impressions.toLocaleString()} impressions
                                                </span>
                                                <span>
                                                    {placement.clicks.toLocaleString()} clicks (CTR: {((placement.clicks / placement.impressions) * 100).toFixed(2)}%)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={placement.isActive}
                                            onCheckedChange={() => toggleActive(placement.id)}
                                        />
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Preview
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
