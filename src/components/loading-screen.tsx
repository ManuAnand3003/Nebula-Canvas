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
          className="fixed inset-0 bg-gradient-to-br from-[#0B0F19] via-[#121212] to-[#0B0F19] flex flex-col items-center justify-center text-[#b5b5ff] z-50"
        >
          <div className="w-20 h-20 rounded-full border-4 border-white/30 border-t-primary animate-spin mb-4"></div>
          <p className="text-lg tracking-wider">Calibrating your cosmos...</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
