'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { NewsletterData } from '@/lib/types/notion';
import { MagnetTheater } from '../components/flow/MagnetTheater';

// 静态数据 - 苏富比冰箱贴
const staticNewsletterData: NewsletterData = {
  id: 'flow-magnets-1',
  templateKey: 'flow-magnets',
  title: 'The Luxury Market\nLowdown\nNorth Texas 2025',
  author: 'Rob Brinkley',
  content: '<p>In 2025, the Dallas-Fort Worth luxury real estate market continued to outperform wider-ranging regional trends, demonstrating resilience amid broader housing moderation. While the overall D-FW median home price hovered around the mid‑$400,000s, the luxury segment stood out as a significant driver of value and activity.</p><h2>2025 Market Resilience</h2><p>The Dallas-Arlington-Fort Worth area led the state in luxury performance, accounting for roughly 39 percent of all Texas million-dollar-plus home sales. Approximately 4,992 luxury homes transacted, totaling an estimated $8.5 billion in sales volume, underscoring both scale and buyer appetite in high-end segments.</p><h2>Regional Highlights</h2><ul><li><strong>Park Cities:</strong> Prestigious enclaves like Highland Park continued to perform well above metro averages, with luxury estates rarely dropping below $2 million.</li><li><strong>Preston Hollow:</strong> Held its status as an ultra-luxury destination, attracting sophisticated buyers for custom estates.</li><li><strong>Lakewood:</strong> Demonstrated lifestyle-centric demand, prioritizing renovated homes with outdoor access.</li><li><strong>Southlake:</strong> Defined by strong family-oriented demand and top-tier schools.</li></ul><h2>Strategic Shifts</h2><p>Higher mortgage rates in 2025 influenced leverage decisions, with many luxury buyers opting for alternative financing strategies or cash transactions. For 2026, calibrated pricing and narrative-driven marketing—showcasing provenance and lifestyle—will be key to standing out.</p>',
  contentRichText: [],
  time: 'Jan 2026',
  annualPrice: '¥500/年',
  monthlyPrice: '¥50/月',
  ctaText: 'Find an advisor',
  benefits: [
    'D-FW accounts for 39% of Texas luxury sales ($8.5B)',
    'Resilient pricing in Park Cities & Preston Hollow',
    'Strategic opportunities for buyers in 2026'
  ],
  consume: 'In 2025, Dallas-Fort Worth led Texas luxury real estate with 8.5 billion dollars in sales, proving remarkably resilient. While average markets cooled, premium enclaves like Park Cities and Southlake saw steady gains. Heading into 2026, strategic pricing and lifestyle-driven marketing will be your key to success in this balanced, high-demand environment.',
  ttsUrl: 'https://amzn-s3-fc-bucket.s3.sa-east-1.amazonaws.com/audio/48e54e68-b0d0-4745-8cae-08908725065f.mp3'
};

export default function FlowMagnets() {
  const router = useRouter();
  const newsletter = staticNewsletterData;
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  // Refs for Audio/TTS
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio & Speech Synthesis
  useEffect(() => {
    // Mode A: S3 Audio Initialization
    if (newsletter.ttsUrl) {
      const audio = new Audio(newsletter.ttsUrl);
      audio.onended = () => setIsPlayingTTS(false);
      audioRef.current = audio;
    }

    return () => {
      if (synthRef.current) synthRef.current.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [newsletter.ttsUrl]);

  const handleTogglePlay = () => {
    // Mode A: Audio URL (if exists)
    if (newsletter.ttsUrl && audioRef.current) {
      if (isPlayingTTS) {
        audioRef.current.pause();
        setIsPlayingTTS(false);
      } else {
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        setIsPlayingTTS(true);
      }
      return;
    }

    // Mode B: Web Speech API
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (!synthRef.current) synthRef.current = window.speechSynthesis;

    if (isPlayingTTS) {
      synthRef.current.pause(); // or cancel
      setIsPlayingTTS(false);
    } else {
      // Resume or Start
      if (synthRef.current.paused && synthRef.current.speaking) {
        synthRef.current.resume();
        setIsPlayingTTS(true);
      } else {
        // Start new
        const utterance = new SpeechSynthesisUtterance(newsletter.consume || newsletter.content);
        utterance.lang = 'en-US'; // Changed to English for correct pronunciation
        utterance.rate = 1.1; // Speed adjust 1.1x per user request
        utterance.onend = () => setIsPlayingTTS(false);
        utteranceRef.current = utterance;
        synthRef.current.speak(utterance);
        setIsPlayingTTS(true);
      }
    }
  };

  const handleFindAdvisor = () => {
    router.push('/advisors');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section (Theater) */}
      <MagnetTheater
        title={newsletter.title}
        isPlaying={isPlayingTTS}
        onTogglePlay={handleTogglePlay}
        benefits={newsletter.benefits}
        onFindAdvisor={handleFindAdvisor}
      />
    </div>
  );
}
