import { useHabitStore } from "@/store/habits";
import { HabitCard } from "./HabitCard";
import { useEffect, useRef } from "react";
import { useVirtualizer } from '@tanstack/react-virtual'

export function HabitList() {
  const { habits, isLoading, fetchHabits } = useHabitStore();
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: habits.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimate of your row height
    overscan: 5,
  });

  useEffect(() => {
    if (habits.length === 0) {
      fetchHabits();
    }
  }, [fetchHabits, habits.length]);

  if (isLoading) {
    return <div>Loading habits...</div>;
  }

  if (habits.length === 0) {
    return <p className="text-center text-muted-foreground">No habits yet. Add one to get started!</p>;
  }

  return (
    <div ref={parentRef} className="h-[calc(100vh-200px)] overflow-y-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const habit = habits[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
                padding: '8px 0', // To create space between items
              }}
            >
              <HabitCard habit={habit} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
