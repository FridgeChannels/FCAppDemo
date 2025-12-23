import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from "lucide-react";

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
  const icon = (
    <ArrowUpRight
      aria-hidden="true"
      className="h-[clamp(24px,3.6vh,44px)] w-[clamp(24px,3.6vh,44px)]"
    />
  );

  return (
    <div className={cn('flex w-full justify-center', className)}>
      {isSubscribed ? (
        <Button
          onClick={onViewOriginal}
          variant="player"
          size="lg"
          className="w-full h-[clamp(64px,12vh,120px)] px-[clamp(24px,5vw,44px)] gap-3 rounded-[5px] text-[clamp(24px,3.6vh,44px)] bg-red-600 text-white hover:bg-red-700 shadow-[0_14px_34px_rgba(220,38,38,0.28)] font-brand-serif font-semibold"
        >
          {icon}
          {buttonLabel}
        </Button>
      ) : (
        <Button
          onClick={onSubscribe}
          variant="player"
          size="lg"
          className="w-full h-[clamp(64px,12vh,120px)] px-[clamp(24px,5vw,44px)] gap-3 rounded-[5px] text-[clamp(24px,3.6vh,44px)] bg-red-600 text-white hover:bg-red-700 shadow-[0_14px_34px_rgba(220,38,38,0.28)] font-brand-serif font-semibold"
        >
          {icon}
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};
