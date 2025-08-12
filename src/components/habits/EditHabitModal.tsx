import { useUIStore } from "@/store/ui";
import { useHabitStore } from "@/store/habits";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/common/Dialog";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useState, useEffect } from "react";
import { Habit } from "@/types/db";

export function EditHabitModal() {
  const { activeModal, closeModal, modalData } = useUIStore();
  const { updateHabit } = useHabitStore();

  const [habit, setHabit] = useState<Habit | null>(null);

  const isOpen = activeModal === 'editHabit';

  useEffect(() => {
    if (isOpen && modalData) {
      setHabit(modalData as Habit);
    } else {
      // Reset state when modal is closed or data is not available
      setHabit(null);
    }
  }, [isOpen, modalData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!habit) return;
    setHabit({ ...habit, [e.target.id]: e.target.value });
  };

  const handleReminderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!habit) return;
    const { checked } = e.target;
    setHabit({
      ...habit,
      reminder: {
        ...habit.reminder,
        enabled: checked,
        time: checked ? habit.reminder.time || "09:00" : undefined,
      },
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!habit) return;
    setHabit({
      ...habit,
      reminder: { ...habit.reminder, time: e.target.value },
    });
  };

  const handleSubmit = async () => {
    if (!habit) return;

    await updateHabit(habit);
    closeModal();
  };

  if (!habit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-end">Name</label>
            <Input id="name" value={habit.name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-end">Description</label>
            <Input id="description" value={habit.description || ''} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="icon" className="text-end">Icon</label>
            <Input id="icon" value={habit.icon} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="color" className="text-end">Color</label>
            <Input id="color" type="color" value={habit.color} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="col-span-4 border-t my-2" />
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="reminder" className="text-end">Reminder</label>
            <div className="col-span-3 flex items-center gap-4">
              <input
                type="checkbox"
                id="reminder"
                checked={habit.reminder.enabled}
                onChange={handleReminderChange}
                className="h-4 w-4"
              />
              {habit.reminder.enabled && (
                <Input
                  type="time"
                  value={habit.reminder.time || ''}
                  onChange={handleTimeChange}
                />
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
