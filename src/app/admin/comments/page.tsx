"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
import {
    Search,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    AlertCircle,
    MessageSquare,
    Flag,
    Trash2,
    Eye,
    Reply,
    ThumbsUp,
    ThumbsDown,
    Clock,
    Filter,
    RefreshCw,
} from "lucide-react";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { newsArticles } from "@/data/mock";

// Mock comments data
const mockComments = [
    {
        id: "1",
        author: { name: "Budi Santoso", avatar: "https://i.pravatar.cc/150?img=1", email: "budi@email.com" },
        content: "Artikel yang sangat informatif! Terima kasih sudah berbagi informasi ini.",
        article: newsArticles[0],
        status: "approved",
        likes: 12,
        createdAt: "2024-12-25T08:00:00Z",
        replies: 2,
    },
    {
        id: "2",
        author: { name: "Siti Rahayu", avatar: "https://i.pravatar.cc/150?img=5", email: "siti@email.com" },
        content: "Saya tidak setuju dengan pendapat ini. Menurut saya, ada beberapa fakta yang perlu dikoreksi.",
        article: newsArticles[1],
        status: "pending",
        likes: 3,
        createdAt: "2024-12-25T07:30:00Z",
        replies: 0,
    },
    {
        id: "3",
        author: { name: "Anonymous", avatar: "https://i.pravatar.cc/150?img=3", email: "anon@email.com" },
        content: "SPAM CONTENT - BUY NOW!!!! www.spam-link.com",
        article: newsArticles[2],
        status: "spam",
        likes: 0,
        createdAt: "2024-12-25T06:00:00Z",
        replies: 0,
    },
    {
        id: "4",
        author: { name: "Dewi Lestari", avatar: "https://i.pravatar.cc/150?img=9", email: "dewi@email.com" },
        content: "Ini adalah breaking news yang penting untuk diketahui masyarakat. Semoga kondisi segera membaik.",
        article: newsArticles[0],
        status: "approved",
        likes: 25,
        createdAt: "2024-12-25T05:00:00Z",
        replies: 5,
    },
    {
        id: "5",
        author: { name: "Ahmad Fauzi", avatar: "https://i.pravatar.cc/150?img=7", email: "ahmad@email.com" },
        content: "Bagus sekali penjelasannya. Bisa minta referensi sumber datanya?",
        article: newsArticles[3],
        status: "pending",
        likes: 8,
        createdAt: "2024-12-24T23:00:00Z",
        replies: 1,
    },
];

type CommentStatus = "all" | "approved" | "pending" | "spam";

export default function CommentsPage() {
    const [comments, setComments] = useState(mockComments);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<CommentStatus>("all");
    const [selectedComments, setSelectedComments] = useState<string[]>([]);
    const [replyDialog, setReplyDialog] = useState<{ open: boolean; commentId: string | null }>({
        open: false,
        commentId: null,
    });
    const [replyContent, setReplyContent] = useState("");

    const filteredComments = comments.filter((comment) => {
        const matchesSearch =
            comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comment.author.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || comment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: comments.length,
        pending: comments.filter((c) => c.status === "pending").length,
        approved: comments.filter((c) => c.status === "approved").length,
        spam: comments.filter((c) => c.status === "spam").length,
    };

    const updateStatus = (id: string, status: string) => {
        setComments((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status } : c))
        );
    };

    const deleteComment = (id: string) => {
        setComments((prev) => prev.filter((c) => c.id !== id));
    };

    const toggleSelect = (id: string) => {
        setSelectedComments((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const bulkAction = (action: "approve" | "spam" | "delete") => {
        if (action === "delete") {
            setComments((prev) => prev.filter((c) => !selectedComments.includes(c.id)));
        } else {
            setComments((prev) =>
                prev.map((c) =>
                    selectedComments.includes(c.id)
                        ? { ...c, status: action === "approve" ? "approved" : "spam" }
                        : c
                )
            );
        }
        setSelectedComments([]);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return <Badge className="bg-green-500/10 text-green-600 gap-1"><CheckCircle2 className="h-3 w-3" />Approved</Badge>;
            case "pending":
                return <Badge className="bg-amber-500/10 text-amber-600 gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
            case "spam":
                return <Badge className="bg-red-500/10 text-red-600 gap-1"><AlertCircle className="h-3 w-3" />Spam</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Komentar</h1>
                    <p className="text-sm text-muted-foreground">
                        Moderasi dan kelola komentar dari pembaca
                    </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className={statusFilter === "all" ? "ring-2 ring-primary" : ""} onClick={() => setStatusFilter("all")}>
                    <CardContent className="p-4 flex items-center gap-4 cursor-pointer">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                            <MessageSquare className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.total}</p>
                            <p className="text-xs text-muted-foreground">Total Komentar</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className={statusFilter === "pending" ? "ring-2 ring-primary" : ""} onClick={() => setStatusFilter("pending")}>
                    <CardContent className="p-4 flex items-center gap-4 cursor-pointer">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                            <Clock className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.pending}</p>
                            <p className="text-xs text-muted-foreground">Menunggu Moderasi</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className={statusFilter === "approved" ? "ring-2 ring-primary" : ""} onClick={() => setStatusFilter("approved")}>
                    <CardContent className="p-4 flex items-center gap-4 cursor-pointer">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.approved}</p>
                            <p className="text-xs text-muted-foreground">Disetujui</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className={statusFilter === "spam" ? "ring-2 ring-primary" : ""} onClick={() => setStatusFilter("spam")}>
                    <CardContent className="p-4 flex items-center gap-4 cursor-pointer">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.spam}</p>
                            <p className="text-xs text-muted-foreground">Spam</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search & Bulk Actions */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Cari komentar atau nama..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {selectedComments.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{selectedComments.length} dipilih</span>
                                <Button variant="outline" size="sm" onClick={() => bulkAction("approve")}>
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Approve
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => bulkAction("spam")}>
                                    <Flag className="h-4 w-4 mr-1" />
                                    Spam
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => bulkAction("delete")}>
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Hapus
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-3">
                {filteredComments.map((comment) => (
                    <Card key={comment.id} className={`transition-all ${comment.status === "pending" ? "border-amber-200 dark:border-amber-900/50" : ""}`}>
                        <CardContent className="p-4">
                            <div className="flex gap-4">
                                {/* Checkbox */}
                                <div className="pt-1">
                                    <Checkbox
                                        checked={selectedComments.includes(comment.id)}
                                        onCheckedChange={() => toggleSelect(comment.id)}
                                    />
                                </div>

                                {/* Avatar */}
                                <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden">
                                    <Image
                                        src={comment.author.avatar}
                                        alt={comment.author.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-medium text-sm">{comment.author.name}</span>
                                                {getStatusBadge(comment.status)}
                                            </div>
                                            <p className="text-xs text-muted-foreground">{comment.author.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <RelativeTime date={comment.createdAt} className="text-xs text-muted-foreground" />
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => updateStatus(comment.id, "approved")}>
                                                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                                        Approve
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateStatus(comment.id, "spam")}>
                                                        <Flag className="mr-2 h-4 w-4 text-amber-500" />
                                                        Mark as Spam
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setReplyDialog({ open: true, commentId: comment.id })}>
                                                        <Reply className="mr-2 h-4 w-4" />
                                                        Reply
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600" onClick={() => deleteComment(comment.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    {/* Comment Text */}
                                    <p className="text-sm mt-2 leading-relaxed">{comment.content}</p>

                                    {/* Article Reference */}
                                    <div className="mt-3 p-2 rounded-lg bg-muted/50 flex items-center gap-3">
                                        <div className="relative h-8 w-12 shrink-0 rounded overflow-hidden">
                                            <Image
                                                src={comment.article.image_url}
                                                alt={comment.article.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-1 flex-1">
                                            {comment.article.title}
                                        </p>
                                        <Button variant="ghost" size="sm" className="h-6 text-xs gap-1">
                                            <Eye className="h-3 w-3" />
                                            View
                                        </Button>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <ThumbsUp className="h-3 w-3" />
                                            {comment.likes} likes
                                        </span>
                                        {comment.replies > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Reply className="h-3 w-3" />
                                                {comment.replies} replies
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Reply Dialog */}
            <Dialog open={replyDialog.open} onOpenChange={(open) => setReplyDialog({ open, commentId: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Balas Komentar</DialogTitle>
                        <DialogDescription>
                            Tulis balasan untuk komentar ini sebagai admin
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Textarea
                            placeholder="Tulis balasan Anda..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReplyDialog({ open: false, commentId: null })}>
                            Batal
                        </Button>
                        <Button onClick={() => {
                            setReplyDialog({ open: false, commentId: null });
                            setReplyContent("");
                        }}>
                            Kirim Balasan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
