import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Plus, Folder, Calendar, ChevronRight, ArrowLeft } from "lucide-react";
import { ProjectSetupChat } from "../components/workspace/ProjectSetupChat";
import { TaskTracker, Task } from "../components/workspace/TaskTracker";
import { Badge } from "../components/ui/badge";

interface Project {
  id: string;
  name: string;
  category: string;
  type: "greenfield" | "brownfield";
  lastActive: string;
  status: "active" | "planning" | "completed";
  assets: number;
  version: string;
  description: string;
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: "ai-delivery-copilot",
    name: "AI Delivery Co-Pilot",
    category: "REQUIREMENTS",
    type: "greenfield",
    lastActive: "5/26/2026",
    status: "active",
    assets: 4,
    version: "v1.0.0",
    description:
      "Multi-modal contextual parsing layer built to optimize delivery tracking, parse engineering artifacts, and cross-team workflows.",
  },
  {
    id: "workplace-multi-vendor",
    name: "Workplace Multi-Vendor Platform",
    category: "DEVELOPMENT",
    type: "brownfield",
    lastActive: "4/12/2026",
    status: "active",
    assets: 3,
    version: "v2.4.1",
    description:
      "Refactoring application core architecture with robust microservices topology and repository design patterns for scale.",
  },
  {
    id: "enterprise-knowledge-router",
    name: "Enterprise Knowledge Base Router",
    category: "DESIGN",
    type: "greenfield",
    lastActive: "5/10/2026",
    status: "planning",
    assets: 1,
    version: "v0.2.0",
    description:
      "Vector index router optimization engine utilizing smart routing workflows over distributed private cloud execution.",
  },
];

const STATUS_CONFIG = {
  active: { color: "bg-[#22C55E]", label: "Active" },
  planning: { color: "bg-[#F59E0B]", label: "Planning" },
  completed: { color: "bg-gray-500", label: "Completed" },
};

export function Projects({ initialProjects }: { initialProjects?: Project[] }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>(
    initialProjects && initialProjects.length
      ? initialProjects
      : INITIAL_PROJECTS,
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle new project from AI Workspace
  useEffect(() => {
    const state = location.state as {
      newProject?: Project;
    } | null;
    if (state?.newProject) {
      const newProject = state.newProject;
      // Check if project already exists to avoid duplicates
      if (!projects.find((p) => p.id === newProject.id)) {
        setProjects([newProject, ...projects]);
        setNewProjectId(newProject.id);
        setShowSuccessMessage(true);

        // Scroll to top to show the new project
        setTimeout(() => {
          scrollContainerRef.current?.scrollTo({
            top: 0,
            behavior: "smooth",
          });
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
      scrollContainerRef.current?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
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
    <div className="h-full flex flex-col bg-slate-50 text-slate-900 transition-colors">
      <div className="px-8 py-6 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Projects</h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              A unified view of your initiatives, asset connectivity, and
              delivery status.
            </p>
          </div>
          <button
            onClick={() => navigate("/requirements")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#6366F1]/20 transition-all hover:from-[#5558E3] hover:to-[#7C4FE0]"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      {showSuccessMessage && (
        <div className="mx-8 mt-6 rounded-3xl border border-emerald-200/70 bg-emerald-50/80 p-4 text-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
              <svg
                className="h-5 w-5"
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
              <p className="text-sm font-semibold">
                Project created successfully!
              </p>
              <p className="text-xs text-slate-500">
                Your new project has been added to the list.
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-8 py-6"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_80px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-[#6366F1]/20">
                  <Folder className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                    Centralized Enterprise Projects Router
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                    Your project portfolio at a glance
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                    Browse active initiatives with connected assets, release
                    readiness, and high-level progress indicators.
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#6366F1]" />
                3 Total
              </div>
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() =>
                  navigate("/requirements", { state: { project } })
                }
                className="group w-full text-left"
              >
                <div
                  className={`flex h-full flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#6366F1]/30 hover:shadow-lg ${
                    project.id === newProjectId
                      ? "border-emerald-300 shadow-[0_30px_60px_-30px_rgba(34,197,94,0.6)]"
                      : ""
                  }`}
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#EEF2FF] text-[#4F46E5]">
                          <Folder className="h-5 w-5" />
                        </div>
                        <Badge variant="secondary">{project.category}</Badge>
                      </div>
                      <Badge variant="outline">{project.type}</Badge>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 group-hover:text-[#4F46E5]">
                        {project.name}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${STATUS_CONFIG[project.status].color}`}
                        />
                        {STATUS_CONFIG[project.status].label}
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                        {project.assets} Assets Connected
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {project.lastActive}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {project.version}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
