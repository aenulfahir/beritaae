"use client";

import { useState, useEffect } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // Parse headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headings = doc.querySelectorAll("h1, h2, h3");
    const tocItems: TOCItem[] = [];

    headings.forEach((h, i) => {
      const text = h.textContent?.trim() || "";
      if (text.length > 3) {
        const id = `heading-${i}`;
        tocItems.push({ id, text, level: parseInt(h.tagName[1]) });
      }
    });

    setItems(tocItems);
  }, [content]);

  // Add IDs to actual headings in the DOM
  useEffect(() => {
    if (items.length === 0) return;
    const proseEl = document.querySelector(".prose");
    if (!proseEl) return;

    const headings = proseEl.querySelectorAll("h1, h2, h3");
    let idx = 0;
    headings.forEach((h) => {
      const text = h.textContent?.trim() || "";
      if (text.length > 3 && idx < items.length) {
        h.id = items[idx].id;
        idx++;
      }
    });
  }, [items]);

  // Track active heading on scroll
  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-80px 0px -80% 0px" },
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <div className="mb-6">
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 rounded-full text-xs"
        onClick={() => setIsOpen(!isOpen)}
      >
        <List className="h-3.5 w-3.5" />
        Daftar Isi ({items.length})
        {isOpen ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
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
            <nav className="mt-3 p-3 bg-muted/30 rounded-xl border max-h-[300px] overflow-y-auto">
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        document
                          .getElementById(item.id)
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }}
                      className={`w-full text-left text-sm py-1 px-2 rounded hover:bg-accent transition-colors ${
                        activeId === item.id
                          ? "text-primary font-medium bg-primary/5"
                          : "text-muted-foreground"
                      }`}
                      style={{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }}
                    >
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
