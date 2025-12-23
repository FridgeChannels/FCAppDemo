import { X, ArrowLeft } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-card animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border/50 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onClose}
            className="flex items-center text-card-foreground hover:opacity-70 transition-opacity"
            aria-label="Back to player"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 text-center">
            <span className="text-sm text-muted-foreground">{channel.name}</span>
          </div>
          <div className="w-16" /> {/* Spacer for balance */}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="h-[calc(100vh-60px)]">
        <article className="px-6 py-8 max-w-2xl mx-auto">
          {/* Episode Header */}
          <header className="mb-8">
            <p className="text-sm text-muted-foreground mb-2">{episode.publishedAt}</p>
            <h1 className="text-2xl font-bold text-card-foreground leading-tight mb-4">
              {episode.title}
            </h1>
            <div className="flex items-center gap-3">
              <img
                src={channel.coverImage}
                alt={channel.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-card-foreground">{channel.creatorName}</p>
                <p className="text-xs text-muted-foreground">{channel.name}</p>
              </div>
            </div>
          </header>

          {/* Newsletter Content */}
          <div className="prose prose-invert prose-sm max-w-none">
            {episode.originalContent ? (
              <div 
                className="text-card-foreground leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: episode.originalContent }}
              />
            ) : (
              <div className="text-card-foreground leading-relaxed space-y-6">
                <p className="text-lg font-medium" style={{ color: 'hsl(var(--list-accent))' }}>
                  {episode.aiSummary}
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">The Crisis of Deep Thinking</h2>
                <p>
                  In this age of information explosion, we are surrounded by countless notifications, messages, and content every day. Smartphones allow us to access information anytime, anywhere, but is this convenience eroding our ability to think deeply?
                </p>
                <p>
                  Psychological research shows that frequent task switching significantly reduces our cognitive efficiency. When we become accustomed to quick browsing and instant gratification, our brains gradually lose the ability to focus on complex problems.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">The Double-Edged Sword of Social Media</h2>
                <p>
                  Social media algorithms are designed to maximize user engagement, not to promote deep understanding. Short videos and fast-scrolling feeds are training our attention to become increasingly fragmented.
                </p>
                <blockquote className="border-l-4 border-list-accent pl-4 my-6 italic text-muted-foreground">
                  "We are not consuming content; we are being consumed by content. Every swipe is a small betrayal of our focus."
                  <footer className="text-sm mt-2">— Attention Economy Researcher</footer>
                </blockquote>

                <h2 className="text-xl font-semibold mt-8 mb-4">How to Rebuild Deep Thinking Ability</h2>
                <p>
                  The good news is that our brains are plastic. Through conscious practice, we can gradually restore our ability to think deeply:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Daily Focus Time</strong>: Set aside 30 minutes of uninterrupted time to focus on a single task</li>
                  <li><strong>Deep Reading</strong>: Read at least one book that requires focus each week</li>
                  <li><strong>Meditation Practice</strong>: Train sustained attention through meditation</li>
                  <li><strong>Reduce Notifications</strong>: Turn off unnecessary phone notifications</li>
                  <li><strong>Writing to Think</strong>: Organize and deepen thinking through writing</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">Conclusion</h2>
                <p>
                  Deep thinking is not just a skill, but a choice. In this era that pursues speed and efficiency, choosing to slow down and think deeply may be the wisest decision we can make.
                </p>
                <p>
                  Remember, truly valuable insights often come from long periods of focus and reflection, not from rapid information consumption.
                </p>

                <div className="mt-12 pt-8 border-t border-border/30">
                  <p className="text-sm text-muted-foreground">
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
