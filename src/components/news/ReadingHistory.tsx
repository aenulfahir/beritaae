"use client";

import { useEffect } from "react";

interface ReadingHistoryEntry {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  category: string;
  readAt: number;
}

const HISTORY_KEY = "beritaae-reading-history";
const MAX_HISTORY = 50;

// Save article to reading history
export function useReadingHistory(article: {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  category: { name: string };
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      const history: ReadingHistoryEntry[] = stored ? JSON.parse(stored) : [];

      // Remove if already exists
      const filtered = history.filter((h) => h.id !== article.id);

      // Add to front
      filtered.unshift({
        id: article.id,
        title: article.title,
        slug: article.slug,
        image_url: article.image_url,
        category: article.category.name,
        readAt: Date.now(),
      });

      // Trim to max
      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(filtered.slice(0, MAX_HISTORY)),
      );
    } catch {
      // localStorage might be full or unavailable
    }
  }, [
    article.id,
    article.title,
    article.slug,
    article.image_url,
    article.category.name,
  ]);
}

// Get reading history
export function getReadingHistory(): ReadingHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Clear reading history
export function clearReadingHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}
