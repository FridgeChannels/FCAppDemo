'use client';

import { motion } from 'framer-motion';
import { Play, Pause, X, Bookmark, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CHANNELS, ChannelData } from '../../data/channels';

export interface AudioTheaterProps {
    isVisible: boolean;
    onScrollToRead: () => void;
    audioProgress: number;
    isPlaying: boolean;
    onTogglePlay: () => void;
    currentChannel: ChannelData;
    onChannelSelect: (index: number) => void;
}

export function AudioTheater({
    isVisible,
    onScrollToRead,
    audioProgress,
    isPlaying,
    onTogglePlay,
    currentChannel,
    onChannelSelect
}: AudioTheaterProps) {
    // Show shimmer if near end (e.g., > 90%)
    const showShimmer = audioProgress > 0.9;

    // Category menu state
    const [showCategories, setShowCategories] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

    if (!isVisible) return null;

    // const categories = ['SOTHEBY\'S', 'Tech News', 'Sport', 'Lifestyle', 'Business', 'Entertainment', 'Science', 'Travel', 'Food'];

    // // Category to title mapping
    // const categoryTitles: Record<string, string> = {
    //     'SOTHEBY\'S': 'Global Real Estate Market Outlook 2026: Trends & Insights',
    //     'Tech News': 'Innovation Frontier: The Latest in Technology and Digital Transformation',
    //     'Sport': 'Athletic Excellence: Champions, Records, and Sporting Legends',
    //     'Lifestyle': 'Château Excellence: A Legacy of Terroir and Tradition',
    //     'Business': 'Market Insights: Strategic Leadership and Global Commerce',
    //     'Entertainment': 'Cultural Spotlight: Arts, Media, and Creative Expression',
    //     'Science': 'Discovery Channel: Breakthroughs in Research and Innovation',
    //     'Travel': 'Wanderlust Chronicles: Destinations, Cultures, and Adventures',
    //     'Food': 'Culinary Arts: Fine Dining, Recipes, and Gastronomic Journeys'
    // };

    // // Get current title based on selected category
    // const currentTitle = selectedCategory
    //     ? categoryTitles[selectedCategory]
    //     : categoryTitles['SOTHEBY\'S'];

    const toggleCategories = () => {
        setShowCategories(!showCategories);
    };

    const handleCategorySelect = (index: number) => {
        onChannelSelect(index);
        setShowCategories(false);
    };

    const handleContactClick = () => {
        setShowContactModal(true);
        // Auto close after 3 seconds
        setTimeout(() => {
            setShowContactModal(false);
        }, 3000);
    };

    return (
        <>
            <motion.div
                className="relative w-full h-screen flex flex-col items-center justify-between py-12 px-6 z-40 overflow-hidden"
                style={{ top: '-16px', backgroundColor: '#002349' }}
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

                {/* Top Bar - Identity - REMOVED (Merged into Channel) */}

                {/* Top Navigation Buttons - Minimal & Toned Down */}
                <div
                    className="w-full flex justify-between items-center z-10 gap-4 p-4 overflow-hidden cursor-pointer active:scale-95 transition-transform"
                    onClick={toggleCategories}
                >
                    {/* Sotheby's Logo - Circular */}
                    <div className="w-12 h-12 rounded-full bg-white flex-shrink-0 overflow-hidden shadow-sm opacity-80 border border-white/5 flex items-center justify-center p-2">
                        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="140" fontFamily="serif" fontWeight="bold" fill="#002349">S</text>
                        </svg>
                    </div>

                    {/* Title - Channel Name & Scrolling Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden">
                        <div className="flex items-center justify-between mb-1">
                            <motion.span
                                className="text-white/50 text-[10px] uppercase tracking-[0.2em]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {currentChannel.category} CHANNEL
                            </motion.span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCategories();
                                }}
                                className="w-2 h-2 rounded border border-white/10 flex items-center justify-center flex-shrink-0 bg-transparent"
                            >
                                <Menu size={16} className="text-white" strokeWidth={2} />
                            </button>
                        </div>

                        {/* Marquee Container */}
                        <div className="relative w-full overflow-hidden h-6 mask-linear-fade">
                            <motion.div
                                className="whitespace-nowrap inline-block"
                                animate={{ x: isPlaying ? [0, -1000] : 0 }}
                                transition={{
                                    x: {
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        duration: 20,
                                        ease: "linear",
                                    }
                                }}
                                style={{
                                    animationPlayState: isPlaying ? "running" : "paused" // Fallback / reinforcement
                                }}
                            >
                                <span className="text-white text-base font-serif-luxury italic tracking-wide mr-8">
                                    {currentChannel.content}
                                </span>
                                <span className="text-white text-base font-serif-luxury italic tracking-wide mr-8">
                                    {currentChannel.content}
                                </span>
                                <span className="text-white text-base font-serif-luxury italic tracking-wide mr-8">
                                    {currentChannel.content}
                                </span>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Category Menu - Slide in from right */}
                {showCategories && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleCategories}
                        />

                        {/* Category Panel */}
                        <motion.div
                            className="fixed top-0 right-0 h-full w-80 z-50 backdrop-blur-[20px] bg-[rgba(60,50,80,0.95)] border-l border-white/10 shadow-2xl"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <div className="flex flex-col h-full pt-6">
                                {/* Header */}
                                <div className="flex justify-between items-center px-6 pb-6 border-b border-white/10">
                                    <h2 className="text-white text-lg font-medium">Categories</h2>
                                    <button
                                        onClick={toggleCategories}
                                        className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                                    >
                                        <X size={16} className="text-white" />
                                    </button>
                                </div>

                                {/* Category List */}
                                <div className="flex-1 overflow-y-auto px-6 py-6">
                                    <div className="space-y-2">
                                        {CHANNELS.map((channel, index) => (
                                            <motion.button
                                                key={channel.category}
                                                className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => handleCategorySelect(index)}
                                            >
                                                <span className="text-white text-sm font-medium">{channel.category}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}


                {/* Top Bar - Identity - MORE PROMINENT */}
                {/* Top Bar - Identity - MOVED TO TOP */}

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
                </div>

                {/* Content Title - Now Playing (MOVED UP) */}

                {/* Bottom Controls - Identity Bar (Heavy Glass) */}
                <motion.div
                    className="w-full h-16 rounded-full flex items-center justify-between px-2 backdrop-blur-[20px] bg-white/5 border border-white/10 z-20 cursor-pointer overflow-hidden relative group"
                    style={{
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        marginTop: '20px'
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
                                src="/images/james_avatar.jpg"
                                alt="James"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-xs font-medium tracking-wide">James Edition</span>
                            {/* <div className="flex items-center space-x-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                <span className="text-white/60 text-[10px] uppercase tracking-wider">Online Now</span>
                            </div> */}
                        </div>
                    </div>

                    {/* Contact me Button with Golden Shimmer */}
                    <div className="relative overflow-hidden rounded-full cursor-pointer" onClick={handleContactClick}>
                        <div className="w-48 h-10 rounded-full flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: '#C29B40' }}>
                            <span className="text-white text-sm font-bold font-serif italic">Contact me</span>
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

            {/* Contact Modal */}
            {showContactModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowContactModal(false)}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative z-10 bg-[#002349]/95 backdrop-blur-xl rounded-2xl p-6 md:p-8 w-full max-w-sm shadow-2xl border border-white/10"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            {/* Success Icon */}
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#C29B40]/20 flex items-center justify-center mb-1">
                                <svg className="w-7 h-7 md:w-8 md:h-8 text-[#C29B40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            {/* Message */}
                            <p className="text-white text-base md:text-lg font-medium leading-relaxed px-2">
                                Thanks for your email. We&apos;ve received it and will reach out shortly.
                            </p>

                            {/* Close Button */}
                            <button
                                onClick={() => setShowContactModal(false)}
                                className="mt-2 px-8 py-2.5 rounded-full bg-[#C29B40] text-white text-sm font-bold hover:bg-[#C29B40]/90 transition-colors w-full md:w-auto"
                            >
                                OK
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}
