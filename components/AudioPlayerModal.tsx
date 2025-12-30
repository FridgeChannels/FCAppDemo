'use client';

// Audio Player Modal: Full audio player screen as a modal
// Slides up from bottom like SubscriptionModal

import { mockArticle } from "@/mock/article";
import Image from "next/image";

interface AudioPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSeekForward?: () => void;
  onSeekBackward?: () => void;
  ttsText?: string;
  onViewFullIssue?: () => void;
  newsletterTitle?: string;
  newsletterAuthor?: string;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  progress?: number;
  currentTime?: number;
  duration?: number;
}

export const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({
  isOpen,
  onClose,
  onSeekForward,
  onSeekBackward,
  ttsText,
  onViewFullIssue,
  newsletterTitle,
  newsletterAuthor,
  isPlaying = false,
  onTogglePlay,
  progress = 0,
  currentTime = 0,
  duration = 0,
}) => {
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out max-h-[90vh] overflow-y-auto"
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <div className="flex flex-col">
          <div className="flex flex-col">
            {/* Artwork placeholder - REMOVED as per user request */}

            {/* Article info */}
            <div className="px-8 pt-10 pb-12 text-center">
              <h1
                className="text-2xl sm:text-3xl font-bold leading-tight mb-4 text-gray-900"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {newsletterTitle || 'How Elon Musk Ate NASA'}
              </h1>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>
                By {newsletterAuthor || mockArticle.author}
              </p>
            </div>
          </div>

          {/* Audio playback controls */}
          <div className="px-6 pb-8">
            {/* Progress bar */}
            <div className="mb-3 sm:mb-4">
              <div className="h-1 bg-gray-200 rounded-full relative">
                <div className="h-full bg-hark-red rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-hark-red rounded-full -ml-1.5 sm:-ml-2 transition-all duration-300" style={{ left: `${progress}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] sm:text-xs text-gray-600 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
              <button
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-white relative touch-manipulation hover:bg-gray-50 active:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900 focus-visible:outline-offset-2"
                aria-label="Rewind 15 seconds"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSeekBackward && ttsText) {
                    onSeekBackward();
                  }
                }}
              >
                <Image
                  src="/icons/rewind-15.png"
                  alt=""
                  aria-hidden="true"
                  width={28}
                  height={28}
                  className="h-7 w-7 sm:h-8 sm:w-8"
                />
              </button>

              <button
                className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center touch-manipulation"
                aria-label={isPlaying ? 'Pause' : 'Play'}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTogglePlay) {
                    onTogglePlay();
                  }
                }}
              >
                {isPlaying ? (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="sm:w-16 sm:h-16">
                    <rect x="8" y="6" width="3" height="12" fill="#1F2937" />
                    <rect x="13" y="6" width="3" height="12" fill="#1F2937" />
                  </svg>
                ) : (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="sm:w-16 sm:h-16">
                    <path d="M8 5V19L19 12L8 5Z" fill="#1F2937" />
                  </svg>
                )}
              </button>

              <button
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-white relative touch-manipulation hover:bg-gray-50 active:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900 focus-visible:outline-offset-2"
                aria-label="Forward 15 seconds"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSeekForward && ttsText) {
                    onSeekForward();
                  }
                }}
              >
                <Image
                  src="/icons/forward-15.png"
                  alt=""
                  aria-hidden="true"
                  width={28}
                  height={28}
                  className="h-7 w-7 sm:h-8 sm:w-8"
                />
              </button>
            </div>

            {/* Full Issue button */}
            <button
              className="w-full bg-red-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-none font-bold text-lg sm:text-xl hover:bg-red-700 transition-colors touch-manipulation mt-4 sm:mt-6 font-atlantic-condensed flex items-center justify-center gap-2 h-[41px]"
              style={{ fontFamily: 'Atlantic Condensed, Georgia, serif' }}
              onClick={(e) => {
                e.stopPropagation();
                if (onViewFullIssue) {
                  onViewFullIssue();
                }
              }}
            >
              <span>View Full Issue</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

          </div>
        </div>
      </div>
    </>
  );
};

