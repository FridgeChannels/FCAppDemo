'use client';

import { motion } from 'framer-motion';
import { X, MicOff, Pause, Play, Bookmark } from 'lucide-react';
import { useState } from 'react';

export default function ShowViewPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showShimmer, setShowShimmer] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['Tech News', 'Sport', 'Lifestyle', 'Business', 'Entertainment', 'Science', 'Travel', 'Food'];

  // Category to title mapping
  const categoryTitles: Record<string, string> = {
    'Tech News': 'Innovation Frontier: The Latest in Technology and Digital Transformation',
    'Sport': 'Athletic Excellence: Champions, Records, and Sporting Legends',
    'Lifestyle': 'Château Excellence: A Legacy of Terroir and Tradition',
    'Business': 'Market Insights: Strategic Leadership and Global Commerce',
    'Entertainment': 'Cultural Spotlight: Arts, Media, and Creative Expression',
    'Science': 'Discovery Channel: Breakthroughs in Research and Innovation',
    'Travel': 'Wanderlust Chronicles: Destinations, Cultures, and Adventures',
    'Food': 'Culinary Arts: Fine Dining, Recipes, and Gastronomic Journeys'
  };

  // Get current title based on selected category
  const currentTitle = selectedCategory
    ? categoryTitles[selectedCategory]
    : 'Château Excellence: A Legacy of Terroir and Tradition';

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleScrollToRead = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategories(false);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Gradient Background - Soft blur effect */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(180, 120, 180, 0.85), rgba(80, 60, 100, 0.95))',
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        }}
      />

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
                  {categories.map((category, index) => (
                    <motion.button
                      key={category}
                      className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleCategorySelect(category)}
                    >
                      <span className="text-white text-sm font-medium">{category}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col h-screen pt-6 pb-24 px-6">
        {/* Top Navigation Buttons */}
        <div className="flex justify-between items-start mb-6">
          <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-[20px] flex items-center justify-center border border-white/10">
            <X size={18} className="text-white" strokeWidth={2} />
          </button>
          <button
            onClick={toggleCategories}
            className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-[20px] border border-white/10"
          >
            <span className="text-white text-sm font-medium">All category</span>
          </button>
        </div>

        {/* Info Card */}
        <motion.div
          className="w-full rounded-2xl backdrop-blur-[20px] bg-[rgba(60,50,80,0.65)] border border-white/10 p-4 mb-6 flex items-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Thumbnail */}
          <div className="w-20 h-20 rounded-xl bg-[#F5E6E6] flex-shrink-0 overflow-hidden shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 via-green-400 to-purple-500" />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <motion.h3
              className="text-white text-base font-medium leading-tight mb-1.5"
              key={selectedCategory || 'default'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentTitle}
            </motion.h3>
          </div>

          {/* Bookmark Icon */}
          <button className="flex-shrink-0 p-1">
            <Bookmark size={20} className="text-white" strokeWidth={1.5} fill="none" />
          </button>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          className="w-full rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ minHeight: '400px' }}
        >
          {/* Abstract Object - 3D Bubble Surface */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-72 h-72">
              {/* Base shape with gradient */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400 via-green-400 via-yellow-400 to-purple-500 opacity-90"
                style={{
                  filter: 'blur(1px)',
                  transform: 'perspective(1000px) rotateX(5deg) rotateY(-5deg)'
                }}
              />

              {/* 3D Bubble Elements - Multiple layers for depth */}
              {/* Large bubbles */}
              <div className="absolute top-8 left-12 w-20 h-20 rounded-full bg-gradient-to-br from-blue-300 to-cyan-400 shadow-[0_8px_16px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.3)]"
                style={{ transform: 'translateZ(10px)' }}
              />
              <div className="absolute top-16 right-16 w-24 h-24 rounded-full bg-gradient-to-br from-green-300 to-emerald-400 shadow-[0_8px_16px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.3)]"
                style={{ transform: 'translateZ(15px)' }}
              />
              <div className="absolute bottom-20 left-20 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow-[0_8px_16px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.3)]"
                style={{ transform: 'translateZ(8px)' }}
              />
              <div className="absolute bottom-12 right-12 w-16 h-16 rounded-full bg-gradient-to-br from-purple-300 to-pink-400 shadow-[0_8px_16px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.3)]"
                style={{ transform: 'translateZ(12px)' }}
              />

              {/* Medium bubbles */}
              <div className="absolute top-32 left-24 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-300 to-blue-400 shadow-[0_4px_8px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.4)]"
                style={{ transform: 'translateZ(5px)' }}
              />
              <div className="absolute top-40 right-28 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-300 to-green-400 shadow-[0_4px_8px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.4)]"
                style={{ transform: 'translateZ(7px)' }}
              />
              <div className="absolute bottom-32 left-32 w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-yellow-400 shadow-[0_4px_8px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.4)]"
                style={{ transform: 'translateZ(6px)' }}
              />

              {/* Small bubbles for texture */}
              <div className="absolute top-24 left-40 w-8 h-8 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.5)]" />
              <div className="absolute top-48 right-20 w-6 h-6 rounded-full bg-gradient-to-br from-blue-200 to-cyan-300 shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.5)]" />
              <div className="absolute bottom-40 right-36 w-7 h-7 rounded-full bg-gradient-to-br from-green-200 to-emerald-300 shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.5)]" />
              <div className="absolute bottom-28 left-48 w-9 h-9 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.5)]" />

              {/* Center focal bubble */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 shadow-[0_12px_24px_rgba(0,0,0,0.3),inset_0_3px_6px_rgba(255,255,255,0.4)]"
                style={{ transform: 'translate(-50%, -50%) translateZ(20px)' }}
              />

              {/* Highlight/Shine effect */}
              <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-white/20 blur-xl" />
            </div>
          </div>
        </motion.div>

        {/* Control Bar */}
        <motion.div
          className="flex items-center justify-between w-full mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Speed Control */}
          <button className="flex-1 h-12 rounded-full bg-white/20 backdrop-blur-[20px] border border-white/10 flex items-center justify-center">
            <span className="text-white text-sm font-medium">{playbackSpeed}x</span>
          </button>

          {/* Join Button */}
          <button className="px-8 py-3 rounded-full bg-white flex items-center space-x-2 shadow-lg">
            <MicOff size={18} className="text-gray-800" strokeWidth={2} />
            <span className="text-gray-800 text-sm font-medium">Join</span>
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-[20px] border border-white/10 flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause size={18} className="text-white" strokeWidth={2} />
            ) : (
              <Play size={18} className="text-white ml-0.5" strokeWidth={2} />
            )}
          </button>
        </motion.div>

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
          onClick={handleScrollToRead}
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
              <span className="text-black text-xs font-medium tracking-wide">James Edition</span>
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-black/60 text-[10px] uppercase tracking-wider">Online Now</span>
              </div>
            </div>
          </div>

          {/* Contact me Button with Golden Shimmer */}
          <div className="relative overflow-hidden rounded-full">
            <div className="w-40 h-10 rounded-full flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: '#002349' }}>
              <span className="text-white text-sm font-bold font-serif italic pr-0.5">Contact me</span>
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
      </div>
    </div>
  );
}
