'use client';

import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cnLocal(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Logo SVG Component
function FCLogo({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="4" />
            <path d="M50 20V80" stroke="currentColor" strokeWidth="4" />
            <path d="M20 50H80" stroke="currentColor" strokeWidth="4" />
            {/* Simulation of serif detail */}
            <path d="M40 20H60" stroke="currentColor" strokeWidth="2" />
            <path d="M40 80H60" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

interface IdentityLogoProps {
    state: 'hidden' | 'reveal' | 'move-up';
    yOffset?: number; // Allow external control of Y offset (e.g. for drag)
}

export function IdentityLogo({ state, yOffset = 0 }: IdentityLogoProps) {
    const isRevealed = state !== 'hidden';
    const isMovingUp = state === 'move-up';

    // Base Y Position: Center (0) or Top (-30vh)
    // We add the external yOffset (drag) to this base.
    const numericBaseY = isMovingUp ? -250 : 0;

    return (
        <motion.div
            className="flex items-center justify-center pointer-events-none relative z-50 origin-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
                opacity: isRevealed ? 1 : 0,
                scale: isRevealed ? 1 : 0.95,
                y: isMovingUp
                    ? numericBaseY + yOffset
                    : (state === 'reveal' ? [yOffset, yOffset - 15, yOffset] : yOffset),
            }}
            transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1], // The core curve
                y: state === 'reveal' ? { duration: 2.0, repeat: Infinity, ease: "easeInOut" } : { duration: 0.8 }
            }}
        >
            <div className="relative w-32 h-32 text-white">
                <FCLogo className="w-full h-full" />

                {/* Shimmer Effect - Silk-like light sweep */}
                {!isMovingUp && isRevealed && (
                    <motion.div
                        className="absolute inset-0 z-10"
                        initial={{ x: '-150%' }}
                        animate={{ x: '150%' }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 1.5,
                            ease: "easeInOut"
                        }}
                    >
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-[#B89B5E]/40 to-transparent skew-x-12 blur-sm" />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
