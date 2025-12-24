import { RotateCcw, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaybackControlsProps {
  onSkipBack: () => void;
  onSkipForward: () => void;
  className?: string;
}

export const PlaybackControls = ({
  onSkipBack,
  onSkipForward,
  className,
}: PlaybackControlsProps) => {
  return (
    <div className={cn('flex items-center justify-center gap-6 sm:gap-8 md:gap-10', className)}>
      {/* Skip Back 15s */}
      <button
        onClick={onSkipBack}
        className="relative p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm touch-target"
        aria-label="Skip back 15 seconds"
      >
        <RotateCcw size={24} className="sm:w-7 sm:h-7 text-neutral-800" />
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-800"
        >
          15
        </span>
      </button>

      {/* Spacer for play button */}
      <div className="w-10 sm:w-12" />

      {/* Skip Forward 30s */}
      <button
        onClick={onSkipForward}
        className="relative p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm touch-target"
        aria-label="Skip forward 15 seconds"
      >
        <RotateCw size={24} className="sm:w-7 sm:h-7 text-neutral-800" />
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-800"
        >
          15
        </span>
      </button>
    </div>
  );
};
