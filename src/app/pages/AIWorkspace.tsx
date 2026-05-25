import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ProjectSetupChat } from "../components/workspace/ProjectSetupChat";
import { TaskTracker, Task } from "../components/workspace/TaskTracker";

export function AIWorkspace() {
  const navigate = useNavigate();
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);

  const handleProjectComplete = (newProject: any) => {
    // Navigate to projects page after completion
    setTimeout(() => {
      navigate("/projects", { state: { newProject } });
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50 dark:bg-[#0A0F1E] transition-colors">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 dark:border-white/10 px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              AI Workspace
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Create and manage projects with AI assistance
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Chat Interface */}
        <div className="flex-1 min-w-0">
          <ProjectSetupChat
            onClose={() => navigate("/projects")}
            onTaskUpdate={setCurrentTasks}
            onProjectComplete={handleProjectComplete}
          />
        </div>

        {/* Task Tracker */}
        <TaskTracker projectId={null} tasks={currentTasks} />
      </div>
    </div>
  );
}
