"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface ReadingTimeLeftProps {
  content: string;
}

export function ReadingTimeLeft({ content }: ReadingTimeLeftProps) {
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  const wordCount = content.replace(/<[^>]*>/g, " ").split(/\s+/).length;
  const totalMinutes = Math.ceil(wordCount / 200); // 200 wpm reading speed

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const progress = Math.min(scrollTop / docHeight, 1);
      const remaining = Math.max(0, Math.ceil(totalMinutes * (1 - progress)));
      setMinutesLeft(remaining);
      setVisible(scrollTop > 200 && progress < 0.95);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalMinutes]);

  if (!visible || minutesLeft === null) return null;

  return (
    <div className="fixed top-14 right-4 z-40 px-3 py-1.5 bg-background/90 backdrop-blur-sm border rounded-full shadow-sm text-xs text-muted-foreground flex items-center gap-1.5 transition-opacity">
      <Clock className="h-3 w-3" />
      <span>
        {minutesLeft === 0 ? "Hampir selesai" : `${minutesLeft} menit lagi`}
      </span>
    </div>
  );
}
