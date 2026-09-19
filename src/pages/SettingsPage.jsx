import { Sun, Moon } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import AppLayout from "../components/AppLayout";
export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <AppLayout>
          <h1 className="text-2xl font-semibold text-emerald-950 dark:text-emerald-100 -mt-3">
            Settings
          </h1>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm shadow-emerald-900/5 dark:shadow-none dark:border dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  Theme
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Switch between light and dark mode
                </p>
              </div>

              <button
                onClick={toggleTheme}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  theme === "dark" ? "bg-emerald-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 w-6 h-6 rounded-full bg-white flex items-center justify-center transition-transform ${
                    theme === "dark" ? "translate-x-7" : "translate-x-1"
                  }`}
                >
                  {theme === "dark" ? (
                    <Moon size={14} className="text-emerald-600" />
                  ) : (
                    <Sun size={14} className="text-amber-500" />
                  )}
                </span>
              </button>
            </div>
          </div>
       </AppLayout>
  );
}