'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface MagnetContentProps {
    author: string;
    time: string;
    contentHtml: string;
}

export function MagnetContent({ author, time, contentHtml }: MagnetContentProps) {
    return (
        <div className="relative z-20 bg-[#F9F9F9] text-[#000000] pb-24">
            <div className="max-w-xl mx-auto px-6 pt-16 sm:pt-24">
                {/* Content is injected here */}
            </div>
        </div>
    );
}
