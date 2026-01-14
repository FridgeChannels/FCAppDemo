'use client';

import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';


interface PresenceCardProps {
    isVisible: boolean;
    onComplete: () => void;
}

export function PresenceCard({ isVisible, onComplete }: PresenceCardProps) {
    const [startExit, setStartExit] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [lineDelay, setLineDelay] = useState(1.0);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Simulation Config
    const motionScale = useMotionValue(1);
    // Smooth the random jitters so it feels organic, not glitchy
    const smoothScale = useSpring(motionScale, { stiffness: 300, damping: 20 });

    // Stagger Text Config
    const textLines = [
        "I am James, your dedicated advisor.",
        "Beyond bespoke property insights,",
        "I have curated a selection of tranquil channels",
        "for your quiet moments.",
        "Welcome to your private frequency."
    ];

    useEffect(() => {
        if (isVisible) {
            const audio = new Audio('https://amzn-s3-fc-bucket.s3.sa-east-1.amazonaws.com/audio/93ec84e3-7921-4d3d-917d-21450d95be12.mp3');
            // NO crossOrigin setting to avoid CORS fail
            audio.volume = 1.0;
            audio.playbackRate = 1.1;
            audioRef.current = audio;

            // Handle End - Trigger Transition
            audio.onended = () => {
                triggerExit();
            };

            // Calculate timing based on metadata
            audio.onloadedmetadata = () => {
                const rawDuration = audio.duration;
                const adjustedDuration = rawDuration / 1.1;
                const revealWindow = adjustedDuration * 0.85;
                const perLine = revealWindow / textLines.length;
                setLineDelay(perLine);
            };

            // Fallback if metadata loads too fast or calc fails
            if (audio.readyState >= 1) {
                audio.onloadedmetadata?.(new Event('loadedmetadata'));
            }

            return () => {
                setIsPlaying(false);
                audio.pause();
            };
        }
    }, [isVisible]);

    const handleStart = async () => {
        if (audioRef.current) {
            try {
                await audioRef.current.play();
                setIsStarted(true);
                setIsPlaying(true);
            } catch (err) {
                console.log("Play failed:", err);
            }
        }
    };

    // High-Fidelity Voice Simulation Loop
    // Simulates waveform peaks/valleys randomly while playing
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isPlaying) {
            interval = setInterval(() => {
                // Random float between 1.0 and 1.06
                // Represents "speaking volume"
                // Ideally, speech has pauses, so we weight it towards 1.0 slightly
                const isPeak = Math.random() > 0.6;
                const target = isPeak
                    ? 1.02 + (Math.random() * 0.04) // Peak: 1.02 - 1.06
                    : 1.0 + (Math.random() * 0.01); // Silence/Low: 1.0 - 1.01

                motionScale.set(target);
            }, 100); // 10 updates/sec = 10Hz control signal
        } else {
            motionScale.set(1);
        }

        return () => clearInterval(interval);
    }, [isPlaying, motionScale]);

    const triggerExit = () => {
        setStartExit(true);
        setTimeout(() => {
            onComplete();
        }, 800);
    };

    return (
        <AnimatePresence>
            {isVisible && !startExit && (
                <motion.div
                    key="presence-container"
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#002349] text-white overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ y: '-100vh', opacity: 1 }}
                    transition={{ duration: 1.2, ease: [0.32, 0, 0.67, 0] }}
                >
                    {/* Background Noise Texture */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-overlay"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
                        }}
                    />

                    {/* Avatar Portrait - Audio Reactive (Simulated) */}
                    <div className="relative">
                        <motion.div
                            className="relative z-10 mb-12"
                            initial={{ scale: 1.1, filter: 'blur(10px)', opacity: 0 }}
                            animate={{
                                filter: isStarted ? 'blur(0px)' : 'blur(5px)',
                                opacity: 1,
                                scale: isStarted ? undefined : 1
                            }}
                            style={{ scale: isStarted ? smoothScale : 1 }} // Spring smoothed random values
                            transition={{
                                default: { duration: 1.5, ease: "easeOut" }
                            }}
                        >
                            <div className="w-32 h-32 rounded-full border-[0.5px] border-[#B89B5E] p-1 flex items-center justify-center relative">
                                <div className="w-full h-full rounded-full bg-stone-800 overflow-hidden relative">
                                    <img
                                        src="https://dl6bglhcfn2kh.cloudfront.net/James-Falconer-c9710917869cf8554ca5bc49f6595242.jpg?version=1749563435"
                                        alt="James Falconer"
                                        className="w-full h-full object-cover transition-all duration-700"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Play Button Overlay */}
                        {!isStarted && (
                            <motion.button
                                onClick={handleStart}
                                className="absolute inset-0 flex items-center justify-center z-20 pb-12"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="w-16 h-16 rounded-full bg-[#B89B5E]/90 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(184,155,94,0.4)] border border-[#F9F9F9]/20">
                                    <Play className="w-6 h-6 text-[#002349] fill-current ml-1" />
                                </div>
                            </motion.button>
                        )}
                    </div>

                    {/* Staggered Text */}
                    <div className="z-10 text-center space-y-4 px-8 max-w-md">
                        {textLines.map((line, i) => (
                            <motion.p
                                key={i}
                                className="text-stone-300 font-serif-luxury font-light text-lg tracking-wide leading-relaxed"
                                initial={{ opacity: 0, y: 10 }}
                                animate={isPlaying ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                transition={{ delay: 0.5 + (i * lineDelay), duration: 0.8 }}
                            >
                                {line}
                            </motion.p>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
