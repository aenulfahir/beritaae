"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  isArticleSaved,
  toggleSaveArticle,
} from "@/lib/supabase/services/bookmarks";
import { Button } from "@/components/ui/button";
import { Bookmark, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  articleId: string;
  variant?: "icon" | "button" | "floating";
  className?: string;
  showText?: boolean;
}

export function BookmarkButton({
  articleId,
  variant = "icon",
  className,
  showText = false,
}: BookmarkButtonProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSaved() {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const saved = await isArticleSaved(user.id, articleId);
        setIsSaved(saved);
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      } finally {
        setChecking(false);
      }
    }

    checkSaved();
  }, [user, articleId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Redirect to login
      window.location.href =
        "/login?redirect=" + encodeURIComponent(window.location.pathname);
      return;
    }

    setLoading(true);
    try {
      const result = await toggleSaveArticle(user.id, articleId);
      if (!result.error) {
        setIsSaved(result.saved);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return null;
  }

  if (variant === "floating") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className={cn(
          "p-2 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-md shadow-lg hover:scale-110 transition-transform disabled:opacity-50",
          isSaved && "text-primary",
          className
        )}
        title={isSaved ? "Hapus dari tersimpan" : "Simpan artikel"}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Bookmark className={cn("h-3.5 w-3.5", isSaved && "fill-current")} />
        )}
      </button>
    );
  }

  if (variant === "button") {
    return (
      <Button
        variant={isSaved ? "default" : "outline"}
        size="sm"
        onClick={handleToggle}
        disabled={loading}
        className={cn("gap-2", className)}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
        )}
        {showText && (isSaved ? "Tersimpan" : "Simpan")}
      </Button>
    );
  }

  // Default icon variant
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={loading}
      className={cn(isSaved && "text-primary", className)}
      title={isSaved ? "Hapus dari tersimpan" : "Simpan artikel"}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
      )}
    </Button>
  );
}
