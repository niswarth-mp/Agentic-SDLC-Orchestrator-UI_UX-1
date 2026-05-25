import { Search, Bell, User, Command, Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export function TopNav() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-white dark:bg-[#0F172A] border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 transition-colors">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects, agents, artifacts..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 dark:bg-white/5 bg-gray-50 dark:bg-gray-900 border border-white/10 dark:border-white/10 border-gray-200 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-gray-500">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white dark:hover:text-white hover:text-gray-900 hover:bg-white/5 dark:hover:bg-white/5 hover:bg-gray-100 rounded-lg transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full" />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 text-gray-400 hover:text-white dark:hover:text-white hover:text-gray-900 hover:bg-white/5 dark:hover:bg-white/5 hover:bg-gray-100 rounded-lg transition-all group"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
          )}
        </button>

        <div className="h-8 w-px bg-white/10 dark:bg-white/10 bg-gray-200" />

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-white dark:text-white text-gray-900">
              Engineering Team
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-400 text-gray-500">
              admin@company.com
            </p>
          </div>
          <button className="w-10 h-10 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-lg flex items-center justify-center text-white hover:shadow-lg hover:shadow-[#6366F1]/20 transition-all">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
