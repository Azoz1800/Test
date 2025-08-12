import { db } from './db';
import { Habit, HabitLog, Setting } from '@/types/db';
import { encryptData, decryptData } from './crypto';

interface BackupData {
  habits: Habit[];
  habitLogs: HabitLog[];
  settings: Setting[];
}

export async function exportDataAsJson() {
  try {
    const habits = await db.habits.toArray();
    const habitLogs = await db.habitLogs.toArray();
    const settings = await db.settings.toArray();

    const data = {
      habits,
      habitLogs,
      settings,
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `habit-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to export data:", error);
    alert("Error exporting data. See console for details.");
  }
}

export function importDataFromJson(jsonString: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const data: BackupData = JSON.parse(jsonString);

      // Basic validation
      if (!data.habits || !data.habitLogs || !data.settings) {
        throw new Error("Invalid backup file format.");
      }

      await db.transaction('rw', db.habits, db.habitLogs, db.settings, async () => {
        // Clear existing data
        await Promise.all([
          db.habits.clear(),
          db.habitLogs.clear(),
          db.settings.clear(),
        ]);

        // Import new data
        await Promise.all([
          db.habits.bulkAdd(data.habits.map(h => ({...h, createdAt: new Date(h.createdAt)}))),
          db.habitLogs.bulkAdd(data.habitLogs),
          db.settings.bulkAdd(data.settings),
        ]);
      });

      alert("Data imported successfully! The app will now reload.");
      window.location.reload(); // Reload to reflect changes everywhere
      resolve();

    } catch (error) {
      console.error("Failed to import data:", error);
      alert(`Error importing data: ${error.message}`);
      reject(error);
    }
  });
}

export async function exportDataAsEncryptedJson(passphrase: string) {
  try {
    const habits = await db.habits.toArray();
    const habitLogs = await db.habitLogs.toArray();
    const settings = await db.settings.toArray();

    const data = {
      habits,
      habitLogs,
      settings,
    };
    const jsonString = JSON.stringify(data);

    const { encrypted, salt, iv } = await encryptData(passphrase, jsonString);

    const encryptedBackup = {
      encrypted,
      salt,
      iv,
    };

    const encryptedJsonString = JSON.stringify(encryptedBackup, null, 2);
    const blob = new Blob([encryptedJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `habit-tracker-backup-encrypted-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to export encrypted data:", error);
    alert("Error exporting encrypted data. See console for details.");
  }
}

interface EncryptedBackupData {
  encrypted: string;
  salt: string;
  iv: string;
}

export async function importDataFromEncryptedJson(jsonString: string, passphrase: string): Promise<void> {
  try {
    const data: EncryptedBackupData = JSON.parse(jsonString);

    if (!data.encrypted || !data.salt || !data.iv) {
      throw new Error("Invalid encrypted backup file format.");
    }

    const decryptedJsonString = await decryptData(passphrase, data.encrypted, data.salt, data.iv);

    // Now we can reuse the plain import function
    await importDataFromJson(decryptedJsonString);

  } catch (error) {
    console.error("Failed to import encrypted data:", error);
    // The error might be "wrong password", which decrypt will throw.
    const specificError = error instanceof Error ? error.message : "An unknown error occurred."
    alert(`Error importing encrypted data: ${specificError}. Did you use the correct passphrase?`);
    throw error;
  }
}
