import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Episode, Channel } from '@/types/player';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OriginalContentViewProps {
  episode: Episode;
  channel: Channel;
  isOpen: boolean;
  onClose: () => void;
}

export const OriginalContentView = ({
  episode,
  channel,
  isOpen,
  onClose,
}: OriginalContentViewProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-card animate-fade-in no-scroll-x">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border/50 safe-area-top">
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <button
            onClick={onClose}
            className="flex items-center text-card-foreground hover:opacity-70 transition-opacity min-h-[44px] min-w-[44px] justify-center touch-target"
            aria-label="Back to player"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 text-center min-w-0 px-2">
            <span className="text-xs sm:text-sm text-muted-foreground truncate block">{channel.name}</span>
          </div>
          <a
            href={episode.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm min-h-[44px] px-2 justify-center touch-target"
            aria-label="Open original article in a new tab"
          >
            <span className="hidden sm:inline">Open</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="h-[calc(100vh-60px)] safe-area-bottom">
        <article className="w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
          {/* Episode Header */}
          <header className="mb-6 sm:mb-8 md:mb-10">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{episode.publishedAt}</p>
            <h1 className="text-xl sm:text-2xl font-bold text-card-foreground leading-tight mb-3 sm:mb-4 text-wrap-safe break-words">
              {episode.title}
            </h1>
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src={channel.coverImage}
                alt={channel.name}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-card-foreground truncate">{channel.creatorName}</p>
                <p className="text-xs text-muted-foreground truncate">{channel.name}</p>
              </div>
            </div>
          </header>

          {/* Newsletter Content */}
          <div className="prose prose-invert prose-sm max-w-none">
            {episode.originalContent ? (
              <div 
                className="text-card-foreground leading-relaxed space-y-4 sm:space-y-5 text-wrap-safe break-words"
                dangerouslySetInnerHTML={{ __html: episode.originalContent }}
                style={{ 
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto'
                }}
              />
            ) : (
              <div className="text-card-foreground leading-relaxed space-y-4 sm:space-y-6 text-wrap-safe break-words">
                <p className="text-base sm:text-lg font-medium" style={{ color: 'hsl(var(--list-accent))' }}>
                  {episode.aiSummary}
                </p>
                
                <h2 className="text-lg sm:text-xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4">The Crisis of Deep Thinking</h2>
                <p className="text-sm sm:text-base">
                  In this age of information explosion, we are surrounded by countless notifications, messages, and content every day. Smartphones allow us to access information anytime, anywhere, but is this convenience eroding our ability to think deeply?
                </p>
                <p className="text-sm sm:text-base">
                  Psychological research shows that frequent task switching significantly reduces our cognitive efficiency. When we become accustomed to quick browsing and instant gratification, our brains gradually lose the ability to focus on complex problems.
                </p>

                <h2 className="text-lg sm:text-xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4">The Double-Edged Sword of Social Media</h2>
                <p className="text-sm sm:text-base">
                  Social media algorithms are designed to maximize user engagement, not to promote deep understanding. Short videos and fast-scrolling feeds are training our attention to become increasingly fragmented.
                </p>
                <blockquote className="border-l-4 border-list-accent pl-3 sm:pl-4 my-4 sm:my-6 italic text-muted-foreground text-sm sm:text-base">
                  "We are not consuming content; we are being consumed by content. Every swipe is a small betrayal of our focus."
                  <footer className="text-xs sm:text-sm mt-2">— Attention Economy Researcher</footer>
                </blockquote>

                <h2 className="text-lg sm:text-xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4">How to Rebuild Deep Thinking Ability</h2>
                <p className="text-sm sm:text-base">
                  The good news is that our brains are plastic. Through conscious practice, we can gradually restore our ability to think deeply:
                </p>
                <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base">
                  <li><strong>Daily Focus Time</strong>: Set aside 30 minutes of uninterrupted time to focus on a single task</li>
                  <li><strong>Deep Reading</strong>: Read at least one book that requires focus each week</li>
                  <li><strong>Meditation Practice</strong>: Train sustained attention through meditation</li>
                  <li><strong>Reduce Notifications</strong>: Turn off unnecessary phone notifications</li>
                  <li><strong>Writing to Think</strong>: Organize and deepen thinking through writing</li>
                </ul>

                <h2 className="text-lg sm:text-xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4">Conclusion</h2>
                <p className="text-sm sm:text-base">
                  Deep thinking is not just a skill, but a choice. In this era that pursues speed and efficiency, choosing to slow down and think deeply may be the wisest decision we can make.
                </p>
                <p className="text-sm sm:text-base">
                  Remember, truly valuable insights often come from long periods of focus and reflection, not from rapid information consumption.
                </p>

                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/30">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Thank you for reading this newsletter. If you found this article helpful, feel free to share it with your friends.
                  </p>
                </div>
              </div>
            )}
          </div>
        </article>
      </ScrollArea>
    </div>
  );
};
