'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnetTheater } from '../components/flow/MagnetTheater';
import { motion } from 'framer-motion';

export default function MagnetPage() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };



  const handleFindAdvisor = () => {
    router.push('/advisors');
  };

  // Sample data
  const title = 'The Luxury Market Lowdown\nNorth Texas 2025';
  const benefits = [
    "D-FW accounts for 39% of Texas luxury sales ($8.5B)",
    "Resilient pricing in Park Cities & Preston Hollow",
    "Strategic opportunities for buyers in 2026"
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Magnet Theater Section */}
      <MagnetTheater
        title={title}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}

        benefits={benefits}
        onFindAdvisor={handleFindAdvisor}
      />
    </div>
  );
}
