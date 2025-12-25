"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Search,
    Plus,
    Upload,
    MoreHorizontal,
    Image as ImageIcon,
    Video,
    FileText,
    Folder,
    Grid3X3,
    List,
    Trash2,
    Download,
    Copy,
    Eye,
    File,
    HardDrive,
    Clock,
    X,
} from "lucide-react";
import { RelativeTime } from "@/components/ui/RelativeTime";

// Mock media data
const mockMedia = [
    { id: "1", name: "hero-politik.jpg", type: "image", size: 245000, url: "https://picsum.photos/800/600?random=1", createdAt: "2024-12-25T08:00:00Z" },
    { id: "2", name: "ekonomi-chart.png", type: "image", size: 182000, url: "https://picsum.photos/800/600?random=2", createdAt: "2024-12-24T15:00:00Z" },
    { id: "3", name: "interview-video.mp4", type: "video", size: 15000000, url: "https://picsum.photos/800/600?random=3", createdAt: "2024-12-24T10:00:00Z" },
    { id: "4", name: "press-release.pdf", type: "document", size: 520000, url: "#", createdAt: "2024-12-23T18:00:00Z" },
    { id: "5", name: "thumbnail-sport.jpg", type: "image", size: 98000, url: "https://picsum.photos/800/600?random=4", createdAt: "2024-12-23T12:00:00Z" },
    { id: "6", name: "infografis.png", type: "image", size: 456000, url: "https://picsum.photos/800/600?random=5", createdAt: "2024-12-22T09:00:00Z" },
    { id: "7", name: "breaking-news.jpg", type: "image", size: 312000, url: "https://picsum.photos/800/600?random=6", createdAt: "2024-12-22T08:00:00Z" },
    { id: "8", name: "podcast-audio.mp3", type: "audio", size: 8500000, url: "#", createdAt: "2024-12-21T14:00:00Z" },
];

type ViewMode = "grid" | "list";
type MediaType = "all" | "image" | "video" | "document" | "audio";

export default function MediaPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [typeFilter, setTypeFilter] = useState<MediaType>("all");
    const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
    const [previewMedia, setPreviewMedia] = useState<typeof mockMedia[0] | null>(null);

    const filteredMedia = mockMedia.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
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
        total: mockMedia.length,
        images: mockMedia.filter((m) => m.type === "image").length,
        videos: mockMedia.filter((m) => m.type === "video").length,
        documents: mockMedia.filter((m) => m.type === "document" || m.type === "audio").length,
        totalSize: mockMedia.reduce((acc, m) => acc + m.size, 0),
    };

    const toggleSelect = (id: string) => {
        setSelectedMedia((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
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
                    <Button variant="outline" size="sm" className="gap-2">
                        <Folder className="h-4 w-4" />
                        New Folder
                    </Button>
                    <Dialog>
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
                            <div className="border-2 border-dashed rounded-xl p-8 text-center">
                                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-sm text-muted-foreground mb-2">
                                    Drag & drop file di sini, atau
                                </p>
                                <Button variant="outline" size="sm">
                                    Pilih File
                                </Button>
                                <p className="text-xs text-muted-foreground mt-4">
                                    Max file size: 50MB. Format: JPG, PNG, GIF, MP4, PDF
                                </p>
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
                            <p className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</p>
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
                            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as MediaType)}>
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
                            <span className="text-sm text-muted-foreground">{selectedMedia.length} dipilih</span>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Media Grid/List */}
            {viewMode === "grid" ? (
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
                                            <Button variant="secondary" size="icon" className="h-7 w-7">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Preview
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Copy className="mr-2 h-4 w-4" />
                                                Copy URL
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Download className="mr-2 h-4 w-4" />
                                                Download
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600">
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
                <Card>
                    <div className="divide-y">
                        {filteredMedia.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-muted/50">
                                <Checkbox
                                    checked={selectedMedia.includes(item.id)}
                                    onCheckedChange={() => toggleSelect(item.id)}
                                />
                                <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                                    {item.type === "image" ? (
                                        <Image src={item.url} alt={item.name} fill className="object-cover" />
                                    ) : (
                                        getFileIcon(item.type)
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFileSize(item.size)} • <RelativeTime date={item.createdAt} />
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
                                        <DropdownMenuItem>
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copy URL
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600">
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
                                            {formatFileSize(previewMedia.size)} • <RelativeTime date={previewMedia.createdAt} />
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copy URL
                                        </Button>
                                        <Button size="sm">
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
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
