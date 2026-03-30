"use client";

import { useState, useEffect, useCallback } from "react";
import { Twitter, Facebook, Copy, Check, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PopupPosition {
  x: number;
  y: number;
}

export function HighlightQuote() {
  const [selectedText, setSelectedText] = useState("");
  const [position, setPosition] = useState<PopupPosition | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() || "";

    if (text.length < 10) {
      setPosition(null);
      setSelectedText("");
      return;
    }

    const range = selection?.getRangeAt(0);
    if (!range) return;

    // Check if selection is within article content
    const container = range.commonAncestorContainer;
    const articleEl =
      (container as Element).closest?.(".prose") ||
      (container.parentElement as Element)?.closest?.(".prose");
    if (!articleEl) {
      setPosition(null);
      return;
    }

    const rect = range.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setSelectedText(text.slice(0, 280));
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("touchend", handleSelection);
    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
    };
  }, [handleSelection]);

  const shareTwitter = () => {
    const url = window.location.href;
    window.open(
      `https://twitter.com/intent/tweet?text="${encodeURIComponent(selectedText)}"&url=${encodeURIComponent(url)}`,
      "_blank",
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(selectedText)}`,
      "_blank",
    );
  };

  const copyQuote = () => {
    navigator.clipboard.writeText(
      `"${selectedText}" — ${window.location.href}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {position && selectedText && (
        <motion.div
          initial={{ opacity: 0, y: 5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 5, scale: 0.95 }}
          className="fixed z-50 flex items-center gap-1 p-1.5 bg-foreground text-background rounded-lg shadow-xl"
          style={{
            left: `${Math.min(Math.max(position.x - 80, 16), window.innerWidth - 176)}px`,
            top: `${position.y + window.scrollY - 48}px`,
            position: "absolute",
          }}
        >
          <button
            type="button"
            onClick={shareTwitter}
            className="p-1.5 rounded hover:bg-background/20 transition-colors"
            title="Share ke Twitter"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={shareFacebook}
            className="p-1.5 rounded hover:bg-background/20 transition-colors"
            title="Share ke Facebook"
          >
            <Facebook className="h-4 w-4" />
          </button>
          <div className="w-px h-5 bg-background/30" />
          <button
            type="button"
            onClick={copyQuote}
            className="p-1.5 rounded hover:bg-background/20 transition-colors"
            title="Salin kutipan"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          <div className="w-px h-5 bg-background/30" />
          <span className="px-1.5 text-[10px] opacity-60 flex items-center gap-1">
            <Quote className="h-3 w-3" />
            Kutip
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
