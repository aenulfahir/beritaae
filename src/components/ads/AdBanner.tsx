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
  width = 300,
  height = 250,
}: AdBannerProps) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [impressionTracked, setImpressionTracked] = useState(false);

  // Fetch ad on mount
  useEffect(() => {
    async function fetchAd() {
      setLoading(true);
      const activeAd = await getActiveAdForSlot(slotType);
      setAd(activeAd);
      setLoading(false);
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

  // Loading state
  if (loading) {
    return (
      <div
        className={cn("animate-pulse bg-muted rounded-lg", className)}
        style={{ width, height }}
      />
    );
  }

  // No ad available
  if (!ad) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg cursor-pointer group",
        className
      )}
      onClick={handleClick}
    >
      <div className="relative" style={{ width, height }}>
        <Image
          src={ad.image_url}
          alt={ad.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={`${width}px`}
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
