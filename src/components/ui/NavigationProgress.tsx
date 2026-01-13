"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavigationProgressProps {
  color?: string;
  height?: number;
  showSpinner?: boolean;
}

export function NavigationProgress({
  color = "hsl(var(--primary))",
  height = 3,
  showSpinner = true,
}: NavigationProgressProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousPathRef = useRef<string>("");
  const isFirstRender = useRef(true);

  // Cleanup function
  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Complete progress animation
  const completeProgress = () => {
    cleanup();
    setProgress(100);

    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setProgress(0);
    }, 300);
  };

  // Track route changes
  useEffect(() => {
    const currentPath =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    // Skip first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousPathRef.current = currentPath;
      return;
    }

    // If path changed, complete the progress
    if (previousPathRef.current !== currentPath) {
      completeProgress();
      previousPathRef.current = currentPath;
    }

    return () => cleanup();
  }, [pathname, searchParams]);

  // Listen for link clicks to start progress
  useEffect(() => {
    const startProgress = () => {
      cleanup();
      setIsVisible(true);
      setProgress(0);

      let currentProgress = 0;
      intervalRef.current = setInterval(() => {
        currentProgress += Math.random() * 12 + 3;
        if (currentProgress > 85) {
          currentProgress = 85 + Math.random() * 5;
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
        setProgress(Math.min(currentProgress, 90));
      }, 200);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip conditions
      const isExternal = anchor.target === "_blank";
      const isHashLink = href.startsWith("#");
      const isSpecialProtocol =
        href.startsWith("mailto:") || href.startsWith("tel:");
      const isDownload = anchor.hasAttribute("download");

      if (isExternal || isHashLink || isSpecialProtocol || isDownload) return;

      // Only handle internal navigation
      if (href.startsWith("/") || href.startsWith(window.location.origin)) {
        const currentPath = window.location.pathname + window.location.search;
        let newPath = href;

        if (href.startsWith(window.location.origin)) {
          try {
            const url = new URL(href);
            newPath = url.pathname + url.search;
          } catch {
            return;
          }
        }

        if (currentPath !== newPath) {
          startProgress();
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      cleanup();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
        style={{ height }}
      >
        <div
          className="h-full transition-all duration-200 ease-out"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            boxShadow: `0 0 10px ${color}80, 0 0 5px ${color}40`,
          }}
        />
      </div>

      {/* Spinner */}
      {showSpinner && progress > 0 && progress < 100 && (
        <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
          <div
            className="w-5 h-5 border-2 rounded-full animate-spin"
            style={{
              borderColor: `${color}30`,
              borderTopColor: color,
            }}
          />
        </div>
      )}
    </>
  );
}
