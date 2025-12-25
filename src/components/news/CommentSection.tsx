"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Heart,
    MessageCircle,
    MoreHorizontal,
    Send,
    ChevronDown,
    ChevronUp,
    Flag,
    ThumbsUp,
    Reply,
    Smile
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Comment {
    id: string;
    author: {
        name: string;
        avatar: string;
        isVerified?: boolean;
    };
    content: string;
    createdAt: string;
    likes: number;
    isLiked?: boolean;
    replies?: Comment[];
}

interface CommentSectionProps {
    articleId: string;
}

// Mock comments data
const mockComments: Comment[] = [
    {
        id: "1",
        author: {
            name: "Budi Santoso",
            avatar: "https://i.pravatar.cc/150?img=33",
            isVerified: true,
        },
        content: "Artikel yang sangat informatif! Saya setuju bahwa digitalisasi UMKM sangat penting untuk kemajuan ekonomi Indonesia. Semoga program ini bisa berjalan dengan baik dan merata ke seluruh daerah.",
        createdAt: "2 jam lalu",
        likes: 24,
        isLiked: false,
        replies: [
            {
                id: "1-1",
                author: {
                    name: "Siti Rahayu",
                    avatar: "https://i.pravatar.cc/150?img=44",
                },
                content: "Setuju banget! Apalagi di daerah terpencil yang masih minim akses internet.",
                createdAt: "1 jam lalu",
                likes: 8,
                isLiked: true,
            },
            {
                id: "1-2",
                author: {
                    name: "Ahmad Wijaya",
                    avatar: "https://i.pravatar.cc/150?img=52",
                },
                content: "Betul, infrastruktur digital juga harus diperbaiki bukan hanya pelatihannya saja.",
                createdAt: "45 menit lalu",
                likes: 5,
                isLiked: false,
            },
        ],
    },
    {
        id: "2",
        author: {
            name: "Maya Putri",
            avatar: "https://i.pravatar.cc/150?img=45",
        },
        content: "Kapan ya program ini sampai ke kota-kota kecil? Saya berharap UMKM di daerah juga bisa merasakan manfaatnya 🙏",
        createdAt: "3 jam lalu",
        likes: 15,
        isLiked: false,
        replies: [
            {
                id: "2-1",
                author: {
                    name: "Admin BeritaAE",
                    avatar: "https://i.pravatar.cc/150?img=68",
                    isVerified: true,
                },
                content: "Menurut info dari Kemenkop, program ini akan diluncurkan bertahap ke seluruh provinsi mulai Q1 2025.",
                createdAt: "2 jam lalu",
                likes: 12,
                isLiked: false,
            },
        ],
    },
    {
        id: "3",
        author: {
            name: "Rizki Pratama",
            avatar: "https://i.pravatar.cc/150?img=12",
        },
        content: "Finally! Ini yang ditunggu-tunggu para pelaku UMKM. Semoga realisasinya tidak hanya di atas kertas saja.",
        createdAt: "5 jam lalu",
        likes: 32,
        isLiked: true,
    },
];

function SingleComment({
    comment,
    isReply = false,
    onReply,
}: {
    comment: Comment;
    isReply?: boolean;
    onReply?: (commentId: string) => void;
}) {
    const [liked, setLiked] = useState(comment.isLiked || false);
    const [likeCount, setLikeCount] = useState(comment.likes);
    const [showReplies, setShowReplies] = useState(true);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("group", isReply && "ml-12 mt-3")}
        >
            <div className={cn(
                "flex gap-3",
                !isReply && "p-4 rounded-2xl hover:bg-accent/30 transition-colors"
            )}>
                {/* Avatar */}
                <div className="relative shrink-0">
                    <Image
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        width={isReply ? 32 : 40}
                        height={isReply ? 32 : 40}
                        className="rounded-full ring-2 ring-background"
                    />
                    {comment.author.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{comment.author.name}</span>
                        {comment.author.isVerified && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-blue-500/10 text-blue-500 border-0">
                                Verified
                            </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">• {comment.createdAt}</span>
                    </div>

                    {/* Comment Text */}
                    <p className={cn("text-sm leading-relaxed", isReply ? "text-muted-foreground" : "")}>
                        {comment.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-1 mt-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-8 px-2 gap-1.5 text-xs",
                                liked && "text-red-500"
                            )}
                            onClick={handleLike}
                        >
                            <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} />
                            <span>{likeCount}</span>
                        </Button>

                        {!isReply && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 gap-1.5 text-xs"
                                onClick={() => setShowReplyInput(!showReplyInput)}
                            >
                                <Reply className="h-3.5 w-3.5" />
                                Balas
                            </Button>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Flag className="h-3.5 w-3.5" />
                        </Button>
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
                                    <Image
                                        src="https://i.pravatar.cc/150?img=68"
                                        alt="You"
                                        width={32}
                                        height={32}
                                        className="rounded-full shrink-0"
                                    />
                                    <div className="flex-1 flex gap-2">
                                        <input
                                            type="text"
                                            placeholder={`Balas ${comment.author.name}...`}
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="flex-1 px-4 py-2 text-sm rounded-full bg-muted border-0 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                        <Button size="icon" className="h-9 w-9 rounded-full shrink-0">
                                            <Send className="h-4 w-4" />
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
                                className="h-7 px-2 gap-1 text-xs text-primary"
                                onClick={() => setShowReplies(!showReplies)}
                            >
                                {showReplies ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                {showReplies ? "Sembunyikan" : "Lihat"} {comment.replies.length} balasan
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
                                            <SingleComment key={reply.id} comment={reply} isReply />
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
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState(mockComments);
    const [sortBy, setSortBy] = useState<"newest" | "popular">("popular");

    const totalComments = comments.reduce(
        (acc, c) => acc + 1 + (c.replies?.length || 0),
        0
    );

    const sortedComments = [...comments].sort((a, b) => {
        if (sortBy === "popular") return b.likes - a.likes;
        return 0; // For now, keep original order for newest
    });

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
            {/* Comment Input */}
            <Card className="border-0 shadow-lg mb-8 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex gap-4 p-4 items-start">
                        <div className="relative shrink-0">
                            <Image
                                src="https://i.pravatar.cc/150?img=68"
                                alt="You"
                                width={40}
                                height={40}
                                className="rounded-full ring-2 ring-primary/20 object-cover aspect-square"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="relative">
                                <textarea
                                    placeholder="Tulis komentar Anda..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 text-sm rounded-xl bg-background border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y min-h-[100px] transition-all"
                                />
                                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                                        <Smile className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-end mt-2">
                                <Button
                                    disabled={!commentText.trim()}
                                    className="gap-2 rounded-full px-6 h-9"
                                    size="sm"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                    Kirim
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-1">
                {sortedComments.map((comment) => (
                    <SingleComment key={comment.id} comment={comment} />
                ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
                <Button variant="outline" className="rounded-full px-8">
                    Muat Lebih Banyak Komentar
                </Button>
            </div>
        </section>
    );
}
