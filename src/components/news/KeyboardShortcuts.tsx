"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const SHORTCUTS = [
  { keys: ["?"], desc: "Tampilkan shortcut" },
  { keys: ["J"], desc: "Scroll ke bawah" },
  { keys: ["K"], desc: "Scroll ke atas" },
  { keys: ["C"], desc: "Ke bagian komentar" },
  { keys: ["H"], desc: "Ke beranda" },
  { keys: ["S"], desc: "Simpan artikel" },
  { keys: ["T"], desc: "Ke atas halaman" },
  { keys: ["Esc"], desc: "Tutup dialog" },
];

export function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger if typing in input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (e.target as HTMLElement).isContentEditable
      )
        return;

      switch (e.key) {
        case "?":
          setShowHelp((v) => !v);
          break;
        case "j":
          window.scrollBy({ top: 300, behavior: "smooth" });
          break;
        case "k":
          window.scrollBy({ top: -300, behavior: "smooth" });
          break;
        case "c":
          document
            .getElementById("comments-section")
            ?.scrollIntoView({ behavior: "smooth" });
          break;
        case "h":
          window.location.href = "/";
          break;
        case "t":
          window.scrollTo({ top: 0, behavior: "smooth" });
          break;
        case "Escape":
          setShowHelp(false);
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <AnimatePresence>
      {showHelp && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowHelp(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-background rounded-2xl shadow-2xl border p-6 w-80"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Keyboard className="h-4 w-4" />
                Keyboard Shortcuts
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setShowHelp(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {SHORTCUTS.map((s) => (
                <div
                  key={s.desc}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{s.desc}</span>
                  <div className="flex gap-1">
                    {s.keys.map((k) => (
                      <kbd
                        key={k}
                        className="px-2 py-0.5 bg-muted rounded text-xs font-mono font-bold"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-4 text-center">
              Tekan ? untuk toggle
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
