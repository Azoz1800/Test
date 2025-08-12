import { Habit } from "@/types/db";
import { Button } from "@/components/common/Button";
import { Check, SkipForward, X } from "lucide-react";

interface HabitCardProps {
  habit: Habit;
  // onStatusChange: (habitId: number, status: 'completed' | 'skipped' | 'missed') => void;
}

export function HabitCard({ habit }: HabitCardProps) {
  const handleComplete = () => {
    // onStatusChange(habit.id!, 'completed');
    console.log("complete");
  };

  const handleSkip = () => {
    // onStatusChange(habit.id!, 'skipped');
    console.log("skip");
  };

  const handleMiss = () => {
    // onStatusChange(habit.id!, 'missed');
    console.log("miss");
  };

  return (
    <div
      className="p-4 rounded-lg flex items-center justify-between"
      style={{ backgroundColor: habit.color + '20' }} // Use habit color with some transparency
    >
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: habit.color }}
        >
          {/* Placeholder for habit icon */}
          <span className="text-2xl">{habit.icon}</span>
        </div>
        <div>
          <h3 className="font-bold text-lg">{habit.name}</h3>
          <p className="text-sm text-muted-foreground">Streak: 0 days</p> {/* Placeholder for streak */}
        </div>
      </div>
      <div className="flex gap-2">
        <Button aria-label={`Mark ${habit.name} as completed`} size="icon" variant="ghost" onClick={handleComplete}>
          <Check className="h-6 w-6 text-green-500" />
        </Button>
        <Button aria-label={`Mark ${habit.name} as skipped`} size="icon" variant="ghost" onClick={handleSkip}>
          <SkipForward className="h-6 w-6 text-yellow-500" />
        </Button>
        <Button aria-label={`Mark ${habit.name} as missed`} size="icon" variant="ghost" onClick={handleMiss}>
          <X className="h-6 w-6 text-red-500" />
        </Button>
      </div>
    </div>
  );
}
