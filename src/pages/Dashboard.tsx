import { HabitList } from "@/components/habits/HabitList";
import { Button } from "@/components/common/Button";
import { useUIStore } from "@/store/ui";
import { Plus } from "lucide-react";

export function Dashboard() {
  const { openModal } = useUIStore();

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={() => openModal('addHabit')}>
          <Plus className="ms-2 h-4 w-4" /> Add Habit
        </Button>
      </div>
      <HabitList />
    </div>
  );
}
