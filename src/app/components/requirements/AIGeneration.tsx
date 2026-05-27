import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  RefreshCw,
  Sparkles,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface BRDDocument {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  summary: string;
  confidence: number;
}

interface UserStory {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  storyPoints: number;
  acceptanceCriteria: string[];
  status: "pending" | "approved" | "rejected";
  expanded?: boolean;
}

interface Epic {
  id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  userStories: UserStory[];
  expanded?: boolean;
}

interface AIGenerationProps {
  document: BRDDocument;
  onComplete: (epics: Epic[]) => void;
}

const PRIORITY_COLORS = {
  low: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-300",
    dot: "bg-gray-500",
  },
  medium: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  high: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  critical: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-300",
    dot: "bg-red-500",
  },
};

const MOCK_EPICS: Epic[] = [
  {
    id: "1",
    title: "User Authentication & Authorization",
    description:
      "Implement secure user authentication system with role-based access control",
    status: "pending",
    expanded: false,
    userStories: [
      {
        id: "1-1",
        title: "User Registration",
        description:
          "As a new user, I want to register an account so that I can access the platform",
        priority: "high",
        storyPoints: 5,
        status: "pending",
        expanded: false,
        acceptanceCriteria: [
          "User can register with email and password",
          "Email verification is sent upon registration",
          "Password must meet security requirements (8+ chars, special chars)",
          "User receives welcome email after successful registration",
        ],
      },
      {
        id: "1-2",
        title: "User Login",
        description:
          "As a registered user, I want to log in to my account so that I can access my data",
        priority: "high",
        storyPoints: 3,
        status: "pending",
        expanded: false,
        acceptanceCriteria: [
          "User can log in with email and password",
          "Invalid credentials show appropriate error message",
          "Session is created and maintained across browser tabs",
          "Remember me option available for persistent login",
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Product Catalog Management",
    description:
      "Build comprehensive product catalog with search, filtering, and categorization",
    status: "pending",
    expanded: false,
    userStories: [
      {
        id: "2-1",
        title: "Product Listing",
        description:
          "As a user, I want to browse products so that I can find items to purchase",
        priority: "high",
        storyPoints: 8,
        status: "pending",
        expanded: false,
        acceptanceCriteria: [
          "Products displayed in grid/list view",
          "Each product shows image, name, price, and rating",
          "Pagination or infinite scroll implemented",
          "Loading states for better UX",
        ],
      },
      {
        id: "2-2",
        title: "Product Search",
        description:
          "As a user, I want to search for products by keywords so that I can quickly find what I need",
        priority: "medium",
        storyPoints: 5,
        status: "pending",
        expanded: false,
        acceptanceCriteria: [
          "Search bar accessible from all pages",
          "Real-time search suggestions as user types",
          "Search results sorted by relevance",
          "Search history saved for logged-in users",
        ],
      },
    ],
  },
];

export function AIGeneration({ document, onComplete }: AIGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [regeneratingEpicId, setRegeneratingEpicId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    // Simulate AI generation
    setTimeout(() => {
      setEpics(MOCK_EPICS);
      setIsGenerating(false);
    }, 3000);
  }, []);

  const toggleEpic = (epicId: string) => {
    setEpics(
      epics.map((epic) =>
        epic.id === epicId ? { ...epic, expanded: !epic.expanded } : epic,
      ),
    );
  };

  const toggleUserStory = (epicId: string, storyId: string) => {
    setEpics(
      epics.map((epic) =>
        epic.id === epicId
          ? {
              ...epic,
              userStories: epic.userStories.map((story) =>
                story.id === storyId
                  ? { ...story, expanded: !story.expanded }
                  : story,
              ),
            }
          : epic,
      ),
    );
  };

  const handleRegenerateAll = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleRegenerateEpic = async (epicId: string) => {
    setRegeneratingEpicId(epicId);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRegeneratingEpicId(null);
  };

  const approveEpic = (epicId: string) => {
    setEpics(
      epics.map((epic) =>
        epic.id === epicId ? { ...epic, status: "approved" as const } : epic,
      ),
    );
  };

  const rejectEpic = (epicId: string) => {
    setEpics(
      epics.map((epic) =>
        epic.id === epicId ? { ...epic, status: "rejected" as const } : epic,
      ),
    );
  };

  const handleContinue = () => {
    const approvedEpics = epics.filter((e) => e.status === "approved");
    onComplete(approvedEpics);
  };

  if (isGenerating) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            AI is Generating Requirements...
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Analyzing document and creating epics, user stories, and acceptance
            criteria
          </p>
          <div className="max-w-md mx-auto space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-ping" />
              <span>Extracting requirements from BRD</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-[#6366F1] rounded-full animate-ping" />
              <span>Categorizing into epics and user stories</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-ping" />
              <span>Generating acceptance criteria</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const approvedCount = epics.filter((e) => e.status === "approved").length;
  const rejectedCount = epics.filter((e) => e.status === "rejected").length;
  const pendingCount = epics.filter((e) => e.status === "pending").length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Epic Review & Approval
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Review AI-generated epics. Approve, reject, or regenerate each epic
          individually.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#22C55E]/5 border border-[#22C55E]/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-[#22C55E]" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Approved
              </span>
            </div>
            <p className="text-2xl font-bold text-[#22C55E]">{approvedCount}</p>
          </div>
          <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-[#EF4444]" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Rejected
              </span>
            </div>
            <p className="text-2xl font-bold text-[#EF4444]">{rejectedCount}</p>
          </div>
          <div className="bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <RefreshCw className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Pending
              </span>
            </div>
            <p className="text-2xl font-bold text-[#F59E0B]">{pendingCount}</p>
          </div>
        </div>
      </div>

      {/* Epics List */}
      <div className="space-y-4">
        {epics.map((epic) => (
          <div
            key={epic.id}
            className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden"
          >
            {/* Epic Header */}
            <div className="p-6">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleEpic(epic.id)}
                  className="mt-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {epic.expanded ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {epic.title}
                        </h3>
                        {epic.status === "approved" && (
                          <span className="px-3 py-1 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-semibold rounded-full">
                            APPROVED
                          </span>
                        )}
                        {epic.status === "rejected" && (
                          <span className="px-3 py-1 bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-semibold rounded-full">
                            REJECTED
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {epic.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{epic.userStories.length} User Stories</span>
                      </div>
                    </div>
                    {epic.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => approveEpic(epic.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 hover:bg-[#22C55E]/20 border border-[#22C55E]/30 text-[#22C55E] rounded-lg transition-all"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => rejectEpic(epic.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#EF4444] rounded-lg transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleRegenerateEpic(epic.id)}
                          disabled={regeneratingEpicId === epic.id}
                          className="flex items-center gap-2 px-4 py-2 bg-[#6366F1]/10 hover:bg-[#6366F1]/20 border border-[#6366F1]/30 text-[#6366F1] rounded-lg transition-all disabled:opacity-50"
                        >
                          <RefreshCw
                            className={`w-4 h-4 ${regeneratingEpicId === epic.id ? "animate-spin" : ""}`}
                          />
                          {regeneratingEpicId === epic.id
                            ? "Regenerating..."
                            : "Regenerate"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* User Stories Preview */}
            {epic.expanded && (
              <div className="border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0F172A] p-6">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  User Stories Preview ({epic.userStories.length})
                </h4>
                <div className="space-y-2">
                  {epic.userStories.map((story) => (
                    <div
                      key={story.id}
                      className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {story.title}
                          </h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {story.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 ${PRIORITY_COLORS[story.priority].bg} ${PRIORITY_COLORS[story.priority].text} text-xs font-semibold rounded`}
                          >
                            {story.priority.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {story.storyPoints} SP
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          onClick={handleRegenerateAll}
          className="px-6 py-3 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
        >
          Regenerate All Epics
        </button>
        <button
          onClick={handleContinue}
          disabled={approvedCount === 0}
          className="px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl font-medium hover:from-[#5558E3] hover:to-[#7C4FE0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to User Story Approval ({approvedCount} Epics)
        </button>
      </div>
    </div>
  );
}
