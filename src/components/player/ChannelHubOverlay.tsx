import { Check } from 'lucide-react';
import { Channel, Episode } from '@/types/player';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ChannelHubOverlayProps {
  channel: Channel;
  episodes: Episode[];
  currentEpisodeId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  onSelectEpisode: (episode: Episode) => void;
}

export const ChannelHubOverlay = ({
  channel,
  episodes,
  currentEpisodeId,
  isOpen,
  onClose,
  onSubscribe,
  onSelectEpisode,
}: ChannelHubOverlayProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl border-t-0 bg-card text-card-foreground h-[85vh] max-h-[85vh] p-0 safe-area-bottom no-scroll-x"
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2 sticky top-0 bg-card z-10">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <ScrollArea className="h-[calc(85vh-20px)]">
          <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
            {/* Header */}
            <SheetHeader className="text-left">
              <SheetTitle className="text-xl sm:text-2xl font-bold text-card-foreground text-wrap-safe">
                Channel Info
              </SheetTitle>
            </SheetHeader>

            {/* Channel summary */}
            <div className="flex items-start gap-3 sm:gap-4 md:gap-5 mt-4 sm:mt-6">
              <img
                src={channel.coverImage}
                alt={channel.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-card-foreground mb-1 text-wrap-safe break-words">
                  {channel.name}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                  by {channel.creatorName}
                </p>

                {channel.isSubscribed ? (
                  <Button variant="listSecondary" size="sm" disabled className="gap-2 min-h-[44px] touch-target">
                    <Check size={16} />
                    <span>Subscribed</span>
                  </Button>
                ) : (
                  <Button variant="listPrimary" size="sm" onClick={onSubscribe} className="min-h-[44px] touch-target">
                    Subscribe
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                About
              </h3>
              <p className="text-sm sm:text-base text-card-foreground leading-relaxed text-wrap-safe break-words">
                {channel.description}
              </p>
            </div>

            {/* Divider */}
            <div className="my-6 sm:my-8 h-px bg-border/40" />

            {/* Queue */}
            <div className="flex items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-card-foreground">Queue</h3>
                <p className="text-xs sm:text-sm text-muted-foreground text-wrap-safe">
                  Now playing <span className="text-card-foreground">{channel.name}</span>
                </p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {episodes.length} items
              </span>
            </div>

            <div className="space-y-2 sm:space-y-3 pb-6 sm:pb-10">
              {episodes.map((episode, index) => {
                const isCurrentEpisode = episode.id === currentEpisodeId;

                return (
                  <button
                    key={episode.id}
                    onClick={() => {
                      onSelectEpisode(episode);
                      onClose();
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 sm:gap-4 md:gap-5 p-3 sm:p-4 rounded-xl transition-colors text-left min-h-[80px]',
                      isCurrentEpisode ? 'bg-red-500/15' : 'hover:bg-red-500/10',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                    )}
                  >
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-list-item flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-list-item to-list-bg flex items-center justify-center">
                        <span className="text-xs text-muted-foreground font-medium">
                          EP{episodes.length - index}
                        </span>
                      </div>
                      {isCurrentEpisode && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <div className="w-8 h-8 rounded-full bg-card-foreground flex items-center justify-center">
                            <span className="text-card text-sm font-bold leading-none">▶</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className={cn(
                          'font-semibold line-clamp-2 mb-1 leading-snug text-sm sm:text-base text-wrap-safe break-words',
                          isCurrentEpisode ? 'text-red-600 dark:text-red-400' : 'text-card-foreground'
                        )}
                      >
                        {episode.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                        {episode.progress === 100 && (
                          <span className="text-red-600 dark:text-red-400">✓</span>
                        )}
                        <span className="truncate">{channel.name}</span>
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};


