"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Upload,
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  FileText,
  Grid3X3,
  List,
  Trash2,
  Download,
  Copy,
  Eye,
  File,
  HardDrive,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import { RelativeTime } from "@/components/ui/RelativeTime";
import {
  uploadMediaFile,
  deleteMediaFile,
  deleteMediaFiles,
  copyMediaUrl,
  type MediaFile,
} from "@/lib/supabase/services/media";

type ViewMode = "grid" | "list";
type MediaType = "all" | "image" | "video" | "document" | "audio";

interface MediaClientProps {
  initialMedia: MediaFile[];
}

export function MediaClient({ initialMedia }: MediaClientProps) {
  const [media, setMedia] = useState<MediaFile[]>(initialMedia);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [typeFilter, setTypeFilter] = useState<MediaType>("all");
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [previewMedia, setPreviewMedia] = useState<MediaFile | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = media.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case "video":
        return <Video className="h-5 w-5 text-purple-500" />;
      case "document":
        return <FileText className="h-5 w-5 text-amber-500" />;
      case "audio":
        return <File className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const stats = {
    total: media.length,
    images: media.filter((m) => m.type === "image").length,
    videos: media.filter((m) => m.type === "video").length,
    documents: media.filter((m) => m.type === "document" || m.type === "audio")
      .length,
    totalSize: media.reduce((acc, m) => acc + m.size, 0),
  };

  const toggleSelect = (id: string) => {
    setSelectedMedia((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedFiles: MediaFile[] = [];

    try {
      for (const file of Array.from(files)) {
        const result = await uploadMediaFile(file);
        if (result) {
          uploadedFiles.push(result);
        }
      }

      if (uploadedFiles.length > 0) {
        setMedia((prev) => [...uploadedFiles, ...prev]);
        alert(`${uploadedFiles.length} file berhasil diupload`);
        setUploadDialogOpen(false);
      } else {
        alert("Gagal mengupload file");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Terjadi kesalahan saat upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (item: MediaFile) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${item.name}"?`)) return;

    const success = await deleteMediaFile(item.bucket, item.path);
    if (success) {
      setMedia((prev) => prev.filter((m) => m.id !== item.id));
    } else {
      alert("Gagal menghapus file");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMedia.length === 0) return;
    if (
      !confirm(
        `Apakah Anda yakin ingin menghapus ${selectedMedia.length} file?`
      )
    )
      return;

    const filesToDelete = media
      .filter((m) => selectedMedia.includes(m.id))
      .map((m) => ({ bucket: m.bucket, path: m.path }));

    const success = await deleteMediaFiles(filesToDelete);
    if (success) {
      setMedia((prev) => prev.filter((m) => !selectedMedia.includes(m.id)));
      setSelectedMedia([]);
    } else {
      alert("Gagal menghapus beberapa file");
    }
  };

  const handleCopyUrl = async (url: string) => {
    const success = await copyMediaUrl(url);
    if (!success) {
      alert("Gagal menyalin URL");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-sm text-muted-foreground">
            Kelola semua file media di portal berita Anda
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Media</DialogTitle>
                <DialogDescription>
                  Upload gambar, video, atau dokumen ke library
                </DialogDescription>
              </DialogHeader>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Mengupload file...
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag & drop file di sini, atau
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => handleUpload(e.target.files)}
                      aria-label="Upload file"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Pilih File
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      Max file size: 10MB. Format: JPG, PNG, GIF, WebP
                    </p>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <HardDrive className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Files</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <ImageIcon className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.images}</p>
              <p className="text-xs text-muted-foreground">Images</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Video className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.videos}</p>
              <p className="text-xs text-muted-foreground">Videos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <HardDrive className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {formatFileSize(stats.totalSize)}
              </p>
              <p className="text-xs text-muted-foreground">Total Size</p>
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
                placeholder="Cari file..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={typeFilter}
                onValueChange={(v) => setTypeFilter(v as MediaType)}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="image">Gambar</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Dokumen</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {selectedMedia.length > 0 && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                {selectedMedia.length} dipilih
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedMedia([])}
              >
                <X className="h-4 w-4 mr-2" />
                Batal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">
            {media.length === 0
              ? "Belum ada media. Upload file pertama Anda!"
              : "Tidak ada media ditemukan"}
          </p>
          {media.length === 0 && (
            <Button className="mt-4" onClick={() => setUploadDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* Media Grid */
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredMedia.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div
                className="relative aspect-square cursor-pointer"
                onClick={() => item.type === "image" && setPreviewMedia(item)}
              >
                {item.type === "image" ? (
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-muted">
                    {getFileIcon(item.type)}
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Checkbox
                    checked={selectedMedia.includes(item.id)}
                    onCheckedChange={() => toggleSelect(item.id)}
                    className="bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {item.type === "image" && (
                        <DropdownMenuItem onClick={() => setPreviewMedia(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleCopyUrl(item.url)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={item.url} download={item.name} target="_blank">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-xs font-medium truncate">{item.name}</p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground">
                  <span>{formatFileSize(item.size)}</span>
                  <RelativeTime date={item.createdAt} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Media List */
        <Card>
          <div className="divide-y">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 hover:bg-muted/50"
              >
                <Checkbox
                  checked={selectedMedia.includes(item.id)}
                  onCheckedChange={() => toggleSelect(item.id)}
                />
                <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  {item.type === "image" ? (
                    <Image
                      src={item.url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    getFileIcon(item.type)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(item.size)} •{" "}
                    <RelativeTime date={item.createdAt} />
                  </p>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {item.type}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleCopyUrl(item.url)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy URL
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href={item.url} download={item.name} target="_blank">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(item)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!previewMedia} onOpenChange={() => setPreviewMedia(null)}>
        <DialogContent className="max-w-3xl p-0">
          {previewMedia && (
            <>
              <div className="relative aspect-video">
                <Image
                  src={previewMedia.url}
                  alt={previewMedia.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{previewMedia.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(previewMedia.size)} •{" "}
                      <RelativeTime date={previewMedia.createdAt} />
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyUrl(previewMedia.url)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy URL
                    </Button>
                    <Button size="sm" asChild>
                      <a
                        href={previewMedia.url}
                        download={previewMedia.name}
                        target="_blank"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
