'use client';

import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

interface SwipeIndicatorProps {
    isVisible: boolean;
}

export function SwipeIndicator({ isVisible }: SwipeIndicatorProps) {
    return (
        <motion.div
            className="absolute bottom-20 left-0 right-0 flex flex-col items-center justify-center pointer-events-none z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center text-white/50"
            >
                <ChevronUp className="w-6 h-6 mb-1" />
                <span className="text-[10px] tracking-[0.2em] uppercase font-light">Swipe to Open</span>
            </motion.div>
        </motion.div>
    );
}
