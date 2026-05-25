import {
  CheckCheck,
  Loader2,
  FileCode,
  Database,
  GitBranch,
  Package,
  Settings,
  FileText,
} from "lucide-react";

export interface Task {
  id: string;
  name: string;
  status: "completed" | "in-progress" | "pending";
  icon: "code" | "database" | "git" | "package" | "settings" | "file";
}

interface TaskTrackerProps {
  projectId: string | null;
  tasks?: Task[];
}

const ICON_MAP = {
  code: FileCode,
  database: Database,
  git: GitBranch,
  package: Package,
  settings: Settings,
  file: FileText,
};

const DEFAULT_TASKS: Task[] = [
  {
    id: "1",
    name: "Waiting for project setup to begin",
    status: "pending",
    icon: "code",
  },
];

export function TaskTracker({ projectId, tasks }: TaskTrackerProps) {
  const activeTasks = tasks && tasks.length > 0 ? tasks : DEFAULT_TASKS;
  const completedCount = activeTasks.filter(
    (t) => t.status === "completed",
  ).length;
  const totalCount = activeTasks.length;
  const inProgressCount = activeTasks.filter(
    (t) => t.status === "in-progress",
  ).length;
  const pendingCount = activeTasks.filter((t) => t.status === "pending").length;

  return (
    <div className="w-96 bg-gray-100 dark:bg-[#0A0F1E] border-l border-gray-200 dark:border-white/10 flex flex-col h-full transition-colors">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex-shrink-0">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
          AI Progress
        </h3>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-3">
          {activeTasks.map((task) => {
            const Icon = ICON_MAP[task.icon];

            return (
              <div
                key={task.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  task.status === "completed"
                    ? "bg-white dark:bg-[#0D1321] border border-gray-200 dark:border-white/5"
                    : task.status === "in-progress"
                      ? "bg-[#6366F1]/10 border border-[#6366F1]/30"
                      : "bg-white dark:bg-[#0D1321] border border-gray-200 dark:border-white/5"
                }`}
              >
                {/* Status Icon */}
                {task.status === "completed" ? (
                  <div className="w-5 h-5 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center flex-shrink-0">
                    <CheckCheck className="w-3 h-3 text-[#22C55E]" />
                  </div>
                ) : task.status === "in-progress" ? (
                  <div className="w-5 h-5 rounded-full border-2 border-[#6366F1] border-t-transparent animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-700 flex-shrink-0" />
                )}

                {/* Task Icon */}
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    task.status === "completed"
                      ? "text-gray-400 dark:text-gray-500"
                      : task.status === "in-progress"
                        ? "text-[#6366F1]"
                        : "text-gray-500 dark:text-gray-600"
                  }`}
                />

                {/* Task Name */}
                <p
                  className={`text-sm flex-1 min-w-0 ${
                    task.status === "completed"
                      ? "text-gray-400 dark:text-gray-500 line-through"
                      : task.status === "in-progress"
                        ? "text-gray-900 dark:text-white font-medium"
                        : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {task.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="border-t border-gray-200 dark:border-white/10 px-6 py-6 flex-shrink-0">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[#22C55E] mb-1">
              {completedCount}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">
              Done
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#6366F1] mb-1">
              {inProgressCount}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">
              Active
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-1">
              {pendingCount}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">
              Pending
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
