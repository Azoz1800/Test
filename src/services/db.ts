import Dexie, { Table } from 'dexie';
import { Habit, HabitLog, Setting } from '@/types/db';

export class HabitTrackerDB extends Dexie {
  habits!: Table<Habit, number>;
  habitLogs!: Table<HabitLog, number>;
  settings!: Table<Setting, number>;

  constructor() {
    super('HabitTrackerDB');
    this.version(1).stores({
      habits: '++id, name, createdAt, archived',
      habitLogs: '++id, &[habitId+date], habitId, date',
      settings: 'id',
    });
  }
}

export const db = new HabitTrackerDB();

// =================================================================
// Default Settings
// =================================================================
db.on('populate', async () => {
  await db.settings.add({
    id: 0,
    theme: 'system',
    language: 'en',
    notifications: {
      enabled: false,
    },
  });
});

// =================================================================
// Habit CRUD Operations
// =================================================================
// (I will add CRUD functions here later)
