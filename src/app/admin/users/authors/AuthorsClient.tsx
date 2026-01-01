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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  MoreHorizontal,
  PenTool,
  FileText,
  Eye,
  Edit,
  CheckCircle,
  Calendar,
  UserMinus,
  UserPlus,
  Shield,
} from "lucide-react";
import { RelativeTime } from "@/components/ui/RelativeTime";

type UserRole =
  | "superadmin"
  | "admin"
  | "moderator"
  | "editor"
  | "author"
  | "member";
type UserStatus = "active" | "inactive" | "banned";

const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: "Super Admin",
  admin: "Admin",
  moderator: "Moderator",
  editor: "Editor",
  author: "Penulis",
  member: "Member",
};

const ROLE_COLORS: Record<UserRole, { bg: string; text: string }> = {
  superadmin: { bg: "bg-red-500/10", text: "text-red-600" },
  admin: { bg: "bg-blue-500/10", text: "text-blue-600" },
  moderator: { bg: "bg-amber-500/10", text: "text-amber-600" },
  editor: { bg: "bg-purple-500/10", text: "text-purple-600" },
  author: { bg: "bg-green-500/10", text: "text-green-600" },
  member: { bg: "bg-gray-500/10", text: "text-gray-600" },
};

interface AuthorUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  status: UserStatus;
  bio: string | null;
  phone: string | null;
  created_at: string;
  articles_count?: number;
  total_views?: number;
  comments_count?: number;
}

interface AuthorsStats {
  total: number;
  active: number;
  inactive: number;
  editors: number;
  authors: number;
  totalArticles: number;
  totalViews: number;
}

interface AuthorsClientProps {
  initialUsers: AuthorUser[];
  initialStats: AuthorsStats;
}

type RoleFilter = "all" | "editor" | "author";
type StatusFilter = "all" | "active" | "inactive";

// API functions for client-side operations
async function updateUserRole(userId: string, newRole: UserRole) {
  const res = await fetch("/api/admin/users", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, action: "role", value: newRole }),
  });
  return res.json();
}

async function updateUserStatus(userId: string, newStatus: UserStatus) {
  const res = await fetch("/api/admin/users", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, action: "status", value: newStatus }),
  });
  return res.json();
}

export default function AuthorsClient({
  initialUsers,
  initialStats,
}: AuthorsClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [stats] = useState(initialStats);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [editingUser, setEditingUser] = useState<AuthorUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("author");
  const [isLoading, setIsLoading] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.full_name?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active"
        ? user.status === "active" || !user.status
        : user.status === statusFilter);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: UserRole) => {
    const colors = ROLE_COLORS[role];
    const label = ROLE_LABELS[role];

    return (
      <Badge className={`${colors.bg} ${colors.text} gap-1`}>
        {role === "editor" ? (
          <Shield className="h-3 w-3" />
        ) : (
          <PenTool className="h-3 w-3" />
        )}
        {label}
      </Badge>
    );
  };

  const handleRoleChange = async () => {
    if (!editingUser) return;
    setIsLoading(true);

    const result = await updateUserRole(editingUser.id, selectedRole);

    if (result.success) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id ? { ...u, role: selectedRole } : u
        )
      );
      setIsEditDialogOpen(false);
      setEditingUser(null);
    } else {
      alert("Gagal mengubah role: " + result.error);
    }

    setIsLoading(false);
  };

  const handleStatusToggle = async (user: AuthorUser) => {
    const newStatus: UserStatus =
      user.status === "active" || !user.status ? "inactive" : "active";

    const result = await updateUserStatus(user.id, newStatus);

    if (result.success) {
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
    } else {
      alert("Gagal mengubah status: " + result.error);
    }
  };

  const openEditDialog = (user: AuthorUser) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    setIsEditDialogOpen(true);
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Penulis & Editor</h1>
          <p className="text-sm text-muted-foreground">
            Kelola penulis dan editor artikel
          </p>
        </div>
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <FileText className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalArticles}</p>
              <p className="text-xs text-muted-foreground">Total Artikel</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Eye className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {formatViews(stats.totalViews)}
              </p>
              <p className="text-xs text-muted-foreground">Total Views</p>
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
              <Select
                value={roleFilter}
                onValueChange={(v) => setRoleFilter(v as RoleFilter)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="author">Penulis</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as StatusFilter)}
              >
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

      {/* Authors Grid */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Tidak ada penulis ditemukan
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden bg-muted">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.full_name || "Avatar"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                        <PenTool className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm truncate">
                        {user.full_name || "Tanpa Nama"}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {getRoleBadge(user.role)}
                      <Badge
                        variant={
                          user.status === "active" || !user.status
                            ? "default"
                            : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {user.status === "active" || !user.status
                          ? "Aktif"
                          : "Nonaktif"}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Ubah Role
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        Lihat Artikel
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusToggle(user)}
                      >
                        {user.status === "active" || !user.status ? (
                          <>
                            <UserMinus className="mr-2 h-4 w-4" />
                            Nonaktifkan
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Aktifkan
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {user.bio && (
                  <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                    {user.bio}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-lg font-bold">
                      {user.articles_count || 0}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Artikel</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">
                      {formatViews(user.total_views || 0)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">
                      {user.comments_count || 0}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Komentar
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Bergabung <RelativeTime date={user.created_at} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Role Penulis</DialogTitle>
            <DialogDescription>
              Ubah role untuk {editingUser?.full_name || editingUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Role Baru</Label>
              <Select
                value={selectedRole}
                onValueChange={(v) => setSelectedRole(v as UserRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="author">Penulis</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <strong>Moderator:</strong> Moderasi komentar dan konten
              </p>
              <p>
                <strong>Editor:</strong> Edit dan publish artikel
              </p>
              <p>
                <strong>Penulis:</strong> Tulis artikel (perlu approval)
              </p>
              <p>
                <strong>Member:</strong> Baca dan komentar saja
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Batal
            </Button>
            <Button onClick={handleRoleChange} disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
