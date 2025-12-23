import { useState, useRef, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Episode, Channel } from '@/types/player';
import { PlayButton } from './PlayButton';
import { PlaybackControls } from './PlaybackControls';
import { ProgressBar } from './ProgressBar';
import { ActionButton } from './ActionButton';
import { ScrollingText } from './ScrollingText';

interface PlayerSurfaceProps {
  episode: Episode;
  channel: Channel;
  isPlaying: boolean;
  progress: number;
  currentTime: string;
  duration: string;
  volume: number;
  onTogglePlay: () => void;
  onSeek: (progress: number) => void;
  onVolumeChange: (volume: number) => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onBack?: () => void;
  onOpenChannelInfo: () => void;
  onOpenEpisodeList: () => void;
  onSubscribe: () => void;
  onViewOriginal: () => void;
  onNextEpisode: () => void;
  onPreviousEpisode: () => void;
}

export const PlayerSurface = ({
  episode,
  channel,
  isPlaying,
  progress,
  currentTime,
  duration,
  volume,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onSkipBack,
  onSkipForward,
  onBack,
  onOpenChannelInfo,
  onOpenEpisodeList,
  onSubscribe,
  onViewOriginal,
  onNextEpisode,
  onPreviousEpisode,
}: PlayerSurfaceProps) => {
  const [slideDirection, setSlideDirection] = useState<'up' | 'down' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayEpisode, setDisplayEpisode] = useState(episode);
  const prevEpisodeId = useRef<string>(episode.id);
  const isAnimatingRef = useRef(false);
  const DEBUG_VERIFY_RUN_ID = 'verify_fix_1';
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const wheelDeltaY = useRef<number>(0);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:DEBUG_VERIFY_RUN_ID,hypothesisId:'H3',location:'src/components/player/PlayerSurface.tsx:mount',message:'verify_mount_guard_enabled',data:{episodeId:episode.id},timestamp:Date.now()})}).catch(()=>{});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // #endregion agent log

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'repro2',hypothesisId:'H3',location:'src/components/player/PlayerSurface.tsx:stateSnapshot',message:'state_snapshot',data:{episodeId:episode.id,displayEpisodeId:displayEpisode.id,prevEpisodeId:prevEpisodeId.current,isAnimating,slideDirection},timestamp:Date.now()})}).catch(()=>{});
  }, [displayEpisode.id, episode.id, isAnimating, slideDirection]);
  // #endregion agent log

  // Swipe up gesture detection (touch and trackpad)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Touch events (mobile devices)
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'repro1',hypothesisId:'H2',location:'src/components/player/PlayerSurface.tsx:touchstart',message:'touchstart',data:{y:touchStartY.current},timestamp:Date.now()})}).catch(()=>{});
      // #endregion agent log
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      if (touchStartY.current !== null && touchEndY.current !== null) {
        const deltaY = touchStartY.current - touchEndY.current;
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'repro1',hypothesisId:'H2',location:'src/components/player/PlayerSurface.tsx:touchend',message:'touchend',data:{deltaY,startY:touchStartY.current,endY:touchEndY.current},timestamp:Date.now()})}).catch(()=>{});
        // #endregion agent log
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:DEBUG_VERIFY_RUN_ID,hypothesisId:'H3',location:'src/components/player/PlayerSurface.tsx:touchend',message:'verify_swipe_attempt',data:{deltaY,isAnimating:isAnimatingRef.current},timestamp:Date.now()})}).catch(()=>{});
        // #endregion agent log
        if (isAnimatingRef.current) {
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'postfix1',hypothesisId:'H3',location:'src/components/player/PlayerSurface.tsx:touchend',message:'ignored_swipe_while_animating',data:{deltaY},timestamp:Date.now()})}).catch(()=>{});
          // #endregion agent log
          touchStartY.current = null;
          touchEndY.current = null;
          return;
        }
        // Swipe up: start Y is greater than end Y, and swipe distance exceeds 50px
        if (deltaY > 50) {
          setSlideDirection('up');
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'repro1',hypothesisId:'H2',location:'src/components/player/PlayerSurface.tsx:touchend',message:'swipe_up->onNextEpisode',data:{deltaY},timestamp:Date.now()})}).catch(()=>{});
          // #endregion agent log
          onNextEpisode();
        }
        // Swipe down: start Y is less than end Y, and swipe distance exceeds 50px
        else if (deltaY < -50) {
          setSlideDirection('down');
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'repro1',hypothesisId:'H2',location:'src/components/player/PlayerSurface.tsx:touchend',message:'swipe_down->onPreviousEpisode',data:{deltaY},timestamp:Date.now()})}).catch(()=>{});
          // #endregion agent log
          onPreviousEpisode();
        }
      }
      touchStartY.current = null;
      touchEndY.current = null;
    };

    // Wheel events (trackpad two-finger swipe)
    const handleWheel = (e: WheelEvent) => {
      // deltaY < 0 means scrolling up (swipe up)
      if (e.deltaY < 0) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:DEBUG_VERIFY_RUN_ID,hypothesisId:'H3',location:'src/components/player/PlayerSurface.tsx:wheel',message:'verify_wheel_attempt',data:{deltaY:e.deltaY,isAnimating:isAnimatingRef.current},timestamp:Date.now()})}).catch(()=>{});
        // #endregion agent log
        if (isAnimatingRef.current) {
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'postfix1',hypothesisId:'H3',location:'src/components/player/PlayerSurface.tsx:wheel',message:'ignored_wheel_while_animating',data:{deltaY:e.deltaY},timestamp:Date.now()})}).catch(()=>{});
          // #endregion agent log
          wheelDeltaY.current = 0;
          return;
        }
        wheelDeltaY.current += Math.abs(e.deltaY);
        
        // Clear previous timer
        if (wheelTimeout.current) {
          clearTimeout(wheelTimeout.current);
        }
        
        // Trigger when accumulated scroll distance exceeds threshold
        if (wheelDeltaY.current > 100) {
          setSlideDirection('up');
          onNextEpisode();
          wheelDeltaY.current = 0;
        } else {
          // Reset accumulated value if no continued scrolling within a period
          wheelTimeout.current = setTimeout(() => {
            wheelDeltaY.current = 0;
          }, 300);
        }
      }
      // deltaY > 0 means scrolling down (swipe down)
      else if (e.deltaY > 0) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:DEBUG_VERIFY_RUN_ID,hypothesisId:'H3',location:'src/components/player/PlayerSurface.tsx:wheel',message:'verify_wheel_attempt',data:{deltaY:e.deltaY,isAnimating:isAnimatingRef.current},timestamp:Date.now()})}).catch(()=>{});
        // #endregion agent log
        if (isAnimatingRef.current) {
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'postfix1',hypothesisId:'H3',location:'src/components/player/PlayerSurface.tsx:wheel',message:'ignored_wheel_while_animating',data:{deltaY:e.deltaY},timestamp:Date.now()})}).catch(()=>{});
          // #endregion agent log
          wheelDeltaY.current = 0;
          return;
        }
        wheelDeltaY.current += e.deltaY;
        
        // Clear previous timer
        if (wheelTimeout.current) {
          clearTimeout(wheelTimeout.current);
        }
        
        // Trigger when accumulated scroll distance exceeds threshold
        if (wheelDeltaY.current > 100) {
          setSlideDirection('down');
          onPreviousEpisode();
          wheelDeltaY.current = 0;
        } else {
          // Reset accumulated value if no continued scrolling within a period
          wheelTimeout.current = setTimeout(() => {
            wheelDeltaY.current = 0;
          }, 300);
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
      if (wheelTimeout.current) {
        clearTimeout(wheelTimeout.current);
      }
    };
  }, [onNextEpisode, onPreviousEpisode]);

  // Handle slide animation when episode changes
  useEffect(() => {
    if (episode.id !== prevEpisodeId.current) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'repro1',hypothesisId:'H3',location:'src/components/player/PlayerSurface.tsx:episodeEffect',message:'episode_changed',data:{prevEpisodeId:prevEpisodeId.current,nextEpisodeId:episode.id,slideDirection,isAnimating},timestamp:Date.now()})}).catch(()=>{});
      // #endregion agent log
      // Only animate when direction is driven by a gesture (set before calling onNextEpisode/onPreviousEpisode).
      // For programmatic episode changes (e.g. clicking an episode card in Channel page), switch instantly.
      if (!slideDirection) {
        setIsAnimating(false);
        setDisplayEpisode(episode);
        prevEpisodeId.current = episode.id;
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'repro1',hypothesisId:'H3',location:'src/components/player/PlayerSurface.tsx:episodeEffect',message:'no_slideDirection_instant_switch',data:{episodeId:episode.id},timestamp:Date.now()})}).catch(()=>{});
        // #endregion agent log
        return;
      }

      setIsAnimating(true);

      // Update displayed episode after a brief delay to trigger animation
      const animationTimer = setTimeout(() => {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'repro2',hypothesisId:'H3',location:'src/components/player/PlayerSurface.tsx:animationTimer',message:'animationTimer_fired_setDisplayEpisode',data:{episodeId:episode.id,displayEpisodeIdBefore:displayEpisode.id,slideDirection,isAnimating},timestamp:Date.now()})}).catch(()=>{});
        // #endregion agent log
        setDisplayEpisode(episode);
      }, 50); // Small delay to ensure animation starts

      // Reset animation state after transition completes
      const resetTimer = setTimeout(() => {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'repro2',hypothesisId:'H3',location:'src/components/player/PlayerSurface.tsx:resetTimer',message:'resetTimer_fired',data:{episodeId:episode.id,displayEpisodeId:displayEpisode.id,slideDirection,isAnimating},timestamp:Date.now()})}).catch(()=>{});
        // #endregion agent log
        setIsAnimating(false);
        setSlideDirection(null);
      }, 450); // Slightly longer than transition duration

      prevEpisodeId.current = episode.id;

      return () => {
        clearTimeout(animationTimer);
        clearTimeout(resetTimer);
      };
    }
  }, [episode.id, episode, slideDirection]);

  // Get transform value based on slide direction
  const getCurrentTransform = () => {
    if (!isAnimating || !slideDirection) return 'translateY(0)';
    if (slideDirection === 'up') {
      return 'translateY(-100%)'; // Current slides up and out
    } else {
      return 'translateY(100%)'; // Current slides down and out
    }
  };

  const getNextTransform = () => {
    if (!isAnimating || !slideDirection) {
      // When not animating, keep off-screen
      return 'translateY(100%)';
    }
    // New content starts from opposite side and slides to center
    if (slideDirection === 'up') {
      // New content starts from bottom (100%) and slides to center (0)
      return 'translateY(0)';
    } else {
      // New content starts from top (-100%) and slides to center (0)
      return 'translateY(0)';
    }
  };

  const getNextInitialTransform = () => {
    if (!slideDirection) return 'translateY(100%)';
    // Initial position before animation: opposite side of slide direction
    if (slideDirection === 'up') {
      return 'translateY(100%)'; // Start from bottom
    } else {
      return 'translateY(-100%)'; // Start from top
    }
  };

  const backButton = (
    <button
      type="button"
      onClick={onBack}
      disabled={!onBack}
      aria-label="Back"
      className="absolute left-4 top-[calc(env(safe-area-inset-top,20px)+12px)] z-20 inline-flex h-10 w-10 items-center justify-center rounded-full text-black/80 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    >
      <ChevronLeft className="h-5 w-5" />
    </button>
  );

  // Render content for an episode
  const renderContent = (ep: Episode, transform: string, isCurrent: boolean) => (
    <div
      key={ep.id}
      className="absolute inset-0 h-full w-full bg-background flex flex-col safe-area-top safe-area-bottom"
      style={{
        transform,
        transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: isCurrent ? 2 : 1,
      }}
    >
      {backButton}
      {/* Top drag indicator */}
      <div className="flex justify-center pt-3 pb-2">
        <div 
          className="w-10 h-1 rounded-full"
          style={{ backgroundColor: 'hsla(40, 30%, 30%, 0.3)' }}
        />
      </div>

      {/* Cover Image Area */}
      <div className="flex items-center justify-center px-0 py-8 sm:py-10">
        <div className="relative w-full max-w-[520px] aspect-[2/1]">
          <img
            src={ep.coverImage ?? channel.coverImage}
            alt={channel.name}
            className="w-full h-full object-cover rounded-none shadow-player-card"
          />
          {/* Subtle overlay for depth */}
          <div 
            className="absolute right-0 bottom-0 h-full w-full rounded-none"
            style={{ 
              background: 'linear-gradient(180deg, transparent 60%, hsla(0, 75%, 45%, 0.22) 100%)' 
            }}
          />
        </div>
      </div>

      {/* Content Info Area */}
      <div className="px-6 sm:px-8 space-y-5">
        {/* Title */}
        <h1 
          className="text-xl font-bold leading-tight"
          style={{ color: 'hsl(40, 15%, 15%)' }}
        >
          <ScrollingText text={ep.title} />
        </h1>

        {/* Channel & Date */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onOpenChannelInfo}
            className="text-base font-medium text-left text-neutral-800 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            aria-label="View channel info"
          >
            {channel.name}
          </button>
          <p 
            className="text-sm font-medium text-neutral-700"
          >
            {ep.publishedAt}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
            <ProgressBar
              progress={isCurrent ? progress : (ep.progress || 0)}
              currentTime={isCurrent ? currentTime : '0:00'}
              duration={isCurrent ? duration : '0:00'}
              onSeek={isCurrent ? onSeek : () => {}}
              hideTime={true}
            />
            <div className="flex items-center justify-between mt-3 text-sm text-neutral-700">
              <span>{isCurrent ? currentTime : '0:00'}</span>
              <span>{isCurrent ? duration : '0:00'}</span>
            </div>
        </div>

        {/* Transcript removed */}
      </div>

      {/* Playback Controls */}
      <div className="px-6 sm:px-8 py-5 relative">
        <PlaybackControls
          onSkipBack={onSkipBack}
          onSkipForward={onSkipForward}
        />
        {/* Centered Play Button */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <PlayButton size="sm" isPlaying={isCurrent ? isPlaying : false} onToggle={onTogglePlay} />
        </div>
      </div>

      {/* Bottom CTA Panel (half-oval) */}
      <div className="w-full flex-1 flex items-end px-6 sm:px-8 pb-[80px]">
        <ActionButton
          isSubscribed={channel.isSubscribed}
          onSubscribe={onSubscribe}
          onViewOriginal={onViewOriginal}
          className="w-full"
        />
      </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="min-h-[100dvh] w-full bg-background overflow-hidden relative"
    >
      {/* Current content sliding out */}
      {renderContent(displayEpisode, getCurrentTransform(), true)}
      
      {/* Next content sliding in - only show when animating and episode is different */}
      {isAnimating && episode.id !== displayEpisode.id && (
        <div
          key={`next-${episode.id}`}
          className="absolute inset-0 h-full w-full bg-background flex flex-col safe-area-top safe-area-bottom"
          style={{
            transform: getNextInitialTransform(),
            transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 3,
          }}
          ref={(el) => {
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'repro3',hypothesisId:'H3',location:'src/components/player/PlayerSurface.tsx:nextRef',message:el?'next_ref_mount':'next_ref_unmount',data:{episodeId:episode.id,displayEpisodeId:displayEpisode.id,slideDirection,isAnimating,initialTransform:getNextInitialTransform()},timestamp:Date.now()})}).catch(()=>{});
            // #endregion agent log
            // Trigger animation by setting final position after initial render
            if (el) {
              requestAnimationFrame(() => {
                // #region agent log
                fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'repro3',hypothesisId:'H3',location:'src/components/player/PlayerSurface.tsx:nextRef',message:'next_ref_rAF_before',data:{episodeId:episode.id,domTransformBefore:el.style.transform,initialTransform:getNextInitialTransform()},timestamp:Date.now()})}).catch(()=>{});
                // #endregion agent log
                el.style.transform = 'translateY(0)';
                // #region agent log
                fetch('http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'repro3',hypothesisId:'H3',location:'src/components/player/PlayerSurface.tsx:nextRef',message:'next_ref_rAF_after',data:{episodeId:episode.id,domTransformAfter:el.style.transform},timestamp:Date.now()})}).catch(()=>{});
                // #endregion agent log
              });
            }
          }}
        >
          {/* Render new episode content */}
          {(() => {
            const ep = episode;
            return (
              <>
                {/* Top drag indicator */}
                <div className="flex justify-center pt-3 pb-2">
                  <div 
                    className="w-10 h-1 rounded-full"
                    style={{ backgroundColor: 'hsla(40, 30%, 30%, 0.3)' }}
                  />
                </div>

                {/* Cover Image Area */}
                <div className="flex items-center justify-center px-0 py-8 sm:py-10">
                  <div className="relative w-full max-w-[520px] aspect-[2/1]">
                    <img
                      src={ep.coverImage ?? channel.coverImage}
                      alt={channel.name}
                      className="w-full h-full object-cover rounded-none shadow-player-card"
                    />
                    <div 
                      className="absolute right-0 bottom-0 h-full w-full rounded-none"
                      style={{ 
                        background: 'linear-gradient(180deg, transparent 60%, hsla(0, 75%, 45%, 0.22) 100%)' 
                      }}
                    />
                  </div>
                </div>

                {/* Content Info Area */}
                <div className="px-6 sm:px-8 space-y-5">
                  <h1 
                    className="text-xl font-bold leading-tight"
                    style={{ color: 'hsl(40, 15%, 15%)' }}
                  >
                    <ScrollingText text={ep.title} />
                  </h1>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={onOpenChannelInfo}
                      className="text-base font-medium text-left text-neutral-800 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                      aria-label="View channel info"
                    >
                      {channel.name}
                    </button>
                    <p 
                      className="text-sm font-medium text-neutral-700"
                    >
                      {ep.publishedAt}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full">
                    <ProgressBar
                      progress={ep.progress || 0}
                      currentTime="0:00"
                      duration="0:00"
                      onSeek={() => {}}
                      hideTime={true}
                    />
                    <div className="flex items-center justify-between mt-3 text-sm text-neutral-700">
                      <span>0:00</span>
                      <span>0:00</span>
                    </div>
                  </div>

                  {/* Transcript removed */}
                </div>

                <div className="px-6 sm:px-8 py-5 relative">
                  <PlaybackControls
                    onSkipBack={onSkipBack}
                    onSkipForward={onSkipForward}
                  />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <PlayButton size="sm" isPlaying={false} onToggle={onTogglePlay} />
                  </div>
                </div>

                {/* Bottom CTA Panel (half-oval) */}
                <div className="w-full flex-1 flex items-end px-6 sm:px-8 pb-[80px]">
                  <ActionButton
                    isSubscribed={channel.isSubscribed}
                    onSubscribe={onSubscribe}
                    onViewOriginal={onViewOriginal}
                    className="w-full"
                  />
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

