"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardPage from '@/app/dashboard/page';

export default function Home() {
  const [isDiving, setIsDiving] = useState(false);
  const router = useRouter();

  const handleDiveIn = () => {
    setIsDiving(true);
    // Wait for animation to start before navigating
    setTimeout(() => {
      router.push('/dashboard');
    }, 500); // Should match the fade-out animation duration
  };

  return (
      <AnimatePresence>
        {!isDiving ? (
          <motion.main
            key="intro"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
            className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-[#0B0F19] via-[#121212] to-[#0B0F19] animate-nebula-flow"
          >
            <div className="flex flex-col items-center justify-center text-center animate-dive-in">
                <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-lg">
                    Nebula Desk
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-300/80">Your cosmic productivity hub.</p>
                <Button 
                    onClick={handleDiveIn}
                    className="mt-12 px-8 py-6 text-lg font-semibold text-white bg-primary/20 border-2 border-primary/50 rounded-full shadow-[0_0_20px_theme(colors.primary/50%)] hover:bg-primary/30 hover:border-primary/80 hover:shadow-[0_0_30px_theme(colors.primary/70%)] transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                    Dive In
                </Button>
            </div>
          </motion.main>
        ) : null}
      </AnimatePresence>
  );
}
