'use client';

import { motion } from 'framer-motion';
import { Play, Pause, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MagnetTheaterProps {
    title: string;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onScrollDown: () => void;
}

export function MagnetTheater({ title, isPlaying, onTogglePlay, onScrollDown }: MagnetTheaterProps) {
    // Sonar Ring Animation
    const sonarTransition = {
        duration: 4,
        repeat: Infinity,
        ease: "linear" as const
    };

    return (
        <div className="relative w-full h-screen bg-[#002349] overflow-hidden flex flex-col items-center justify-center text-white">
            {/* Background Texture (Noise) */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
                }}
            />

            {/* Central Resonance (Sonar Rings) */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                {/* Outer Ring */}
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full border border-white/10"
                    animate={{ rotate: 360 }}
                    transition={sonarTransition}
                    style={{ borderStyle: 'dashed' }}
                />
                {/* Mid Ring */}
                <motion.div
                    className="absolute w-[400px] h-[400px] rounded-full border border-[#B89B5E]/30"
                    animate={{ rotate: -360 }}
                    transition={{ ...sonarTransition, duration: 8 }}
                    style={{ borderStyle: 'dashed' }}
                />
                {/* Inner Ring */}
                <motion.div
                    className="absolute w-[250px] h-[250px] rounded-full border border-white/20"
                    animate={{ rotate: 180 }}
                    transition={{ ...sonarTransition, duration: 6 }}
                    style={{ borderStyle: 'dotted' }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-8 px-6 max-w-lg">

                {/* Dynamic Title */}
                <motion.h1
                    className="font-serif-luxury text-4xl sm:text-5xl leading-tight tracking-wide text-[#F9F9F9]"
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

                {/* Audio Control (Play/Pause) */}
                <motion.button
                    onClick={onTogglePlay}
                    className="group relative flex items-center justify-center w-16 h-16 rounded-full border border-[#B89B5E] bg-[#002349]/50 backdrop-blur-sm hover:bg-[#B89B5E] transition-all duration-500"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isPlaying ? (
                        <Pause className="w-6 h-6 text-[#F9F9F9] fill-current" />
                    ) : (
                        <Play className="w-6 h-6 text-[#F9F9F9] fill-current ml-1" />
                    )}

                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-full border border-[#B89B5E] opacity-50 blur-[2px] animate-pulse group-hover:blur-[4px] transition-all" />
                </motion.button>

                <motion.p
                    className="text-[#B89B5E] text-xs tracking-[0.2em] font-medium uppercase mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ delay: 0.8 }}
                >
                    {isPlaying ? 'Listening...' : 'Listen to Introduction'}
                </motion.p>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 z-10 cursor-pointer"
                onClick={onScrollDown}
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="flex flex-col items-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                    <span className="text-[10px] tracking-widest uppercase text-white">Discover</span>
                    <ChevronDown className="w-5 h-5 text-[#B89B5E]" />
                </div>
            </motion.div>
        </div>
    );
}
