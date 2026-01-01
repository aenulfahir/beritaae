"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Search,
  Plus,
  MoreHorizontal,
  Folder,
  Edit,
  Trash2,
  Palette,
  FileText,
  Eye,
  GripVertical,
  Loader2,
} from "lucide-react";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/supabase/services/categories";
import { Category } from "@/types";

interface CategoryWithStats extends Category {
  articleCount: number;
  totalViews: number;
}

interface CategoriesClientProps {
  initialCategories: CategoryWithStats[];
  totalArticles: number;
}

export function CategoriesClient({
  initialCategories,
  totalArticles,
}: CategoriesClientProps) {
  const [categories, setCategories] =
    useState<CategoryWithStats[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryWithStats | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    color: "#3b82f6",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const colorPresets = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#84cc16",
    "#22c55e",
    "#14b8a6",
    "#06b6d4",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
  ];

  const stats = {
    total: categories.length,
    totalArticles,
    avgArticles:
      categories.length > 0 ? Math.round(totalArticles / categories.length) : 0,
  };

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.slug) return;

    setIsSaving(true);
    const created = await createCategory(newCategory);
    if (created) {
      setCategories((prev) => [
        ...prev,
        { ...created, articleCount: 0, totalViews: 0 },
      ]);
      setNewCategory({ name: "", slug: "", color: "#3b82f6" });
      setIsAddDialogOpen(false);
      toast.success("Kategori berhasil ditambahkan");
    } else {
      toast.error("Gagal menambahkan kategori");
    }
    setIsSaving(false);
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;

    setIsSaving(true);
    const updated = await updateCategory(editingCategory.id, {
      name: editingCategory.name,
      slug: editingCategory.slug,
      color: editingCategory.color,
    });
    if (updated) {
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
      );
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      toast.success("Kategori berhasil diperbarui");
    } else {
      toast.error("Gagal memperbarui kategori");
    }
    setIsSaving(false);
  };

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    setDeleteDialogOpen(false);
    const success = await deleteCategory(categoryToDelete);
    if (success) {
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete));
      toast.success("Kategori berhasil dihapus");
    } else {
      toast.error("Gagal menghapus kategori");
    }
    setCategoryToDelete(null);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kategori</h1>
          <p className="text-sm text-muted-foreground">
            Kelola kategori untuk mengorganisasi artikel
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Kategori
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kategori Baru</DialogTitle>
              <DialogDescription>
                Buat kategori baru untuk mengorganisasi artikel
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Kategori</Label>
                <Input
                  placeholder="Contoh: Teknologi"
                  value={newCategory.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setNewCategory({
                      ...newCategory,
                      name,
                      slug: generateSlug(name),
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  placeholder="teknologi"
                  value={newCategory.slug}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, slug: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  URL: /category/{newCategory.slug || "slug"}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Warna</Label>
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg border-2"
                    style={{ backgroundColor: newCategory.color }}
                  />
                  <Input
                    type="text"
                    value={newCategory.color}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, color: e.target.value })
                    }
                    className="w-28"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      title={`Pilih warna ${color}`}
                      className="h-6 w-6 rounded-full border-2 border-transparent hover:border-foreground transition-all"
                      style={{ backgroundColor: color }}
                      onClick={() => setNewCategory({ ...newCategory, color })}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Batal
              </Button>
              <Button onClick={handleAddCategory} disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Folder className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Kategori</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <FileText className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalArticles}</p>
              <p className="text-xs text-muted-foreground">Total Artikel</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Palette className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.avgArticles}</p>
              <p className="text-xs text-muted-foreground">
                Rata-rata Artikel/Kategori
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari kategori..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden group">
            <div className="h-2" style={{ backgroundColor: category.color }} />
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="cursor-grab text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Folder
                      className="h-5 w-5"
                      style={{ color: category.color }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      /{category.slug}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingCategory(category);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href={`/category/${category.slug}`} target="_blank">
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Artikel
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteClick(category.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-xl font-bold">{category.articleCount}</p>
                  <p className="text-[10px] text-muted-foreground">Artikel</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">
                    {(category.totalViews / 1000).toFixed(1)}K
                  </p>
                  <p className="text-[10px] text-muted-foreground">Views</p>
                </div>
              </div>

              <div className="mt-4">
                <Badge
                  className="text-[10px]"
                  style={{
                    backgroundColor: `${category.color}20`,
                    color: category.color,
                    borderColor: category.color,
                  }}
                  variant="outline"
                >
                  {category.color}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
            <DialogDescription>Ubah informasi kategori</DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Kategori</Label>
                <Input
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={editingCategory.slug}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      slug: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Warna</Label>
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg border-2"
                    style={{ backgroundColor: editingCategory.color }}
                  />
                  <Input
                    type="text"
                    value={editingCategory.color}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        color: e.target.value,
                      })
                    }
                    className="w-28"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      title={`Pilih warna ${color}`}
                      className="h-6 w-6 rounded-full border-2 border-transparent hover:border-foreground transition-all"
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        setEditingCategory({ ...editingCategory, color })
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Batal
            </Button>
            <Button onClick={handleEditCategory} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Kategori akan dihapus secara
              permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
