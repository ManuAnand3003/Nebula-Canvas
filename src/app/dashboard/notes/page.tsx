import NotesSection from "@/components/notes-section";
import { Card, CardContent } from "@/components/ui/card";

export default function NotesPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-[#121212] to-background p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <NotesSection />
      </div>
    </div>
  );
}
