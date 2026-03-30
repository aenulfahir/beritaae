"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  SkipForward,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TextToSpeechProps {
  text: string;
  title?: string;
}

export function TextToSpeech({ text, title }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Strip HTML tags from content
  const cleanText = text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = cleanText.split(/\s+/).length;
  const estimatedDuration = Math.ceil(wordCount / (150 * speed)); // ~150 words/min

  useEffect(() => {
    setIsSupported("speechSynthesis" in window);
    return () => {
      window.speechSynthesis?.cancel();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const trackProgress = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const startTime = Date.now();
    const totalMs = estimatedDuration * 60 * 1000;
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / totalMs) * 100, 100);
      setProgress(pct);
      if (pct >= 100 && intervalRef.current) clearInterval(intervalRef.current);
    }, 500);
  }, [estimatedDuration]);

  const handlePlay = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      trackProgress();
      return;
    }

    window.speechSynthesis.cancel();
    const fullText = title ? `${title}. ${cleanText}` : cleanText;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = "id-ID";
    utterance.rate = speed;
    utterance.pitch = 1;

    // Try to find Indonesian voice
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang.startsWith("id"));
    if (idVoice) utterance.voice = idVoice;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setProgress(0);
    trackProgress();
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const idx = speeds.indexOf(speed);
    const next = speeds[(idx + 1) % speeds.length];
    setSpeed(next);
    if (isPlaying || isPaused) {
      handleStop();
    }
  };

  if (!isSupported) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-violet-500/10 to-blue-500/10 rounded-xl border border-violet-200/30 dark:border-violet-800/30">
      <div className="flex items-center gap-1">
        {!isPlaying && !isPaused ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full bg-violet-500 text-white hover:bg-violet-600"
            onClick={handlePlay}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        ) : isPlaying ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full bg-violet-500 text-white hover:bg-violet-600"
            onClick={handlePause}
          >
            <Pause className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full bg-violet-500 text-white hover:bg-violet-600"
            onClick={handlePlay}
          >
            <Play className="h-4 w-4" />
          </Button>
        )}
        {(isPlaying || isPaused) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 rounded-full"
            onClick={handleStop}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
            {isPlaying
              ? "Sedang membaca..."
              : isPaused
                ? "Dijeda"
                : "Dengarkan Artikel"}
          </span>
          <span className="text-[10px] text-muted-foreground">
            ~{estimatedDuration} menit
          </span>
        </div>
        <div className="h-1 bg-violet-200/50 dark:bg-violet-800/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-[10px] font-bold rounded-full"
        onClick={cycleSpeed}
      >
        {speed}x
      </Button>
    </div>
  );
}
