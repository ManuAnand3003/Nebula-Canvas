"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoaded: () => void;
}

export default function LoadingScreen({ onLoaded }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Calls onLoaded after the fade-out animation completes
      setTimeout(onLoaded, 500);
    }, 1200);

    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 bg-gradient-to-br from-[#06060c] via-[#071021] to-[#020214] flex flex-col items-center justify-center text-[#dbe1ff] z-50"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="relative flex flex-col items-center justify-center gap-6">
            {/* twinkling background stars */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute w-1 h-1 bg-white/90 rounded-full left-1/4 top-1/6 opacity-60 animate-pulse" />
              <div className="absolute w-0.5 h-0.5 bg-white/85 rounded-full left-3/4 top-1/4 opacity-50 animate-ping-slow" />
              <div className="absolute w-1 h-1 bg-white/80 rounded-full left-5/8 top-3/4 opacity-50 animate-pulse delay-200" />
              <div className="absolute w-0.5 h-0.5 bg-white/70 rounded-full left-1/6 top-2/3 opacity-40 animate-ping-slow delay-100" />
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-white/6 blur-sm animate-spin-slow" />
              <div className="absolute inset-6 rounded-full border-2 border-white/8 opacity-60 animate-spin-slower" />
              <div className="absolute inset-12 rounded-full bg-gradient-to-br from-[#7dd3fc]/10 to-transparent blur-2xl" />

              <div className="relative w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_12px_rgba(99,102,241,0.6)] animate-pulse" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Nebula Canvas
                <span className="block text-sm text-white/70 mt-2 animate-pulse">Warming up the cosmos</span>
              </h2>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
