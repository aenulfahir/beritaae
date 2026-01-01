"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  bio?: string;
  avatar_url?: string;
  email?: string;
  linkedin_url?: string;
  twitter_url?: string;
  display_order: number;
  is_active: boolean;
}

interface TeamStats {
  total: number;
  active: number;
  departmentCount: number;
}

interface TeamClientProps {
  initialMembers: TeamMember[];
  initialDepartments: string[];
  initialStats: TeamStats;
}

const defaultDepartments = [
  "Executive",
  "Editorial",
  "Technology",
  "Marketing",
  "Human Resources",
  "Finance",
  "Content",
];

async function createMember(data: Partial<TeamMember>) {
  const res = await fetch("/api/admin/company", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table: "team_members", data }),
  });
  return res.json();
}

async function updateMember(id: string, data: Partial<TeamMember>) {
  const res = await fetch("/api/admin/company", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table: "team_members", id, data }),
  });
  return res.json();
}

async function deleteMember(id: string) {
  const res = await fetch(`/api/admin/company?table=team_members&id=${id}`, {
    method: "DELETE",
  });
  return res.json();
}

export default function TeamClient({
  initialMembers,
  initialDepartments,
  initialStats,
}: TeamClientProps) {
  const [members, setMembers] = useState(initialMembers);
  const [stats, setStats] = useState(initialStats);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    bio: "",
    email: "",
    linkedin_url: "",
    twitter_url: "",
    avatar_url: "",
  });

  const departments = [
    ...new Set([...defaultDepartments, ...initialDepartments]),
  ];

  const groupedMembers = departments
    .map((dept) => ({
      department: dept,
      members: members.filter((m) => m.department === dept),
    }))
    .filter((g) => g.members.length > 0);

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      department: "",
      bio: "",
      email: "",
      linkedin_url: "",
      twitter_url: "",
      avatar_url: "",
    });
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.role) return;
    setSaving(true);

    const result = await createMember({
      ...formData,
      display_order: members.length + 1,
      is_active: true,
    });

    if (result.success && result.data) {
      setMembers([...members, result.data]);
      setStats({ ...stats, total: stats.total + 1, active: stats.active + 1 });
      setIsAddDialogOpen(false);
      resetForm();
    } else {
      alert("Gagal menambah anggota: " + result.error);
    }

    setSaving(false);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      department: member.department || "",
      bio: member.bio || "",
      email: member.email || "",
      linkedin_url: member.linkedin_url || "",
      twitter_url: member.twitter_url || "",
      avatar_url: member.avatar_url || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingMember) return;
    setSaving(true);

    const result = await updateMember(editingMember.id, formData);

    if (result.success) {
      setMembers(
        members.map((m) =>
          m.id === editingMember.id ? { ...m, ...formData } : m
        )
      );
      setEditingMember(null);
      resetForm();
    } else {
      alert("Gagal mengupdate anggota: " + result.error);
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus anggota ini?")) return;

    const result = await deleteMember(id);

    if (result.success) {
      const deletedMember = members.find((m) => m.id === id);
      setMembers(members.filter((m) => m.id !== id));
      setStats({
        ...stats,
        total: stats.total - 1,
        active: deletedMember?.is_active ? stats.active - 1 : stats.active,
      });
    } else {
      alert("Gagal menghapus anggota: " + result.error);
    }
  };

  const handleToggleActive = async (member: TeamMember) => {
    const result = await updateMember(member.id, {
      is_active: !member.is_active,
    });

    if (result.success) {
      setMembers(
        members.map((m) =>
          m.id === member.id ? { ...m, is_active: !m.is_active } : m
        )
      );
      setStats({
        ...stats,
        active: member.is_active ? stats.active - 1 : stats.active + 1,
      });
    }
  };

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
        <Button
          size="sm"
          className="gap-2"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Tambah Anggota
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Anggota</p>
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
              <p className="text-2xl font-bold">{groupedMembers.length}</p>
              <p className="text-xs text-muted-foreground">Departemen</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Grid by Department */}
      {groupedMembers.map((group) => (
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
                <div
                  key={member.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group ${
                    !member.is_active && "opacity-60"
                  }`}
                >
                  <div className="cursor-grab text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden bg-muted">
                    {member.avatar_url ? (
                      <Image
                        src={member.avatar_url}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.role}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {member.linkedin_url && (
                        <Linkedin className="h-3 w-3 text-blue-600" />
                      )}
                      {member.twitter_url && <Twitter className="h-3 w-3" />}
                      {member.email && (
                        <Mail className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(member)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleActive(member)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {member.is_active ? "Nonaktifkan" : "Aktifkan"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(member.id)}
                      >
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

      {members.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Belum ada anggota tim. Klik "Tambah Anggota" untuk menambahkan.
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAddDialogOpen || !!editingMember}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingMember(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit Anggota Tim" : "Tambah Anggota Tim"}
            </DialogTitle>
            <DialogDescription>
              {editingMember
                ? "Edit informasi anggota tim"
                : "Tambahkan anggota tim baru ke halaman publik"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    alt=""
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <Label>URL Avatar</Label>
                <Input
                  placeholder="https://..."
                  value={formData.avatar_url}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar_url: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nama Lengkap *</Label>
                <Input
                  placeholder="Nama anggota"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Jabatan *</Label>
                <Input
                  placeholder="Contoh: Senior Editor"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Departemen</Label>
              <Select
                value={formData.department}
                onValueChange={(v) =>
                  setFormData({ ...formData, department: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih departemen" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bio Singkat</Label>
              <Textarea
                placeholder="Deskripsi singkat tentang anggota..."
                rows={2}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  placeholder="email@beritaae.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedin_url}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin_url: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setEditingMember(null);
                resetForm();
              }}
            >
              Batal
            </Button>
            <Button
              onClick={editingMember ? handleUpdate : handleAdd}
              disabled={saving}
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
