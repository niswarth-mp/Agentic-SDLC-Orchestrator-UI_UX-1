import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6 hover:border-[#6366F1]/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-[#6366F1]/10 rounded-lg">
          <Icon className="w-6 h-6 text-[#6366F1]" />
        </div>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.positive ? "text-[#22C55E]" : "text-[#EF4444]"
            }`}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
}
