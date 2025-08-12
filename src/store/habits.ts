import { create } from 'zustand';
import { db } from '@/services/db';
import { Habit, HabitLog } from '@/types/db';

interface HabitState {
  habits: Habit[];
  logs: Map<string, HabitLog>; // Key: habitId-date
  isLoading: boolean;
  fetchHabits: () => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => Promise<void>;
  updateHabit: (habit: Habit) => Promise<void>;
  archiveHabit: (id: number) => Promise<void>;
  deleteHabit: (id: number) => Promise<void>;
  getHabitsForDate: (date: Date) => Habit[];
  // More functions for logs will be added later
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  logs: new Map(),
  isLoading: true,
  fetchHabits: async () => {
    set({ isLoading: true });
    try {
      const habits = await db.habits.where('archived').equals(0).toArray();
      set({ habits, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch habits:', error);
      set({ isLoading: false });
    }
  },
  addHabit: async (habitData) => {
    const newHabit: Habit = {
      ...habitData,
      createdAt: new Date(),
      archived: false,
    };
    const id = await db.habits.add(newHabit);
    // Dexie returns the generated id, so we add it to the object
    set((state) => ({
      habits: [...state.habits, { ...newHabit, id }],
    }));
  },
  updateHabit: async (habit) => {
    await db.habits.put(habit);
    set((state) => ({
      habits: state.habits.map((h) => (h.id === habit.id ? habit : h)),
    }));
  },
  archiveHabit: async (id) => {
    await db.habits.update(id, { archived: true });
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
    }));
  },
  deleteHabit: async (id) => {
    // Also delete associated logs
    await db.transaction('rw', db.habits, db.habitLogs, async () => {
      await db.habitLogs.where('habitId').equals(id).delete();
      await db.habits.delete(id);
    });
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
      // TODO: Also clean up logs from the store's state
    }));
  },
  getHabitsForDate: (date) => {
    // This logic will be complex, involving frequency rules
    // I will implement this properly when building the UI
    return get().habits;
  },
}));

// Fetch habits once when the app loads
useHabitStore.getState().fetchHabits();
