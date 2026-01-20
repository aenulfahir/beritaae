"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Ad } from "@/types/ads";
import {
  getActiveAdForSlot,
  trackImpression,
  trackClick,
} from "@/lib/supabase/services/ads";
import { cn } from "@/lib/utils";

interface PostArticleAdProps {
  className?: string;
}

// Default dimensions
const DEFAULT_DESKTOP_HEIGHT = 96; // h-24
const DEFAULT_MOBILE_HEIGHT = 80; // h-20

export function PostArticleAd({ className }: PostArticleAdProps) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [impressionTracked, setImpressionTracked] = useState(false);

  // Fetch ad on mount with retry
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;

    async function fetchAd() {
      setLoading(true);
      try {
        const activeAd = await getActiveAdForSlot("post_article");
        setAd(activeAd);
        retryCount = 0;
      } catch (error) {
        console.error("Error fetching post article ad:", error);
        // Retry on failure
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(fetchAd, 1000 * retryCount);
          return;
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAd();
  }, []);

  // Track impression when ad is displayed
  useEffect(() => {
    if (ad && !impressionTracked) {
      trackImpression(ad.id);
      setImpressionTracked(true);
    }
  }, [ad, impressionTracked]);

  // Handle click
  const handleClick = useCallback(async () => {
    if (ad) {
      await trackClick(ad.id);
      window.open(ad.target_url, "_blank", "noopener,noreferrer");
    }
  }, [ad]);

  // Get display dimensions
  const getDisplayHeight = (isMobile: boolean): number => {
    if (!ad || ad.display_mode === "auto" || !ad.display_height) {
      return isMobile ? DEFAULT_MOBILE_HEIGHT : DEFAULT_DESKTOP_HEIGHT;
    }
    // For mobile, scale down proportionally
    if (isMobile && ad.display_height > 80) {
      return Math.round(ad.display_height * 0.8);
    }
    return ad.display_height;
  };

  // Loading state
  if (loading) {
    return (
      <div className={cn("w-full max-w-3xl mx-auto my-8", className)}>
        <div className="animate-pulse bg-muted rounded-lg h-20 md:h-24" />
      </div>
    );
  }

  // No ad available
  if (!ad) {
    return null;
  }

  const desktopHeight = getDisplayHeight(false);
  const mobileHeight = getDisplayHeight(true);

  return (
    <div className={cn("w-full max-w-3xl mx-auto my-8", className)}>
      <div className="flex flex-col items-center">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
          You might be interested
        </p>

        <div
          className="relative w-full overflow-hidden rounded-lg cursor-pointer group border border-border/50 bg-muted/30"
          onClick={handleClick}
        >
          {/* Desktop: Leaderboard */}
          <div
            className="hidden md:block relative w-full"
            style={{ height: desktopHeight }}
          >
            <Image
              src={ad.image_url}
              alt={ad.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="728px"
            />
          </div>

          {/* Mobile: Smaller banner */}
          <div
            className="md:hidden relative w-full"
            style={{ height: mobileHeight }}
          >
            <Image
              src={ad.image_url}
              alt={ad.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="320px"
            />
          </div>

          {/* Ad indicator */}
          <span className="absolute top-1 right-1 px-1.5 py-0.5 text-[10px] font-medium bg-black/50 text-white rounded">
            Ad
          </span>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
      </div>
    </div>
  );
}
