"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  MoreHorizontal,
  MessageSquare,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  ThumbsUp,
  RefreshCw,
  Clock,
  User,
  Flag,
  AlertTriangle,
  Shield,
  Ban,
} from "lucide-react";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { createClient } from "@/lib/supabase/client";
import {
  getCommentReports,
  updateReportStatus,
  CommentReport,
} from "@/lib/supabase/services/comments";


interface Comment {
  id: string;
  content: string;
  likes_count: number;
  is_approved: boolean;
  created_at: string;
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string;
  } | null;
  articles: {
    id: string;
    title: string;
    slug: string;
    image_url: string | null;
  } | null;
}

interface CommentsClientProps {
  initialComments: Comment[];
}

type StatusFilter = "all" | "approved" | "pending";
type ReportStatusFilter = "all" | "pending" | "reviewed" | "resolved" | "dismissed";

const REPORT_REASON_LABELS: Record<string, { label: string; color: string }> = {
  spam: { label: "Spam", color: "bg-gray-500" },
  harassment: { label: "Pelecehan", color: "bg-red-500" },
  inappropriate: { label: "Tidak Pantas", color: "bg-orange-500" },
  misinformation: { label: "Info Palsu", color: "bg-amber-500" },
  other: { label: "Lainnya", color: "bg-blue-500" },
};

const REPORT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Menunggu", color: "bg-amber-500" },
  reviewed: { label: "Ditinjau", color: "bg-blue-500" },
  resolved: { label: "Selesai", color: "bg-green-500" },
  dismissed: { label: "Ditolak", color: "bg-gray-500" },
};

export function CommentsClient({ initialComments }: CommentsClientProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("comments");

  // Reports state
  const [reports, setReports] = useState<CommentReport[]>([]);
  const [reportStatusFilter, setReportStatusFilter] = useState<ReportStatusFilter>("pending");
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  // Fetch reports when tab changes
  useEffect(() => {
    if (activeTab === "reports") {
      fetchReports();
    }
  }, [activeTab, reportStatusFilter]);

  const fetchReports = async () => {
    setIsLoadingReports(true);
    const data = await getCommentReports(
      reportStatusFilter === "all" ? undefined : reportStatusFilter
    );
    setReports(data);
    setIsLoadingReports(false);
  };

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.profiles?.full_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      comment.articles?.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && comment.is_approved) ||
      (statusFilter === "pending" && !comment.is_approved);
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: comments.length,
    approved: comments.filter((c) => c.is_approved).length,
    pending: comments.filter((c) => !c.is_approved).length,
    reports: reports.filter((r) => r.status === "pending").length,
  };


  const handleApprove = async (commentId: string) => {
    setIsUpdating(commentId);
    const supabase = createClient();

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("comments")
        .update({ is_approved: true })
        .eq("id", commentId);

      if (error) {
        console.error("Error approving comment:", error);
        toast.error("Gagal menyetujui komentar");
        return;
      }

      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, is_approved: true } : c))
      );
      toast.success("Komentar berhasil disetujui");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleReject = async (commentId: string) => {
    setIsUpdating(commentId);
    const supabase = createClient();

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("comments")
        .update({ is_approved: false })
        .eq("id", commentId);

      if (error) {
        console.error("Error rejecting comment:", error);
        toast.error("Gagal menolak komentar");
        return;
      }

      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, is_approved: false } : c))
      );
      toast.success("Persetujuan komentar dibatalkan");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteClick = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;

    setIsUpdating(commentToDelete);
    setDeleteDialogOpen(false);
    const supabase = createClient();

    try {
      // Use RPC function to bypass RLS
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: rpcError } = await (supabase as any).rpc("admin_delete_comment", {
        p_comment_id: commentToDelete,
      });

      if (rpcError) {
        console.error("RPC delete failed, trying direct delete:", rpcError);
        // Fallback to direct delete
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from("comments")
          .delete()
          .eq("id", commentToDelete);

        if (error) {
          console.error("Error deleting comment:", error);
          toast.error("Gagal menghapus komentar: " + (error.message || "Permission denied"));
          return;
        }
      }

      setComments((prev) => prev.filter((c) => c.id !== commentToDelete));
      toast.success("Komentar berhasil dihapus");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsUpdating(null);
      setCommentToDelete(null);
    }
  };

  const handleReportAction = async (
    reportId: string,
    action: "resolved" | "dismissed",
    deleteComment?: boolean
  ) => {
    setIsUpdating(reportId);
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Anda harus login");
        return;
      }

      const success = await updateReportStatus(reportId, action, user.id);
      if (!success) {
        toast.error("Gagal memperbarui status laporan");
        return;
      }

      if (action === "resolved" && deleteComment) {
        const report = reports.find((r) => r.id === reportId);
        if (report?.comment_id) {
          // Use RPC function to bypass RLS
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).rpc("admin_delete_comment", {
            p_comment_id: report.comment_id,
          });
          setComments((prev) => prev.filter((c) => c.id !== report.comment_id));
        }
      }

      await fetchReports();
      toast.success(
        action === "dismissed" 
          ? "Laporan diabaikan" 
          : deleteComment 
            ? "Komentar berhasil dihapus" 
            : "Laporan ditandai selesai"
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsUpdating(null);
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
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-blue-500" />
            Komentar
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola komentar dan laporan dari pembaca
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <MessageSquare className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Komentar</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.approved}</p>
              <p className="text-xs text-muted-foreground">Disetujui</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Menunggu</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <Flag className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.reports}</p>
              <p className="text-xs text-muted-foreground">Laporan Baru</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="comments" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Komentar
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <Flag className="h-4 w-4" />
            Laporan
            {stats.reports > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 px-1.5">
                {stats.reports}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Comments Tab */}
        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari komentar..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {filteredComments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {comments.length === 0 ? "Belum ada komentar" : "Tidak ada komentar ditemukan"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredComments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-muted">
                        {comment.profiles?.avatar_url ? (
                          <Image src={comment.profiles.avatar_url} alt={comment.profiles.full_name || "User"} fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.profiles?.full_name || "Anonymous"}</span>
                          <Badge variant={comment.is_approved ? "default" : "secondary"} className="text-[10px]">
                            {comment.is_approved ? "Disetujui" : "Menunggu"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{comment.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {comment.articles && (
                            <Link href={`/news/${comment.articles.slug}`} target="_blank" className="hover:text-primary truncate max-w-[200px]">
                              {comment.articles.title}
                            </Link>
                          )}
                          <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{comment.likes_count}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /><RelativeTime date={comment.created_at} /></span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        {!comment.is_approved && (
                          <Button variant="outline" size="sm" className="gap-1 text-green-600 hover:text-green-700" onClick={() => handleApprove(comment.id)} disabled={isUpdating === comment.id}>
                            <CheckCircle className="h-4 w-4" />Setujui
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isUpdating === comment.id}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {comment.articles && (
                              <DropdownMenuItem asChild>
                                <Link href={`/news/${comment.articles.slug}`} target="_blank"><Eye className="mr-2 h-4 w-4" />Lihat Artikel</Link>
                              </DropdownMenuItem>
                            )}
                            {comment.is_approved ? (
                              <DropdownMenuItem onClick={() => handleReject(comment.id)}><XCircle className="mr-2 h-4 w-4" />Batalkan Persetujuan</DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleApprove(comment.id)}><CheckCircle className="mr-2 h-4 w-4" />Setujui</DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(comment.id)}><Trash2 className="mr-2 h-4 w-4" />Hapus</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>


        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <Select value={reportStatusFilter} onValueChange={(v) => setReportStatusFilter(v as ReportStatusFilter)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status Laporan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="reviewed">Ditinjau</SelectItem>
                    <SelectItem value="resolved">Selesai</SelectItem>
                    <SelectItem value="dismissed">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="gap-2" onClick={fetchReports}>
                  <RefreshCw className="h-4 w-4" />Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLoadingReports ? (
            <Card>
              <CardContent className="p-8 text-center">
                <RefreshCw className="h-8 w-8 mx-auto text-muted-foreground animate-spin mb-4" />
                <p className="text-muted-foreground">Memuat laporan...</p>
              </CardContent>
            </Card>
          ) : reports.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 mx-auto text-green-500/50 mb-4" />
                <p className="text-muted-foreground">
                  Tidak ada laporan {reportStatusFilter !== "all" && `dengan status "${REPORT_STATUS_LABELS[reportStatusFilter]?.label}"`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <Card key={report.id} className={report.status === "pending" ? "border-amber-500/50 bg-amber-500/5" : ""}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge className={`text-[10px] text-white ${REPORT_REASON_LABELS[report.reason]?.color || "bg-gray-500"}`}>
                            {REPORT_REASON_LABELS[report.reason]?.label || report.reason}
                          </Badge>
                          <Badge variant="outline" className={`text-[10px] ${report.status === "pending" ? "border-amber-500 text-amber-500" : report.status === "resolved" ? "border-green-500 text-green-500" : "border-gray-500 text-gray-500"}`}>
                            {REPORT_STATUS_LABELS[report.status]?.label || report.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground"><RelativeTime date={report.created_at} /></span>
                        </div>
                        {report.comment && (
                          <div className="p-3 rounded-lg bg-muted/50 mb-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium">Komentar oleh: {report.comment.profiles?.full_name || "Anonymous"}</span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">&quot;{report.comment.content}&quot;</p>
                            {report.comment.articles && (
                              <Link href={`/news/${report.comment.articles.slug}`} target="_blank" className="text-xs text-primary hover:underline mt-1 inline-block">
                                Pada artikel: {report.comment.articles.title}
                              </Link>
                            )}
                          </div>
                        )}
                        {report.description && (
                          <p className="text-sm text-muted-foreground mb-2"><span className="font-medium">Keterangan:</span> {report.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Dilaporkan oleh:</span>
                          {report.reporter ? <span className="font-medium">{report.reporter.full_name || "User"}</span> : <span>Anonymous</span>}
                        </div>
                      </div>
                      {report.status === "pending" && (
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm" className="gap-1 text-green-600 hover:text-green-700" onClick={() => handleReportAction(report.id, "dismissed")} disabled={isUpdating === report.id}>
                            <CheckCircle className="h-4 w-4" />Abaikan
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="destructive" size="sm" className="gap-1" disabled={isUpdating === report.id}>
                                <Ban className="h-4 w-4" />Tindakan
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleReportAction(report.id, "resolved", true)}>
                                <Trash2 className="mr-2 h-4 w-4" />Hapus Komentar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReportAction(report.id, "resolved")}>
                                <CheckCircle className="mr-2 h-4 w-4" />Tandai Selesai
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Komentar?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Komentar akan dihapus secara permanen dari sistem.
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
