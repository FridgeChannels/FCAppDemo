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
  return (
    <div className={cn('flex w-full justify-center mt-5 translate-y-[50px]', className)}>
      {isSubscribed ? (
        <Button
          onClick={onViewOriginal}
          variant="player"
          size="lg"
          className="w-1/2 h-14 rounded-full text-lg bg-red-600 text-white hover:bg-red-700 shadow-[0_14px_34px_rgba(220,38,38,0.28)] cta-breathe"
        >
          View Original
        </Button>
      ) : (
        <Button
          onClick={onSubscribe}
          variant="player"
          size="lg"
          className="w-1/2 h-14 rounded-full text-lg bg-red-600 text-white hover:bg-red-700 shadow-[0_14px_34px_rgba(220,38,38,0.28)] cta-breathe"
        >
          Subscribe to View
        </Button>
      )}
    </div>
  );
};
