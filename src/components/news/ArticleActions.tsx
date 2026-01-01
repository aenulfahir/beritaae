"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  isArticleSaved,
  toggleSaveArticle,
} from "@/lib/supabase/services/bookmarks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  BookmarkCheck,
  Link2,
  MessageCircle,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ArticleActionsProps {
  articleId: string;
  initialLikes: number;
  initialDislikes: number;
  commentCount: number;
  userReaction: "like" | "dislike" | null;
}

export function ArticleActions({
  articleId,
  initialLikes,
  initialDislikes,
  commentCount,
  userReaction: initialUserReaction,
}: ArticleActionsProps) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userReaction, setUserReaction] = useState<"like" | "dislike" | null>(
    initialUserReaction
  );
  const [isReacting, setIsReacting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check if article is saved on mount
  useEffect(() => {
    async function checkSaved() {
      if (!user) return;
      try {
        const isSaved = await isArticleSaved(user.id, articleId);
        setSaved(isSaved);
      } catch (error) {
        console.error("Error checking bookmark:", error);
      }
    }
    checkSaved();
  }, [user, articleId]);

  const handleToggleSave = async () => {
    if (!user) {
      window.location.href =
        "/login?redirect=" + encodeURIComponent(window.location.pathname);
      return;
    }

    setSavingBookmark(true);
    try {
      const result = await toggleSaveArticle(user.id, articleId);
      if (!result.error) {
        setSaved(result.saved);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setSavingBookmark(false);
    }
  };

  const handleReaction = async (reactionType: "like" | "dislike") => {
    if (!user) {
      window.location.href =
        "/login?redirect=" + encodeURIComponent(window.location.pathname);
      return;
    }

    if (isReacting) return;

    // Optimistic update
    const previousReaction = userReaction;
    const previousLikes = likes;
    const previousDislikes = dislikes;

    if (userReaction === reactionType) {
      // Toggle off
      setUserReaction(null);
      if (reactionType === "like") {
        setLikes(likes - 1);
      } else {
        setDislikes(dislikes - 1);
      }
    } else {
      // Set new reaction
      if (userReaction === "like") {
        setLikes(likes - 1);
      } else if (userReaction === "dislike") {
        setDislikes(dislikes - 1);
      }

      setUserReaction(reactionType);
      if (reactionType === "like") {
        setLikes((prev) => prev + 1);
      } else {
        setDislikes((prev) => prev + 1);
      }
    }

    // API call
    setIsReacting(true);
    try {
      const response = await fetch(`/api/articles/${articleId}/reaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reactionType }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Revert on error
        setUserReaction(previousReaction);
        setLikes(previousLikes);
        setDislikes(previousDislikes);
        console.error("Error toggling reaction:", data.error);
      } else {
        // Update with server values
        setLikes(data.likesCount);
        setDislikes(data.dislikesCount);
        setUserReaction(data.newReaction);
      }
    } catch (error) {
      // Revert on error
      setUserReaction(previousReaction);
      setLikes(previousLikes);
      setDislikes(previousDislikes);
      console.error("Error toggling reaction:", error);
    } finally {
      setIsReacting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToComments = () => {
    document
      .getElementById("comments-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Floating Action Bar */}
      <Card className="border-0 shadow-xl bg-background/95 backdrop-blur-md sticky bottom-6 z-40">
        <CardContent className="p-3">
          <div className="flex items-center justify-between gap-2">
            {/* Like/Dislike */}
            <div className="flex items-center bg-muted rounded-full p-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 px-4 rounded-full gap-2 transition-all",
                  userReaction === "like" &&
                    "bg-green-500/20 text-green-600 hover:bg-green-500/30"
                )}
                onClick={() => handleReaction("like")}
                disabled={isReacting}
              >
                <motion.div
                  animate={{ scale: userReaction === "like" ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <ThumbsUp
                    className={cn(
                      "h-4 w-4",
                      userReaction === "like" && "fill-current"
                    )}
                  />
                </motion.div>
                <span className="font-semibold">{likes}</span>
              </Button>
              <div className="w-px h-6 bg-border" />
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 px-4 rounded-full gap-2 transition-all",
                  userReaction === "dislike" &&
                    "bg-red-500/20 text-red-600 hover:bg-red-500/30"
                )}
                onClick={() => handleReaction("dislike")}
                disabled={isReacting}
              >
                <motion.div
                  animate={{
                    scale: userReaction === "dislike" ? [1, 1.3, 1] : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <ThumbsDown
                    className={cn(
                      "h-4 w-4",
                      userReaction === "dislike" && "fill-current"
                    )}
                  />
                </motion.div>
                <span className="font-semibold">{dislikes}</span>
              </Button>
            </div>

            {/* Comment Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-4 rounded-full gap-2"
              onClick={scrollToComments}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="font-semibold">{commentCount}</span>
              <span className="hidden sm:inline text-muted-foreground">
                Komentar
              </span>
            </Button>

            {/* Save Button */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-9 px-4 rounded-full gap-2 transition-all",
                saved && "bg-primary/20 text-primary hover:bg-primary/30"
              )}
              onClick={handleToggleSave}
              disabled={savingBookmark}
            >
              <motion.div
                animate={{ scale: saved ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.2 }}
              >
                {savingBookmark ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : saved ? (
                  <BookmarkCheck className="h-4 w-4 fill-current" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </motion.div>
              <span className="hidden sm:inline">
                {saved ? "Tersimpan" : "Simpan"}
              </span>
            </Button>

            {/* Share Button */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-4 rounded-full gap-2"
                onClick={() => setShowShare(!showShare)}
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Bagikan</span>
              </Button>

              {/* Share Popup */}
              <AnimatePresence>
                {showShare && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute bottom-full right-0 mb-2 p-3 bg-background border rounded-xl shadow-xl min-w-[200px]"
                  >
                    <p className="text-xs font-medium text-muted-foreground mb-3">
                      Bagikan via
                    </p>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500"
                        onClick={() => {
                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                              window.location.href
                            )}`,
                            "_blank"
                          );
                        }}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl hover:bg-sky-500/10 hover:text-sky-500 hover:border-sky-500"
                        onClick={() => {
                          window.open(
                            `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                              window.location.href
                            )}`,
                            "_blank"
                          );
                        }}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl hover:bg-green-500/10 hover:text-green-500 hover:border-green-500"
                        onClick={() => {
                          window.open(
                            `https://wa.me/?text=${encodeURIComponent(
                              window.location.href
                            )}`,
                            "_blank"
                          );
                        }}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl"
                        onClick={handleCopy}
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Link2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full rounded-lg gap-2"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied ? "Link Tersalin!" : "Salin Link"}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
