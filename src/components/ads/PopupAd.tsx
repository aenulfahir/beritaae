"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getActiveAdForSlot,
  trackImpression,
  trackClick,
} from "@/lib/supabase/services/ads";
import { Ad } from "@/types/ads";
import { motion, AnimatePresence } from "framer-motion";

const POPUP_SESSION_KEY = "popup_ad_shown";

// Fallback ad jika tidak ada di database
const FALLBACK_AD: Ad = {
  id: "fallback-popup",
  title: "Promo Spesial Hari Ini!",
  image_url:
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&h=400&fit=crop",
  target_url: "/advertise",
  slot_type: "popup",
  is_active: true,
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  impressions: 0,
  clicks: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function PopupAd() {
  const [ad, setAd] = useState<Ad | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if popup was already shown in this session
    const wasShown = sessionStorage.getItem(POPUP_SESSION_KEY);
    if (wasShown) {
      setIsLoading(false);
      return;
    }

    // Fetch popup ad
    const fetchAd = async () => {
      try {
        const popupAd = await getActiveAdForSlot("popup");
        // Use fetched ad or fallback
        const adToShow = popupAd || FALLBACK_AD;
        setAd(adToShow);

        // Delay before showing popup
        setTimeout(() => {
          setIsVisible(true);
          if (popupAd) {
            trackImpression(popupAd.id);
          }
        }, 1500);
      } catch (error) {
        console.error("Error fetching popup ad:", error);
        // Use fallback on error
        setAd(FALLBACK_AD);
        setTimeout(() => setIsVisible(true), 1500);
      }
      setIsLoading(false);
    };

    fetchAd();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem(POPUP_SESSION_KEY, "true");
  };

  const handleClick = () => {
    if (ad && ad.id !== "fallback-popup") {
      trackClick(ad.id);
    }
    if (ad) {
      window.open(ad.target_url, "_blank", "noopener,noreferrer");
    }
    handleClose();
  };

  if (isLoading || !ad) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Popup Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: 0.1,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: 50,
              transition: { duration: 0.2 },
            }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              className="relative max-w-md w-full bg-background rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {/* Animated border glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-20 blur-xl" />

              {/* Close Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white shadow-lg"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>

              {/* Sponsored Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute top-3 left-3 z-20"
              >
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                  <Sparkles className="h-3 w-3" />
                  Sponsored
                </span>
              </motion.div>

              {/* Ad Content */}
              <div className="relative cursor-pointer" onClick={handleClick}>
                {/* Image */}
                <motion.div
                  className="relative aspect-[4/3] w-full overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={ad.image_url}
                    alt={ad.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </motion.div>

                {/* Ad Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="font-bold text-xl mb-1 drop-shadow-lg"
                  >
                    {ad.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-sm text-white/90 flex items-center gap-1"
                  >
                    Klik untuk info lebih lanjut
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      →
                    </motion.span>
                  </motion.p>
                </div>
              </div>

              {/* Bottom CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="p-4 bg-muted/50"
              >
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={handleClick}
                >
                  <Sparkles className="h-4 w-4" />
                  Lihat Promo
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
