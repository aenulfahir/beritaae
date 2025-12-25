"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Search,
    Plus,
    MoreHorizontal,
    PenTool,
    FileText,
    Eye,
    Mail,
    Phone,
    Edit,
    Trash2,
    ExternalLink,
    CheckCircle,
    XCircle,
    Star,
    TrendingUp,
    Calendar,
} from "lucide-react";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { newsArticles } from "@/data/mock";

// Mock authors data
const mockAuthors = [
    {
        id: "1",
        name: "Ahmad Fadillah",
        email: "ahmad@beritaae.com",
        avatar: "https://i.pravatar.cc/150?img=11",
        bio: "Jurnalis senior dengan pengalaman 10 tahun di bidang politik dan ekonomi.",
        phone: "+62 812-1111-2222",
        status: "active",
        verified: true,
        articlesCount: 156,
        totalViews: 1250000,
        rating: 4.8,
        joinedAt: "2023-01-15T00:00:00Z",
    },
    {
        id: "2",
        name: "Siti Nurhaliza",
        email: "siti@beritaae.com",
        avatar: "https://i.pravatar.cc/150?img=5",
        bio: "Kontributor aktif untuk berita hiburan dan lifestyle.",
        phone: "+62 813-2222-3333",
        status: "active",
        verified: true,
        articlesCount: 89,
        totalViews: 780000,
        rating: 4.5,
        joinedAt: "2023-06-20T00:00:00Z",
    },
    {
        id: "3",
        name: "Budi Santoso",
        email: "budi@beritaae.com",
        avatar: "https://i.pravatar.cc/150?img=12",
        bio: "Penulis teknologi dan reviewer gadget.",
        phone: "+62 814-3333-4444",
        status: "active",
        verified: false,
        articlesCount: 45,
        totalViews: 320000,
        rating: 4.2,
        joinedAt: "2023-09-10T00:00:00Z",
    },
    {
        id: "4",
        name: "Dewi Lestari",
        email: "dewi@beritaae.com",
        avatar: "https://i.pravatar.cc/150?img=9",
        bio: "Reporter olahraga dan pecinta sepakbola.",
        phone: "+62 815-4444-5555",
        status: "inactive",
        verified: true,
        articlesCount: 67,
        totalViews: 450000,
        rating: 4.6,
        joinedAt: "2023-04-05T00:00:00Z",
    },
];

type AuthorStatus = "all" | "active" | "inactive";

export default function AuthorsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<AuthorStatus>("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const filteredAuthors = mockAuthors.filter((author) => {
        const matchesSearch =
            author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            author.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || author.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: mockAuthors.length,
        active: mockAuthors.filter((a) => a.status === "active").length,
        verified: mockAuthors.filter((a) => a.verified).length,
        totalArticles: mockAuthors.reduce((acc, a) => acc + a.articlesCount, 0),
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Penulis</h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola penulis dan kontributor artikel
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah Penulis
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Penulis Baru</DialogTitle>
                            <DialogDescription>
                                Daftarkan penulis baru untuk berkontribusi di portal berita
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nama Lengkap</Label>
                                <Input placeholder="Masukkan nama lengkap" />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" placeholder="penulis@beritaae.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>No. Telepon</Label>
                                <Input placeholder="+62 xxx-xxxx-xxxx" />
                            </div>
                            <div className="space-y-2">
                                <Label>Bio</Label>
                                <Textarea placeholder="Deskripsi singkat tentang penulis..." rows={3} />
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

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                            <PenTool className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.total}</p>
                            <p className="text-xs text-muted-foreground">Total Penulis</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.active}</p>
                            <p className="text-xs text-muted-foreground">Aktif</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                            <Star className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.verified}</p>
                            <p className="text-xs text-muted-foreground">Terverifikasi</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                            <FileText className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.totalArticles}</p>
                            <p className="text-xs text-muted-foreground">Total Artikel</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama atau email..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AuthorStatus)}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="active">Aktif</SelectItem>
                                <SelectItem value="inactive">Nonaktif</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Authors Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAuthors.map((author) => (
                    <Card key={author.id} className="overflow-hidden">
                        <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                                <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden">
                                    <Image
                                        src={author.avatar}
                                        alt={author.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-sm truncate">{author.name}</h3>
                                        {author.verified && (
                                            <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{author.email}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <Badge variant={author.status === "active" ? "default" : "secondary"} className="text-[10px]">
                                            {author.status === "active" ? "Aktif" : "Nonaktif"}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Star className="h-3 w-3 text-amber-500" />
                                            {author.rating}
                                        </div>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Profil
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Lihat Artikel
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Lihat Public Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                                {author.bio}
                            </p>

                            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t">
                                <div className="text-center">
                                    <p className="text-lg font-bold">{author.articlesCount}</p>
                                    <p className="text-[10px] text-muted-foreground">Artikel</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold">{(author.totalViews / 1000).toFixed(0)}K</p>
                                    <p className="text-[10px] text-muted-foreground">Views</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold flex items-center justify-center gap-1">
                                        <Star className="h-3 w-3 text-amber-500" />
                                        {author.rating}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">Rating</p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                Bergabung <RelativeTime date={author.joinedAt} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
