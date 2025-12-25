"use client";

import { useState } from "react";
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
    Briefcase,
    Plus,
    Save,
    CheckCircle,
    MoreHorizontal,
    Edit,
    Trash2,
    MapPin,
    Clock,
    DollarSign,
    Users,
    Eye,
    Calendar,
    ExternalLink,
} from "lucide-react";
import { RelativeTime } from "@/components/ui/RelativeTime";

const mockJobs = [
    {
        id: "1",
        title: "Senior Journalist",
        department: "Editorial",
        location: "Jakarta",
        type: "Full-time",
        level: "Senior",
        salary: "Rp 15-25 juta/bulan",
        description: "Kami mencari jurnalis senior berpengalaman untuk memimpin liputan berita nasional.",
        requirements: "- Minimal 5 tahun pengalaman\n- Kemampuan menulis yang baik\n- Networking yang luas",
        isActive: true,
        applicants: 24,
        createdAt: "2024-12-01T00:00:00Z",
    },
    {
        id: "2",
        title: "Frontend Developer",
        department: "Technology",
        location: "Remote",
        type: "Full-time",
        level: "Mid-Senior",
        salary: "Rp 20-35 juta/bulan",
        description: "Bergabunglah dengan tim engineering kami untuk membangun platform berita modern.",
        requirements: "- React/Next.js expert\n- TypeScript proficient\n- 3+ years experience",
        isActive: true,
        applicants: 45,
        createdAt: "2024-12-10T00:00:00Z",
    },
    {
        id: "3",
        title: "Social Media Manager",
        department: "Marketing",
        location: "Jakarta",
        type: "Contract",
        level: "Mid",
        salary: "Rp 10-15 juta/bulan",
        description: "Kelola akun media sosial BeritaAE dan tingkatkan engagement.",
        requirements: "- Pengalaman 2+ tahun di social media\n- Kreatif dan up-to-date\n- Kemampuan analitik",
        isActive: true,
        applicants: 67,
        createdAt: "2024-12-15T00:00:00Z",
    },
    {
        id: "4",
        title: "Video Editor",
        department: "Content",
        location: "Jakarta",
        type: "Full-time",
        level: "Junior-Mid",
        salary: "Rp 8-12 juta/bulan",
        description: "Edit video berita dan konten multimedia untuk platform digital.",
        requirements: "- Adobe Premiere Pro\n- After Effects basic\n- Portfolio required",
        isActive: false,
        applicants: 32,
        createdAt: "2024-11-20T00:00:00Z",
    },
];

const departments = ["Editorial", "Technology", "Marketing", "Content", "Human Resources", "Finance"];
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
const levels = ["Junior", "Junior-Mid", "Mid", "Mid-Senior", "Senior", "Lead"];

export default function CompanyCareersPage() {
    const [jobs, setJobs] = useState(mockJobs);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const toggleActive = (id: string) => {
        setJobs((prev) =>
            prev.map((job) => (job.id === id ? { ...job, isActive: !job.isActive } : job))
        );
    };

    const stats = {
        total: jobs.length,
        active: jobs.filter((j) => j.isActive).length,
        totalApplicants: jobs.reduce((acc, j) => acc + j.applicants, 0),
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Briefcase className="h-6 w-6" />
                        Karir
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola lowongan kerja dan halaman karir
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
                                Tambah Lowongan
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Tambah Lowongan Baru</DialogTitle>
                                <DialogDescription>
                                    Buat lowongan kerja baru untuk ditampilkan di halaman karir
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Judul Posisi</Label>
                                        <Input placeholder="Contoh: Senior Editor" />
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
                                </div>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Lokasi</Label>
                                        <Input placeholder="Jakarta / Remote" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tipe</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih tipe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {jobTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Level</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {levels.map((level) => (
                                                    <SelectItem key={level} value={level}>{level}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Range Gaji</Label>
                                    <Input placeholder="Rp 15-25 juta/bulan" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Deskripsi</Label>
                                    <Textarea placeholder="Deskripsi singkat tentang posisi..." rows={3} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Persyaratan</Label>
                                    <Textarea placeholder="- Requirement 1&#10;- Requirement 2&#10;- Requirement 3" rows={4} />
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

            {/* Careers Page Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Pengaturan Halaman Karir</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Judul Halaman</Label>
                        <Input defaultValue="Bergabung dengan Tim Kami" />
                    </div>
                    <div className="space-y-2">
                        <Label>Deskripsi</Label>
                        <Textarea
                            defaultValue="Bergabunglah dengan BeritaAE dan jadilah bagian dari perubahan di industri media digital Indonesia."
                            rows={2}
                        />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Email Lamaran</Label>
                            <Input defaultValue="karir@beritaae.com" />
                        </div>
                        <div className="space-y-2">
                            <Label>WhatsApp HR</Label>
                            <Input defaultValue="+62 812 3456 7890" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                            <Briefcase className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.total}</p>
                            <p className="text-xs text-muted-foreground">Total Lowongan</p>
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                            <Users className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.totalApplicants}</p>
                            <p className="text-xs text-muted-foreground">Total Pelamar</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Jobs List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Daftar Lowongan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {jobs.map((job) => (
                            <div key={job.id} className={`p-4 rounded-lg border transition-all ${!job.isActive && "opacity-60"}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-semibold">{job.title}</h3>
                                            <Badge variant="secondary">{job.department}</Badge>
                                            <Badge variant={job.isActive ? "default" : "outline"}>
                                                {job.isActive ? "Aktif" : "Nonaktif"}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {job.type}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <DollarSign className="h-3 w-3" />
                                                {job.salary}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                                            {job.description}
                                        </p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                {job.applicants} pelamar
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <RelativeTime date={job.createdAt} />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={job.isActive}
                                            onCheckedChange={() => toggleActive(job.id)}
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
                                                    Lihat Pelamar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <ExternalLink className="mr-2 h-4 w-4" />
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
