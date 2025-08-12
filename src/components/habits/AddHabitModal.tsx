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
import { useState } from "react";
import { Habit } from "@/types/db";

export function AddHabitModal() {
  const { activeModal, closeModal } = useUIStore();
  const { addHabit } = useHabitStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("🎯");
  const [color, setColor] = useState("#3b82f6");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");

  const isOpen = activeModal === 'addHabit';

  const handleSubmit = async () => {
    if (!name) return;

    const newHabit: Omit<Habit, 'id' | 'createdAt' | 'archived'> = {
      name,
      description,
      icon,
      color,
      frequency: { type: 'daily' },
      reminder: {
        enabled: reminderEnabled,
        time: reminderEnabled ? reminderTime : undefined,
      },
    };

    await addHabit(newHabit);
    closeModal();
    // Reset form
    setName("");
    setDescription("");
    setIcon("🎯");
    setColor("#3b82f6");
    setReminderEnabled(false);
    setReminderTime("09:00");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* ... other inputs ... */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-end">Name</label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-end">Description</label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="icon" className="text-end">Icon</label>
            <Input id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="color" className="text-end">Color</label>
            <Input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="col-span-3" />
          </div>
          <div className="col-span-4 border-t my-2" />
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="reminder" className="text-end">Reminder</label>
            <div className="col-span-3 flex items-center gap-4">
              <input
                type="checkbox"
                id="reminder"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
                className="h-4 w-4"
              />
              {reminderEnabled && (
                <Input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Save Habit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
