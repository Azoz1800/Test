import { NavLink, Outlet } from "react-router-dom";
import { Home, Calendar as CalendarIcon, Settings as SettingsIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AddHabitModal } from "@/components/habits/AddHabitModal";
import { EditHabitModal } from "@/components/habits/EditHabitModal";
import { BackupModal } from "@/components/habits/BackupModal";
import { cn } from "@/lib/utils";

export function MainLayout() {
  const { t } = useTranslation();

  const navItems = [
    { to: "/", label: t('dashboard'), icon: Home },
    { to: "/calendar", label: t('calendar'), icon: CalendarIcon },
    { to: "/settings", label: t('settings'), icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-muted/40">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 border-e bg-card p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-center">Habit Tracker</h1>
        </div>
        <nav>
          <ul className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end // Use 'end' for the dashboard route to avoid matching all routes
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg p-3 text-muted-foreground transition-colors hover:text-primary hover:bg-muted",
                      isActive && "bg-primary text-primary-foreground hover:text-primary-foreground"
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Modals */}
      <AddHabitModal />
      <EditHabitModal />
      <BackupModal />
    </div>
  );
}
