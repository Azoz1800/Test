import { useEffect } from 'react';
import { useHabitStore } from '@/store/habits';
import { showNotification, requestNotificationPermission } from '@/services/notifications';
import { format } from 'date-fns';

export function ReminderScheduler() {
  const { habits } = useHabitStore();

  useEffect(() => {
    // Ask for permission when the component mounts if not already granted
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = format(now, 'HH:mm');

      habits.forEach(habit => {
        if (
          habit.reminder.enabled &&
          habit.reminder.time === currentTime
        ) {
          // TODO: Add logic to check if the habit is due today based on frequency
          showNotification(`Time for ${habit.name}!`, {
            body: 'Don\'t forget to complete your habit.',
            icon: '/vite.svg' // Using a placeholder icon
          });
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [habits]);

  return null; // This component does not render anything
}
