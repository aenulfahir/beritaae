"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, ChevronRight, Newspaper } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { LocationWeatherWidget } from "@/components/layout/LocationWeatherWidget";

interface BreakingNewsItem {
  id: string;
  title: string;
  slug: string;
}

interface LatestNewsItem {
  id: string;
  title: string;
  slug: string;
  published_at: string;
}

export function TopBar() {
  return (
    <div className="bg-zinc-900 text-zinc-300 text-xs border-b border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-8">
          {/* Left: Date, Time, Location, Weather - Dynamic */}
          <LocationWeatherWidget />

          {/* Right: Quick Links */}
          <div className="flex items-center gap-3">
            <Link
              href="/about"
              className="hover:text-white transition-colors hidden sm:block"
            >
              Tentang
            </Link>
            <Link
              href="/contact"
              className="hover:text-white transition-colors hidden sm:block"
            >
              Kontak
            </Link>
            <Link
              href="/advertise"
              className="hover:text-white transition-colors hidden sm:block"
            >
              Iklan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BreakingNewsTicker() {
  const [breakingItems, setBreakingItems] = useState<BreakingNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchBreakingNews = async () => {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("articles")
          .select("id, title, slug")
          .eq("status", "published")
          .eq("is_breaking", true)
          .order("published_at", { ascending: false })
          .limit(10);

        if (!isMounted) return;

        if (error) {
          console.error("Error fetching breaking news:", error);
          setHasError(true);
          setIsLoading(false);
          return;
        }

        setBreakingItems(data || []);
        setHasError(false);
      } catch (error) {
        console.error("Error:", error);
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBreakingNews();

    // Refresh every 30 seconds
    const interval = setInterval(fetchBreakingNews, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Don't render if no breaking news or still loading
  if (isLoading || hasError || breakingItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-9">
          {/* Breaking Badge */}
          <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-red-400/50">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </div>
            <span className="font-bold text-xs uppercase tracking-wider">
              Breaking
            </span>
          </div>

          {/* Scrolling News */}
          <div className="flex-1 overflow-hidden ml-4">
            <div className="flex gap-12 animate-marquee whitespace-nowrap">
              {breakingItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="text-sm font-medium hover:underline flex items-center gap-2"
                >
                  <ChevronRight className="h-3 w-3" />
                  {item.title}
                </Link>
              ))}
              {/* Duplicate for seamless loop */}
              {breakingItems.map((item) => (
                <Link
                  key={`dup-${item.id}`}
                  href={`/news/${item.slug}`}
                  className="text-sm font-medium hover:underline flex items-center gap-2"
                >
                  <ChevronRight className="h-3 w-3" />
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LatestNewsTicker() {
  const [latestItems, setLatestItems] = useState<LatestNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchLatestNews = async () => {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("articles")
          .select("id, title, slug, published_at")
          .eq("status", "published")
          .eq("is_breaking", false)
          .order("published_at", { ascending: false })
          .limit(10);

        if (!isMounted) return;

        if (error) {
          console.error("Error fetching latest news:", error);
          setHasError(true);
          setIsLoading(false);
          return;
        }

        setLatestItems(data || []);
        setHasError(false);
      } catch (error) {
        console.error("Error:", error);
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLatestNews();

    // Refresh every 60 seconds
    const interval = setInterval(fetchLatestNews, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Don't render if no latest news or error
  if (!isLoading && (latestItems.length === 0 || hasError)) {
    return null;
  }

  // Don't show loading state, just hide until data is ready
  if (isLoading) {
    return null;
  }

  return (
    <div className="bg-zinc-700 text-zinc-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-8">
          {/* Latest Badge */}
          <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-zinc-600">
            <Newspaper className="h-3.5 w-3.5 text-zinc-300" />
            <span className="font-semibold text-xs uppercase tracking-wider text-zinc-300">
              Terbaru
            </span>
          </div>

          {/* Scrolling News */}
          <div className="flex-1 overflow-hidden ml-4">
            <div className="flex gap-10 animate-marquee-slow whitespace-nowrap">
              {latestItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="text-xs font-medium hover:text-white transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="h-3 w-3 text-zinc-400" />
                  <span className="text-zinc-300">{item.title}</span>
                </Link>
              ))}
              {/* Duplicate for seamless loop */}
              {latestItems.map((item) => (
                <Link
                  key={`dup-${item.id}`}
                  href={`/news/${item.slug}`}
                  className="text-xs font-medium hover:text-white transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="h-3 w-3 text-zinc-400" />
                  <span className="text-zinc-300">{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
