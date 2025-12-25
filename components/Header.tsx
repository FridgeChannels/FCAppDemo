'use client';

import { useRouter } from 'next/navigation';

// Header component with navigation and audio controls
interface HeaderProps {
  showPlayButton?: boolean;
  showGiftBookmark?: boolean;
}

export const Header = ({ showPlayButton = true, showGiftBookmark = false }: HeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="flex justify-between items-center px-3 sm:px-4 py-2 gap-2">
      <button 
        onClick={handleBack}
        className="flex items-center hover:opacity-80 transition-opacity touch-manipulation p-1 -ml-1"
        aria-label="返回首页"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-0.5 sm:mr-1 sm:w-6 sm:h-6">
          <path d="M15 18L9 12L15 6" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-hark-red text-sm sm:text-base font-medium hidden xs:inline">Home</span>
      </button>
      
      {showGiftBookmark ? (
        <div className="flex items-center gap-3 sm:gap-4">
          <button className="touch-manipulation p-1" aria-label="Gift">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6">
              <path d="M20 7H4V5C4 3.9 4.9 3 6 3H18C19.1 3 20 3.9 20 5V7ZM20 9V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V9H20Z" fill="black"/>
            </svg>
          </button>
          <button className="touch-manipulation p-1" aria-label="Bookmark">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6">
              <path d="M19 21L12 16L5 21V5C5 3.9 5.9 3 7 3H17C18.1 3 19 3.9 19 5V21Z" fill="black"/>
            </svg>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button className="touch-manipulation p-1" aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6">
              <circle cx="12" cy="5" r="1.5" fill="black"/>
              <circle cx="12" cy="12" r="1.5" fill="black"/>
              <circle cx="12" cy="19" r="1.5" fill="black"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

