'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RippleTrigger } from '../components/nfc/RippleTrigger';
import { IdentityLogo } from '../components/nfc/IdentityLogo';
import { CHANNELS } from '../data/channels';
import { PresenceCard } from '../components/nfc/PresenceCard';
import { AudioTheater } from '../components/nfc/AudioTheater';
import { DepthReading } from '../components/nfc/DepthReading';
import { CuratorCTA } from '../components/nfc/CuratorCTA';
import { SwipeIndicator } from '../components/nfc/SwipeIndicator'; // Restored

// Phases of the animation
// idle -> triggered -> reveal -> presence -> transition -> active
type AnimationPhase = 'idle' | 'triggered' | 'reveal' | 'presence' | 'transition' | 'active';

export default function NFCPage() {
    const [phase, setPhase] = useState<AnimationPhase>('idle');
    const [scrollProgress, setScrollProgress] = useState(0);
    const [audioProgress, setAudioProgress] = useState(0);
    const [yOffset, setYOffset] = useState(0); // For Swipe Drag
    const [isPlaying, setIsPlaying] = useState(false); // Main Audio State

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
        // 300ms: Reveal Logo -> THEN WAIT FOR SWIPE
        setTimeout(() => setPhase('reveal'), 300);
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
        const audio = new Audio('https://amzn-s3-fc-bucket.s3.sa-east-1.amazonaws.com/audio/6d5d4873-60ee-474f-b98e-64ec17b704bc.mp3');
        audio.loop = false; // Main content usually doesn't loop
        audio.volume = 0;
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
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
        };
    }, []);

    // Volume Fade In (Cross-fade)
    useEffect(() => {
        if (phase === 'active' && audioRef.current) {
            let vol = 0;
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
    }, [phase]);

    // Handle Scroll to Reading Section
    const handleScrollToRead = () => {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    };

    const showRipple = phase === 'triggered' || phase === 'reveal';
    const logoState = phase === 'idle' || phase === 'triggered'
        ? 'hidden'
        : phase === 'reveal'
            ? 'reveal'
            : 'move-up';

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

                {/* Interaction Layer (Only active during reveal) */}
                <motion.div
                    className="absolute inset-0 z-50 cursor-grab active:cursor-grabbing pointer-events-auto"
                    style={{ display: phase === 'reveal' ? 'block' : 'none' }}
                    drag="y"
                    dragConstraints={{ top: -200, bottom: 0 }}
                    dragElastic={0.2}
                    onDrag={(event, info) => {
                        // Only allow dragging up
                        if (info.offset.y < 0) {
                            setYOffset(info.offset.y);
                        }
                    }}
                    onDragEnd={(event, info) => {
                        if (info.offset.y < -100) {
                            handleSwipeComplete();
                        } else {
                            setYOffset(0); // Snap back
                        }
                    }}
                />

                {/* Logo / Content Layer - Hides when Presence starts */}
                <motion.div
                    animate={{ opacity: (phase === 'presence' || phase === 'transition' || phase === 'active') ? 0 : 1 }}
                    transition={{ duration: 0.5 }}
                // Pass yOffset to logo for visual feedback during drag
                >
                    <IdentityLogo state={logoState} yOffset={phase === 'reveal' ? yOffset : 0} />
                </motion.div>

                {/* Swipe Hint */}
                <SwipeIndicator isVisible={phase === 'reveal'} />
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
                    currentChannel={CHANNELS[0]}
                    onChannelSelect={() => { }}
                />
            </div>

            {/* Phase 5: Depth Reading (Below Fold) */}
            {phase === 'active' && (
                <div className="relative z-30 bg-[#F9F9F9]">
                    <DepthReading onScrollProgress={setScrollProgress} />
                </div>
            )}

            {/* Reciprocity CTA */}
            <CuratorCTA isVisible={scrollProgress > 0.6} />

        </motion.div>
    );
}
