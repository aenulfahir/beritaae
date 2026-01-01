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
  Users,
  Mail,
  MessageSquare,
  Ban,
  CheckCircle,
  XCircle,
  Calendar,
  UserCheck,
  UserX,
  Activity,
  Heart,
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

interface MemberUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  status: UserStatus;
  last_login: string | null;
  created_at: string;
  comments_count?: number;
  likes_given?: number;
}

interface MembersStats {
  total: number;
  active: number;
  inactive: number;
  banned: number;
  totalComments: number;
}

interface MembersClientProps {
  initialUsers: MemberUser[];
  initialStats: MembersStats;
}

type StatusFilter = "all" | "active" | "inactive" | "banned";

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

export default function MembersClient({
  initialUsers,
  initialStats,
}: MembersClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [stats] = useState(initialStats);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [promotingUser, setPromotingUser] = useState<MemberUser | null>(null);
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("author");
  const [isLoading, setIsLoading] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.full_name?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active"
        ? user.status === "active" || !user.status
        : user.status === statusFilter);
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: UserStatus | null) => {
    switch (status) {
      case "active":
      case null:
        return (
          <Badge className="bg-green-500/10 text-green-600 gap-1">
            <CheckCircle className="h-3 w-3" />
            Aktif
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-500/10 text-gray-600 gap-1">
            <XCircle className="h-3 w-3" />
            Nonaktif
          </Badge>
        );
      case "banned":
        return (
          <Badge className="bg-red-500/10 text-red-600 gap-1">
            <Ban className="h-3 w-3" />
            Banned
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleStatusChange = async (
    user: MemberUser,
    newStatus: UserStatus
  ) => {
    const result = await updateUserStatus(user.id, newStatus);

    if (result.success) {
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
    } else {
      alert("Gagal mengubah status: " + result.error);
    }
  };

  const handlePromote = async () => {
    if (!promotingUser) return;
    setIsLoading(true);

    const result = await updateUserRole(promotingUser.id, selectedRole);

    if (result.success) {
      // Remove from members list since they're no longer a member
      setUsers(users.filter((u) => u.id !== promotingUser.id));
      setIsPromoteDialogOpen(false);
      setPromotingUser(null);
    } else {
      alert("Gagal mengubah role: " + result.error);
    }

    setIsLoading(false);
  };

  const openPromoteDialog = (user: MemberUser) => {
    setPromotingUser(user);
    setSelectedRole("author");
    setIsPromoteDialogOpen(true);
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
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <MessageSquare className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalComments}</p>
              <p className="text-xs text-muted-foreground">Total Komentar</p>
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
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as StatusFilter)}
            >
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
              <TableHead>Last Login</TableHead>
              <TableHead>Bergabung</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  Tidak ada member ditemukan
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
                            <Users className="h-5 w-5" />
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
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <MessageSquare className="h-3 w-3 text-muted-foreground" />
                      {user.comments_count || 0}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <Heart className="h-3 w-3 text-red-500" />
                      {user.likes_given || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Activity className="h-3 w-3" />
                      {user.last_login ? (
                        <RelativeTime date={user.last_login} />
                      ) : (
                        <span className="text-xs">Belum pernah</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <RelativeTime date={user.created_at} />
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
                        <DropdownMenuItem
                          onClick={() => openPromoteDialog(user)}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Promosikan
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Kirim Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "banned" ? (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(user, "active")}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Unban
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(user, "banned")}
                            className="text-red-600"
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Ban
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Promote Dialog */}
      <Dialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promosikan Member</DialogTitle>
            <DialogDescription>
              Promosikan {promotingUser?.full_name || promotingUser?.email} ke
              role yang lebih tinggi
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
                  <SelectItem value="author">Penulis</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <strong>Penulis:</strong> Dapat menulis artikel (perlu approval)
              </p>
              <p>
                <strong>Editor:</strong> Dapat edit dan publish artikel
              </p>
              <p>
                <strong>Moderator:</strong> Dapat moderasi komentar dan konten
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPromoteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button onClick={handlePromote} disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Promosikan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
