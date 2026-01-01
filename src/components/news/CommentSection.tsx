"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Heart,
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
  Flag,
  ThumbsUp,
  Reply,
  Smile,
  Loader2,
  CheckCircle,
  Shield,
  PenLine,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  getArticleComments,
  createComment,
  toggleCommentLike,
  isCommentLiked,
  subscribeToComments,
  reportComment,
} from "@/lib/supabase/services/comments";
import { Comment } from "@/types";

interface CommentSectionProps {
  articleId: string;
}

const REPORT_REASONS = [
  { value: "spam", label: "Spam", icon: "🚫" },
  { value: "harassment", label: "Pelecehan / Bullying", icon: "😠" },
  { value: "inappropriate", label: "Konten Tidak Pantas", icon: "⚠️" },
  { value: "misinformation", label: "Informasi Palsu", icon: "❌" },
  { value: "other", label: "Lainnya", icon: "📝" },
];

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Baru saja";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} menit lalu`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Role badge component
function RoleBadge({ role }: { role?: string }) {
  if (!role || role === "member") return null;

  const roleConfig: Record<
    string,
    { label: string; color: string; icon: React.ReactNode }
  > = {
    admin: {
      label: "Admin",
      color: "bg-red-500/10 text-red-600 dark:text-red-400",
      icon: <Shield className="h-2.5 w-2.5" />,
    },
    editor: {
      label: "Editor",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      icon: <PenLine className="h-2.5 w-2.5" />,
    },
    author: {
      label: "Penulis",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      icon: <PenLine className="h-2.5 w-2.5" />,
    },
  };

  const config = roleConfig[role];
  if (!config) return null;

  return (
    <Badge
      variant="secondary"
      className={cn(
        "text-[10px] px-1.5 py-0 h-4 border-0 gap-0.5 font-medium",
        config.color
      )}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}

// Verified badge component
function VerifiedBadge({ role }: { role?: string }) {
  if (!role || !["admin", "editor", "author"].includes(role)) return null;

  return (
    <span
      className="inline-flex items-center justify-center"
      title="Terverifikasi"
    >
      <CheckCircle className="h-3.5 w-3.5 text-blue-500 fill-blue-500/20" />
    </span>
  );
}

function SingleComment({
  comment,
  isReply = false,
  onReplySubmit,
  userId,
  onReport,
}: {
  comment: Comment;
  isReply?: boolean;
  onReplySubmit: (parentId: string, content: string) => Promise<void>;
  userId?: string;
  onReport: (commentId: string) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes_count);
  const [showReplies, setShowReplies] = useState(true);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userId) {
      isCommentLiked(comment.id, userId).then(setLiked);
    }
  }, [comment.id, userId]);

  const handleLike = async () => {
    if (!userId) return;

    const newLiked = await toggleCommentLike(comment.id, userId);
    setLiked(newLiked);
    setLikeCount(newLiked ? likeCount + 1 : likeCount - 1);
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    await onReplySubmit(comment.id, replyText);
    setReplyText("");
    setShowReplyInput(false);
    setIsSubmitting(false);
  };

  const isVerified =
    comment.author?.role &&
    ["admin", "editor", "author"].includes(comment.author.role);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("group", isReply && "ml-10 sm:ml-12 mt-3")}
    >
      <div
        className={cn(
          "flex gap-3",
          !isReply &&
            "p-4 rounded-2xl hover:bg-accent/30 transition-colors border border-transparent hover:border-border/50"
        )}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <Image
            src={
              comment.author?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                comment.author?.name || "U"
              )}&background=random`
            }
            alt={comment.author?.name || "User"}
            width={isReply ? 32 : 40}
            height={isReply ? 32 : 40}
            className={cn(
              "rounded-full object-cover aspect-square",
              isVerified ? "ring-2 ring-blue-500/50" : "ring-2 ring-background"
            )}
            unoptimized
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header - Name, Verified Badge, Role Badge, Time */}
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="font-semibold text-sm">
              {comment.author?.name || "Anonymous"}
            </span>
            <VerifiedBadge role={comment.author?.role} />
            <RoleBadge role={comment.author?.role} />
            <span className="text-xs text-muted-foreground">
              • {formatRelativeTime(comment.created_at)}
            </span>
          </div>

          {/* Comment Text */}
          <p
            className={cn(
              "text-sm leading-relaxed whitespace-pre-wrap break-words",
              isReply ? "text-muted-foreground" : ""
            )}
          >
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-1 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-2 gap-1.5 text-xs rounded-full",
                liked && "text-red-500"
              )}
              onClick={handleLike}
              disabled={!userId}
              title={userId ? "Suka" : "Login untuk menyukai"}
            >
              <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} />
              <span>{likeCount}</span>
            </Button>

            {!isReply && userId && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 gap-1.5 text-xs rounded-full"
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                <Reply className="h-3.5 w-3.5" />
                Balas
              </Button>
            )}

            {userId && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500"
                onClick={() => onReport(comment.id)}
                title="Laporkan komentar"
              >
                <Flag className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          {/* Reply Input */}
          <AnimatePresence>
            {showReplyInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
              >
                <div className="flex gap-2">
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder={`Balas ${comment.author?.name || "User"}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 px-4 py-2 text-sm rounded-full bg-muted border-0 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleReplySubmit()
                      }
                    />
                    <Button
                      size="icon"
                      className="h-9 w-9 rounded-full shrink-0"
                      onClick={handleReplySubmit}
                      disabled={isSubmitting || !replyText.trim()}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 gap-1 text-xs text-primary rounded-full"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
                {showReplies ? "Sembunyikan" : "Lihat"} {comment.replies.length}{" "}
                balasan
              </Button>

              <AnimatePresence>
                {showReplies && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {comment.replies.map((reply) => (
                      <SingleComment
                        key={reply.id}
                        comment={reply}
                        isReply
                        onReplySubmit={onReplySubmit}
                        userId={userId}
                        onReport={onReport}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const { user, profile } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "popular">("popular");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Report dialog state
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportingCommentId, setReportingCommentId] = useState<string | null>(
    null
  );
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isReporting, setIsReporting] = useState(false);

  // Fetch comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const data = await getArticleComments(articleId);
      setComments(data);
      setIsLoading(false);
    };

    fetchComments();

    // Subscribe to real-time updates
    const channel = subscribeToComments(articleId, (payload) => {
      if (payload.eventType === "INSERT" && payload.new) {
        setComments((prev) => {
          // If it's a reply, add to parent
          if (payload.new!.parent_id) {
            return prev.map((c) => {
              if (c.id === payload.new!.parent_id) {
                return {
                  ...c,
                  replies: [...(c.replies || []), payload.new!],
                };
              }
              return c;
            });
          }
          // Otherwise add to root
          return [...prev, payload.new!];
        });
      } else if (payload.eventType === "DELETE" && payload.old) {
        setComments((prev) => prev.filter((c) => c.id !== payload.old!.id));
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [articleId]);

  const totalComments = comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length || 0),
    0
  );

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "popular") return b.likes_count - a.likes_count;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const newComment = await createComment({
        article_id: articleId,
        user_id: user.id,
        content: commentText,
      });

      if (newComment) {
        setComments((prev) => [...prev, newComment]);
        setCommentText("");
      } else {
        console.error("Failed to create comment - check authentication");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentId: string, content: string) => {
    if (!user) return;

    try {
      const newReply = await createComment({
        article_id: articleId,
        user_id: user.id,
        content,
        parent_id: parentId,
      });

      if (newReply) {
        setComments((prev) =>
          prev.map((c) => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: [...(c.replies || []), newReply],
              };
            }
            return c;
          })
        );
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const handleOpenReport = (commentId: string) => {
    setReportingCommentId(commentId);
    setReportReason("");
    setReportDescription("");
    setReportDialogOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!reportingCommentId || !reportReason || !user) return;

    setIsReporting(true);
    try {
      const success = await reportComment({
        comment_id: reportingCommentId,
        reporter_id: user.id,
        reason: reportReason,
        description: reportDescription || undefined,
      });

      if (success) {
        setReportDialogOpen(false);
        toast.success("Laporan berhasil dikirim", {
          description:
            "Terima kasih atas kontribusi Anda. Tim moderator akan meninjau laporan ini.",
        });
      } else {
        toast.error("Gagal mengirim laporan", {
          description: "Silakan coba lagi nanti.",
        });
      }
    } catch (error) {
      console.error("Error reporting comment:", error);
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi nanti.",
      });
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto mt-12 pt-8 border-t">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Komentar</h2>
          <Badge variant="secondary" className="rounded-full">
            {totalComments}
          </Badge>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-full">
          <Button
            variant={sortBy === "popular" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-3 rounded-full text-xs"
            onClick={() => setSortBy("popular")}
          >
            <ThumbsUp className="h-3 w-3 mr-1" />
            Terpopuler
          </Button>
          <Button
            variant={sortBy === "newest" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-3 rounded-full text-xs"
            onClick={() => setSortBy("newest")}
          >
            Terbaru
          </Button>
        </div>
      </div>

      {/* Comment Input */}
      <Card className="border-0 shadow-lg mb-8 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex gap-4 p-4 items-start">
            <div className="relative shrink-0">
              <Image
                src={
                  profile?.avatar_url ||
                  user?.user_metadata?.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profile?.full_name ||
                      user?.user_metadata?.full_name ||
                      user?.email ||
                      "U"
                  )}&background=random`
                }
                alt={
                  profile?.full_name || user?.user_metadata?.full_name || "You"
                }
                width={40}
                height={40}
                className="rounded-full ring-2 ring-primary/20 object-cover aspect-square"
                unoptimized
              />
            </div>
            <div className="flex-1">
              {user ? (
                <>
                  <div className="relative">
                    <textarea
                      placeholder="Tulis komentar Anda..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 text-sm rounded-xl bg-background border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y min-h-[100px] transition-all"
                    />
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-muted"
                      >
                        <Smile className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-end mt-2">
                    <Button
                      disabled={!commentText.trim() || isSubmitting}
                      className="gap-2 rounded-full px-6 h-9"
                      size="sm"
                      onClick={handleSubmitComment}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                      Kirim
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Silakan login untuk mengirim komentar
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/login">Login</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : sortedComments.length > 0 ? (
        <div className="space-y-1">
          {sortedComments.map((comment) => (
            <SingleComment
              key={comment.id}
              comment={comment}
              onReplySubmit={handleReplySubmit}
              userId={user?.id}
              onReport={handleOpenReport}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        </div>
      )}

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Laporkan Komentar
            </DialogTitle>
            <DialogDescription>
              Pilih alasan mengapa Anda melaporkan komentar ini. Laporan akan
              ditinjau oleh tim moderator.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Reason Selection */}
            <div className="space-y-2">
              <Label>Alasan Laporan</Label>
              <div className="grid grid-cols-1 gap-2">
                {REPORT_REASONS.map((reason) => (
                  <button
                    key={reason.value}
                    type="button"
                    onClick={() => setReportReason(reason.value)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                      reportReason === reason.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="text-lg">{reason.icon}</span>
                    <span className="text-sm font-medium">{reason.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Keterangan Tambahan (Opsional)
              </Label>
              <Textarea
                id="description"
                placeholder="Jelaskan lebih detail mengapa komentar ini bermasalah..."
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReportDialogOpen(false)}
              disabled={isReporting}
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmitReport}
              disabled={!reportReason || isReporting}
              className="gap-2"
            >
              {isReporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Flag className="h-4 w-4" />
              )}
              Kirim Laporan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
