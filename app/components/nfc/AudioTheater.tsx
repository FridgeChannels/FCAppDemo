'use client';

import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface AudioTheaterProps {
    isVisible: boolean;
    onScrollToRead: () => void;
    audioProgress: number;
    isPlaying: boolean;
    onTogglePlay: () => void;
}

export function AudioTheater({ isVisible, onScrollToRead, audioProgress, isPlaying, onTogglePlay }: AudioTheaterProps) {
    if (!isVisible) return null;

    // Show shimmer if near end (e.g., > 90%)
    const showShimmer = audioProgress > 0.9;

    return (
        <motion.div
            className="relative w-full h-screen flex flex-col items-center justify-between py-12 px-6 z-40 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1.0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Luxury Noise Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
                }}
            />

            {/* Top Bar - Identity */}
            <motion.div
                className="w-full flex justify-center pt-8 z-10"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.8 }}
            >
                <h2 className="text-[#B89B5E] text-[10px] tracking-[0.3em] font-serif-luxury font-light uppercase">SOTHEBY&apos;S INTERNATIONAL REALTY</h2>
            </motion.div>

            {/* The Stage - Breathing Sonar Halo */}
            <div className="flex-1 flex flex-col items-center justify-center relative w-full z-10">

                {/* Ring 1 - Outer Slow */}
                <motion.svg
                    className="absolute w-[400px] h-[400px]"
                    viewBox="0 0 400 400"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                    <circle cx="200" cy="200" r="198" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 8" />
                </motion.svg>

                {/* Ring 2 - Mid Breathing */}
                <motion.svg
                    className="absolute w-[320px] h-[320px]"
                    viewBox="0 0 320 320"
                    animate={{ rotate: -360, scale: [0.95, 1.05, 0.95] }}
                    transition={{
                        rotate: { duration: 40, repeat: Infinity, ease: "linear" },
                        scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <circle cx="160" cy="160" r="158" fill="none" stroke="rgba(184, 155, 94, 0.4)" strokeWidth="1" strokeDasharray="2 10" />
                </motion.svg>

                {/* Ring 3 - Inner Pulse */}
                <motion.svg
                    className="absolute w-[240px] h-[240px]"
                    viewBox="0 0 240 240"
                    animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{
                        duration: 4, repeat: Infinity, ease: "easeInOut"
                    }}
                >
                    <circle cx="120" cy="120" r="118" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="1 4" />
                </motion.svg>

                {/* Core Focus - Inner Glow & Frosted */}
                <div
                    className="w-48 h-48 rounded-full bg-[#0A0A0A] shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer pointer-events-auto relative overflow-hidden group border border-white/5"
                    onClick={onTogglePlay}
                >
                    {/* Subtle Inner Glow */}
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]" />

                    {/* Status */}
                    <div className="text-white/80 p-6 relative z-10 transition-transform duration-500 group-hover:scale-110">
                        {isPlaying ? <Pause size={20} strokeWidth={0.5} /> : <Play size={20} strokeWidth={0.5} className="ml-1" />}
                    </div>
                </div>

                {/* Golden Sentence Flow - Refined Typography */}
                <div className="absolute top-[68%] w-full max-w-sm text-center px-4">
                    <motion.p
                        className="text-stone-300 font-serif-luxury font-light text-xl leading-[2.0] tracking-wide"
                        initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
                        animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                        transition={{ delay: 2.5, duration: 2.0 }}
                    >
                        Ideally, we don&apos;t just sell a home.
                        <br />
                        We inaugurate a life.
                    </motion.p>
                </div>
            </div>

            {/* Bottom Controls - Identity Bar (Heavy Glass) */}
            <motion.div
                className="w-full h-16 rounded-full flex items-center justify-between px-2 backdrop-blur-[20px] bg-white/5 border border-white/10 z-20 cursor-pointer overflow-hidden relative group"
                style={{
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)'
                }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
                onClick={onScrollToRead}
            >
                <div className="flex items-center space-x-4 pl-2">
                    <div className="w-10 h-10 rounded-full bg-stone-800 border border-white/10 overflow-hidden relative">
                        {/* User Avatar Image */}
                        <img
                            src="https://dl6bglhcfn2kh.cloudfront.net/James-Falconer-c9710917869cf8554ca5bc49f6595242.jpg?version=1749563435"
                            alt="James"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white text-xs font-medium tracking-wide">James Edition</span>
                        <div className="flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            <span className="text-white/40 text-[10px] uppercase tracking-wider">Online Now</span>
                        </div>
                    </div>
                </div>

                {/* Read Button with Golden Shimmer */}
                <div className="relative overflow-hidden rounded-full">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                        <span className="text-[#B89B5E] text-xs font-serif italic pr-0.5">Read</span>
                    </div>

                    {/* Golden Shimmer Overlay */}
                    {showShimmer && (
                        <motion.div
                            className="absolute inset-0 z-20 pointer-events-none"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.0 }}
                        >
                            <div className="w-full h-full bg-gradient-to-r from-transparent via-[#B89B5E]/60 to-transparent skew-x-12 blur-[2px]" />
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
