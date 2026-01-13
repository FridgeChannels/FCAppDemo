'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface DepthReadingProps {
    onScrollProgress: (progress: number) => void;
}

export function DepthReading({ onScrollProgress }: DepthReadingProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    // Report scroll progress for CTA trigger
    scrollYProgress.on('change', (latest) => {
        onScrollProgress(latest);
    });

    // Parallax: Image moves slower than text (0.8x speed relative to scroll essentially)
    const imageY = useTransform(scrollYProgress, [0, 1], [0, 100]);

    return (
        <div ref={containerRef} className="relative w-full min-h-[200vh] bg-[#F9F9F9] text-[#1A1A1A] pb-32">
            <div className="max-w-2xl mx-auto px-6 pt-32 grid grid-cols-12 gap-4">

                {/* Asymmetric Header */}
                <div className="col-span-8 mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-serif-luxury text-4xl leading-tight tracking-wide mb-6"
                    >
                        The Architecture of<br /><span className="italic text-[#707070]">Silent Luxury</span>
                    </motion.h2>
                    <div className="w-16 h-[1px] bg-[#B89B5E]" />
                </div>

                {/* Content Block 1: Market Signal */}
                <div className="col-span-12 md:col-span-7 mb-16 space-y-6">
                    <h3 className="text-xs font-bold tracking-[0.2em] text-[#B89B5E] uppercase">Market Signal</h3>
                    <p className="font-serif-luxury text-lg leading-loose text-[#1A1A1A]">
                        In Q4 2024, we observed a 14% shift in ultra-high-net-worth capital moving towards &quot;turnkey privacy&quot;. The demand isn&apos;t just for space, but for curated seclusion.
                    </p>
                    <p className="font-serif-luxury text-lg leading-loose text-[#707070]">
                        This property represents a rare asset class: historically significant, yet fully modernized for the digital nomad elite.
                    </p>
                </div>

                {/* Parallax Image Block */}
                <div className="col-span-12 md:col-start-5 md:col-span-8 mb-24 relative h-[400px] overflow-hidden rounded-sm">
                    <motion.div style={{ y: imageY }} className="absolute inset-0 bg-neutral-200">
                        {/* Placeholder for Paralax Image */}
                        <div className="w-full h-[120%] bg-gradient-to-b from-gray-300 to-gray-400" />
                        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-3 py-1">
                            <span className="text-[9px] tracking-widest uppercase text-black">Fig 1.0 — Private Estate</span>
                        </div>
                    </motion.div>
                </div>

                {/* Content Block 2: Design Detail */}
                <div className="col-span-12 md:col-span-7 mb-16 space-y-6">
                    <h3 className="text-xs font-bold tracking-[0.2em] text-[#B89B5E] uppercase">Design Detail</h3>
                    <ul className="space-y-4 font-serif-luxury text-lg text-[#1A1A1A]">
                        <li className="flex items-start">
                            <span className="mr-4 text-[#B89B5E] text-sm mt-1">01</span>
                            <span>Uses local limestone to maintain thermal equilibrium without artificial cooling.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-4 text-[#B89B5E] text-sm mt-1">02</span>
                            <span>Soundproofed master suite with independent acoustic isolation.</span>
                        </li>
                    </ul>
                </div>

                {/* Content Block 3: Privileged Access */}
                <div className="col-span-12 md:col-start-4 md:col-span-8 mb-32 space-y-6">
                    <h3 className="text-xs font-bold tracking-[0.2em] text-[#B89B5E] uppercase">Privileged Access</h3>
                    <p className="font-serif-luxury text-xl italic text-[#1A1A1A] leading-relaxed">
                        &quot;Access to this estate is currently restricted to pre-qualified buyers. Our team holds the exclusive key for private viewings this season.&quot;
                    </p>
                </div>

            </div>
        </div>
    );
}
