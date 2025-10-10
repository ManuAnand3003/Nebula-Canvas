"use client";

import { useRouter } from 'next/navigation';
import { StickyNote, ListChecks, PenSquare, Plus, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

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

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const sections = [
    {
      title: "Notes",
      description: "Capture your thoughts",
      icon: StickyNote,
      path: "/dashboard/notes",
      color: "text-purple-400",
    },
    {
      title: "Tasks",
      description: "Organize your life",
      icon: ListChecks,
      path: "/dashboard/tasks",
      color: "text-cyan-400",
    },
    {
      title: "Canvas",
      description: "Unleash your creativity",
      icon: PenSquare,
      path: "/dashboard/canvas",
      color: "text-pink-400",
    },
  ];

  const fabItems = [
    { icon: StickyNote, path: '/dashboard/notes', angle: -60, label: 'Note' },
    { icon: ListChecks, path: '/dashboard/tasks', angle: 0, label: 'Task' },
    { icon: PenSquare, path: '/dashboard/canvas', angle: 60, label: 'Canvas' },
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }}
      exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }}
      className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-background via-[#121212] to-background animate-nebula-flow"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2, ease: "easeOut" } }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          Workspace
        </h1>
        <p className="mt-3 text-lg text-gray-400/80">Choose your destination</p>
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
            <Card className="bg-card/50 backdrop-blur-xl border border-border/20 h-full rounded-2xl shadow-lg hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300">
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
                <div className="h-32 rounded-lg bg-background/40 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground italic">Preview coming soon...</p>
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
              className="h-20 w-20 rounded-full bg-primary/20 border-2 border-primary/50 shadow-[0_0_20px_theme(colors.primary/50%)] hover:bg-primary/30 hover:shadow-[0_0_30px_theme(colors.primary/70%)] transition-all duration-300 ease-in-out flex items-center justify-center"
              aria-expanded={isCreateMenuOpen}
            >
              <motion.div
                 animate={{ rotate: isCreateMenuOpen ? 45 : 0 }}
                 transition={{ duration: 0.3 }}
              >
                <Plus className="h-10 w-10 text-white" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}
