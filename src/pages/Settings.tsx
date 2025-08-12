import { Button } from "@/components/common/Button";
import { useSettingsStore } from "@/store/settings";
import { useUIStore } from "@/store/ui";

export function Settings() {
  const { settings, updateSettings } = useSettingsStore();
  const { openModal } = useUIStore();

  if (!settings) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-6 max-w-md">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Appearance</h2>
          <div className="flex items-center gap-4">
            <label htmlFor="theme-select">Theme:</label>
            <select
              id="theme-select"
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value as any })}
              className="p-2 border rounded-md bg-background"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Data Management</h2>
          <div className="flex items-center gap-4">
            <Button onClick={() => openModal('backup')}>Backup / Restore Data</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
