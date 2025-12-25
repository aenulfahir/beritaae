"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
    Users,
    Plus,
    Save,
    CheckCircle,
    Upload,
    MoreHorizontal,
    Edit,
    Trash2,
    GripVertical,
    Linkedin,
    Twitter,
    Mail,
} from "lucide-react";

const mockTeam = [
    {
        id: "1",
        name: "Ahmad Fadillah",
        role: "CEO & Founder",
        department: "Executive",
        bio: "Pendiri BeritaAE dengan pengalaman 15 tahun di industri media.",
        avatar: "https://i.pravatar.cc/150?img=1",
        linkedin: "https://linkedin.com/in/ahmadfadillah",
        twitter: "https://twitter.com/ahmadfadillah",
        email: "ahmad@beritaae.com",
        order: 1,
    },
    {
        id: "2",
        name: "Siti Nurhaliza",
        role: "Editor in Chief",
        department: "Editorial",
        bio: "Memimpin tim editorial dengan standar jurnalistik tertinggi.",
        avatar: "https://i.pravatar.cc/150?img=5",
        linkedin: "https://linkedin.com/in/sitinurhaliza",
        twitter: "",
        email: "siti@beritaae.com",
        order: 2,
    },
    {
        id: "3",
        name: "Budi Santoso",
        role: "CTO",
        department: "Technology",
        bio: "Bertanggung jawab atas infrastruktur teknologi platform.",
        avatar: "https://i.pravatar.cc/150?img=12",
        linkedin: "https://linkedin.com/in/budisantoso",
        twitter: "https://twitter.com/budisantoso",
        email: "budi@beritaae.com",
        order: 3,
    },
    {
        id: "4",
        name: "Dewi Lestari",
        role: "Marketing Director",
        department: "Marketing",
        bio: "Mengembangkan strategi pemasaran dan brand awareness.",
        avatar: "https://i.pravatar.cc/150?img=9",
        linkedin: "",
        twitter: "https://twitter.com/dewilestari",
        email: "dewi@beritaae.com",
        order: 4,
    },
    {
        id: "5",
        name: "Rudi Hartono",
        role: "Head of News",
        department: "Editorial",
        bio: "Memimpin tim reporter untuk liputan berita nasional.",
        avatar: "https://i.pravatar.cc/150?img=15",
        linkedin: "https://linkedin.com/in/rudihartono",
        twitter: "",
        email: "rudi@beritaae.com",
        order: 5,
    },
    {
        id: "6",
        name: "Maya Indah",
        role: "HR Manager",
        department: "Human Resources",
        bio: "Mengelola talent acquisition dan employee development.",
        avatar: "https://i.pravatar.cc/150?img=23",
        linkedin: "https://linkedin.com/in/mayaindah",
        twitter: "",
        email: "maya@beritaae.com",
        order: 6,
    },
];

const departments = ["Executive", "Editorial", "Technology", "Marketing", "Human Resources", "Finance"];

export default function CompanyTeamPage() {
    const [team, setTeam] = useState(mockTeam);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const groupedTeam = departments.map((dept) => ({
        department: dept,
        members: team.filter((m) => m.department === dept),
    })).filter((g) => g.members.length > 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        Tim Kami
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola anggota tim yang ditampilkan di halaman publik
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleSave} variant="outline" className="gap-2">
                        {saved ? (
                            <>
                                <CheckCircle className="h-4 w-4" />
                                Tersimpan
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Simpan Urutan
                            </>
                        )}
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Tambah Anggota
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Tambah Anggota Tim</DialogTitle>
                                <DialogDescription>
                                    Tambahkan anggota tim baru ke halaman publik
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <Button variant="outline" size="sm">Upload Foto</Button>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Nama Lengkap</Label>
                                        <Input placeholder="Nama anggota" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Jabatan</Label>
                                        <Input placeholder="Contoh: Senior Editor" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Departemen</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih departemen" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Bio Singkat</Label>
                                    <Textarea placeholder="Deskripsi singkat tentang anggota..." rows={2} />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input placeholder="email@beritaae.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>LinkedIn</Label>
                                        <Input placeholder="https://linkedin.com/in/..." />
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

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                            <Users className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{team.length}</p>
                            <p className="text-xs text-muted-foreground">Total Anggota</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                            <Users className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{groupedTeam.length}</p>
                            <p className="text-xs text-muted-foreground">Departemen</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                            <Users className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{team.filter((m) => m.department === "Executive").length}</p>
                            <p className="text-xs text-muted-foreground">Executive</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Team Grid by Department */}
            {groupedTeam.map((group) => (
                <Card key={group.department}>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{group.department}</CardTitle>
                            <Badge variant="secondary">{group.members.length} anggota</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {group.members.map((member) => (
                                <div key={member.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                                    <div className="cursor-grab text-muted-foreground hover:text-foreground">
                                        <GripVertical className="h-4 w-4" />
                                    </div>
                                    <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden">
                                        <Image
                                            src={member.avatar}
                                            alt={member.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{member.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {member.linkedin && (
                                                <Linkedin className="h-3 w-3 text-blue-600" />
                                            )}
                                            {member.twitter && (
                                                <Twitter className="h-3 w-3" />
                                            )}
                                            <Mail className="h-3 w-3 text-muted-foreground" />
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Hapus
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
