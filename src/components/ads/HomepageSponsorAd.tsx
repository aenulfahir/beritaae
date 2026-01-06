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
import { Sparkles } from "lucide-react";

interface HomepageSponsorAdProps {
  className?: string;
}

export function HomepageSponsorAd({ className }: HomepageSponsorAdProps) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [impressionTracked, setImpressionTracked] = useState(false);

  // Fetch ad on mount
  useEffect(() => {
    async function fetchAd() {
      setLoading(true);
      const activeAd = await getActiveAdForSlot("homepage_hero");
      setAd(activeAd);
      setLoading(false);
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

  // Loading state
  if (loading) {
    return (
      <div className={cn("w-full", className)}>
        <div className="animate-pulse bg-muted rounded-xl h-24 md:h-32" />
      </div>
    );
  }

  // No ad available
  if (!ad) {
    return null;
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        className="relative overflow-hidden rounded-xl cursor-pointer group bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20"
        onClick={handleClick}
      >
        {/* Sponsored label */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-1 bg-primary/90 text-primary-foreground rounded-full text-[10px] font-semibold">
          <Sparkles className="h-3 w-3" />
          Sponsored
        </div>

        {/* Desktop: Larger banner */}
        <div className="hidden md:block relative h-32 w-full">
          <Image
            src={ad.image_url}
            alt={ad.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 970px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        </div>

        {/* Mobile: Smaller banner */}
        <div className="md:hidden relative h-24 w-full">
          <Image
            src={ad.image_url}
            alt={ad.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-sm font-medium truncate">{ad.title}</p>
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
      </div>
    </div>
  );
}
