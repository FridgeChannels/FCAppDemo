'use client';

import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MagnetTheaterProps {
    title: string;
    isPlaying: boolean;
    onTogglePlay: () => void;
    benefits?: string[];
    onFindAdvisor?: () => void;
}

export function MagnetTheater({ title, isPlaying, onTogglePlay, benefits, onFindAdvisor }: MagnetTheaterProps) {
    // Sonar Ring Animation
    const sonarTransition = {
        duration: 4,
        repeat: Infinity,
        ease: "linear" as const
    };

    return (
        <div className="relative w-full h-[100dvh] bg-[#002349] overflow-hidden flex flex-col items-center text-white">
            {/* Background Texture (Noise) */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
                }}
            />

            {/* Central Resonance (Sonar Rings) - Fixed Background */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
                {/* Outer Ring */}
                <motion.div
                    className="absolute w-[140vw] h-[140vw] sm:w-[600px] sm:h-[600px] rounded-full border border-white/10"
                    animate={{ rotate: 360 }}
                    transition={sonarTransition}
                    style={{ borderStyle: 'dashed' }}
                />
                {/* Mid Ring */}
                <motion.div
                    className="absolute w-[100vw] h-[100vw] sm:w-[400px] sm:h-[400px] rounded-full border border-[#B89B5E]/30"
                    animate={{ rotate: -360 }}
                    transition={{ ...sonarTransition, duration: 8 }}
                    style={{ borderStyle: 'dashed' }}
                />
                {/* Inner Ring */}
                <motion.div
                    className="absolute w-[60vw] h-[60vw] sm:w-[250px] sm:h-[250px] rounded-full border border-white/20"
                    animate={{ rotate: 180 }}
                    transition={{ ...sonarTransition, duration: 6 }}
                    style={{ borderStyle: 'dotted' }}
                />
            </div>

            {/* Main Content - Scrollable Layer */}
            <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden flex flex-col items-center">
                <div className="flex flex-col items-center text-center space-y-12 px-6 max-w-lg pt-24 pb-48 w-full">

                    {/* Dynamic Title */}
                    <motion.h1
                        className="font-serif-luxury text-3xl sm:text-5xl leading-tight tracking-wide text-[#F9F9F9]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.0, ease: "easeOut" }}
                    >
                        {title.split('\n').map((line, i) => (
                            <span key={i} className="block">
                                {line}
                            </span>
                        ))}
                    </motion.h1>

                    {/* Benefits Section ("What to Expect") - Editorial Style */}
                    {benefits && benefits.length > 0 && (
                        <motion.div
                            className="w-full max-w-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                        >
                            <h2 className="text-xs font-medium tracking-[0.25em] uppercase text-[#B89B5E] text-center mb-10 opacity-90">
                                What to Expect
                            </h2>
                            <ul className="space-y-6 sm:space-y-8 text-center">
                                {benefits.map((benefit, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.9 + i * 0.1 }}
                                        className="text-base sm:text-xl font-light leading-relaxed text-[#F9F9F9]/90"
                                    >
                                        {benefit}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* CTA: Find an Advisor (Fixed at bottom above controls) */}
            {onFindAdvisor && (
                <motion.div
                    className="absolute bottom-24 sm:bottom-28 w-full flex justify-center z-30 px-6 pointer-events-none"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    <div className="w-full max-w-xs pointer-events-auto">
                        <button
                            onClick={onFindAdvisor}
                            className="w-full py-3 sm:py-4 px-8 bg-[#B89B5E] text-white font-medium text-lg sm:text-xl tracking-[0.2em] uppercase rounded-full hover:bg-[#a38850] transition-all shadow-[0_0_20px_rgba(184,155,94,0.3)] active:scale-[0.98] duration-300"
                        >
                            Find an Advisor
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Bottom Playback Controls */}
            <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto px-4 bg-[#002349]/90 backdrop-blur-xl border-t border-white/10 pb-6 pt-3 z-40">
                {/* Progress Bar (Static for now as props don't pass progress yet, or we assume full duration loop) */}
                <div className="flex items-center justify-between gap-2 cursor-pointer" onClick={onTogglePlay}>
                    <div className="flex-1 mr-4 min-w-0 overflow-hidden relative" style={{ height: '1.5em' }}>
                        <h2
                            className="text-lg font-bold text-white whitespace-nowrap absolute transition-all duration-500"
                            style={{
                                animation: title.length > 30 ? 'scroll-text 15s linear infinite' : 'none'
                            }}
                        >
                            {title.replace(/\n/g, ' ')}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                            className="p-1 touch-manipulation"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                            onClick={(e) => {
                                e.stopPropagation();
                                onTogglePlay();
                            }}
                        >
                            {isPlaying ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <rect x="8" y="6" width="3" height="12" fill="#FFFFFF" />
                                    <rect x="13" y="6" width="3" height="12" fill="#FFFFFF" />
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 4L18 12L6 20V4Z" fill="#FFFFFF" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
