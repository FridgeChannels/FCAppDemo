'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface RippleTriggerProps {
    isActive: boolean;
}

export function RippleTrigger({ isActive }: RippleTriggerProps) {
    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="rounded-full bg-white/20 blur-xl"
                        initial={{ width: 0, height: 0, opacity: 0.3 }}
                        animate={{
                            width: '120vmax',
                            height: '120vmax',
                            opacity: 0
                        }}
                        transition={{
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1] as const, // "Water drop" feel
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
