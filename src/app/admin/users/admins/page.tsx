"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
    Search,
    Plus,
    MoreHorizontal,
    UserCog,
    Shield,
    ShieldCheck,
    ShieldAlert,
    Mail,
    Phone,
    MapPin,
    Edit,
    Trash2,
    Key,
    Ban,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
} from "lucide-react";
import { RelativeTime } from "@/components/ui/RelativeTime";

// Mock admin users data
const mockAdmins = [
    {
        id: "1",
        name: "Super Admin",
        email: "superadmin@beritaae.com",
        avatar: "https://i.pravatar.cc/150?img=1",
        role: "super_admin",
        phone: "+62 812-3456-7890",
        status: "active",
        lastLogin: "2024-12-25T08:00:00Z",
        createdAt: "2024-01-15T00:00:00Z",
    },
    {
        id: "2",
        name: "Admin Editor",
        email: "editor@beritaae.com",
        avatar: "https://i.pravatar.cc/150?img=2",
        role: "editor",
        phone: "+62 813-4567-8901",
        status: "active",
        lastLogin: "2024-12-25T07:30:00Z",
        createdAt: "2024-03-20T00:00:00Z",
    },
    {
        id: "3",
        name: "Admin Moderator",
        email: "moderator@beritaae.com",
        avatar: "https://i.pravatar.cc/150?img=3",
        role: "moderator",
        phone: "+62 814-5678-9012",
        status: "active",
        lastLogin: "2024-12-24T15:00:00Z",
        createdAt: "2024-06-10T00:00:00Z",
    },
    {
        id: "4",
        name: "Admin Backup",
        email: "backup@beritaae.com",
        avatar: "https://i.pravatar.cc/150?img=4",
        role: "admin",
        phone: "+62 815-6789-0123",
        status: "inactive",
        lastLogin: "2024-11-15T10:00:00Z",
        createdAt: "2024-02-01T00:00:00Z",
    },
];

type AdminRole = "all" | "super_admin" | "admin" | "editor" | "moderator";
type AdminStatus = "all" | "active" | "inactive";

export default function AdminsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<AdminRole>("all");
    const [statusFilter, setStatusFilter] = useState<AdminStatus>("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const filteredAdmins = mockAdmins.filter((admin) => {
        const matchesSearch =
            admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            admin.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || admin.role === roleFilter;
        const matchesStatus = statusFilter === "all" || admin.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "super_admin":
                return <Badge className="bg-red-500/10 text-red-600 gap-1"><ShieldAlert className="h-3 w-3" />Super Admin</Badge>;
            case "admin":
                return <Badge className="bg-blue-500/10 text-blue-600 gap-1"><ShieldCheck className="h-3 w-3" />Admin</Badge>;
            case "editor":
                return <Badge className="bg-purple-500/10 text-purple-600 gap-1"><Shield className="h-3 w-3" />Editor</Badge>;
            case "moderator":
                return <Badge className="bg-amber-500/10 text-amber-600 gap-1"><Shield className="h-3 w-3" />Moderator</Badge>;
            default:
                return <Badge variant="secondary">{role}</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        return status === "active" ? (
            <Badge className="bg-green-500/10 text-green-600 gap-1">
                <CheckCircle className="h-3 w-3" />
                Aktif
            </Badge>
        ) : (
            <Badge className="bg-gray-500/10 text-gray-600 gap-1">
                <XCircle className="h-3 w-3" />
                Nonaktif
            </Badge>
        );
    };

    const stats = {
        total: mockAdmins.length,
        active: mockAdmins.filter((a) => a.status === "active").length,
        superAdmin: mockAdmins.filter((a) => a.role === "super_admin").length,
        inactive: mockAdmins.filter((a) => a.status === "inactive").length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Admin Users</h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola akun administrator portal berita
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Admin Baru</DialogTitle>
                            <DialogDescription>
                                Buat akun administrator baru untuk portal berita
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nama Lengkap</Label>
                                <Input placeholder="Masukkan nama lengkap" />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" placeholder="admin@beritaae.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="editor">Editor</SelectItem>
                                        <SelectItem value="moderator">Moderator</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>No. Telepon</Label>
                                <Input placeholder="+62 xxx-xxxx-xxxx" />
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
                            <UserCog className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.total}</p>
                            <p className="text-xs text-muted-foreground">Total Admin</p>
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                            <ShieldAlert className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.superAdmin}</p>
                            <p className="text-xs text-muted-foreground">Super Admin</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-500/10">
                            <XCircle className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.inactive}</p>
                            <p className="text-xs text-muted-foreground">Nonaktif</p>
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
                        <div className="flex gap-2">
                            <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as AdminRole)}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Role</SelectItem>
                                    <SelectItem value="super_admin">Super Admin</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="editor">Editor</SelectItem>
                                    <SelectItem value="moderator">Moderator</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AdminStatus)}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="active">Aktif</SelectItem>
                                    <SelectItem value="inactive">Nonaktif</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Admin Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Admin</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Kontak</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAdmins.map((admin) => (
                            <TableRow key={admin.id} className="group">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden">
                                            <Image
                                                src={admin.avatar}
                                                alt={admin.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{admin.name}</p>
                                            <p className="text-xs text-muted-foreground">{admin.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{getRoleBadge(admin.role)}</TableCell>
                                <TableCell>{getStatusBadge(admin.status)}</TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <p className="flex items-center gap-1 text-muted-foreground">
                                            <Phone className="h-3 w-3" />
                                            {admin.phone}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <RelativeTime date={admin.lastLogin} />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Key className="mr-2 h-4 w-4" />
                                                Reset Password
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <Ban className="mr-2 h-4 w-4" />
                                                {admin.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Hapus
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
