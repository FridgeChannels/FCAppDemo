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
  const buttonStyle = {
    color: 'hsl(40, 30%, 25%)',
  };

  return (
    <div className={cn('flex items-center justify-center gap-8', className)}>
      {/* Skip Back 15s */}
      <button
        onClick={onSkipBack}
        className="relative p-2 transition-opacity hover:opacity-70"
        aria-label="Skip back 15 seconds"
      >
        <RotateCcw size={28} style={buttonStyle} />
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold"
          style={buttonStyle}
        >
          15
        </span>
      </button>

      {/* Spacer for play button */}
      <div className="w-20" />

      {/* Skip Forward 30s */}
      <button
        onClick={onSkipForward}
        className="relative p-2 transition-opacity hover:opacity-70"
        aria-label="Skip forward 30 seconds"
      >
        <RotateCw size={28} style={buttonStyle} />
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold"
          style={buttonStyle}
        >
          30
        </span>
      </button>
    </div>
  );
};
