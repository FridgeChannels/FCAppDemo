'use client';

import { motion } from 'framer-motion';

interface ContentLayerProps {
    isVisible: boolean; // Corresponds to entering Phase 3
    isActive: boolean;  // Corresponds to Phase 4 (fully active, audio playing)
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0, filter: 'blur(10px)' },
    visible: {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        transition: {
            duration: 1.0, // Slower for luxury feel
            ease: [0.22, 1, 0.36, 1] as const,
        }
    },
};

const coverZoomVariants = {
    hidden: { scale: 1.0 },
    visible: {
        scale: 1.05,
        transition: {
            duration: 10, // Very slow "Cinemagraph" feel
            ease: "linear" as const,
            repeat: Infinity,
            repeatType: "reverse" as const, // Or just mirror
        }
    }
};

export function ContentLayer({ isVisible, isActive }: ContentLayerProps) {
    // We use `isVisible` to trigger the container entrance.
    // `isActive` could be used for the next level details like audio bars moving.

    if (!isVisible) return null;

    return (
        <motion.div
            className="absolute inset-x-0 top-[200px] bottom-0 z-30 px-6 flex flex-col justify-start space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Cover Art / Main Visual */}
            <motion.div variants={itemVariants} className="w-full aspect-square bg-[#F9F9F9]/5 rounded-sm overflow-hidden relative shadow-2xl border border-white/5">
                <motion.div
                    className="absolute inset-0 bg-neutral-800" // Placeholder for image
                    variants={coverZoomVariants}
                >
                    {/* Actual Image would go here with object-fit: cover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent mix-blend-overlay" />
                </motion.div>

                <div className="absolute bottom-6 left-6 z-10">
                    <p className="text-[#707070] text-[10px] tracking-[0.2em] uppercase mb-2">Exclusive Preview</p>
                    <h3 className="text-white text-3xl font-serif-luxury tracking-wide">Midnight Service</h3>
                </div>
            </motion.div>

            {/* Track Info (Staggered Text) */}
            <div className="space-y-6 pt-4">
                <motion.div variants={itemVariants} className="flex flex-col space-y-2">
                    <div className="h-[1px] w-12 bg-[#B89B5E]" /> {/* Gold accent line */}
                    <p className="text-white font-serif-luxury text-lg tracking-wider">The Penthouse Collection</p>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                    <p className="text-[#707070] text-xs tracking-widest leading-relaxed max-w-[80%]">
                        EXPERIENCE THE PINNACLE OF MODERN LIVING. WHERE LIGHT MEETS ARCHITECTURE IN PERFECT HARMONY.
                    </p>
                </motion.div>
            </div>

            {/* Audio Visualizer (Simulation) */}
            <motion.div variants={itemVariants} className="flex items-end justify-center space-x-1 h-12 pt-4">
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-1 bg-white/80 rounded-full"
                        animate={isActive ? {
                            height: [10, 20 + Math.random() * 20, 10],
                        } : { height: 4 }}
                        transition={{
                            repeat: Infinity,
                            duration: 1 + Math.random(),
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </motion.div>

            {/* Signature */}
            <motion.div
                variants={itemVariants}
                className="mt-auto pb-safe flex justify-center opacity-80"
            >
                <p className="text-[#B89B5E] text-[10px] tracking-[0.3em] font-light uppercase border-b border-[#B89B5E]/30 pb-1">Fridge Channels</p>
            </motion.div>
        </motion.div>
    );
}
