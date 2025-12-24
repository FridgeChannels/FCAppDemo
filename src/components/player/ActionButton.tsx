import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  isSubscribed: boolean;
  onSubscribe: () => void;
  onViewOriginal: () => void;
  className?: string;
}

export const ActionButton = ({
  isSubscribed,
  onSubscribe,
  onViewOriginal,
  className,
}: ActionButtonProps) => {
  const buttonLabel = "Full Issue";

  return (
    <div className={cn('flex w-full justify-center max-w-full', className)}>
      {isSubscribed ? (
        <Button
          onClick={onViewOriginal}
          variant="player"
          size="lg"
          className="w-full h-14 px-4 rounded-[5px] text-base sm:text-lg bg-red-600 text-white hover:bg-red-700 shadow-[0_14px_34px_rgba(220,38,38,0.28)] font-brand-serif font-semibold touch-target overflow-hidden"
        >
          <span className="truncate">{buttonLabel}</span>
        </Button>
      ) : (
        <Button
          onClick={onSubscribe}
          variant="player"
          size="lg"
          className="w-full h-14 px-4 rounded-[5px] text-base sm:text-lg bg-red-600 text-white hover:bg-red-700 shadow-[0_14px_34px_rgba(220,38,38,0.28)] font-brand-serif font-semibold touch-target overflow-hidden"
        >
          <span className="truncate">{buttonLabel}</span>
        </Button>
      )}
    </div>
  );
};
