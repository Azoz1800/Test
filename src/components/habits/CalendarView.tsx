import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday } from 'date-fns';
import { Button } from '@/components/common/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div className="p-4 bg-card rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <Button aria-label="Previous month" variant="ghost" size="icon" onClick={handlePrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
        <Button aria-label="Next month" variant="ghost" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {weekDays.map(day => (
          <div key={day} className="font-bold text-xs text-muted-foreground">{day}</div>
        ))}
        {Array.from({ length: startingDayIndex }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {daysInMonth.map(day => (
          <div
            key={day.toString()}
            className={cn(
              "p-2 rounded-full aspect-square flex items-center justify-center hover:bg-accent cursor-pointer text-sm",
              isToday(day) && "bg-primary text-primary-foreground"
            )}
          >
            {format(day, 'd')}
          </div>
        ))}
      </div>
    </div>
  );
}
