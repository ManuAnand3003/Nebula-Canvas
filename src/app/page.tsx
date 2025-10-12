"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Hero from '@/components/hero';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [isDiving, setIsDiving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Set initial theme from localStorage
    const savedTheme = localStorage.getItem('nebulaTheme') || 'dark';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

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
            className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-transparent animate-nebula-flow"
          >
            <Hero />
            <div className="absolute inset-0 bg-black/40 -z-5 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center justify-center text-center animate-dive-in w-full px-6">
              <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300 drop-shadow-2xl">Nebula Canvas</h1>
              <p className="mt-4 text-xl md:text-2xl text-white/80 max-w-2xl">Your cosmic productivity hub — notes, tasks and drawing, all in one orbit.</p>

              <div className="mt-10">
                <Button 
                  onClick={handleDiveIn}
                  className="px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary/90 border-2 border-primary/50 rounded-full shadow-[0_0_20px_theme(colors.primary/50%)] hover:bg-primary hover:border-primary/80 hover:shadow-[0_0_30px_theme(colors.primary/70%)] transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Dive In
                </Button>
              </div>
            </div>
          </motion.main>
        ) : null}
      </AnimatePresence>
  );
}
