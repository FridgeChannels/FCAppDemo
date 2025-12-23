import { Play, Menu } from 'lucide-react';
import { Episode } from '@/types/player';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface EpisodeListOverlayProps {
  episodes: Episode[];
  currentEpisodeId: string;
  channelName: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectEpisode: (episode: Episode) => void;
}

export const EpisodeListOverlay = ({
  episodes,
  currentEpisodeId,
  channelName,
  isOpen,
  onClose,
  onSelectEpisode,
}: EpisodeListOverlayProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl border-t-0 bg-card h-[85vh] p-0"
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2 sticky top-0 bg-card z-10">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="px-6 pb-4">
          <SheetHeader className="text-left">
            <SheetTitle className="text-2xl font-bold text-card-foreground">
              Queue
            </SheetTitle>
            <p className="text-sm text-muted-foreground">
              Now playing <span className="text-card-foreground">{channelName}</span>
            </p>
          </SheetHeader>
        </div>

        {/* Episode List */}
        <ScrollArea className="flex-1 h-[calc(85vh-100px)] episode-list">
          <div className="px-4 pb-8">
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
                    'w-full flex items-center gap-4 p-3 rounded-xl transition-colors text-left',
                    isCurrentEpisode 
                      ? 'bg-red-500/15' 
                      : 'hover:bg-red-500/10'
                  )}
                >
                  {/* Episode Cover / Index */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-list-item flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-list-item to-list-bg flex items-center justify-center">
                      <span className="text-xs text-muted-foreground font-medium">
                        EP{episodes.length - index}
                      </span>
                    </div>
                    {isCurrentEpisode && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="w-8 h-8 rounded-full bg-card-foreground flex items-center justify-center">
                          <Play size={14} className="text-card ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Episode Info */}
                  <div className="flex-1 min-w-0">
                    <h3 
                      className={cn(
                        'font-semibold line-clamp-2 mb-1 leading-snug',
                        isCurrentEpisode 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-card-foreground'
                      )}
                    >
                      {episode.title}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      {episode.progress === 100 && (
                        <span className="text-red-600 dark:text-red-400">✓</span>
                      )}
                      {channelName}
                    </p>
                  </div>

                  {/* Drag Handle (visual only) */}
                  <Menu size={20} className="text-muted-foreground flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
