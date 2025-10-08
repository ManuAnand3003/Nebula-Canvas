"use client";

import { useState, useMemo } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, ListChecks } from 'lucide-react';

type Task = {
  id: string;
  text: string;
  category: string;
  completed: boolean;
};

export default function TasksSection() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      category: newTaskCategory.trim() || 'General',
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setNewTaskText('');
    setNewTaskCategory('');
  };
  
  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const tasksByCategory = useMemo(() => {
    return tasks.reduce((acc, task) => {
      (acc[task.category] = acc[task.category] || []).push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [tasks]);

  const categories = Object.keys(tasksByCategory).sort();

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">My Tasks</h2>

      <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2 mb-8">
        <Input
          placeholder="Add a new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          className="bg-input/50 flex-grow"
        />
        <Input
          placeholder="Category (e.g., Work)"
          value={newTaskCategory}
          onChange={(e) => setNewTaskCategory(e.target.value)}
          className="bg-input/50 sm:w-48"
        />
        <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </form>
      
      {tasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed border-border/30 rounded-lg p-8">
          <ListChecks className="h-12 w-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">All tasks completed!</h3>
          <p>Add a new task to get started.</p>
        </div>
      ) : (
        <Accordion type="multiple" defaultValue={categories} className="w-full">
          {categories.map(category => (
            <AccordionItem key={category} value={category} className="border-border/30 bg-card/50 backdrop-blur-md rounded-lg mb-2">
              <AccordionTrigger className="hover:no-underline text-lg font-semibold px-4 py-3">
                {category}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="flex flex-col gap-2">
                  {tasksByCategory[category].sort((a,b) => Number(a.completed) - Number(b.completed)).map(task => (
                    <div key={task.id} className="flex items-center p-2 rounded-md hover:bg-accent/10 transition-colors group">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        className="mr-3 h-5 w-5"
                      />
                      <label
                        htmlFor={`task-${task.id}`}
                        className={`flex-1 text-sm cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                      >
                        {task.text}
                      </label>
                      <Button variant="ghost" size="icon" className="text-destructive/70 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteTask(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
