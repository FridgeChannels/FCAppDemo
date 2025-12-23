import { useState, useRef, useEffect } from 'react';
import { Episode, Channel } from '@/types/player';
import { PlayButton } from './PlayButton';
import { PlaybackControls } from './PlaybackControls';
import { ProgressBar } from './ProgressBar';
import { ActionButton } from './ActionButton';

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
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const wheelDeltaY = useRef<number>(0);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      // Direction is driven by the user's gesture (set before calling onNextEpisode/onPreviousEpisode).
      // Fallback to 'up' if direction is not set (e.g. episode selected from list).
      if (!slideDirection) setSlideDirection('up');
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

  // Render content for an episode
  const renderContent = (ep: Episode, transform: string, isCurrent: boolean) => (
    <div
      key={ep.id}
      className="absolute inset-0 min-h-screen bg-white flex flex-col safe-area-top safe-area-bottom"
      style={{
        transform,
        transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: isCurrent ? 2 : 1,
      }}
    >
      {/* Top drag indicator */}
      <div className="flex justify-center pt-3 pb-2">
        <div 
          className="w-10 h-1 rounded-full"
          style={{ backgroundColor: 'hsla(40, 30%, 30%, 0.3)' }}
        />
      </div>

      {/* Cover Image Area */}
      <div className="flex items-center justify-center px-12 py-8">
        <div className="relative" style={{ width: '450px', height: '225px' }}>
          <img
            src={ep.coverImage ?? channel.coverImage}
            alt={channel.name}
            className="w-full h-full object-cover rounded-2xl shadow-player-card"
          />
          {/* Subtle overlay for depth */}
          <div 
            className="absolute inset-0 rounded-2xl"
            style={{ 
              background: 'linear-gradient(180deg, transparent 60%, hsla(0, 75%, 45%, 0.22) 100%)' 
            }}
          />
        </div>
      </div>

      {/* Content Info Area */}
      <div className="px-6 space-y-4">
        {/* Title */}
        <h1 
          className="text-xl font-bold leading-tight line-clamp-2"
          style={{ color: 'hsl(40, 15%, 15%)' }}
        >
          {ep.title}
        </h1>

        {/* Channel & Date */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onOpenChannelInfo}
            className="text-base font-medium text-left transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            style={{ color: 'rgb(134, 104, 45)' }}
            aria-label="View channel info"
          >
            {channel.name}
          </button>
          <p 
            className="text-sm font-medium"
            style={{ color: 'rgb(107, 87, 46)' }}
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
            <div className="flex items-center justify-between mt-2 text-sm" style={{ color: 'hsl(40, 30%, 30%)' }}>
              <span>{isCurrent ? currentTime : '0:00'}</span>
              <span>{isCurrent ? duration : '0:00'}</span>
            </div>
        </div>

        {/* Transcript removed */}
      </div>

      {/* Playback Controls */}
      <div className="px-6 py-4 relative">
        <PlaybackControls
          onSkipBack={onSkipBack}
          onSkipForward={onSkipForward}
        />
        {/* Centered Play Button */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <PlayButton isPlaying={isCurrent ? isPlaying : false} onToggle={onTogglePlay} />
        </div>
      </div>

      {/* Bottom CTA Panel (half-oval) */}
      <div className="mt-auto px-6 pb-6">
        <div className="relative w-full overflow-hidden rounded-t-[999px] rounded-b-[48px] border border-black/5 bg-white/80 shadow-[0_-18px_45px_rgba(0,0,0,0.08)] backdrop-blur-md">
          {/* top indicator */}
          <div className="absolute left-1/2 top-5 -translate-x-1/2">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl" />
              <div className="mx-auto h-6 w-1.5 rounded-full bg-red-500" />
            </div>
          </div>

          <div className="px-6 pt-14 pb-10 h-[230px] rounded-[32px] bg-white/35 backdrop-blur-xl border border-white/30 shadow-sm">
            <ActionButton
              isSubscribed={channel.isSubscribed}
              onSubscribe={onSubscribe}
              onViewOriginal={onViewOriginal}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-white overflow-hidden relative"
    >
      {/* Current content sliding out */}
      {renderContent(displayEpisode, getCurrentTransform(), true)}
      
      {/* Next content sliding in - only show when animating and episode is different */}
      {isAnimating && episode.id !== displayEpisode.id && (
        <div
          key={`next-${episode.id}`}
          className="absolute inset-0 min-h-screen bg-white flex flex-col safe-area-top safe-area-bottom"
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
                {/* Top drag indicator */}
                <div className="flex justify-center pt-3 pb-2">
                  <div 
                    className="w-10 h-1 rounded-full"
                    style={{ backgroundColor: 'hsla(40, 30%, 30%, 0.3)' }}
                  />
                </div>

                {/* Cover Image Area */}
                <div className="flex items-center justify-center px-12 py-8">
                  <div className="relative" style={{ width: '450px', height: '225px' }}>
                    <img
                      src={ep.coverImage ?? channel.coverImage}
                      alt={channel.name}
                      className="w-full h-full object-cover rounded-2xl shadow-player-card"
                    />
                    <div 
                      className="absolute inset-0 rounded-2xl"
                      style={{ 
                        background: 'linear-gradient(180deg, transparent 60%, hsla(0, 75%, 45%, 0.22) 100%)' 
                      }}
                    />
                  </div>
                </div>

                {/* Content Info Area */}
                <div className="px-6 space-y-4">
                  <h1 
                    className="text-xl font-bold leading-tight line-clamp-2"
                    style={{ color: 'hsl(40, 15%, 15%)' }}
                  >
                    {ep.title}
                  </h1>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={onOpenChannelInfo}
                      className="text-base font-medium text-left transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                      style={{ color: 'rgb(134, 104, 45)' }}
                      aria-label="View channel info"
                    >
                      {channel.name}
                    </button>
                    <p 
                      className="text-sm font-medium"
                      style={{ color: 'rgb(107, 87, 46)' }}
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
                    <div className="flex items-center justify-between mt-2 text-sm" style={{ color: 'hsl(40, 30%, 30%)' }}>
                      <span>0:00</span>
                      <span>0:00</span>
                    </div>
                  </div>

                  {/* Transcript removed */}
                </div>

                <div className="px-6 py-4 relative">
                  <PlaybackControls
                    onSkipBack={onSkipBack}
                    onSkipForward={onSkipForward}
                  />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <PlayButton isPlaying={false} onToggle={onTogglePlay} />
                  </div>
                </div>

                {/* Bottom CTA Panel (half-oval) */}
                <div className="mt-auto px-6 pb-6">
                  <div className="relative w-full overflow-hidden rounded-t-[999px] rounded-b-[48px] border border-black/5 bg-white/80 shadow-[0_-18px_45px_rgba(0,0,0,0.08)] backdrop-blur-md">
                    <div className="absolute left-1/2 top-5 -translate-x-1/2">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl" />
                        <div className="mx-auto h-6 w-1.5 rounded-full bg-red-500" />
                      </div>
                    </div>

                    <div className="px-6 pt-14 pb-10 h-[230px] rounded-[32px] bg-white/35 backdrop-blur-xl border border-white/30 shadow-sm">
                      <ActionButton
                        isSubscribed={channel.isSubscribed}
                        onSubscribe={onSubscribe}
                        onViewOriginal={onViewOriginal}
                      />
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

