'use client';

/* eslint-disable react/no-unescaped-entities */

// Screen 4: Article detail/landing page
// Matches fourth screenshot: article landing page with photo-illustration, category, title, lead, author, date

import { Header } from "@/components/Header";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { mockArticle } from "@/mock/article";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Screen4() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(125); // Mock: 2:05 in seconds
  const [totalTime, setTotalTime] = useState(480); // Mock: 8:00 in seconds
  const [isSubscribed, setIsSubscribed] = useState(false); // Mock: 订阅状态
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleViewFullIssue = () => {
    if (isSubscribed) {
      // 已付费用户，直接跳转
      router.push('/screen5');
    } else {
      // 未付费用户，显示订阅弹窗
      setShowSubscriptionModal(true);
    }
  };

  const handleSubscribe = () => {
    // Mock: 付费成功
    setIsSubscribed(true);
    setShowSubscriptionModal(false);
    // 跳转到screen5
    router.push('/screen5');
  };

  const handleCloseModal = () => {
    setShowSubscriptionModal(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / totalTime) * 100;
  return (
    <div className="min-h-screen bg-white flex flex-col w-full max-w-md mx-auto">
      <Header />
      
      {/* Photo-illustration */}
      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden" style={{ height: '270px' }}>
        {/* Grid pattern background */}
        <div className="absolute opacity-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Article metadata and content */}
      <div className="px-3 sm:px-4 py-3 sm:py-4 flex-1">
        <h1 className="font-bold mb-2 sm:mb-3 leading-tight text-black text-center break-words font-atlantic-condensed text-[35pt]" style={{ fontFamily: 'Atlantic Condensed, Georgia, serif' }}>
          HOW NASA ENGINEERED ITS OWN DECLINE
        </h1>
        
        <div className="flex justify-between items-center mb-2 gap-2">
          <p className="text-xs sm:text-sm text-gray-600 break-words" style={{ fontFamily: 'Georgia, serif' }}>
            By {mockArticle.author}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider flex-shrink-0">
            {mockArticle.date}
          </p>
        </div>
        
        {/* Playback Progress Bar */}
        <div className="mb-3 sm:mb-4">
          <div className="bg-white px-1 sm:px-1.5 py-1 sm:py-1">
            {/* Play/Pause button and progress bar in same row */}
            <div className="flex items-center gap-1 sm:gap-1 mb-0">
              <button 
                onClick={togglePlayPause}
                className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0 touch-manipulation p-0"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="sm:w-[28px] sm:h-[28px]">
                    <rect x="6" y="4" width="3" height="12" fill="#DC2626"/>
                    <rect x="11" y="4" width="3" height="12" fill="#DC2626"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="sm:w-[28px] sm:h-[28px]">
                    <path d="M6 4L16 10L6 16V4Z" fill="#DC2626"/>
                  </svg>
                )}
              </button>
              
              {/* Progress bar */}
              <div className="relative flex-1 min-w-0">
                <div className="h-0.5 sm:h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-600 transition-all duration-300 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                {/* Progress handle */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-600 rounded-full shadow-sm -translate-x-1/2"
                  style={{ left: `${progressPercentage}%` }}
                />
              </div>
            </div>
            
            {/* Time labels below progress bar */}
            <div className="flex items-center gap-1 sm:gap-1 mt-0">
              <div className="w-[12px] sm:w-[14px] flex-shrink-0"></div>
              <div className="flex-1 flex items-center justify-between min-w-0" style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                <span className="text-[9px] sm:text-[10px] text-gray-500">{formatTime(currentTime)}</span>
                <span className="text-[9px] sm:text-[10px] text-gray-500">{formatTime(totalTime)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* You'll learn section */}
        <div className="mb-2 sm:mb-3 mt-1.5 sm:mt-2 border border-gray-300 rounded-lg py-3 sm:py-4 px-3 sm:px-4 font-lyon-text shadow-md text-center" style={{ fontFamily: 'Lyon Text, Georgia, serif' }}>
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-1.5 sm:mb-2 break-words text-center">
            You'll get
          </h2>
          
          <ul className="space-y-1.5 sm:space-y-1.5 flex flex-col items-start ml-[30px]">
            <li className="flex items-center justify-start gap-1 sm:gap-1.5 w-full">
              <span className="text-red-600 font-semibold text-sm sm:text-base flex-shrink-0">1.</span>
              <span className="text-sm sm:text-base text-black leading-relaxed break-words">Harnessing passion to fuel success</span>
            </li>
            
            <li className="flex items-center justify-start gap-1 sm:gap-1.5 w-full">
              <span className="text-red-600 font-semibold text-sm sm:text-base flex-shrink-0">2.</span>
              <span className="text-sm sm:text-base text-black leading-relaxed break-words">The power of consistent practice</span>
            </li>
            
            <li className="flex items-center justify-start gap-1 sm:gap-1.5 w-full">
              <span className="text-red-600 font-semibold text-sm sm:text-base flex-shrink-0">3.</span>
              <span className="text-sm sm:text-base text-black leading-relaxed break-words">Building an effective team culture</span>
            </li>
            
            <li className="flex items-center justify-start gap-1 sm:gap-1.5 w-full">
              <span className="text-red-600 font-semibold text-sm sm:text-base flex-shrink-0">4.</span>
              <span className="text-sm sm:text-base text-black leading-relaxed break-words">Leadership through character and trust</span>
            </li>
          </ul>
        </div>
        
        <button 
          onClick={handleViewFullIssue}
          className="w-full bg-red-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-bold text-lg sm:text-xl hover:bg-red-700 transition-colors mt-3 sm:mt-4 touch-manipulation min-h-[44px] font-atlantic-condensed"
          style={{ fontFamily: 'Atlantic Condensed, Georgia, serif' }}
        >
          View Full Issue
        </button>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={handleCloseModal}
        onSubscribe={handleSubscribe}
      />
    </div>
  );
}

