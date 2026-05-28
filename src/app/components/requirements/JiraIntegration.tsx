import { useState } from "react";
import type { Epic, UserStory } from "../../utils/requirementsTypes";
import {
  ExternalLink,
  CheckCircle,
  Loader,
  AlertCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface JiraIntegrationProps {
  epics: Epic[];
  onComplete?: () => void;
}

export function JiraIntegration({
  epics: initialEpics,
  onComplete,
}: JiraIntegrationProps) {
  const [selectedProject, setSelectedProject] = useState("ECOM");
  const [epics, setEpics] = useState<Epic[]>(
    initialEpics
      .filter((e) => e.status === "approved")
      .map((e) => ({
        ...e,
        syncStatus: "pending" as const,
        userStories: e.userStories
          .filter((s) => s.status === "approved")
          .map((s) => ({
            ...s,
            syncStatus: "pending" as const,
          })),
      })),
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "config" | "syncing" | "complete"
  >("config");

  const jiraProjects = [
    {
      key: "ECOM",
      name: "E-Commerce Platform",
      url: "https://your-domain.atlassian.net/browse/ECOM",
    },
    {
      key: "MOBILE",
      name: "Mobile App",
      url: "https://your-domain.atlassian.net/browse/MOBILE",
    },
    {
      key: "API",
      name: "API Services",
      url: "https://your-domain.atlassian.net/browse/API",
    },
  ];

  const handleSync = async () => {
    setIsSyncing(true);
    setCurrentStep("syncing");

    // Begin sync flow

    // Simulate epic sync
    for (let i = 0; i < epics.length; i++) {
      const epic = epics[i];

      // Sync epic
      setEpics((prev) =>
        prev.map((e) =>
          e.id === epic.id ? { ...e, syncStatus: "syncing" as const } : e,
        ),
      );

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setEpics((prev) =>
        prev.map((e) =>
          e.id === epic.id
            ? {
                ...e,
                syncStatus: "synced" as const,
                jiraKey: `${selectedProject}-${100 + i}`,
              }
            : e,
        ),
      );

      // Sync user stories
      for (let j = 0; j < epic.userStories.length; j++) {
        const story = epic.userStories[j];

        setEpics((prev) =>
          prev.map((e) =>
            e.id === epic.id
              ? {
                  ...e,
                  userStories: e.userStories.map((s) =>
                    s.id === story.id
                      ? { ...s, syncStatus: "syncing" as const }
                      : s,
                  ),
                }
              : e,
          ),
        );

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setEpics((prev) =>
          prev.map((e) =>
            e.id === epic.id
              ? {
                  ...e,
                  userStories: e.userStories.map((s) =>
                    s.id === story.id
                      ? {
                          ...s,
                          syncStatus: "synced" as const,
                          jiraKey: `${selectedProject}-${101 + i * 10 + j}`,
                        }
                      : s,
                  ),
                }
              : e,
          ),
        );
      }
    }

    setIsSyncing(false);
    setCurrentStep("complete");
  };

  const toggleEpic = (epicId: string) => {
    setEpics((prev) =>
      prev.map((epic) =>
        epic.id === epicId ? { ...epic, expanded: !epic.expanded } : epic,
      ),
    );
  };

  const syncedEpics = epics.filter((e) => e.syncStatus === "synced").length;
  const syncedStories = epics.reduce(
    (acc, e) =>
      acc + e.userStories.filter((s) => s.syncStatus === "synced").length,
    0,
  );
  const totalStories = epics.reduce((acc, e) => acc + e.userStories.length, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Jira Project Selection */}
      {currentStep === "config" && (
        <>
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Jira Project
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {jiraProjects.map((project) => (
                <button
                  key={project.key}
                  onClick={() => setSelectedProject(project.key)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedProject === project.key
                      ? "border-[#6366F1] bg-[#6366F1]/5"
                      : "border-gray-200 dark:border-white/10 hover:border-[#6366F1]/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-[#6366F1]/10 text-[#6366F1] text-xs font-mono font-semibold rounded">
                          {project.key}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {project.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {project.url}
                      </p>
                    </div>
                    {selectedProject === project.key && (
                      <CheckCircle className="w-5 h-5 text-[#6366F1]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sync Summary */}
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sync Summary
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Epics to Create
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {epics.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  User Stories to Create
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalStories}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <button className="px-6 py-3 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              Back
            </button>
            <button
              onClick={handleSync}
              className="px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl font-medium hover:from-[#5558E3] hover:to-[#7C4FE0] transition-all flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Start Jira Sync
            </button>
          </div>
        </>
      )}

      {/* Syncing Progress */}
      {currentStep === "syncing" && (
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Loader className="w-10 h-10 text-white animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Syncing to Jira...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Creating epics and user stories in {selectedProject}
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-4">
            {epics.map((epic) => (
              <div
                key={epic.id}
                className="border border-gray-200 dark:border-white/10 rounded-lg p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  {epic.syncStatus === "synced" ? (
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                  ) : epic.syncStatus === "syncing" ? (
                    <Loader className="w-5 h-5 text-[#6366F1] animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-white/20" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {epic.title}
                    </p>
                    {epic.jiraKey && (
                      <p className="text-sm text-[#6366F1] font-mono">
                        {epic.jiraKey}
                      </p>
                    )}
                  </div>
                </div>
                <div className="pl-8 space-y-2">
                  {epic.userStories.map((story) => (
                    <div
                      key={story.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      {story.syncStatus === "synced" ? (
                        <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                      ) : story.syncStatus === "syncing" ? (
                        <Loader className="w-4 h-4 text-[#6366F1] animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-white/20" />
                      )}
                      <span className="text-gray-700 dark:text-gray-300">
                        {story.title}
                      </span>
                      {story.jiraKey && (
                        <span className="text-[#6366F1] font-mono text-xs">
                          {story.jiraKey}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complete */}
      {currentStep === "complete" && (
        <>
          <div className="bg-gradient-to-r from-[#22C55E]/10 to-[#10B981]/10 border border-[#22C55E]/30 rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Sync Complete!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Successfully created {syncedEpics} epics and {syncedStories} user
              stories in Jira
            </p>
            <a
              href={`https://your-domain.atlassian.net/browse/${selectedProject}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0052CC] text-white rounded-xl font-medium hover:bg-[#0747A6] transition-all"
            >
              <ExternalLink className="w-5 h-5" />
              View in Jira
            </a>
          </div>

          {/* Synced Items */}
          <div className="space-y-4">
            {epics.map((epic) => (
              <div
                key={epic.id}
                className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden"
              >
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
                  onClick={() => toggleEpic(epic.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {epic.title}
                        </h4>
                        <a
                          href={`https://your-domain.atlassian.net/browse/${epic.jiraKey}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-[#0052CC]/10 border border-[#0052CC]/30 text-[#0052CC] text-xs font-mono font-semibold rounded hover:bg-[#0052CC]/20 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {epic.jiraKey}
                        </a>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {epic.userStories.length} user stories created
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => onComplete?.()}
              className="px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl font-medium hover:from-[#5558E3] hover:to-[#7C4FE0] transition-all"
            >
              Back to Projects
            </button>
          </div>
        </>
      )}
    </div>
  );
}
