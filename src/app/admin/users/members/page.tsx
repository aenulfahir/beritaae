"use client";

import { useState } from "react";
import Image from "next/image";
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
    Search,
    MoreHorizontal,
    Users,
    Mail,
    MessageSquare,
    Eye,
    Edit,
    Trash2,
    Ban,
    CheckCircle,
    XCircle,
    Calendar,
    Download,
    UserCheck,
    UserX,
    Activity,
} from "lucide-react";
import { RelativeTime } from "@/components/ui/RelativeTime";

// Mock members data
const mockMembers = [
    {
        id: "1",
        name: "Andi Pratama",
        email: "andi.pratama@gmail.com",
        avatar: "https://i.pravatar.cc/150?img=20",
        status: "active",
        commentsCount: 45,
        likesGiven: 128,
        lastActive: "2024-12-25T08:30:00Z",
        joinedAt: "2024-01-10T00:00:00Z",
    },
    {
        id: "2",
        name: "Ratna Sari",
        email: "ratna.sari@yahoo.com",
        avatar: "https://i.pravatar.cc/150?img=21",
        status: "active",
        commentsCount: 23,
        likesGiven: 89,
        lastActive: "2024-12-25T07:00:00Z",
        joinedAt: "2024-03-15T00:00:00Z",
    },
    {
        id: "3",
        name: "Budi Setiawan",
        email: "budi.setiawan@gmail.com",
        avatar: "https://i.pravatar.cc/150?img=22",
        status: "banned",
        commentsCount: 12,
        likesGiven: 34,
        lastActive: "2024-11-20T00:00:00Z",
        joinedAt: "2024-02-20T00:00:00Z",
    },
    {
        id: "4",
        name: "Maya Indah",
        email: "maya.indah@outlook.com",
        avatar: "https://i.pravatar.cc/150?img=23",
        status: "active",
        commentsCount: 67,
        likesGiven: 201,
        lastActive: "2024-12-24T18:00:00Z",
        joinedAt: "2023-11-05T00:00:00Z",
    },
    {
        id: "5",
        name: "Rizky Aditya",
        email: "rizky.aditya@gmail.com",
        avatar: "https://i.pravatar.cc/150?img=24",
        status: "inactive",
        commentsCount: 5,
        likesGiven: 15,
        lastActive: "2024-10-15T00:00:00Z",
        joinedAt: "2024-06-01T00:00:00Z",
    },
];

type MemberStatus = "all" | "active" | "inactive" | "banned";

export default function MembersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<MemberStatus>("all");

    const filteredMembers = mockMembers.filter((member) => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || member.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-500/10 text-green-600 gap-1"><CheckCircle className="h-3 w-3" />Aktif</Badge>;
            case "inactive":
                return <Badge className="bg-gray-500/10 text-gray-600 gap-1"><XCircle className="h-3 w-3" />Nonaktif</Badge>;
            case "banned":
                return <Badge className="bg-red-500/10 text-red-600 gap-1"><Ban className="h-3 w-3" />Banned</Badge>;
            default:
                return null;
        }
    };

    const stats = {
        total: mockMembers.length,
        active: mockMembers.filter((m) => m.status === "active").length,
        inactive: mockMembers.filter((m) => m.status === "inactive").length,
        banned: mockMembers.filter((m) => m.status === "banned").length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Member</h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola pembaca dan member yang terdaftar
                    </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                            <Users className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.total}</p>
                            <p className="text-xs text-muted-foreground">Total Member</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                            <UserCheck className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.active}</p>
                            <p className="text-xs text-muted-foreground">Aktif</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-500/10">
                            <UserX className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.inactive}</p>
                            <p className="text-xs text-muted-foreground">Nonaktif</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                            <Ban className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.banned}</p>
                            <p className="text-xs text-muted-foreground">Banned</p>
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
                        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as MemberStatus)}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="active">Aktif</SelectItem>
                                <SelectItem value="inactive">Nonaktif</SelectItem>
                                <SelectItem value="banned">Banned</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Members Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Komentar</TableHead>
                            <TableHead className="text-center">Likes</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead>Bergabung</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMembers.map((member) => (
                            <TableRow key={member.id} className="group">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden">
                                            <Image
                                                src={member.avatar}
                                                alt={member.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{member.name}</p>
                                            <p className="text-xs text-muted-foreground">{member.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{getStatusBadge(member.status)}</TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-sm">
                                        <MessageSquare className="h-3 w-3 text-muted-foreground" />
                                        {member.commentsCount}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-sm">
                                        ❤️ {member.likesGiven}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Activity className="h-3 w-3" />
                                        <RelativeTime date={member.lastActive} />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        <RelativeTime date={member.joinedAt} />
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
                                                <Eye className="mr-2 h-4 w-4" />
                                                Lihat Profil
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Mail className="mr-2 h-4 w-4" />
                                                Kirim Email
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <Ban className="mr-2 h-4 w-4" />
                                                {member.status === "banned" ? "Unban" : "Ban"}
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
