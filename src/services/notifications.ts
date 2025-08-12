export const isNotificationSupported = () => {
  return 'Notification' in window;
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported by this browser.');
    return 'denied';
  }
  return Notification.requestPermission();
};

export const showNotification = (title: string, options?: NotificationOptions) => {
  // Use Electron's native notifications if available
  if (window.electronAPI) {
    window.electronAPI.showNotification(title, options?.body || '');
    return;
  }

  // Fallback to browser notifications
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported by this browser.');
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, options);
    return notification;
  } else if (Notification.permission !== 'denied') {
    requestNotificationPermission().then(permission => {
      if (permission === 'granted') {
        const notification = new Notification(title, options);
        return notification;
      }
    });
  }
};
