import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Calendar } from "@/pages/Calendar";
import { Settings } from "@/pages/Settings";
import { useSettingsStore } from "./store/settings";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReloadPrompt from "./components/common/ReloadPrompt";
import { ReminderScheduler } from "./components/common/ReminderScheduler";

function App() {
  const { settings } = useSettingsStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    const body = document.body;
    const isDark =
      settings?.theme === "dark" ||
      (settings?.theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    body.classList.toggle("dark", isDark);

  }, [settings?.theme]);

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
  }, [i18n, i18n.language]);

  return (
    <Router>
      <ReloadPrompt />
      <ReminderScheduler />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
