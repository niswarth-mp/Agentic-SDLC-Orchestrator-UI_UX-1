import { useState, useEffect } from "react";
import type { Epic, UserStory } from "../../utils/requirementsTypes";
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  RefreshCw,
  Sparkles,
  CheckCircle,
  XCircle,
  FileText,
  Plus,
  ExternalLink,
  Upload,
} from "lucide-react";

interface BRDDocument {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  summary: string;
  confidence: number;
}

interface AIGenerationProps {
  document: BRDDocument;
  onComplete: (epics: Epic[]) => void;
}

const PRIORITY_COLORS: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  P0: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-300",
    dot: "bg-red-500",
  },
  P1: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  P2: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  P3: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-300",
    dot: "bg-gray-500",
  },
};

import userStoriesData from "../../../imports/pasted_text/user-stories.json";

// Epic titles and descriptions based on epic_id
const EPIC_METADATA: Record<string, { title: string; description: string }> = {
  "EP-01": {
    title: "Hybrid Search & Retrieval",
    description:
      "Implement hybrid BM25 + vector search with RRF fusion and shadow evaluation framework",
  },
  "EP-02": {
    title: "Query Understanding",
    description:
      "Build query understanding pipeline with intent classification, attribute extraction, and typo tolerance",
  },
  "EP-03": {
    title: "Personalized Ranking",
    description:
      "Implement personalized ranking with real-time features and experiment framework",
  },
  "EP-04": {
    title: "Merchandising & Inventory",
    description:
      "Enable merchandising rules authoring and inventory-aware ranking",
  },
  "EP-05": {
    title: "Multi-Modal Search",
    description: "Support voice and image search with graceful degradation",
  },
  "EP-06": {
    title: "International Localization",
    description:
      "Implement locale-specific analyzers and embedding models for global markets",
  },
  "EP-07": {
    title: "Autocomplete & Suggestions",
    description:
      "Build type-ahead autocomplete with personalization and trending highlights",
  },
  "EP-08": {
    title: "Indexing & Observability",
    description:
      "Implement streaming catalog ingestion, A/B variant indexing, and explainability APIs",
  },
  "EP-09": {
    title: "Facets & Result Diversity",
    description: "Enable dynamic facets and result diversity controls",
  },
};

// Group user stories by epic_id
function normalizeStory(s: any): UserStory {
  return {
    id: s.id,
    epicId: s.epic_id ?? s.epicId,
    title: s.title,
    description: s.description,
    priority: s.priority ?? "P3",
    storyPoints: s.story_points ?? s.storyPoints ?? 3,
    story_points: s.story_points ?? s.storyPoints,
    acceptanceCriteria: s.acceptance_criteria ?? s.acceptanceCriteria ?? [],
    acceptance_criteria: s.acceptance_criteria ?? s.acceptanceCriteria ?? [],
    status: s.status ?? "pending",
    expanded: s.expanded,
  };
}

function groupStoriesByEpic(stories: any[]): Epic[] {
  const epicMap = new Map<string, UserStory[]>();

  stories.forEach((raw) => {
    const story = normalizeStory(raw);
    const epicId = story.epicId ?? "EP-01";
    if (!epicMap.has(epicId)) {
      epicMap.set(epicId, []);
    }
    epicMap.get(epicId)!.push({ ...story, status: story.status ?? "pending" });
  });

  return Array.from(epicMap.entries()).map(([epicId, userStories]) => ({
    id: epicId,
    title: EPIC_METADATA[epicId]?.title || `Epic ${epicId}`,
    description: EPIC_METADATA[epicId]?.description || "Epic description",
    status: "pending",
    expanded: false,
    userStories,
  }));
}

const MOCK_EPICS: Epic[] = groupStoriesByEpic((userStoriesData as any[]) || []);

export function AIGeneration({ document, onComplete }: AIGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [regeneratingEpicId, setRegeneratingEpicId] = useState<string | null>(
    null,
  );
  const [feedbackMode, setFeedbackMode] = useState<{
    type: "reject" | "regenerate";
    epicId: string;
  } | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [resourceLinks, setResourceLinks] = useState<string[]>([""]);
  const [regenerateInstructions, setRegenerateInstructions] = useState("");

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
    // Open modal to collect extra inputs before regenerating
    setShowRegenerateModal(true);
  };

  const handleSubmitRegenerateAll = async () => {
    // Here you could send `uploadedFiles`, `resourceLinks`, and `regenerateInstructions` to your AI service
    setShowRegenerateModal(false);
    setIsGenerating(true);
    // Simulate regeneration
    await new Promise((r) => setTimeout(r, 2000));
    setEpics(MOCK_EPICS);
    setIsGenerating(false);
  };

  const handleApproveAll = () => {
    setEpics((prev) => prev.map((e) => ({ ...e, status: "approved" })));
  };

  const handleRegenerateEpic = async (epicId: string) => {
    if (!feedbackText.trim()) return;
    setRegeneratingEpicId(epicId);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRegeneratingEpicId(null);
    setFeedbackMode(null);
    setFeedbackText("");
  };

  const approveEpic = (epicId: string) => {
    setEpics(
      epics.map((epic) =>
        epic.id === epicId ? { ...epic, status: "approved" as const } : epic,
      ),
    );
  };

  const rejectEpic = (epicId: string) => {
    if (!feedbackText.trim()) return;
    setEpics(
      epics.map((epic) =>
        epic.id === epicId ? { ...epic, status: "rejected" as const } : epic,
      ),
    );
    setFeedbackMode(null);
    setFeedbackText("");
  };

  const openRegenerateModal = (epicId: string) => {
    setFeedbackMode({ type: "regenerate", epicId });
  };

  const submitFeedback = () => {
    if (!feedbackMode || !feedbackText.trim()) return;

    if (feedbackMode.type === "reject") {
      rejectEpic(feedbackMode.epicId);
    } else {
      handleRegenerateEpic(feedbackMode.epicId);
    }
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Epic Review & Approval
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Review AI-generated epics. Use the controls below to approve or
          regenerate all epics as a batch.
        </p>

        <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleApproveAll}
              className="px-5 py-3 bg-[#22C55E] text-white rounded-xl font-medium hover:brightness-90 transition-all"
            >
              Approve All
            </button>
            <button
              onClick={handleRegenerateAll}
              className="px-5 py-3 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Regenerate All Epics
            </button>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Upload multiple documents, add resource links, and provide
            instructions for your project.
          </div>
        </div>

        {/* Stats */}
        {/* Batch actions inserted above; status cards removed per design */}
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
                            className={`px-2 py-1 ${PRIORITY_COLORS[story.priority]?.bg || PRIORITY_COLORS.P3.bg} ${PRIORITY_COLORS[story.priority]?.text || PRIORITY_COLORS.P3.text} text-xs font-semibold rounded`}
                          >
                            {story.priority}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {story.storyPoints ?? story.story_points} SP
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

      <div className="flex items-center justify-end gap-4">
        <button
          onClick={handleContinue}
          disabled={approvedCount === 0}
          className="px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl font-medium hover:from-[#5558E3] hover:to-[#7C4FE0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to User Story Approval ({approvedCount} Epics)
        </button>
      </div>

      {/* Feedback Modal */}
      {feedbackMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {feedbackMode.type === "reject"
                ? "Provide Rejection Feedback"
                : "Provide Regenerate Feedback"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {feedbackMode.type === "reject"
                ? "Please explain why you're rejecting this epic and what changes are needed for AI regeneration."
                : "Please explain why you're regenerating this epic and what changes are needed for AI regeneration."}
            </p>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] resize-none"
              placeholder="Enter your feedback here..."
            />
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setFeedbackMode(null);
                  setFeedbackText("");
                }}
                className="px-6 py-2 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                disabled={!feedbackText.trim()}
                className={`px-6 py-2 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  feedbackMode.type === "reject"
                    ? "bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C]"
                    : "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4FE0]"
                }`}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regenerate All Modal */}
      {showRegenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl max-w-3xl w-full p-8 my-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-lg flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Regenerate All Epics
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Provide additional context, documents, and instructions to
                    help AI regenerate your epics and user stories
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Section 1: Upload Documents */}
              <div className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Upload Documents
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF, DOCX, TXT (Optional)
                    </p>
                  </div>
                </div>

                {uploadedFiles.length > 0 ? (
                  <div className="space-y-4">
                    {/* Uploaded Documents Summary */}
                    <div className="bg-gradient-to-br from-[#22C55E]/5 to-[#10B981]/5 border border-[#22C55E]/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-[#22C55E]/20 rounded flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {uploadedFiles.length} document
                            {uploadedFiles.length !== 1 ? "s" : ""} uploaded
                          </span>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {(
                            uploadedFiles.reduce((sum, f) => sum + f.size, 0) /
                            1024 /
                            1024
                          ).toFixed(2)}{" "}
                          MB total
                        </span>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-3 p-2.5 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-lg hover:shadow-sm transition-all"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                                  {index + 1}. {file.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setUploadedFiles((prev) =>
                                  prev.filter((_, i) => i !== index),
                                )
                              }
                              className="text-gray-400 hover:text-[#EF4444] p-1.5 rounded transition-colors flex-shrink-0"
                              title="Remove"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add More Button */}
                    <label className="block">
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) =>
                          setUploadedFiles((prev) => [
                            ...prev,
                            ...Array.from(e.target.files || []),
                          ])
                        }
                      />
                      <span className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 rounded-lg font-medium cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all inline-flex items-center gap-2 text-sm w-full justify-center">
                        <Plus className="w-4 h-4" />
                        Add More Documents
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-lg p-8 text-center bg-gray-50 dark:bg-[#0A0F1E]">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Drop files here or click to browse
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                      Supports PDF, DOCX, TXT files up to 10MB each
                    </p>
                    <label className="inline-block">
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) =>
                          setUploadedFiles(Array.from(e.target.files || []))
                        }
                      />
                      <span className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer transition-all inline-block text-sm">
                        Choose Documents
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Section 2: Resource Links */}
              <div className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Resource Links
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Figma, Teams, Documentation (Optional)
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {resourceLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        value={link}
                        onChange={(e) =>
                          setResourceLinks((prev) =>
                            prev.map((p, i) =>
                              i === idx ? e.target.value : p,
                            ),
                          )
                        }
                        placeholder="https://figma.com/... or https://teams.microsoft.com/..."
                        className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1E] border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      {resourceLinks.length > 1 && (
                        <button
                          onClick={() =>
                            setResourceLinks((prev) =>
                              prev.filter((_, i) => i !== idx),
                            )
                          }
                          className="p-2.5 text-gray-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
                          type="button"
                          title="Remove link"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setResourceLinks((prev) => [...prev, ""])}
                    className="w-full px-4 py-2.5 border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all text-sm flex items-center justify-center gap-2"
                    type="button"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Link
                  </button>
                </div>
              </div>

              {/* Section 3: Processing Instructions */}
              <div className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      AI Instructions
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Guide the regeneration process
                    </p>
                  </div>
                </div>
                <textarea
                  value={regenerateInstructions}
                  onChange={(e) => setRegenerateInstructions(e.target.value)}
                  placeholder="Example: Please analyze the new requirements and update the existing epics accordingly. Add new epics for features not covered in the current ones. Ensure all user stories have clear acceptance criteria."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0A0F1E] border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none h-28"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                <button
                  onClick={() => setShowRegenerateModal(false)}
                  className="px-6 py-2.5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRegenerateAll}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4FE0] text-white rounded-lg font-medium transition-all shadow-lg shadow-[#6366F1]/20"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Start Regeneration
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
