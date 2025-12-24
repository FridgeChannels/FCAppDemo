import { useMemo, useState, useEffect } from 'react';
import { Episode } from '@/types/player';
import { cn } from '@/lib/utils';

interface ExcerptPreviewProps {
  episode: Episode;
  onViewOriginal: () => void;
  className?: string;
}

/**
 * Extract plain text from HTML content for preview
 * Removes HTML tags and normalizes whitespace
 */
const extractTextFromHtml = (html: string): string => {
  if (typeof document === 'undefined') {
    // SSR fallback: simple regex-based extraction
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || div.innerText || '';
  // Normalize whitespace
  return text.replace(/\s+/g, ' ').trim();
};

/**
 * Get preview lines based on screen height
 * Small screen (<= 667px): 6-8 lines
 * Medium screen (668-800px): 8-10 lines  
 * Large screen (> 800px): 10-12 lines
 */
const getPreviewLines = (): number => {
  if (typeof window === 'undefined') return 8;
  
  const height = window.innerHeight;
  // Calculate based on available space (screen height - top content - bottom CTA)
  // Top content ~400-500px, Bottom CTA ~80px, so available space = height - 480-580px
  const availableSpace = height - 500;
  // Each line is roughly 24px (text-sm/base with line-height 1.6)
  const estimatedLines = Math.floor(availableSpace / 24);
  
  // Clamp between 6 and 12 lines
  return Math.max(6, Math.min(12, estimatedLines));
};

export const ExcerptPreview = ({
  episode,
  onViewOriginal,
  className,
}: ExcerptPreviewProps) => {
  const [previewLines, setPreviewLines] = useState(8);
  const [maxHeight, setMaxHeight] = useState<string>('100%');

  useEffect(() => {
    // Calculate max height based on screen height to ensure CTA is always visible
    const calculateMaxHeight = () => {
      if (typeof window === 'undefined') return;
      
      const screenHeight = window.innerHeight;
      // Reserve space for: top content (~500px) + bottom CTA (~80px) + safe area
      const reservedSpace = 580;
      const availableHeight = screenHeight - reservedSpace;
      
      // Use calc to ensure preview never overlaps with CTA
      setMaxHeight(`calc(100vh - ${reservedSpace}px)`);
    };

    // Update preview lines and max height on resize
    const updateLayout = () => {
      setPreviewLines(getPreviewLines());
      calculateMaxHeight();
    };
    
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  const { previewText, fullTextLength } = useMemo(() => {
    if (episode.originalContent) {
      const fullText = extractTextFromHtml(episode.originalContent);
      // Take first 600 characters as preview (more than before for better preview)
      const preview = fullText.slice(0, 600).trim();
      return {
        previewText: preview,
        fullTextLength: fullText.length,
      };
    }
    // Fallback to AI summary
    const summary = episode.aiSummary || '';
    return {
      previewText: summary,
      fullTextLength: summary.length,
    };
  }, [episode.originalContent, episode.aiSummary]);

  const hasContent = previewText.length > 0;
  const hasMoreContent = episode.originalContent && fullTextLength > 600;

  if (!hasContent) {
    return (
      <div className={cn('flex items-center justify-center px-4 py-8 min-h-[120px]', className)}>
        <p className="text-sm text-muted-foreground text-center">
          Preview not available
        </p>
      </div>
    );
  }

  return (
    <div 
      className={cn('relative flex-grow overflow-hidden min-h-0 flex flex-col', className)}
      style={{
        maxHeight: maxHeight,
        minHeight: '120px', // Minimum height to ensure content is visible
      }}
    >
      {/* Preview Content - scrollable if needed */}
      <div
        className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-2 overflow-y-auto cursor-pointer select-none flex-1 min-h-0"
        onClick={onViewOriginal}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onViewOriginal();
          }
        }}
        aria-label="View full article"
      >
        {/* Optional Preview Label */}
        <div className="mb-2 sm:mb-3 flex-shrink-0">
          <span className="text-xs font-medium text-red-600 uppercase tracking-wider">
            Read Preview
          </span>
        </div>

        {/* Preview Text */}
        <div
          className={cn(
            'text-sm sm:text-base leading-relaxed text-foreground/85',
            'transition-opacity active:opacity-70',
            'text-wrap-safe break-words'
          )}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: previewLines,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.6',
          }}
        >
          {previewText}
          {hasMoreContent && '...'}
        </div>

        {/* Optional "Continue reading" hint */}
        {hasMoreContent && (
          <div className="mt-3 text-xs text-muted-foreground/60 flex-shrink-0">
            Tap to read full article →
          </div>
        )}
      </div>

      {/* Fade Gradient Overlay - only show if content is truncated */}
      {hasMoreContent && (
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, hsl(var(--background)) 80%, hsl(var(--background)) 100%)',
          }}
        />
      )}
    </div>
  );
};

