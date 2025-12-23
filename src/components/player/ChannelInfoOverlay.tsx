import { X, Check } from 'lucide-react';
import { Channel } from '@/types/player';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface ChannelInfoOverlayProps {
  channel: Channel;
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export const ChannelInfoOverlay = ({
  channel,
  isOpen,
  onClose,
  onSubscribe,
}: ChannelInfoOverlayProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="rounded-t-3xl border-t-0 bg-card text-card-foreground max-h-[60vh]"
      >
        <div className="mx-auto w-12 h-1.5 rounded-full bg-muted-foreground/30 mb-6" />
        
        <SheetHeader className="sr-only">
          <SheetTitle>Channel Info</SheetTitle>
        </SheetHeader>

        <div className="flex items-start gap-4 mb-6">
          {/* Channel Cover */}
          <img
            src={channel.coverImage}
            alt={channel.name}
            className="w-20 h-20 rounded-xl object-cover"
          />

          {/* Channel Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-card-foreground mb-1">
              {channel.name}
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              by {channel.creatorName}
            </p>
            
            {/* Subscribe Button */}
            {channel.isSubscribed ? (
              <Button
                variant="listSecondary"
                size="sm"
                disabled
                className="gap-2"
              >
                <Check size={16} />
                Subscribed
              </Button>
            ) : (
              <Button
                variant="listPrimary"
                size="sm"
                onClick={onSubscribe}
              >
                Subscribe
              </Button>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            About
          </h3>
          <p className="text-card-foreground leading-relaxed">
            {channel.description}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
