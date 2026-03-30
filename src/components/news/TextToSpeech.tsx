"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Pause, Play, Square, ChevronDown } from "lucide-react";

interface TextToSpeechProps {
  text: string;
  title?: string;
}

// Rank voices by quality for Indonesian
function rankVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase();
  const lang = v.lang.toLowerCase();
  let score = 0;
  // Prefer Indonesian language
  if (lang.startsWith("id")) score += 100;
  // Google voices are generally better quality
  if (name.includes("google")) score += 50;
  // Microsoft voices are also good
  if (name.includes("microsoft")) score += 40;
  // Prefer non-compact/non-default voices
  if (!name.includes("compact")) score += 10;
  // Female voices often sound clearer for news
  if (name.includes("female") || name.includes("wanita")) score += 5;
  return score;
}

export function TextToSpeech({ text, title }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIdx, setSelectedVoiceIdx] = useState(0);
  const [showVoices, setShowVoices] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const cleanText = text
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    setIsSupported(true);

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      // Filter and sort: Indonesian first, then ranked by quality
      const idVoices = allVoices.filter((v) => v.lang.startsWith("id"));
      const otherVoices = allVoices.filter(
        (v) =>
          !v.lang.startsWith("id") &&
          (v.lang.startsWith("ms") || v.lang.startsWith("en")),
      );
      const sorted = [
        ...idVoices.sort((a, b) => rankVoice(b) - rankVoice(a)),
        ...otherVoices.sort((a, b) => rankVoice(b) - rankVoice(a)),
      ];
      if (sorted.length > 0) setVoices(sorted.slice(0, 8)); // Max 8 options
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const handlePlay = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }
    window.speechSynthesis.cancel();
    const fullText = title ? `${title}. ${cleanText}` : cleanText;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = speed;
    utterance.pitch = 1;
    // Use selected voice or best Indonesian voice
    if (voices[selectedVoiceIdx]) {
      utterance.voice = voices[selectedVoiceIdx];
      utterance.lang = voices[selectedVoiceIdx].lang;
    } else {
      utterance.lang = "id-ID";
    }
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const cycleSpeed = () => {
    const speeds = [0.8, 1, 1.2, 1.5];
    const idx = speeds.indexOf(speed);
    setSpeed(speeds[(idx + 1) % speeds.length]);
    if (isPlaying || isPaused) handleStop();
  };

  if (!isSupported) return null;

  const currentVoiceName =
    voices[selectedVoiceIdx]?.name
      ?.replace(/Google |Microsoft |Apple /, "")
      .split(" ")
      .slice(0, 2)
      .join(" ") || "Default";

  return (
    <div className="relative flex items-center gap-1">
      {!isPlaying && !isPaused ? (
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 rounded-full text-xs"
          onClick={handlePlay}
        >
          <Volume2 className="h-3.5 w-3.5" />
          Dengarkan
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 rounded-full text-xs text-violet-600 border-violet-300 dark:border-violet-700"
            onClick={isPlaying ? handlePause : handlePlay}
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            {isPlaying ? "Jeda" : "Lanjut"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 rounded-full"
            onClick={handleStop}
          >
            <Square className="h-3 w-3" />
          </Button>
        </>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-1.5 text-[10px] font-bold rounded-full"
        onClick={cycleSpeed}
      >
        {speed}x
      </Button>
      {voices.length > 1 && (
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-1.5 text-[10px] rounded-full gap-0.5"
            onClick={() => setShowVoices(!showVoices)}
          >
            🗣️ <ChevronDown className="h-2.5 w-2.5" />
          </Button>
          {showVoices && (
            <div className="absolute top-full right-0 mt-1 z-50 bg-background border rounded-lg shadow-lg p-1 min-w-[180px] max-h-[200px] overflow-y-auto">
              {voices.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-accent ${i === selectedVoiceIdx ? "bg-accent font-medium" : ""}`}
                  onClick={() => {
                    setSelectedVoiceIdx(i);
                    setShowVoices(false);
                    if (isPlaying || isPaused) handleStop();
                  }}
                >
                  <span>{v.name.replace(/Google |Microsoft |Apple /, "")}</span>
                  <span className="text-[10px] text-muted-foreground ml-1">
                    ({v.lang})
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
