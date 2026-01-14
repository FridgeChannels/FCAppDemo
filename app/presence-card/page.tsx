'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RippleTrigger } from '../components/nfc/RippleTrigger';
import { CHANNELS, ChannelData } from '../data/channels';

import { PresenceCard } from '../components/nfc/PresenceCard';
import { AudioTheater } from '../components/nfc/AudioTheater';
// import { DepthReading } from '../components/nfc/DepthReading';
import { CuratorCTA } from '../components/nfc/CuratorCTA';


// Phases of the animation
// idle -> triggered -> reveal -> presence -> transition -> active
type AnimationPhase = 'idle' | 'triggered' | 'reveal' | 'presence' | 'transition' | 'active';

export default function NFCPage() {
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false); // Main Audio State
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const currentChannel = CHANNELS[currentChannelIndex];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulated Haptic Feedback
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(20);
    }
  };

  // Auto-trigger on mount
  useEffect(() => {
    const initialDelay = setTimeout(() => {
      handleTriggerSequence();
    }, 500);
    return () => clearTimeout(initialDelay);
  }, []);

  const handleTriggerSequence = () => {
    if (phase !== 'idle') return;

    triggerHaptic();
    setPhase('triggered');

    // 0ms: Triggered (Ripple)
    // Immediate transition to Presence, skipping Logo/Reveal
    handleSwipeComplete();
  };

  const handleSwipeComplete = () => {
    setPhase('presence'); // Transition to Digital Presence
    triggerHaptic();
  }

  const handlePresenceComplete = () => {
    // Presence card slides up (handled by component)
    setPhase('transition');

    // 800ms: Active (Audio Theater) - Sync with Presence slide-up duration
    setTimeout(() => {
      setPhase('active');
      // Start main content audio
      if (audioRef.current) {
        audioRef.current.play().catch(() => { });
        setIsPlaying(true);
      }
    }, 800);
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Preload Main Audio & Event Listeners
  useEffect(() => {
    // Cleanup previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(currentChannel.voice_url);
    audio.loop = false; // Main content usually doesn't loop
    audio.volume = 0; // Start at 0 for fade-in
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setAudioProgress(audio.currentTime / audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    // If active, try to play immediately (switching channels)
    if (phase === 'active') {
      audio.play().catch(() => { });
      setIsPlaying(true);
      // Ensure volume is up if we are already active
      audio.volume = 1;
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [currentChannelIndex]); // Re-run when channel changes

  // Initial Volume Fade In (Cross-fade)
  useEffect(() => {
    if (phase === 'active' && audioRef.current && isPlaying) {
      let vol = audioRef.current.volume;
      if (vol >= 1) return;

      const interval = setInterval(() => {
        if (vol < 1) {
          vol += 0.05;
          if (audioRef.current) audioRef.current.volume = Math.min(vol, 1);
        } else {
          clearInterval(interval);
        }
      }, 50); // Faster fade in for content
      return () => clearInterval(interval);
    }
  }, [phase, isPlaying, currentChannelIndex]);

  const handleChannelSelect = (index: number) => {
    if (index !== currentChannelIndex) {
      setCurrentChannelIndex(index);
      // If already playing, keep playing new track
      if (isPlaying) {
        // Effect will handle the switch and play
      }
    }
  };

  // Handle Scroll to Reading Section
  const handleScrollToRead = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const showRipple = phase === 'triggered' || phase === 'reveal';


  const showTheater = phase === 'transition' || phase === 'active';

  // Dynamic Background: Deep Blue -> Estate White
  const bgColor = (phase === 'presence' || phase === 'transition' || phase === 'active') ? '#002349' : '#000000';

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full min-h-screen bg-black overflow-hidden"
      animate={{
        backgroundColor: bgColor
      }}
      transition={{ duration: 1.0 }}
    >
      {/* Preload Hints */}
      <link rel="preload" href="https://amzn-s3-fc-bucket.s3.sa-east-1.amazonaws.com/audio/93ec84e3-7921-4d3d-917d-21450d95be12.mp3" as="audio" />

      {/* Phase 1: Ripple Trigger & Phase 1.5: Logo Swipe Layer */}
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center pointer-events-none">

        {/* Ripple is always behind */}
        <div className="absolute inset-0 flex items-center justify-center">
          <RippleTrigger isActive={phase === 'triggered'} />
        </div>

        {/* Interaction Layer (Removed - Auto Transition) */}
        <motion.div
          className="absolute inset-0 z-50 pointer-events-none"
        />




      </div>

      {/* Phase 2: Digital Presence Layer */}
      {/* We use AnimatePresence inside the component to handle exit slide-up */}
      <PresenceCard
        isVisible={phase === 'presence'}
        onComplete={handlePresenceComplete}
      />

      {/* Phase 4: Audio Theater (First Screen) */}
      <div className="h-screen w-full relative">
        <AudioTheater
          isVisible={showTheater}
          onScrollToRead={handleScrollToRead}
          audioProgress={audioProgress}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          currentChannel={currentChannel}
          onChannelSelect={handleChannelSelect}
        />
      </div>

      {/* Phase 5: Depth Reading (Below Fold) */}
      {/* {phase === 'active' && (
        <div className="relative z-30 bg-[#F9F9F9]">
          <DepthReading onScrollProgress={setScrollProgress} />
        </div>
      )} */}

      {/* Reciprocity CTA */}
      {/* <CuratorCTA isVisible={scrollProgress > 0.6} /> */}

    </motion.div>
  );
}
