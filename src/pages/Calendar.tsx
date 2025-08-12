import { CalendarView } from "@/components/habits/CalendarView";

export function Calendar() {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Calendar</h1>
      <CalendarView />
    </div>
  );
}
