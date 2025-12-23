import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { button: 'w-12 h-12', icon: 20 },
  md: { button: 'w-16 h-16', icon: 28 },
  lg: { button: 'w-20 h-20', icon: 36 },
};

export const PlayButton = ({
  isPlaying,
  onToggle,
  size = 'lg',
  className,
}: PlayButtonProps) => {
  const { button, icon } = sizeMap[size];

  return (
    <button
      onClick={onToggle}
      className={cn(
        button,
        'rounded-full flex items-center justify-center transition-all duration-200',
        'shadow-player-control hover:scale-105 active:scale-95',
        className
      )}
      style={{
        backgroundColor: 'hsla(40, 25%, 98%, 0.95)',
      }}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? (
        <Pause
          size={icon}
          style={{ color: 'hsl(40, 80%, 30%)' }}
          fill="hsl(40, 80%, 30%)"
        />
      ) : (
        <Play
          size={icon}
          style={{ color: 'hsl(40, 80%, 30%)', marginLeft: '4px' }}
          fill="hsl(40, 80%, 30%)"
        />
      )}
    </button>
  );
};
