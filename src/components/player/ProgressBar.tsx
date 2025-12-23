import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  currentTime: string;
  duration: string;
  onSeek: (progress: number) => void;
  className?: string;
  hideTime?: boolean;
}

export const ProgressBar = ({
  progress,
  currentTime,
  duration,
  onSeek,
  className,
  hideTime = false,
}: ProgressBarProps) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    onSeek(Math.max(0, Math.min(100, percentage)));
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return;
    handleClick(e);
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className="relative h-1.5 rounded-full cursor-pointer group bg-neutral-300"
        onClick={handleClick}
        onMouseMove={handleDrag}
      >
        {/* Progress fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-neutral-800 transition-all duration-100"
          style={{
            width: `${progress}%`,
          }}
        />
        {/* Drag handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          style={{
            left: `calc(${progress}% - 8px)`,
          }}
        />
      </div>
      {!hideTime && (
        <div className="flex justify-between mt-2 text-sm text-neutral-700">
          <span>{currentTime}</span>
          <span>{duration}</span>
        </div>
      )}
    </div>
  );
};
