import { useState, useRef, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Episode, Channel } from '@/types/player';
import { PlayButton } from './PlayButton';
import { PlaybackControls } from './PlaybackControls';
import { ProgressBar } from './ProgressBar';
import { ActionButton } from './ActionButton';
import { ScrollingText } from './ScrollingText';
import { ExcerptPreview } from './ExcerptPreview';

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



  // Swipe up gesture detection (touch and trackpad)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Touch events (mobile devices)
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      if (touchStartY.current !== null && touchEndY.current !== null) {
        const deltaY = touchStartY.current - touchEndY.current;
        if (isAnimatingRef.current) {
          touchStartY.current = null;
          touchEndY.current = null;
          return;
        }
        // Swipe up: start Y is greater than end Y, and swipe distance exceeds 50px
        if (deltaY > 50) {
          setSlideDirection('up');
          onNextEpisode();
        }
        // Swipe down: start Y is less than end Y, and swipe distance exceeds 50px
        else if (deltaY < -50) {
          setSlideDirection('down');
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
        if (isAnimatingRef.current) {
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
        if (isAnimatingRef.current) {
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
      // Only animate when direction is driven by a gesture (set before calling onNextEpisode/onPreviousEpisode).
      // For programmatic episode changes (e.g. clicking an episode card in Channel page), switch instantly.
      if (!slideDirection) {
        setIsAnimating(false);
        setDisplayEpisode(episode);
        prevEpisodeId.current = episode.id;
        return;
      }

      setIsAnimating(true);

      // Update displayed episode after a brief delay to trigger animation
      const animationTimer = setTimeout(() => {
        setDisplayEpisode(episode);
      }, 50); // Small delay to ensure animation starts

      // Reset animation state after transition completes
      const resetTimer = setTimeout(() => {
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
      className="absolute left-2 sm:left-4 top-[calc(env(safe-area-inset-top,0px)+12px)] z-20 inline-flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-full text-black/80 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-target"
    >
      <ChevronLeft className="h-5 w-5" />
    </button>
  );

  // Render content for an episode
  const renderContent = (ep: Episode, transform: string, isCurrent: boolean) => (
    <div
      key={ep.id}
      className="absolute inset-0 h-full w-full bg-background flex min-h-screen flex-col safe-area-top"
      style={{
        transform,
        transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: isCurrent ? 2 : 1,
      }}
    >
      {backButton}
      
      {/* 上方内容 */}
      <div className="flex-shrink-0">
        {/* Top drag indicator */}
        <div className="flex justify-center pt-3 pb-2">
          <div 
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: 'hsla(40, 30%, 30%, 0.3)' }}
          />
        </div>

        {/* Cover Image Area */}
        <div className="flex items-center justify-center px-3 sm:px-0 py-4 sm:py-8 md:py-10">
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
        <div className="px-4 sm:px-6 md:px-8 space-y-4 sm:space-y-5">
          {/* Title */}
          <h1 
            className="text-lg sm:text-xl font-bold leading-tight text-wrap-safe"
            style={{ color: 'hsl(40, 15%, 15%)' }}
          >
            <ScrollingText text={ep.title} />
          </h1>

          {/* Channel & Date */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <button
              type="button"
              onClick={onOpenChannelInfo}
              className="text-sm sm:text-base font-medium text-left text-neutral-800 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm min-h-[44px] px-2 -ml-2 touch-target"
              aria-label="View channel info"
            >
              <span className="text-wrap-safe">{channel.name}</span>
            </button>
            <p 
              className="text-xs sm:text-sm font-medium text-neutral-700 flex-shrink-0"
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
              <div className="flex items-center justify-between mt-2 sm:mt-3 text-xs sm:text-sm text-neutral-700">
                <span>{isCurrent ? currentTime : '0:00'}</span>
                <span>{isCurrent ? duration : '0:00'}</span>
              </div>
          </div>

          {/* Transcript removed */}
        </div>

        {/* Playback Controls */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 relative">
          <PlaybackControls
            onSkipBack={onSkipBack}
            onSkipForward={onSkipForward}
          />
          {/* Centered Play Button */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <PlayButton size="sm" isPlaying={isCurrent ? isPlaying : false} onToggle={onTogglePlay} />
          </div>
        </div>
      </div>

      {/* 中间预览区：自动吃掉多余空间，确保在 CTA 上方 */}
      <div className="flex-grow min-h-0 flex flex-col">
        <ExcerptPreview
          episode={ep}
          onViewOriginal={onViewOriginal}
          className="flex-1 min-h-0"
        />
      </div>

      {/* 底部 CTA - 固定在底部 */}
      <div className="px-4 pt-2 pb-2 flex-shrink-0 bg-background relative z-20" style={{ paddingBottom: `max(0.5rem, env(safe-area-inset-bottom, 0px))` }}>
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
      className="min-h-[100dvh] w-full bg-background overflow-hidden relative no-scroll-x"
    >
      {/* Current content sliding out */}
      {renderContent(displayEpisode, getCurrentTransform(), true)}
      
      {/* Next content sliding in - only show when animating and episode is different */}
      {isAnimating && episode.id !== displayEpisode.id && (
        <div
          key={`next-${episode.id}`}
          className="absolute inset-0 h-full w-full bg-background flex min-h-screen flex-col safe-area-top"
          style={{
            transform: getNextInitialTransform(),
            transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 3,
          }}
          ref={(el) => {
            // Trigger animation by setting final position after initial render
            if (el) {
              requestAnimationFrame(() => {
                el.style.transform = 'translateY(0)';
              });
            }
          }}
        >
          {/* Render new episode content */}
          {(() => {
            const ep = episode;
            return (
              <>
                {/* 上方内容 */}
                <div className="flex-shrink-0">
                  {/* Top drag indicator */}
                  <div className="flex justify-center pt-3 pb-2">
                    <div 
                      className="w-10 h-1 rounded-full"
                      style={{ backgroundColor: 'hsla(40, 30%, 30%, 0.3)' }}
                    />
                  </div>

                  {/* Cover Image Area */}
                  <div className="flex items-center justify-center px-3 sm:px-0 py-4 sm:py-8 md:py-10">
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
                  <div className="px-4 sm:px-6 md:px-8 space-y-4 sm:space-y-5">
                    <h1 
                      className="text-lg sm:text-xl font-bold leading-tight text-wrap-safe"
                      style={{ color: 'hsl(40, 15%, 15%)' }}
                    >
                      <ScrollingText text={ep.title} />
                    </h1>

                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                      <button
                        type="button"
                        onClick={onOpenChannelInfo}
                        className="text-sm sm:text-base font-medium text-left text-neutral-800 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm min-h-[44px] px-2 -ml-2 touch-target"
                        aria-label="View channel info"
                      >
                        <span className="text-wrap-safe">{channel.name}</span>
                      </button>
                      <p 
                        className="text-xs sm:text-sm font-medium text-neutral-700 flex-shrink-0"
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
                      <div className="flex items-center justify-between mt-2 sm:mt-3 text-xs sm:text-sm text-neutral-700">
                        <span>0:00</span>
                        <span>0:00</span>
                      </div>
                    </div>

                    {/* Transcript removed */}
                  </div>

                  {/* Playback Controls */}
                  <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 relative">
                    <PlaybackControls
                      onSkipBack={onSkipBack}
                      onSkipForward={onSkipForward}
                    />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <PlayButton size="sm" isPlaying={false} onToggle={onTogglePlay} />
                    </div>
                  </div>
                </div>

                {/* 中间预览区：自动吃掉多余空间，确保在 CTA 上方 */}
                <div className="flex-grow min-h-0 flex flex-col">
                  <ExcerptPreview
                    episode={ep}
                    onViewOriginal={onViewOriginal}
                    className="flex-1 min-h-0"
                  />
                </div>

                {/* 底部 CTA - 固定在底部 */}
                <div className="px-4 pt-2 pb-2 flex-shrink-0 bg-background relative z-20" style={{ paddingBottom: `max(0.5rem, env(safe-area-inset-bottom, 0px))` }}>
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

