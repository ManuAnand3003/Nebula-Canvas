import TasksSection from "@/components/tasks-section";

export default function TasksPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-[#121212] to-background p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <TasksSection />
      </div>
    </div>
  );
}
