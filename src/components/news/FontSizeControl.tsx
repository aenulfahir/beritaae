"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Type, Minus, Plus } from "lucide-react";

const FONT_SIZE_KEY = "beritaae-font-size";
const SIZES = [
  { label: "S", value: "text-sm", px: 14 },
  { label: "M", value: "text-base", px: 16 },
  { label: "L", value: "text-lg", px: 18 },
  { label: "XL", value: "text-xl", px: 20 },
];

export function FontSizeControl() {
  const [sizeIndex, setSizeIndex] = useState(1); // Default M

  useEffect(() => {
    const saved = localStorage.getItem(FONT_SIZE_KEY);
    if (saved) {
      const idx = SIZES.findIndex((s) => s.label === saved);
      if (idx >= 0) setSizeIndex(idx);
    }
  }, []);

  useEffect(() => {
    // Apply font size to article content
    const proseEl = document.querySelector(".prose");
    if (proseEl) {
      (proseEl as HTMLElement).style.fontSize = `${SIZES[sizeIndex].px}px`;
    }
    localStorage.setItem(FONT_SIZE_KEY, SIZES[sizeIndex].label);
  }, [sizeIndex]);

  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-full">
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 rounded-full"
        onClick={() => setSizeIndex(Math.max(0, sizeIndex - 1))}
        disabled={sizeIndex === 0}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="text-xs font-medium w-6 text-center text-muted-foreground flex items-center justify-center gap-0.5">
        <Type className="h-3 w-3" />
        {SIZES[sizeIndex].label}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 rounded-full"
        onClick={() => setSizeIndex(Math.min(SIZES.length - 1, sizeIndex + 1))}
        disabled={sizeIndex === SIZES.length - 1}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
