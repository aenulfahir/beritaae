"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ArticleSummaryProps {
  content: string;
  title: string;
}

function generateSummary(content: string, title: string): string {
  // Strip HTML
  const text = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

  if (sentences.length <= 3) return text;

  // Score sentences by importance
  const titleWords = title
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const wordFreq: Record<string, number> = {};
  const words = text.toLowerCase().split(/\s+/);
  words.forEach((w) => {
    if (w.length > 3) wordFreq[w] = (wordFreq[w] || 0) + 1;
  });

  const scored = sentences.map((s, i) => {
    let score = 0;
    const sLower = s.toLowerCase();
    // Position bonus - first sentences are important
    if (i < 3) score += 3 - i;
    // Title word overlap
    titleWords.forEach((w) => {
      if (sLower.includes(w)) score += 2;
    });
    // High frequency words
    sLower.split(/\s+/).forEach((w) => {
      if (wordFreq[w] && wordFreq[w] > 2) score += 0.5;
    });
    // Length bonus - medium sentences preferred
    const wordCount = s.split(/\s+/).length;
    if (wordCount > 8 && wordCount < 30) score += 1;
    return { sentence: s.trim(), score, index: i };
  });

  // Pick top 3-4 sentences, maintain order
  const topSentences = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(4, Math.ceil(sentences.length * 0.3)))
    .sort((a, b) => a.index - b.index)
    .map((s) => s.sentence);

  return topSentences.join(" ");
}

function generateKeyPoints(content: string): string[] {
  const text = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  if (sentences.length < 3) return [];

  // Extract key points from first few and important sentences
  const points: string[] = [];
  const seen = new Set<string>();

  sentences.slice(0, Math.min(8, sentences.length)).forEach((s) => {
    const clean = s.trim();
    if (clean.length > 20 && clean.length < 150 && !seen.has(clean)) {
      seen.add(clean);
      points.push(clean);
    }
  });

  return points.slice(0, 4);
}

export function ArticleSummary({ content, title }: ArticleSummaryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [keyPoints, setKeyPoints] = useState<string[]>([]);

  const handleGenerate = useCallback(() => {
    if (summary) {
      setIsOpen(!isOpen);
      return;
    }
    setIsGenerating(true);
    setIsOpen(true);
    // Simulate AI processing delay
    setTimeout(() => {
      setSummary(generateSummary(content, title));
      setKeyPoints(generateKeyPoints(content));
      setIsGenerating(false);
    }, 800);
  }, [content, title, summary, isOpen]);

  const wordCount = content.replace(/<[^>]*>/g, " ").split(/\s+/).length;
  if (wordCount < 100) return null;

  return (
    <div className="mb-6">
      <Button
        variant="outline"
        size="sm"
        className="gap-2 rounded-full border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30"
        onClick={handleGenerate}
      >
        <Sparkles className="h-3.5 w-3.5" />
        {isOpen ? "Sembunyikan Ringkasan" : "Ringkasan AI"}
        {isOpen ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/20 rounded-xl border border-violet-200/50 dark:border-violet-800/30">
              {isGenerating ? (
                <div className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Membuat ringkasan...
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-violet-500" />
                    <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                      Ringkasan
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90 mb-3">
                    {summary}
                  </p>
                  {keyPoints.length > 0 && (
                    <>
                      <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-2">
                        Poin Utama
                      </div>
                      <ul className="space-y-1.5">
                        {keyPoints.map((point, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-sm text-foreground/80"
                          >
                            <span className="text-violet-500 font-bold shrink-0">
                              {i + 1}.
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
