"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Clock,
  TrendingUp,
  FileText,
  X,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  category: {
    name: string;
    color: string;
  } | null;
  created_at: string;
  views_count: number;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400";

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setSelectedIndex(0);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Save to recent searches
  const saveRecentSearch = useCallback(
    (searchQuery: string) => {
      const updated = [
        searchQuery,
        ...recentSearches.filter((s) => s !== searchQuery),
      ].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    },
    [recentSearches]
  );

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    onOpenChange(false);
    router.push(`/news/${result.slug}`);
  };

  // Handle recent search click
  const handleRecentClick = (search: string) => {
    setQuery(search);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleResultClick(results[selectedIndex]);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Pencarian</DialogTitle>

        {/* Search Input */}
        <div className="flex items-center border-b px-4">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cari berita, topik, atau penulis..."
            className="border-0 focus-visible:ring-0 text-base h-14 px-3"
          />
          {isLoading && (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          )}
          {query && !isLoading && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 hover:bg-accent rounded"
              title="Hapus pencarian"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <ScrollArea className="max-h-[60vh]">
          {/* Search Results */}
          {query && results.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                {results.length} hasil ditemukan
              </p>
              <div className="space-y-1">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                      selectedIndex === index
                        ? "bg-accent"
                        : "hover:bg-accent/50"
                    )}
                  >
                    <div className="relative h-16 w-24 shrink-0 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={result.image_url || PLACEHOLDER_IMAGE}
                        alt={result.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {result.category && (
                          <Badge
                            variant="outline"
                            className="text-[10px] h-4 px-1.5"
                            style={{
                              borderColor: result.category.color,
                              color: result.category.color,
                            }}
                          >
                            {result.category.name}
                          </Badge>
                        )}
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(result.created_at)}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">
                        {result.title}
                      </h4>
                      {result.excerpt && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {result.excerpt}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {query && !isLoading && results.length === 0 && (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium">Tidak ada hasil</p>
              <p className="text-xs text-muted-foreground mt-1">
                Coba kata kunci lain atau periksa ejaan
              </p>
            </div>
          )}

          {/* Recent Searches & Suggestions (when no query) */}
          {!query && (
            <div className="p-4 space-y-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Pencarian Terakhir
                    </p>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, i) => (
                      <button
                        key={i}
                        onClick={() => handleRecentClick(search)}
                        className="px-3 py-1.5 text-sm bg-muted hover:bg-accent rounded-full transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Topics */}
              <div>
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Topik Populer
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Politik",
                    "Ekonomi",
                    "Teknologi",
                    "Olahraga",
                    "Hiburan",
                  ].map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setQuery(topic)}
                      className="px-3 py-1.5 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded-full transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-muted-foreground bg-muted/30">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
                ↑↓
              </kbd>
              Navigasi
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
                Enter
              </kbd>
              Pilih
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
                Esc
              </kbd>
              Tutup
            </span>
          </div>
          <Link
            href="/search"
            onClick={() => onOpenChange(false)}
            className="text-primary hover:underline"
          >
            Pencarian Lanjutan
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
