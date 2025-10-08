"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StickyNote, ListChecks, PenSquare, Wind } from "lucide-react";
import NotesSection from '@/components/notes-section';
import TasksSection from '@/components/tasks-section';
import CanvasSection from '@/components/canvas-section';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-background to-slate-900">
      <div className="w-full max-w-7xl mx-auto bg-card/60 backdrop-blur-2xl border border-border/30 rounded-2xl shadow-2xl overflow-hidden">
        <Tabs defaultValue="notes" className="w-full">
          <div className="flex flex-wrap items-center justify-between p-4 border-b border-border/30 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Wind className="text-primary h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Nebula Canvas</h1>
            </div>
            <TabsList className="bg-background/70 rounded-lg p-1">
              <TabsTrigger value="notes" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground">
                <StickyNote className="h-4 w-4" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="tasks" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground">
                <ListChecks className="h-4 w-4" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="canvas" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground">
                <PenSquare className="h-4 w-4" />
                Canvas
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="notes" className="p-4 sm:p-6 min-h-[75vh]">
            <NotesSection />
          </TabsContent>
          <TabsContent value="tasks" className="p-4 sm:p-6 min-h-[75vh]">
            <TasksSection />
          </TabsContent>
          <TabsContent value="canvas" className="p-4 sm:p-6 min-h-[75vh]">
            <CanvasSection />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
