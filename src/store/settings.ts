import { create } from 'zustand';
import { db } from '@/services/db';
import { Setting } from '@/types/db';

interface SettingsState {
  settings: Setting | null;
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<Omit<Setting, 'id'>>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  isLoading: true,
  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const settings = await db.settings.get(0);
      if (settings) {
        set({ settings, isLoading: false });
      } else {
        // This case should ideally not happen if the populate hook works
        console.warn('No settings found, default populate hook might have failed.');
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      set({ isLoading: false });
    }
  },
  updateSettings: async (newSettings) => {
    const currentSettings = get().settings;
    // We don't update if settings haven't been loaded yet.
    if (!currentSettings) return;

    const updatedSettings: Setting = {
      ...currentSettings,
      ...newSettings,
      id: 0 // Ensure ID is not changed
    };

    await db.settings.put(updatedSettings);
    set({ settings: updatedSettings });
  },
}));

// Initialize settings on app load
useSettingsStore.getState().fetchSettings();
