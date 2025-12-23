import { Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
}

export const VolumeControl = ({
  volume,
  onVolumeChange,
  className,
}: VolumeControlProps) => {
  const isMuted = volume === 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    onVolumeChange(Math.max(0, Math.min(1, percentage)));
  };

  const toggleMute = () => {
    onVolumeChange(isMuted ? 1 : 0);
  };

  const controlColor = 'hsl(40, 30%, 30%)';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <button onClick={toggleMute} className="transition-opacity hover:opacity-70">
        {isMuted ? (
          <VolumeX size={20} style={{ color: controlColor }} />
        ) : (
          <Volume2 size={20} style={{ color: controlColor }} />
        )}
      </button>
      <div
        className="relative w-full h-1 rounded-full cursor-pointer"
        style={{ backgroundColor: 'hsla(40, 50%, 30%, 0.3)' }}
        onClick={handleClick}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${volume * 100}%`,
            backgroundColor: 'hsl(40, 30%, 35%)',
          }}
        />
      </div>
    </div>
  );
};
