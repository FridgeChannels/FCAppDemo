'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, ChevronRight, Phone, Mail, FileText } from 'lucide-react';

interface CuratorCTAProps {
    isVisible: boolean; // Triggered by 60% scroll
}

export function CuratorCTA({ isVisible }: CuratorCTAProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Floating Entry Card (The Reciprocity Trigger) */}
            <AnimatePresence>
                {isVisible && !isOpen && (
                    <motion.div
                        className="fixed bottom-8 left-6 right-6 z-50"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div
                            className="bg-[#1A1A1A] text-white p-5 shadow-2xl rounded-sm border-l-2 border-[#B89B5E] cursor-pointer flex items-center justify-between group"
                            onClick={() => setIsOpen(true)}
                        >
                            <div className="flex flex-col">
                                <span className="text-[10px] tracking-widest text-[#B89B5E] uppercase mb-1">Curator&apos;s Note</span>
                                <span className="font-serif-luxury text-sm tracking-wide">James has prepared the liquidity report for this asset.</span>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <ChevronRight size={14} className="text-white/60" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Half-sheet Popup */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Sheet */}
                        <motion.div
                            className="fixed bottom-0 left-0 right-0 bg-[#F9F9F9] z-[70] rounded-t-2xl overflow-hidden pb-safe"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-300 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-gray-500 to-gray-300" />
                                        </div>
                                        <div>
                                            <h3 className="font-serif-luxury text-lg text-[#1A1A1A]">James Anderson</h3>
                                            <p className="text-[#707070] text-xs tracking-widest uppercase">Senior Partner, Sotheby&apos;s</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 rounded-full text-[#1A1A1A]">
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 shadow-sm rounded-xl active:scale-98 transition-transform">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-[#B89B5E]/10 rounded-full text-[#B89B5E]">
                                                <FileText size={18} />
                                            </div>
                                            <span className="text-[#1A1A1A] font-medium text-sm text-left">Request Full Liquidity Report</span>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-300" />
                                    </button>

                                    <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 shadow-sm rounded-xl active:scale-98 transition-transform">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-gray-100 rounded-full text-[#1A1A1A]">
                                                <Mail size={18} />
                                            </div>
                                            <span className="text-[#1A1A1A] font-medium text-sm text-left">Private Inquiry</span>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-300" />
                                    </button>

                                    <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 shadow-sm rounded-xl active:scale-98 transition-transform">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-gray-100 rounded-full text-[#1A1A1A]">
                                                <Phone size={18} />
                                            </div>
                                            <span className="text-[#1A1A1A] font-medium text-sm text-left">Schedule a Call</span>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-300" />
                                    </button>
                                </div>

                                <div className="mt-8 text-center">
                                    <p className="text-[10px] text-[#B89B5E] tracking-widest uppercase opacity-60">Sotheby&apos;s International Realty</p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
