import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseRecapAudioOptions {
  src: string;
  fallbackDurationSeconds: number;
  onEnd?: () => void;
}

interface UseRecapAudioReturn {
  audioRef: React.RefObject<HTMLAudioElement>;
  supported: boolean;
  isPlaying: boolean;
  durationSeconds: number;
  currentSeconds: number;
  progress: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seekSeconds: (seconds: number) => void;
  setVolume: (volume: number) => void;
}

export function useRecapAudio({ src, fallbackDurationSeconds, onEnd }: UseRecapAudioOptions): UseRecapAudioReturn {
  const audioRef = useRef<HTMLAudioElement>(null);
  const supported = useMemo(() => typeof window !== "undefined" && "Audio" in window, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(fallbackDurationSeconds);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !supported) return;

    const handleTimeUpdate = () => setCurrentSeconds(audio.currentTime || 0);
    const handleDurationChange = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) setDurationSeconds(audio.duration);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentSeconds(0);
      onEnd?.();
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("loadedmetadata", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("loadedmetadata", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [onEnd, supported]);

  useEffect(() => {
    // keep src in sync if caller changes it
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.getAttribute("src") !== src) audio.setAttribute("src", src);
  }, [src]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch(() => {
      // autoplay may be blocked; keep state consistent
      setIsPlaying(false);
    });
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) play();
    else pause();
  }, [pause, play]);

  const seekSeconds = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(durationSeconds || fallbackDurationSeconds, seconds));
    audio.currentTime = clamped;
    setCurrentSeconds(clamped);
  }, [durationSeconds, fallbackDurationSeconds]);

  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(1, volume));
    audio.volume = clamped;
  }, []);

  const progress = durationSeconds > 0 ? (currentSeconds / durationSeconds) * 100 : 0;

  return {
    audioRef,
    supported,
    isPlaying,
    durationSeconds,
    currentSeconds,
    progress,
    play,
    pause,
    toggle,
    seekSeconds,
    setVolume,
  };
}


