'use client';

// 苏富比冰箱贴页面
import { Header } from "@/components/Header";
import { useState, useEffect } from 'react';

export default function FlowMagnets() {
  const [screenHeight, setScreenHeight] = useState(0);

  // Calculate actual screen height dynamically
  useEffect(() => {
    const updateHeight = () => {
      const height = window.innerHeight;
      setScreenHeight(height);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  return (
    <div 
      className="bg-white flex flex-col w-full max-w-md mx-auto overflow-hidden relative"
      style={{ height: screenHeight || '100vh' }}
    >
      <Header />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4">
        <div className="max-w-none w-full pt-4 sm:pt-6 pb-4">
          {/* Title */}
          <h1 
            className="font-bold mb-6 sm:mb-8 leading-tight text-black text-center font-atlantic-condensed"
            style={{ 
              fontFamily: 'Atlantic Condensed, Georgia, serif',
              fontSize: '35pt'
            }}
          >
            苏富比冰箱贴
          </h1>
          
          {/* Content area */}
          <div className="space-y-6">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center">
              欢迎来到苏富比冰箱贴页面
            </p>
            
            {/* Placeholder for content */}
            <div className="mt-8 space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-3 text-center" style={{ fontFamily: 'Atlantic Condensed, Georgia, serif' }}>
                  特色内容
                </h2>
                <p className="text-sm text-gray-600 text-center">
                  这里将展示苏富比冰箱贴的相关内容
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
