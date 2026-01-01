"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
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
  Calendar,
} from "lucide-react";
import { RelativeTime } from "@/components/ui/RelativeTime";

interface JobListing {
  id: string;
  title: string;
  department?: string;
  location?: string;
  job_type?: string;
  level?: string;
  salary_range?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  is_active: boolean;
  applicants_count: number;
  created_at: string;
}

interface CareerSettings {
  id: string;
  page_title: string;
  page_description?: string;
  application_email?: string;
  whatsapp?: string;
}

interface CareersStats {
  total: number;
  active: number;
  totalApplicants: number;
}

interface CareersClientProps {
  initialJobs: JobListing[];
  initialSettings: CareerSettings | null;
  initialStats: CareersStats;
}

const departments = [
  "Editorial",
  "Technology",
  "Marketing",
  "Content",
  "Human Resources",
  "Finance",
  "Design",
  "Data",
];
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
const levels = [
  "Junior",
  "Junior-Mid",
  "Mid",
  "Mid-Senior",
  "Senior",
  "Lead",
  "Manager",
];

async function createJob(data: Partial<JobListing>) {
  const res = await fetch("/api/admin/company", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table: "job_listings", data }),
  });
  return res.json();
}

async function updateJob(id: string, data: Partial<JobListing>) {
  const res = await fetch("/api/admin/company", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table: "job_listings", id, data }),
  });
  return res.json();
}

async function deleteJob(id: string) {
  const res = await fetch(`/api/admin/company?table=job_listings&id=${id}`, {
    method: "DELETE",
  });
  return res.json();
}

async function updateSettings(id: string, data: Partial<CareerSettings>) {
  const res = await fetch("/api/admin/company", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table: "career_settings", id, data }),
  });
  return res.json();
}

export default function CareersClient({
  initialJobs,
  initialSettings,
  initialStats,
}: CareersClientProps) {
  const [jobs, setJobs] = useState(initialJobs);
  const [settings, setSettings] = useState(initialSettings);
  const [stats, setStats] = useState(initialStats);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobListing | null>(null);
  const [saving, setSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    job_type: "Full-time",
    level: "",
    salary_range: "",
    description: "",
    requirements: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      location: "",
      job_type: "Full-time",
      level: "",
      salary_range: "",
      description: "",
      requirements: "",
    });
  };

  const handleAdd = async () => {
    if (!formData.title) return;
    setSaving(true);

    const result = await createJob({
      ...formData,
      is_active: true,
      applicants_count: 0,
    });

    if (result.success && result.data) {
      setJobs([result.data, ...jobs]);
      setStats({ ...stats, total: stats.total + 1, active: stats.active + 1 });
      setIsAddDialogOpen(false);
      resetForm();
    } else {
      alert("Gagal menambah lowongan: " + result.error);
    }

    setSaving(false);
  };

  const handleEdit = (job: JobListing) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department || "",
      location: job.location || "",
      job_type: job.job_type || "Full-time",
      level: job.level || "",
      salary_range: job.salary_range || "",
      description: job.description || "",
      requirements: job.requirements || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingJob) return;
    setSaving(true);

    const result = await updateJob(editingJob.id, formData);

    if (result.success) {
      setJobs(
        jobs.map((j) => (j.id === editingJob.id ? { ...j, ...formData } : j))
      );
      setEditingJob(null);
      resetForm();
    } else {
      alert("Gagal mengupdate lowongan: " + result.error);
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus lowongan ini?")) return;

    const result = await deleteJob(id);

    if (result.success) {
      const deletedJob = jobs.find((j) => j.id === id);
      setJobs(jobs.filter((j) => j.id !== id));
      setStats({
        ...stats,
        total: stats.total - 1,
        active: deletedJob?.is_active ? stats.active - 1 : stats.active,
        totalApplicants:
          stats.totalApplicants - (deletedJob?.applicants_count || 0),
      });
    } else {
      alert("Gagal menghapus lowongan: " + result.error);
    }
  };

  const handleToggleActive = async (job: JobListing) => {
    const result = await updateJob(job.id, { is_active: !job.is_active });

    if (result.success) {
      setJobs(
        jobs.map((j) =>
          j.id === job.id ? { ...j, is_active: !j.is_active } : j
        )
      );
      setStats({
        ...stats,
        active: job.is_active ? stats.active - 1 : stats.active + 1,
      });
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);

    const result = await updateSettings(settings.id, settings);

    if (result.success) {
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
    } else {
      alert("Gagal menyimpan pengaturan: " + result.error);
    }

    setSaving(false);
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
        <Button
          size="sm"
          className="gap-2"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Tambah Lowongan
        </Button>
      </div>

      {/* Career Settings */}
      {settings && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Pengaturan Halaman Karir
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveSettings}
                disabled={saving}
                className="gap-2"
              >
                {settingsSaved ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {settingsSaved ? "Tersimpan" : "Simpan"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Judul Halaman</Label>
              <Input
                value={settings.page_title || ""}
                onChange={(e) =>
                  setSettings({ ...settings, page_title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={settings.page_description || ""}
                onChange={(e) =>
                  setSettings({ ...settings, page_description: e.target.value })
                }
                rows={2}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Email Lamaran</Label>
                <Input
                  value={settings.application_email || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      application_email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp HR</Label>
                <Input
                  value={settings.whatsapp || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, whatsapp: e.target.value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            {jobs.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Belum ada lowongan. Klik "Tambah Lowongan" untuk menambahkan.
              </p>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className={`p-4 rounded-lg border transition-all ${
                    !job.is_active && "opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{job.title}</h3>
                        {job.department && (
                          <Badge variant="secondary">{job.department}</Badge>
                        )}
                        <Badge variant={job.is_active ? "default" : "outline"}>
                          {job.is_active ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                        )}
                        {job.job_type && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {job.job_type}
                          </span>
                        )}
                        {job.salary_range && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {job.salary_range}
                          </span>
                        )}
                      </div>
                      {job.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                          {job.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {job.applicants_count} pelamar
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <RelativeTime date={job.created_at} />
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={job.is_active}
                        onCheckedChange={() => handleToggleActive(job)}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(job)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(job.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAddDialogOpen || !!editingJob}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingJob(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingJob ? "Edit Lowongan" : "Tambah Lowongan Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingJob
                ? "Edit informasi lowongan kerja"
                : "Buat lowongan kerja baru untuk ditampilkan di halaman karir"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Judul Posisi *</Label>
                <Input
                  placeholder="Contoh: Senior Editor"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
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
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Lokasi</Label>
                <Input
                  placeholder="Jakarta / Remote"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Tipe</Label>
                <Select
                  value={formData.job_type}
                  onValueChange={(v) =>
                    setFormData({ ...formData, job_type: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(v) => setFormData({ ...formData, level: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Range Gaji</Label>
              <Input
                placeholder="Rp 15-25 juta/bulan"
                value={formData.salary_range}
                onChange={(e) =>
                  setFormData({ ...formData, salary_range: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                placeholder="Deskripsi singkat tentang posisi..."
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Persyaratan</Label>
              <Textarea
                placeholder="- Requirement 1&#10;- Requirement 2&#10;- Requirement 3"
                rows={4}
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setEditingJob(null);
                resetForm();
              }}
            >
              Batal
            </Button>
            <Button
              onClick={editingJob ? handleUpdate : handleAdd}
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
