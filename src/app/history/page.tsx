"use client";

import { useState, useEffect } from "react";
import {
  getReadingHistory,
  clearReadingHistory,
} from "@/components/news/ReadingHistory";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Trash2, Clock, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HistoryPage() {
  const [history, setHistory] = useState<ReturnType<typeof getReadingHistory>>(
    [],
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHistory(getReadingHistory());
  }, []);

  const handleClear = () => {
    clearReadingHistory();
    setHistory([]);
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins} menit lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} hari lalu`;
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>

          <ScrollReveal>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10">
                  <History className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Riwayat Baca</h1>
                  <p className="text-sm text-muted-foreground">
                    {history.length} artikel dibaca
                  </p>
                </div>
              </div>
              {history.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-red-500 hover:text-red-600"
                  onClick={handleClear}
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus Semua
                </Button>
              )}
            </div>
          </ScrollReveal>

          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((item, i) => (
                <ScrollReveal key={item.id} delay={i * 0.03}>
                  <Link href={`/news/${item.slug}`}>
                    <Card className="border-0 shadow-sm hover:shadow-md transition-all hover:bg-accent/30">
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          <div className="relative h-16 w-24 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={item.image_url || "/placeholder.jpg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Badge
                              variant="outline"
                              className="text-[10px] mb-1"
                            >
                              {item.category}
                            </Badge>
                            <h3 className="font-medium text-sm line-clamp-2">
                              {item.title}
                            </h3>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(item.readAt)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <History className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Belum ada riwayat baca</p>
              <Link href="/">
                <Button variant="outline" className="mt-4">
                  Jelajahi Artikel
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
