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
        >
          <div className="relative w-36 h-36 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-white/8 loading-ring"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 4.2, ease: 'linear' }}
              className="absolute inset-4 rounded-full border-2 border-white/12 loading-ring"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }}
              className="absolute inset-8 rounded-full border-2 border-white/16 loading-ring"
            />

            <div className="absolute inset-12 rounded-full bg-gradient-to-br from-purple-600/40 via-indigo-600/30 to-transparent blur-xl opacity-80" />

            {/* twinkling stars */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="loading-star" style={{ left: '18%', top: '26%', width: 4, height: 4 }} />
              <div className="loading-star" style={{ left: '72%', top: '36%', width: 3, height: 3 }} />
              <div className="loading-star" style={{ left: '44%', top: '72%', width: 5, height: 5 }} />
            </div>
          </div>

          <h2 className="text-2xl font-extrabold tracking-wide shimmer-text mb-2">Nebula Canvas</h2>
          <p className="text-lg tracking-wider opacity-90">Calibrating your cosmos...</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
