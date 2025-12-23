import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { button: 'w-12 h-12', icon: 24 },
  md: { button: 'w-16 h-16', icon: 28 },
  lg: { button: 'w-20 h-20', icon: 36 },
};

export const PlayButton = ({
  isPlaying,
  onToggle,
  size = 'lg',
  className,
}: PlayButtonProps) => {
  const { icon } = sizeMap[size];

  return (
    <button
      onClick={onToggle}
      className={cn(
        'inline-flex items-center justify-center bg-transparent',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? (
        <Pause
          size={icon}
          className="text-neutral-800"
          fill="currentColor"
        />
      ) : (
        <Play
          size={icon}
          className="text-neutral-800"
          fill="currentColor"
        />
      )}
    </button>
  );
};
