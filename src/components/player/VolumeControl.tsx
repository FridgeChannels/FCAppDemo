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

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <button onClick={toggleMute} className="transition-opacity hover:opacity-70">
        {isMuted ? (
          <VolumeX size={20} className="text-neutral-800" />
        ) : (
          <Volume2 size={20} className="text-neutral-800" />
        )}
      </button>
      <div
        className="relative w-full h-1 rounded-full cursor-pointer bg-neutral-300"
        onClick={handleClick}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-neutral-800"
          style={{
            width: `${volume * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
