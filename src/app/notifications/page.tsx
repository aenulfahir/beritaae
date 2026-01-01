"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  formatTimeAgo,
  Notification,
} from "@/lib/supabase/services/notifications";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Check,
  Trash2,
  MessageSquare,
  TrendingUp,
  Newspaper,
  Users,
  Clock,
  Loader2,
  LogIn,
  AlertCircle,
  Reply,
  Heart,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NotificationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    async function fetchNotifications() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getUserNotifications(user.id);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [user, authLoading]);

  const handleMarkAsRead = async (notificationId: string) => {
    const success = await markAsRead(notificationId);
    if (success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;

    setMarkingAllRead(true);
    try {
      const success = await markAllAsRead(user.id);
      if (success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      }
    } finally {
      setMarkingAllRead(false);
    }
  };

  const handleDelete = async (notificationId: string) => {
    setDeletingId(notificationId);
    try {
      const success = await deleteNotification(notificationId);
      if (success) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      }
    } finally {
      setDeletingId(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "breaking":
      case "breaking_news":
        return <Newspaper className="h-4 w-4 text-red-500" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "reply":
        return <Reply className="h-4 w-4 text-indigo-500" />;
      case "like":
        return <Heart className="h-4 w-4 text-pink-500" />;
      case "trending":
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case "follow":
        return <Users className="h-4 w-4 text-green-500" />;
      case "system":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case "breaking":
      case "breaking_news":
        return "bg-red-100 dark:bg-red-900/30";
      case "comment":
        return "bg-blue-100 dark:bg-blue-900/30";
      case "reply":
        return "bg-indigo-100 dark:bg-indigo-900/30";
      case "like":
        return "bg-pink-100 dark:bg-pink-900/30";
      case "trending":
        return "bg-orange-100 dark:bg-orange-900/30";
      case "follow":
        return "bg-green-100 dark:bg-green-900/30";
      case "system":
        return "bg-yellow-100 dark:bg-yellow-900/30";
      default:
        return "bg-primary/10";
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filteredNotifications =
    filter === "all"
      ? notifications
      : filter === "unread"
      ? notifications.filter((n) => !n.is_read)
      : notifications.filter(
          (n) => n.type === filter || n.type === `${filter}_news`
        );

  // Show login prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background flex items-center justify-center">
        <Card className="border-0 shadow-lg max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
              <Bell className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">
              Masuk untuk Melihat Notifikasi
            </h2>
            <p className="text-muted-foreground mb-6">
              Dapatkan notifikasi saat ada balasan komentar dan berita terbaru
            </p>
            <Link href="/login">
              <Button className="gap-2">
                <LogIn className="h-4 w-4" />
                Masuk Sekarang
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Render notification card based on type
  const renderNotificationCard = (
    notification: Notification,
    index: number
  ) => {
    const metadata = notification.metadata as {
      replier_name?: string;
      replier_avatar?: string;
      article_title?: string;
      article_slug?: string;
      reply_content?: string;
      parent_comment_preview?: string;
      commenter_name?: string;
      commenter_avatar?: string;
    };

    const isReply = notification.type === "reply";
    const isComment = notification.type === "comment";
    const hasAvatar = metadata?.replier_avatar || metadata?.commenter_avatar;
    const avatarUrl = metadata?.replier_avatar || metadata?.commenter_avatar;
    const personName = metadata?.replier_name || metadata?.commenter_name;

    return (
      <ScrollReveal key={notification.id} delay={index * 0.03}>
        <Card
          className={`group border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden ${
            !notification.is_read
              ? "bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-l-primary"
              : "hover:bg-muted/50"
          }`}
          onClick={() => {
            if (!notification.is_read) {
              handleMarkAsRead(notification.id);
            }
            if (notification.link) {
              window.location.href = notification.link;
            }
          }}
        >
          <CardContent className="p-4">
            <div className="flex gap-3">
              {/* Avatar or Icon */}
              <div className="relative shrink-0">
                {(isReply || isComment) && hasAvatar ? (
                  <div className="relative">
                    <Image
                      src={
                        avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          personName || "U"
                        )}&background=random`
                      }
                      alt={personName || "User"}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                      unoptimized
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 p-1 rounded-full ${getIconBgColor(
                        notification.type
                      )}`}
                    >
                      {getIcon(notification.type)}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconBgColor(
                      notification.type
                    )}`}
                  >
                    {getIcon(notification.type)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    {/* Title with person name highlighted */}
                    <p
                      className={`text-sm ${
                        notification.is_read
                          ? "text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {isReply && personName ? (
                        <>
                          <span className="font-semibold text-foreground">
                            {personName}
                          </span>
                          <span className="text-muted-foreground">
                            {" "}
                            membalas komentar Anda
                          </span>
                        </>
                      ) : isComment && personName ? (
                        <>
                          <span className="font-semibold text-foreground">
                            {personName}
                          </span>
                          <span className="text-muted-foreground">
                            {" "}
                            mengomentari artikel Anda
                          </span>
                        </>
                      ) : (
                        <span
                          className={notification.is_read ? "" : "font-medium"}
                        >
                          {notification.title}
                        </span>
                      )}
                    </p>

                    {/* Article title as link */}
                    {metadata?.article_title && (
                      <p className="text-xs text-primary/80 mt-0.5 flex items-center gap-1">
                        <Newspaper className="h-3 w-3" />
                        <span className="truncate">
                          {metadata.article_title}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Unread indicator */}
                  {!notification.is_read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1 animate-pulse" />
                  )}
                </div>

                {/* Message/Content preview */}
                {notification.message && (
                  <div className="mt-2 p-3 bg-muted/50 rounded-lg border-l-2 border-muted-foreground/20">
                    <p className="text-sm text-muted-foreground italic line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                )}

                {/* Footer with time and action */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeAgo(notification.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {notification.link && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = notification.link!;
                        }}
                      >
                        <ExternalLink className="h-3 w-3" />
                        Lihat
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                      disabled={deletingId === notification.id}
                    >
                      {deletingId === notification.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <ScrollReveal>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Notifikasi</h1>
                  {unreadCount > 0 && (
                    <p className="text-sm text-muted-foreground">
                      <span className="text-primary font-medium">
                        {unreadCount}
                      </span>{" "}
                      belum dibaca
                    </p>
                  )}
                </div>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleMarkAllAsRead}
                  disabled={markingAllRead}
                >
                  {markingAllRead ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">Tandai Semua Dibaca</span>
                </Button>
              )}
            </div>
          </ScrollReveal>

          {/* Filters */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap gap-2 mb-6 p-1 bg-muted/50 rounded-lg w-fit">
              {[
                { key: "all", label: "Semua", icon: Bell },
                { key: "unread", label: "Belum Dibaca", icon: AlertCircle },
                { key: "reply", label: "Balasan", icon: Reply },
                { key: "comment", label: "Komentar", icon: MessageSquare },
              ].map((f) => (
                <Button
                  key={f.key}
                  variant={filter === f.key ? "default" : "ghost"}
                  size="sm"
                  className={`gap-1.5 ${
                    filter === f.key ? "" : "hover:bg-background"
                  }`}
                  onClick={() => setFilter(f.key)}
                >
                  <f.icon className="h-3.5 w-3.5" />
                  {f.label}
                  {f.key === "unread" && unreadCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </ScrollReveal>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notification, index) =>
                renderNotificationCard(notification, index)
              )}
            </div>
          ) : (
            <ScrollReveal>
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                  <Bell className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <h3 className="font-medium text-lg mb-1">
                  {filter === "unread"
                    ? "Semua notifikasi sudah dibaca! 🎉"
                    : "Belum ada notifikasi"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {filter === "unread"
                    ? "Anda sudah membaca semua notifikasi"
                    : "Notifikasi akan muncul di sini saat ada aktivitas baru"}
                </p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </div>
  );
}
