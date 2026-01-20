"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Ad, AdSlotType } from "@/types/ads";
import {
  getActiveAdForSlot,
  trackImpression,
  trackClick,
} from "@/lib/supabase/services/ads";
import { cn } from "@/lib/utils";

interface AdBannerProps {
  slotType: AdSlotType;
  className?: string;
  width?: number;
  height?: number;
}

export function AdBanner({
  slotType,
  className,
  width: defaultWidth = 300,
  height: defaultHeight = 250,
}: AdBannerProps) {
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
        const activeAd = await getActiveAdForSlot(slotType);
        setAd(activeAd);
        retryCount = 0;
      } catch (error) {
        console.error(`Error fetching ad for slot ${slotType}:`, error);
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
  }, [slotType]);

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
      // Open in new tab
      window.open(ad.target_url, "_blank", "noopener,noreferrer");
    }
  }, [ad]);

  // Get display dimensions from ad settings or use defaults
  const getDisplayDimensions = (): { width: number; height: number } => {
    if (
      !ad ||
      ad.display_mode === "auto" ||
      !ad.display_width ||
      !ad.display_height
    ) {
      return { width: defaultWidth, height: defaultHeight };
    }
    return { width: ad.display_width, height: ad.display_height };
  };

  // Loading state
  if (loading) {
    return (
      <div
        className={cn("animate-pulse bg-muted rounded-lg", className)}
        style={{ width: defaultWidth, height: defaultHeight }}
      />
    );
  }

  // No ad available
  if (!ad) {
    return null;
  }

  const dimensions = getDisplayDimensions();
  const isResponsive = ad.display_mode === "responsive";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg cursor-pointer group",
        className,
      )}
      onClick={handleClick}
      style={isResponsive ? { maxWidth: dimensions.width } : undefined}
    >
      <div
        className="relative"
        style={{
          width: isResponsive ? "100%" : dimensions.width,
          height: dimensions.height,
          maxWidth: dimensions.width,
        }}
      >
        <Image
          src={ad.image_url}
          alt={ad.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={`${dimensions.width}px`}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>
      {/* Ad indicator */}
      <span className="absolute top-1 right-1 px-1.5 py-0.5 text-[10px] font-medium bg-black/50 text-white rounded">
        Ad
      </span>
    </div>
  );
}
