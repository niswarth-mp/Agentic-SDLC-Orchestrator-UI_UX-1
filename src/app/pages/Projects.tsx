import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { Plus, Folder, Calendar, ChevronRight, ArrowLeft } from "lucide-react";

interface Project {
  id: string;
  name: string; // config.app_name
  phase: string;
  env?: string; // config.env
  pipeline?: string; // pipeline_name
  version?: number;
  created?: string;
  description?: string;
  projectType?: string; // project_type/raw (kept but not used in UI)
}

const PHASE_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  idea: { label: "Idea", badgeClass: "bg-gray-100 text-gray-800" },
  discovery: {
    label: "Discovery",
    badgeClass: "bg-indigo-100 text-indigo-800",
  },
  design: { label: "Design", badgeClass: "bg-pink-100 text-pink-800" },
  implementation: {
    label: "Implementation",
    badgeClass: "bg-green-100 text-green-800",
  },
  deployment: { label: "Deployment", badgeClass: "bg-blue-100 text-blue-800" },
  failed: { label: "Failed", badgeClass: "bg-red-100 text-red-800" },
  approval_design: {
    label: "Approval (Design)",
    badgeClass: "bg-yellow-100 text-yellow-800",
  },
  // New phases requested — distinct, accessible colors
  req_design: {
    label: "Req Design",
    badgeClass: "bg-purple-100 text-purple-800",
  },
  development: {
    label: "Development",
    badgeClass: "bg-green-50 text-green-900",
  },
  security_scan: {
    label: "Security Scan",
    badgeClass: "bg-red-100 text-red-800",
  },
  testing: { label: "Testing", badgeClass: "bg-yellow-50 text-yellow-900" },
  infra_provision: {
    label: "Infra Provision",
    badgeClass: "bg-teal-100 text-teal-800",
  },
  gitops_deploy: {
    label: "GitOps Deploy",
    badgeClass: "bg-blue-50 text-blue-900",
  },
};

function getPhaseConfig(phase?: string) {
  if (!phase)
    return {
      label: phase ?? "Unknown",
      badgeClass: "bg-gray-100 text-gray-800",
    };
  return (
    PHASE_CONFIG[phase] ?? {
      label: phase,
      badgeClass: "bg-gray-100 text-gray-800",
    }
  );
}

async function fetchProjects(limit = 50): Promise<Project[]> {
  const res = await fetch(`http://localhost:8002/api/projects?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  const data = await res.json();
  // Normalize to Project shape using canonical response hints
  return (data.projects ?? data ?? [])
    .map((p: any) => ({
      id: String(p.project_id ?? p.id ?? ""),
      name: String(
        p.config?.app_name ?? p.config?.name ?? p.name ?? "Untitled Project",
      ),
      phase: String(p.phase ?? ""),
      env: p.config?.env ?? p.env,
      pipeline: p.pipeline_name ?? p.pipeline,
      version: p.version,
      created: p.created,
      description:
        p.description ?? p.config?.description ?? p.config?.constraints ?? "",
      projectType: String(p.project_type ?? p.type ?? ""),
    }))
    .filter((pr: Project) => !!pr.id);
}

interface ProjectsProps {
  initialProjects?: Project[];
}

export default function Projects({
  initialProjects,
}: ProjectsProps): React.ReactElement {
  const [projects, setProjects] = useState<Project[]>(initialProjects ?? []);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    setIsFetching(true);
    fetchProjects(50)
      .then((list) => {
        if (!mounted) return;
        setProjects(list);
        setFetchError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setFetchError(String(err.message || err));
      })
      .finally(() => mounted && setIsFetching(false));
    return () => {
      mounted = false;
    };
  }, []);

  // If another route created a project and passed it through location.state, prepend it
  useEffect(() => {
    const state = (location as any).state;
    if (state && state.newProject) {
      const np = state.newProject as Project;
      setProjects((prev) => [np, ...prev]);
      setNewProjectId(np.id ?? null);
      // clear history state to avoid duplicates
      try {
        window.history.replaceState({}, document.title);
      } catch {}
    }
  }, [location]);

  const handleProjectComplete = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    setNewProjectId(newProject.id);
    setIsCreatingProject(false);
    setTimeout(
      () =>
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" }),
      120,
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50 dark:bg-[#0A0F1E] transition-colors">
      <div className="h-16 border-b border-gray-200 dark:border-white/10 px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Projects
          </h2>
          <p className="text-sm text-gray-500">{projects.length} projects</p>
        </div>
        <div>
          <button
            onClick={() => setIsCreatingProject(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </button>
        </div>
      </div>

      {isCreatingProject ? (
        <div className="p-6">
          <button
            onClick={() => setIsCreatingProject(false)}
            className="text-sm text-gray-500 mb-4 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </button>
          <div className="p-6 bg-white dark:bg-[#111827] rounded-lg">
            Project creation UI goes here.
          </div>
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-8 py-6"
        >
          <div className="max-w-5xl mx-auto space-y-4">
            {isFetching && (
              <div className="text-center text-sm text-gray-500">
                Loading projects…
              </div>
            )}
            {fetchError && (
              <div className="text-center text-sm text-red-500">
                {fetchError}
              </div>
            )}

            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="block group"
              >
                <div
                  className={`bg-white dark:bg-[#111827] border rounded-[28px] p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6366F1]/40 hover:shadow-lg ${project.id === newProjectId ? "border-[#22C55E]/50 shadow-[#22C55E]/10" : "border-gray-200 dark:border-white/10"}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white shadow-inner">
                      <Folder className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-5xl font-extrabold text-gray-900 dark:text-white truncate">
                            {project.name}
                          </h3>
                          {project.description ? (
                            <p className="text-1xl font-extrabold leading-6 text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                              {project.description}
                            </p>
                          ) : (
                            <p className="text-sm leading-6 text-gray-500 dark:text-gray-400 mt-2">
                              No description available.
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getPhaseConfig(project.phase).badgeClass}`}
                          >
                            {getPhaseConfig(project.phase).label}
                          </span>
                          {project.env ? (
                            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-700 bg-gray-100 dark:text-gray-200 dark:bg-white/10 border border-gray-200 dark:border-white/10">
                              {project.env}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3 text-sm text-gray-600 dark:text-gray-300">
                        {project.pipeline ? (
                          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3">
                            <div className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                              Pipeline
                            </div>
                            <div className="mt-1 font-medium text-gray-900 dark:text-white truncate">
                              {project.pipeline}
                            </div>
                          </div>
                        ) : null}
                        {project.version ? (
                          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3">
                            <div className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                              Version
                            </div>
                            <div className="mt-1 font-medium text-gray-900 dark:text-white">
                              v{project.version}
                            </div>
                          </div>
                        ) : null}
                        {project.created ? (
                          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3">
                            <div className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                              Created
                            </div>
                            <div className="mt-1 font-medium text-gray-900 dark:text-white">
                              {new Date(project.created).toLocaleString()}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors group-hover:text-[#6366F1]" />
                  </div>
                </div>
              </Link>
            ))}

            {projects.length === 0 && !isFetching && (
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
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Create Project
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
