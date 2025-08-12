export interface Habit {
  id?: number;
  name: string;
  description?: string;
  color: string;
  icon: string;
  frequency: {
    type: 'daily' | 'weekly' | 'monthly';
    days?: number[]; // day of week for weekly (0=Sun, 6=Sat), day of month for monthly
  };
  reminder: {
    enabled: boolean;
    time?: string; // "HH:mm"
  };
  createdAt: Date;
  archived: boolean;
}

export interface HabitLog {
  id?: number;
  habitId: number;
  date: string; // YYYY-MM-DD
  status: 'completed' | 'skipped' | 'missed';
}

export interface Setting {
  id: 0; // The settings object will have a fixed id of 0
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ar';
  notifications: {
    enabled: boolean;
    dailyReminderTime?: string; // "HH:mm"
  };
}
