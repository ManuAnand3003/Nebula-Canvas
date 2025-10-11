"use client";

import { useRouter } from 'next/navigation';
import { StickyNote, ListChecks, PenSquare, Plus, AudioLines } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LoadingScreen from '@/components/loading-screen';

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15 + 0.5,
      duration: 0.6,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
  hover: {
    scale: 1.04,
    y: -5,
    transition: { type: 'spring', stiffness: 300, damping: 15 }
  }
};


export default function DashboardPage() {
  const router = useRouter();
  const [isCreateMenuOpen, setCreateMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    // Set initial theme from localStorage
    const savedTheme = localStorage.getItem('nebulaTheme') || 'dark';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');

    const savedMusicPref = localStorage.getItem('music') === 'on';
    setIsMusicPlaying(savedMusicPref);
    
    if (savedMusicPref && audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio autoplay was prevented.", e));
    }

  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); 

    let user = localStorage.getItem('nebulaUser');
    if (!user) {
      user = prompt('Hey, what should I call you?');
      if (user) {
        localStorage.setItem('nebulaUser', user);
      } else {
        user = 'dreamer';
      }
    }

    const getGreetingMessage = (name: string) => {
      const hour = new Date().getHours();
      if (hour < 12) return `Good morning, ${name} ☀️`;
      if (hour < 18) return `Good afternoon, ${name} 🌤️`;
      return `Welcome back, ${name} 🌙`;
    };

    setGreeting(getGreetingMessage(user));
    
    return () => clearTimeout(timer);
  }, []);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const toggleMusic = () => {
    const musicIsOn = !isMusicPlaying;
    setIsMusicPlaying(musicIsOn);
    localStorage.setItem('music', musicIsOn ? 'on' : 'off');
    if (musicIsOn) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  };

  const sections = [
    {
      title: "Notes",
      description: "Capture your thoughts",
      icon: StickyNote,
      path: "/dashboard/notes",
      color: "text-purple-400",
      gradient: "from-purple-500/10 to-background",
    },
    {
      title: "Tasks",
      description: "Organize your life",
      icon: ListChecks,
      path: "/dashboard/tasks",
      color: "text-cyan-400",
      gradient: "from-cyan-500/10 to-background",
    },
    {
      title: "Canvas",
      description: "Unleash your creativity",
      icon: PenSquare,
      path: "/dashboard/canvas",
      color: "text-pink-400",
      gradient: "from-pink-500/10 to-background",
    },
  ];

  const fabItems = [
    { icon: StickyNote, path: '/dashboard/notes', angle: -60, label: 'Note' },
    { icon: ListChecks, path: '/dashboard/tasks', angle: 0, label: 'Task' },
    { icon: PenSquare, path: '/dashboard/canvas', angle: 60, label: 'Canvas' },
  ];

  if (isLoading) {
    return <LoadingScreen onLoaded={() => setIsLoading(false)} />;
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }}
      exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }}
      className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gradient-to-br from-background via-background/80 to-background animate-nebula-flow"
    >
      
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMusic}
          className="rounded-full shadow-lg bg-card/70 backdrop-blur-xl border-border/30"
          aria-label="Toggle background music"
        >
          <AudioLines className={cn("h-5 w-5 transition-all", isMusicPlaying ? "animate-audio-wave" : "")} />
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2, ease: "easeOut" } }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-pink-400 to-primary/80 animate-fade-in-down opacity-0">
          {greeting}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground/80">Choose your destination</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            onClick={() => navigateTo(section.path)}
            className="cursor-pointer"
          >
            <Card className="bg-card/50 backdrop-blur-xl border border-border/20 h-full rounded-2xl shadow-lg hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300 overflow-hidden">
              <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
                <div className={`p-3 bg-primary/10 rounded-xl ${section.color}`}>
                  <section.icon className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground">{section.title}</CardTitle>
                  <CardDescription className="text-muted-foreground/80">{section.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className={cn("h-32 rounded-lg bg-gradient-to-br flex items-center justify-center relative overflow-hidden", section.gradient)}>
                   <div className="absolute inset-0 bg-repeat-x bg-center opacity-20 animate-nebula-flow" style={{backgroundImage: 'linear-gradient(90deg, hsla(var(--foreground)/0.05) 1px, transparent 1px), linear-gradient(0deg, hsla(var(--foreground)/0.05) 1px, transparent 1px)', backgroundSize: '20px 20px'}}/>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="fixed bottom-10">
        <div className="relative flex items-center justify-center">
          <AnimatePresence>
            {isCreateMenuOpen &&
              fabItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0, y: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: -100,
                    rotate: item.angle,
                    transition: {
                      type: 'spring',
                      stiffness: 260,
                      damping: 15,
                      delay: index * 0.05,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0,
                    y: 0,
                    transition: { duration: 0.2, ease: 'easeIn' },
                  }}
                  style={{ 
                    position: 'absolute',
                    transformOrigin: 'bottom center'
                  }}
                >
                  <motion.div
                     style={{
                        transformOrigin: 'top center',
                        rotate: -item.angle
                     }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-14 w-14 bg-card/70 backdrop-blur-xl border-border/30"
                      onClick={() => {
                        navigateTo(item.path);
                        setCreateMenuOpen(false);
                      }}
                      aria-label={`Create ${item.label}`}
                    >
                      <item.icon className="h-6 w-6" />
                    </Button>
                  </motion.div>
                </motion.div>
              ))}
          </AnimatePresence>

          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              onClick={() => setCreateMenuOpen(!isCreateMenuOpen)}
              className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/50 border-2 border-primary/50 shadow-[0_0_20px_theme(colors.primary/50%)] hover:bg-primary/40 hover:shadow-[0_0_30px_theme(colors.primary/70%)] transition-all duration-300 ease-in-out flex flex-col items-center justify-center pt-2"
              aria-expanded={isCreateMenuOpen}
            >
              <motion.div
                 animate={{ rotate: isCreateMenuOpen ? 45 : 0 }}
                 transition={{ duration: 0.3 }}
              >
                <Plus className="h-8 w-8 text-white" />
              </motion.div>
              <span className="font-cursive text-xl text-white pointer-events-none -mt-1">Create</span>
            </Button>
          </motion.div>
        </div>
      </div>
      <audio
        ref={audioRef}
        loop
        src="/sounds/nebula-music.mp3"
      />
    </motion.main>
  );
}
