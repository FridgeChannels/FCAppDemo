import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseAiNewsTtsOptions {
  text: string;
  lang?: string;
  durationMs?: number;
  rate?: number;
  pitch?: number;
  volume?: number;
  onEnd?: () => void;
}

interface UseAiNewsTtsReturn {
  supported: boolean;
  isPlaying: boolean;
  start: () => void;
  stop: () => void;
}

export function useAiNewsTts({
  text,
  lang = "zh-CN",
  durationMs = 180_000,
  rate = 1,
  pitch = 1,
  volume = 1,
  onEnd,
}: UseAiNewsTtsOptions): UseAiNewsTtsReturn {
  const supported = useMemo(
    () => typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window,
    [],
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (!supported) return;
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsPlaying(false);
  }, [supported]);

  const start = useCallback(() => {
    if (!supported) return;
    stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onend = () => {
      if (stopTimerRef.current) {
        clearTimeout(stopTimerRef.current);
        stopTimerRef.current = null;
      }
      utteranceRef.current = null;
      setIsPlaying(false);
      onEnd?.();
    };
    utterance.onerror = () => {
      if (stopTimerRef.current) {
        clearTimeout(stopTimerRef.current);
        stopTimerRef.current = null;
      }
      utteranceRef.current = null;
      setIsPlaying(false);
      onEnd?.();
    };

    utteranceRef.current = utterance;
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);

    // Hard stop after duration to approximate "3 minutes".
    stopTimerRef.current = setTimeout(() => {
      stop();
      onEnd?.();
    }, durationMs);
  }, [durationMs, lang, onEnd, pitch, rate, stop, supported, text, volume]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stop();
    };
  }, [stop]);

  return { supported, isPlaying, start, stop };
}


