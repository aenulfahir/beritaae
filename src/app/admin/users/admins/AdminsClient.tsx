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
  UserCog,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Phone,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Crown,
  UserMinus,
  UserPlus,
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

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  status: UserStatus;
  phone: string | null;
  last_login: string | null;
  created_at: string;
}

interface AdminsStats {
  total: number;
  active: number;
  inactive: number;
  superadmin: number;
  admin: number;
  moderator: number;
}

interface AdminsClientProps {
  initialUsers: AdminUser[];
  initialStats: AdminsStats;
}

type RoleFilter = "all" | "superadmin" | "admin" | "moderator";
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

export default function AdminsClient({
  initialUsers,
  initialStats,
}: AdminsClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [stats] = useState(initialStats);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
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
    const Icon =
      role === "superadmin"
        ? ShieldAlert
        : role === "admin"
        ? ShieldCheck
        : Shield;

    return (
      <Badge className={`${colors.bg} ${colors.text} gap-1`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const getStatusBadge = (status: UserStatus | null) => {
    const isActive = status === "active" || !status;
    return isActive ? (
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

  const handleStatusToggle = async (user: AdminUser) => {
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

  const openEditDialog = (user: AdminUser) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    setIsEditDialogOpen(true);
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
              <Crown className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.superadmin}</p>
              <p className="text-xs text-muted-foreground">Super Admin</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Shield className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.moderator}</p>
              <p className="text-xs text-muted-foreground">Moderator</p>
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
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
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
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  Tidak ada admin ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-muted">
                        {user.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt={user.full_name || "Avatar"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            <UserCog className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {user.full_name || "Tanpa Nama"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.phone ? (
                        <p className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </p>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {user.last_login ? (
                        <RelativeTime date={user.last_login} />
                      ) : (
                        <span className="text-xs">Belum pernah</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Ubah Role
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Role Admin</DialogTitle>
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
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="author">Penulis</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <strong>Super Admin:</strong> Akses penuh ke semua fitur
              </p>
              <p>
                <strong>Admin:</strong> Kelola konten dan pengguna
              </p>
              <p>
                <strong>Moderator:</strong> Moderasi komentar dan konten
              </p>
              <p>
                <strong>Editor:</strong> Edit dan publish artikel
              </p>
              <p>
                <strong>Penulis:</strong> Tulis artikel
              </p>
              <p>
                <strong>Member:</strong> Baca dan komentar
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
