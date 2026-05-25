import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Plus, Folder, Calendar, ChevronRight, ArrowLeft } from "lucide-react";
import { ProjectSetupChat } from "../components/workspace/ProjectSetupChat";
import { TaskTracker, Task } from "../components/workspace/TaskTracker";

interface Project {
  id: string;
  name: string;
  type: "greenfield" | "brownfield";
  lastActive: string;
  status: "active" | "planning" | "completed";
  confidence: number;
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: "payment-api",
    name: "Payment API",
    type: "greenfield",
    lastActive: "2 hours ago",
    status: "active",
    confidence: 92,
  },
  {
    id: "retail-ui",
    name: "Retail UI",
    type: "brownfield",
    lastActive: "Yesterday",
    status: "active",
    confidence: 87,
  },
  {
    id: "auth-service",
    name: "Auth Service",
    type: "greenfield",
    lastActive: "3 days ago",
    status: "planning",
    confidence: 78,
  },
  {
    id: "notification-worker",
    name: "Notification Worker",
    type: "brownfield",
    lastActive: "Last week",
    status: "active",
    confidence: 95,
  },
];

const STATUS_CONFIG = {
  active: { color: "bg-[#22C55E]", label: "Active" },
  planning: { color: "bg-[#F59E0B]", label: "Planning" },
  completed: { color: "bg-gray-500", label: "Completed" },
};

export function Projects() {
  const location = useLocation();
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle new project from AI Workspace
  useEffect(() => {
    const state = location.state as { newProject?: Project } | null;
    if (state?.newProject) {
      const newProject = state.newProject;
      // Check if project already exists to avoid duplicates
      if (!projects.find((p) => p.id === newProject.id)) {
        setProjects([newProject, ...projects]);
        setNewProjectId(newProject.id);
        setShowSuccessMessage(true);

        // Scroll to top to show the new project
        setTimeout(() => {
          scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);

        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
        setTimeout(() => {
          setNewProjectId(null);
        }, 5000);
      }
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleProjectComplete = (newProject: Project) => {
    setProjects([newProject, ...projects]);
    setNewProjectId(newProject.id);
    setShowSuccessMessage(true);
    setIsCreatingProject(false);
    setCurrentTasks([]);

    // Scroll to top to show the new project
    setTimeout(() => {
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);

    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
    setTimeout(() => {
      setNewProjectId(null);
    }, 5000);
  };

  // Show chat interface when creating project
  if (isCreatingProject) {
    return (
      <div className="h-full flex flex-col overflow-hidden bg-gray-50 dark:bg-[#0A0F1E] transition-colors">
        {/* Back Button Header */}
        <div className="h-16 border-b border-gray-200 dark:border-white/10 px-6 flex items-center flex-shrink-0">
          <button
            onClick={() => setIsCreatingProject(false)}
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
              onClose={() => {
                setIsCreatingProject(false);
                setCurrentTasks([]);
              }}
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

  // Show projects list
  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#0A0F1E] transition-colors">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Projects
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage all your SDLC projects
            </p>
          </div>
          <button
            onClick={() => setIsCreatingProject(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4FE0] text-white rounded-xl font-medium transition-all shadow-lg shadow-[#6366F1]/20"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mx-8 mt-6 bg-gradient-to-r from-[#22C55E]/10 to-[#10B981]/10 border border-[#22C55E]/30 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#22C55E]/20 border border-[#22C55E]/40 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#22C55E]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              Project created successfully!
            </p>
            <p className="text-xs text-gray-400">
              Your new project has been added to the list.
            </p>
          </div>
        </div>
      )}

      {/* Projects Grid - Vertical Layout */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-8 py-6"
      >
        <div className="max-w-5xl mx-auto space-y-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="block group"
            >
              <div
                className={`bg-white dark:bg-[#111827] border rounded-2xl p-6 transition-all hover:bg-gray-50 dark:hover:bg-[#111827]/80 ${
                  project.id === newProjectId
                    ? "border-[#22C55E]/50 shadow-lg shadow-[#22C55E]/20 animate-pulse"
                    : "border-gray-200 dark:border-white/10 hover:border-[#6366F1]/30"
                }`}
              >
                <div className="flex items-center justify-between gap-6">
                  {/* Left: Project Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Folder className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {project.name}
                        </h3>
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider flex-shrink-0 ${
                            project.type === "greenfield"
                              ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20"
                              : "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20"
                          }`}
                        >
                          {project.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${STATUS_CONFIG[project.status].color}`}
                          />
                          <span className="text-gray-600 dark:text-gray-400">
                            {STATUS_CONFIG[project.status].label}
                          </span>
                        </div>
                        <span className="text-gray-400 dark:text-gray-600">
                          •
                        </span>
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{project.lastActive}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center: Confidence Bar */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                        Confidence
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              project.confidence >= 90
                                ? "bg-[#22C55E]"
                                : project.confidence >= 75
                                  ? "bg-[#F59E0B]"
                                  : "bg-[#EF4444]"
                            }`}
                            style={{ width: `${project.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white w-10 text-right">
                          {project.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-[#6366F1] transition-colors flex-shrink-0" />
                </div>
              </div>
            </Link>
          ))}

          {/* Empty State */}
          {projects.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-3xl flex items-center justify-center mx-auto mb-6 opacity-50">
                <Folder className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No projects yet
              </h3>
              <p className="text-gray-400 mb-6">
                Create your first project to get started
              </p>
              <button
                onClick={() => setIsCreatingProject(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4FE0] text-white rounded-xl font-medium transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
