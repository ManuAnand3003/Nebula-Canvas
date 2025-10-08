"use client";

import { useState } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, StickyNote } from 'lucide-react';
import { format } from 'date-fns';

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function NotesSection() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    
    if (!title.trim() || !content.trim()) return;

    if (currentNote) {
      setNotes(notes.map(note => note.id === currentNote.id ? { ...note, title, content } : note));
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        createdAt: new Date().toISOString(),
      };
      setNotes([newNote, ...notes]);
    }
    setIsDialogOpen(false);
    setCurrentNote(null);
  };
  
  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const openDialog = (note: Note | null) => {
    setCurrentNote(note);
    setIsDialogOpen(true);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Notes</h2>
        <Button onClick={() => openDialog(null)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Add Note
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px] bg-background/80 backdrop-blur-lg border-border/50">
          <form onSubmit={handleSaveNote}>
            <DialogHeader>
              <DialogTitle>{currentNote ? 'Edit Note' : 'Add New Note'}</DialogTitle>
              <DialogDescription>
                {currentNote ? 'Update your note details.' : 'Create a new note to keep track of your thoughts.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                id="title"
                name="title"
                placeholder="Note Title"
                defaultValue={currentNote?.title}
                required
                className="bg-input/50"
              />
              <Textarea
                id="content"
                name="content"
                placeholder="Type your note here..."
                defaultValue={currentNote?.content}
                required
                className="bg-input/50 min-h-[150px]"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {notes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed border-border/30 rounded-lg p-8">
          <StickyNote className="h-12 w-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
          <p>Click 'Add Note' to create your first one!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map(note => (
            <Card key={note.id} className="bg-card/50 backdrop-blur-md border-border/30 flex flex-col transition-transform hover:scale-[1.02] hover:shadow-lg">
              <CardHeader>
                <CardTitle className="truncate">{note.title}</CardTitle>
                <CardDescription>
                  {format(new Date(note.createdAt), 'MMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-4 text-sm text-foreground/80">{note.content}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => openDialog(note)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive/80 hover:text-destructive" onClick={() => handleDeleteNote(note.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
