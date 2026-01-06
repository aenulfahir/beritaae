"use client";

import { AdBanner } from "./AdBanner";
import { cn } from "@/lib/utils";

interface SidebarStickyAdProps {
  className?: string;
}

export function SidebarStickyAd({ className }: SidebarStickyAdProps) {
  return (
    <div className={cn("hidden lg:block", className)}>
      {/* Desktop: Sticky positioning */}
      <div className="sticky top-36">
        <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-3 shadow-sm border border-border/50">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Sponsored
          </p>
          <AdBanner
            slotType="sidebar_sticky"
            width={280}
            height={250}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

// Mobile version - inline ad
export function SidebarAdMobile({ className }: SidebarStickyAdProps) {
  return (
    <div className={cn("lg:hidden my-6", className)}>
      <div className="bg-muted/50 rounded-xl p-3">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2 text-center">
          Sponsored
        </p>
        <div className="flex justify-center">
          <AdBanner slotType="sidebar_sticky" width={300} height={250} />
        </div>
      </div>
    </div>
  );
}
