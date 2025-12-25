'use client';

// Screen 3: Full audio player screen with artwork
// Matches third screenshot: audio player with collage artwork, playback controls, and action buttons

import { useRouter } from 'next/navigation';
import { mockArticle } from "@/mock/article";

export default function Screen3() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col w-full max-w-md mx-auto">
      
      {/* Header with back, gift, bookmark */}
      <div className="flex justify-between items-center px-3 sm:px-4 py-2">
        <button 
          onClick={handleBack}
          className="hover:opacity-80 transition-opacity touch-manipulation p-1"
          aria-label="返回首页"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6">
            <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
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
      </div>

      {/* Artwork placeholder - using a gradient/pattern to represent the collage */}
      <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
        
        {/* Placeholder for collage elements - in real implementation, this would be the actual image */}
        <div className="absolute right-0 bottom-0 w-full h-full flex items-center justify-center px-2">
          <div className="text-white text-[10px] sm:text-xs opacity-50 text-center break-words">Photo-illustration by Fernando Pino</div>
        </div>
      </div>

      {/* Article info */}
      <div className="px-3 sm:px-4 py-3 sm:py-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-1 break-words" style={{ fontFamily: 'Georgia, serif' }}>
          How Elon Musk Ate NASA
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 break-words" style={{ fontFamily: 'Georgia, serif' }}>
          By {mockArticle.author}
        </p>
      </div>

      {/* Audio playback controls */}
      <div className="px-3 sm:px-4 pb-4 sm:pb-6">
        {/* Progress bar */}
        <div className="mb-3 sm:mb-4">
          <div className="h-1 bg-gray-200 rounded-full relative">
            <div className="h-full bg-hark-red rounded-full" style={{ width: '37%' }}></div>
            <div className="absolute top-1/2 -translate-y-1/2 left-[37%] w-3 h-3 sm:w-4 sm:h-4 bg-hark-red rounded-full -ml-1.5 sm:-ml-2"></div>
          </div>
          <div className="flex justify-between text-[10px] sm:text-xs text-gray-600 mt-1">
            <span>18:02</span>
            <span>{mockArticle.audioDuration}</span>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
          <span className="text-xs sm:text-sm text-gray-700 min-w-[2.5rem] text-center">1.0x</span>
          
          <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white relative touch-manipulation" aria-label="Rewind 15 seconds">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="absolute sm:w-4 sm:h-4">
              <path d="M8 4L4 8L8 12" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[9px] sm:text-[10px] font-medium absolute -bottom-4 sm:-bottom-5 text-gray-600 whitespace-nowrap">15</span>
          </button>
          
          <button className="w-14 h-14 sm:w-16 sm:h-16 bg-black rounded-full flex items-center justify-center shadow-lg touch-manipulation" aria-label="Play">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="sm:w-7 sm:h-7">
              <path d="M8 5V19L19 12L8 5Z" fill="white"/>
            </svg>
          </button>
          
          <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white relative touch-manipulation" aria-label="Forward 15 seconds">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="absolute sm:w-4 sm:h-4">
              <path d="M8 4L12 8L8 12" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[9px] sm:text-[10px] font-medium absolute -bottom-4 sm:-bottom-5 text-gray-600 whitespace-nowrap">15</span>
          </button>
          
          <button className="min-w-[1.5rem] sm:min-w-[2rem] touch-manipulation" aria-label="Speed">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="sm:w-5 sm:h-5">
              <rect x="6" y="4" width="2" height="12" fill="black"/>
              <rect x="10" y="4" width="2" height="12" fill="black"/>
              <path d="M14 4L18 10L14 16" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 sm:gap-3">
          <button className="flex-1 border border-gray-300 rounded-lg py-2.5 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium bg-white text-black hover:bg-gray-50 transition-colors touch-manipulation min-h-[44px]">
            READ STORY
          </button>
        </div>
      </div>
    </div>
  );
}

