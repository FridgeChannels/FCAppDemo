import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  PlayerSurface, 
  ChannelHubOverlay,
  OriginalContentView,
  SubscriptionOverlay
} from '@/components/player';
import { mockChannel, mockEpisodes } from '@/data/mockData';
import { Episode } from '@/types/player';
import { useAiNewsTts } from "@/hooks/useAiNewsTts";
import { useRecapAudio } from "@/hooks/useRecapAudio";
import { getDefaultArticleSummary } from "@/lib/articleSummary";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<Episode>(mockEpisodes[1]); // Start with middle episode for testing
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [channel, setChannel] = useState(mockChannel);

  // Overlay state
  const [isChannelHubOpen, setIsChannelHubOpen] = useState(false);
  const [isOriginalContentOpen, setIsOriginalContentOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  // Auto-play "article recap" on refresh (mock); dev team will replace with real summary + audio
  const ttsEngine = (import.meta.env.VITE_TTS_ENGINE as string | undefined) ?? "webspeech";
  const useIndexTts2Audio = ttsEngine.toLowerCase() === "indextts2";
  const fallbackDurationSeconds = 3 * 60;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoPlayOnceRef = useRef(false);

  const recapText = getDefaultArticleSummary();

  const recapAudio = useRecapAudio({
    src: "/recap.wav",
    fallbackDurationSeconds,
    onEnd: () => {
      // notifications disabled
    },
  });

  const { supported: ttsSupported, start: startTts, stop: stopTts } = useAiNewsTts({
    text: recapText,
    lang: "zh-CN",
    durationMs: fallbackDurationSeconds * 1000,
    onEnd: () => {
      setIsPlaying(false);
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      setProgress(0);
      // notifications disabled
    },
  });

  const effectiveDurationSeconds = useIndexTts2Audio ? recapAudio.durationSeconds : fallbackDurationSeconds;
  const effectiveCurrentSeconds = useIndexTts2Audio ? recapAudio.currentSeconds : (progress / 100) * effectiveDurationSeconds;
  const effectiveProgress = useIndexTts2Audio ? recapAudio.progress : progress;
  const effectiveIsPlaying = useIndexTts2Audio ? recapAudio.isPlaying : isPlaying;
  const currentTimeSeconds = effectiveCurrentSeconds;
  const remainingSeconds = effectiveDurationSeconds - effectiveCurrentSeconds;

  // Handlers
  const handleTogglePlay = useCallback(() => {
    if (useIndexTts2Audio) {
      if (!recapAudio.supported) {
        return;
      }
      recapAudio.toggle();
      return;
    }

    setIsPlaying((prev) => {
      const next = !prev;

      if (!ttsSupported) {
        return false;
      }

      // Start / stop TTS
      if (next) {
        startTts();

        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        progressTimerRef.current = setInterval(() => {
          setProgress((p) => {
            const nextP = p + (100 / totalDuration); // ~1s tick
            if (nextP >= 100) return 100;
            return nextP;
          });
        }, 1000);
      } else {
        stopTts();
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
          progressTimerRef.current = null;
        }
      }

      return next;
    });
  }, [recapAudio, startTts, stopTts, ttsSupported, useIndexTts2Audio]);

  // Auto-play on refresh (best-effort; may be blocked by browser until user gesture)
  useEffect(() => {
    if (autoPlayOnceRef.current) return;
    autoPlayOnceRef.current = true;

    if (useIndexTts2Audio) {
      if (!recapAudio.supported) return;
      recapAudio.play();
      return;
    }

    if (!ttsSupported) return;
    // Try to start immediately
    setIsPlaying(true);
    startTts();

    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    progressTimerRef.current = setInterval(() => {
      setProgress((p) => {
        const nextP = p + (100 / fallbackDurationSeconds);
        if (nextP >= 100) return 100;
        return nextP;
      });
    }, 1000);
  }, [fallbackDurationSeconds, recapAudio, startTts, ttsSupported, useIndexTts2Audio]);

  const handleSeek = useCallback((newProgress: number) => {
    if (useIndexTts2Audio) {
      recapAudio.seekSeconds((newProgress / 100) * effectiveDurationSeconds);
      return;
    }
    setProgress(newProgress);
  }, [effectiveDurationSeconds, recapAudio, useIndexTts2Audio]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (useIndexTts2Audio) recapAudio.setVolume(newVolume);
  }, []);

  const handleSkipBack = useCallback(() => {
    if (useIndexTts2Audio) {
      recapAudio.seekSeconds(recapAudio.currentSeconds - 15);
      return;
    }
    const newProgress = Math.max(0, progress - (15 / fallbackDurationSeconds) * 100);
    setProgress(newProgress);
  }, [fallbackDurationSeconds, progress, recapAudio, useIndexTts2Audio]);

  const handleSkipForward = useCallback(() => {
    if (useIndexTts2Audio) {
      recapAudio.seekSeconds(recapAudio.currentSeconds + 15);
      return;
    }
    const newProgress = Math.min(100, progress + (15 / fallbackDurationSeconds) * 100);
    setProgress(newProgress);
  }, [fallbackDurationSeconds, progress, recapAudio, useIndexTts2Audio]);

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      stopTts();
    };
  }, [stopTts]);

  // Click "Subscribe" button - open subscription page
  const handleOpenSubscription = useCallback(() => {
    setIsSubscriptionOpen(true);
  }, []);

  // Optional entry-points from other pages (e.g. Channel page).
  useEffect(() => {
    const state = (location.state ?? null) as
      | {
          openSubscription?: boolean;
          playEpisodeId?: string;
          channel?: typeof channel;
          episodes?: Episode[];
        }
      | null;
    if (!state) return;

    if (state.openSubscription) {
      setIsSubscriptionOpen(true);
    }

    if (state.playEpisodeId) {
      const list = state.episodes ?? mockEpisodes;
      const nextEpisode = list.find((e) => e.id === state.playEpisodeId) ?? null;
      if (nextEpisode) {
        setCurrentEpisode(nextEpisode);
        setProgress(nextEpisode.progress || 0);
      }
      if (state.channel) setChannel(state.channel);
      // Don’t auto-start TTS when coming from an episode selection
      setIsPlaying(false);
      stopTts();
    }

    // Clear navigation state so refresh/back doesn't repeatedly re-trigger.
    navigate(".", { replace: true, state: null });
  }, [location.state, navigate]);

  const openOriginalUrl = useCallback(() => {
    // Open the original URL directly (same behavior as the ExternalLink button).
    const url = currentEpisode.originalUrl;
    if (typeof window !== "undefined" && url) {
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      // If popup is blocked, fall back to same-tab navigation.
      if (!opened) window.location.assign(url);
      return;
    }

    // Fallback (should be rare): show the in-app full issue view.
    setIsOriginalContentOpen(true);
  }, [currentEpisode.originalUrl]);

  const handleViewOriginal = useCallback(() => {
    openOriginalUrl();
  }, [openOriginalUrl]);

  // Confirm subscription - after successful subscription, auto-open the external original URL
  const handleConfirmSubscription = useCallback((plan: 'annual' | 'monthly' | 'free') => {
    if (plan === 'free') {
      setIsSubscriptionOpen(false);
      return;
    }

    setChannel(prev => ({ ...prev, isSubscribed: true }));
    setIsSubscriptionOpen(false);
    setIsChannelHubOpen(false);

    setTimeout(() => {
      openOriginalUrl();
    }, 500);
  }, [openOriginalUrl]);

  const handleSelectEpisode = useCallback((episode: Episode) => {
    setCurrentEpisode(episode);
    setProgress(episode.progress || 0);
    setIsPlaying(true);
  }, []);

  // Jump to next episode - seamless transition, same interface
  const handleNextEpisode = useCallback(() => {
    const currentIndex = mockEpisodes.findIndex(ep => ep.id === currentEpisode.id);
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'repro1',hypothesisId:'H1',location:'src/pages/Index.tsx:handleNextEpisode',message:'handleNextEpisode',data:{currentEpisodeId:currentEpisode.id,currentIndex,episodesLen:mockEpisodes.length,nextId:mockEpisodes[currentIndex+1]?.id ?? null},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    if (currentIndex < mockEpisodes.length - 1) {
      const nextEpisode = mockEpisodes[currentIndex + 1];
      // Switch episode seamlessly, keep current playing state
      setCurrentEpisode(nextEpisode);
      setProgress(nextEpisode.progress || 0);
      // Keep the current playing state (if playing, continue playing; if paused, stay paused)
    }
  }, [currentEpisode.id]);

  // Jump to previous episode - seamless transition, same interface
  const handlePreviousEpisode = useCallback(() => {
    const currentIndex = mockEpisodes.findIndex(ep => ep.id === currentEpisode.id);
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'repro1',hypothesisId:'H1',location:'src/pages/Index.tsx:handlePreviousEpisode',message:'handlePreviousEpisode',data:{currentEpisodeId:currentEpisode.id,currentIndex,episodesLen:mockEpisodes.length,prevId:mockEpisodes[currentIndex-1]?.id ?? null},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    if (currentIndex > 0) {
      const previousEpisode = mockEpisodes[currentIndex - 1];
      // Switch episode seamlessly, keep current playing state
      setCurrentEpisode(previousEpisode);
      setProgress(previousEpisode.progress || 0);
      // Keep the current playing state (if playing, continue playing; if paused, stay paused)
    }
  }, [currentEpisode.id]);

  return (
    <>
      {useIndexTts2Audio && (
        <audio ref={recapAudio.audioRef} src="/recap.wav" preload="auto" />
      )}
      <PlayerSurface
        episode={currentEpisode}
        channel={channel}
        isPlaying={effectiveIsPlaying}
        progress={effectiveProgress}
        currentTime={formatTime(currentTimeSeconds)}
        duration={formatTime(effectiveDurationSeconds)}
        volume={volume}
        onBack={() => navigate(-1)}
        onTogglePlay={handleTogglePlay}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onSkipBack={handleSkipBack}
        onSkipForward={handleSkipForward}
        onOpenChannelInfo={() =>
          navigate(`/channel/${channel.id}`, { state: { channel, episodes: mockEpisodes } })
        }
        onOpenEpisodeList={() => setIsChannelHubOpen(true)}
        onSubscribe={handleOpenSubscription}
        onViewOriginal={handleViewOriginal}
        onNextEpisode={handleNextEpisode}
        onPreviousEpisode={handlePreviousEpisode}
      />

      <ChannelHubOverlay
        channel={channel}
        episodes={mockEpisodes}
        currentEpisodeId={currentEpisode.id}
        isOpen={isChannelHubOpen}
        onClose={() => setIsChannelHubOpen(false)}
        onSubscribe={handleOpenSubscription}
        onSelectEpisode={handleSelectEpisode}
      />

      <OriginalContentView
        episode={currentEpisode}
        channel={channel}
        isOpen={isOriginalContentOpen}
        onClose={() => setIsOriginalContentOpen(false)}
      />

      <SubscriptionOverlay
        channel={channel}
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        onSubscribe={handleConfirmSubscription}
      />
    </>
  );
};

export default Index;
