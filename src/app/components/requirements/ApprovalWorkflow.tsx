import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  User,
  Clock,
} from "lucide-react";

interface UserStory {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  storyPoints: number;
  acceptanceCriteria: string[];
  status: "pending" | "approved" | "rejected";
  expanded?: boolean;
  feedback?: string;
}

interface Epic {
  id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  userStories: UserStory[];
  expanded?: boolean;
  feedback?: string;
}

interface ApprovalWorkflowProps {
  epics: Epic[];
  onComplete: (status: "approved" | "partial") => void;
}

export function ApprovalWorkflow({
  epics: initialEpics,
  onComplete,
}: ApprovalWorkflowProps) {
  const [epics, setEpics] = useState(initialEpics);
  const [feedbackMode, setFeedbackMode] = useState<{
    type: "epic" | "story";
    id: string;
    epicId?: string;
  } | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [regeneratingStoryId, setRegeneratingStoryId] = useState<string | null>(
    null,
  );

  const approveAllStories = (epicId: string) => {
    setEpics(
      epics.map((epic) =>
        epic.id === epicId
          ? {
              ...epic,
              userStories: epic.userStories.map((story) => ({
                ...story,
                status: "approved" as const,
              })),
            }
          : epic,
      ),
    );
  };

  const approveStory = (epicId: string, storyId: string) => {
    setEpics(
      epics.map((epic) =>
        epic.id === epicId
          ? {
              ...epic,
              userStories: epic.userStories.map((story) =>
                story.id === storyId
                  ? { ...story, status: "approved" as const }
                  : story,
              ),
            }
          : epic,
      ),
    );
  };

  const rejectWithFeedback = (
    type: "epic" | "story",
    id: string,
    epicId?: string,
  ) => {
    setFeedbackMode({ type, id, epicId });
  };

  const regenerateStory = async (epicId: string, storyId: string) => {
    setRegeneratingStoryId(storyId);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRegeneratingStoryId(null);
  };

  const submitFeedback = () => {
    if (!feedbackMode || !feedbackText.trim()) return;

    setEpics(
      epics.map((epic) =>
        epic.id === feedbackMode.epicId
          ? {
              ...epic,
              userStories: epic.userStories.map((story) =>
                story.id === feedbackMode.id
                  ? {
                      ...story,
                      status: "rejected" as const,
                      feedback: feedbackText,
                    }
                  : story,
              ),
            }
          : epic,
      ),
    );

    setFeedbackMode(null);
    setFeedbackText("");
  };

  const toggleEpic = (epicId: string) => {
    setEpics(
      epics.map((epic) =>
        epic.id === epicId ? { ...epic, expanded: !epic.expanded } : epic,
      ),
    );
  };

  const handleComplete = () => {
    const hasRejected = epics.some(
      (e) =>
        e.status === "rejected" ||
        e.userStories.some((s) => s.status === "rejected"),
    );
    onComplete(hasRejected ? "partial" : "approved");
  };

  const approvedCount = epics.reduce((acc, epic) => {
    return acc + epic.userStories.filter((s) => s.status === "approved").length;
  }, 0);
  const totalCount = epics.reduce(
    (acc, epic) => acc + epic.userStories.length,
    0,
  );
  const rejectedCount = epics.reduce((acc, epic) => {
    return acc + epic.userStories.filter((s) => s.status === "rejected").length;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          User Story Review & Approval
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Review and approve user stories from the approved epics. You can
          approve, reject, or regenerate individual stories.
        </p>
      </div>

      {/* Approval Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Total
            </span>
            <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {totalCount}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            User Stories
          </p>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Approved
            </span>
            <CheckCircle className="w-5 h-5 text-[#22C55E]" />
          </div>
          <p className="text-3xl font-bold text-[#22C55E]">{approvedCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {Math.round((approvedCount / totalCount) * 100)}% Complete
          </p>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Rejected
            </span>
            <XCircle className="w-5 h-5 text-[#EF4444]" />
          </div>
          <p className="text-3xl font-bold text-[#EF4444]">{rejectedCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Need Revision
          </p>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Pending
            </span>
            <RefreshCw className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <p className="text-3xl font-bold text-[#F59E0B]">
            {totalCount - approvedCount - rejectedCount}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Review Needed
          </p>
        </div>
      </div>

      {/* User Stories by Epic */}
      <div className="space-y-4">
        {epics.map((epic) => {
          const epicApprovedCount = epic.userStories.filter(
            (s) => s.status === "approved",
          ).length;
          const epicPendingCount = epic.userStories.filter(
            (s) => s.status === "pending",
          ).length;

          return (
            <div
              key={epic.id}
              className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleEpic(epic.id)}
                    className="mt-1 text-gray-400 dark:text-gray-500"
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
                          <span className="px-3 py-1 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-semibold rounded-full">
                            EPIC APPROVED
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {epic.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>
                            {epicApprovedCount}/{epic.userStories.length}{" "}
                            Stories Approved
                          </span>
                          {epicPendingCount > 0 && (
                            <span>• {epicPendingCount} Pending Review</span>
                          )}
                        </div>
                      </div>
                      {epicPendingCount > 0 && (
                        <button
                          onClick={() => approveAllStories(epic.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 hover:bg-[#22C55E]/20 border border-[#22C55E]/30 text-[#22C55E] rounded-lg transition-all"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve All Stories
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {epic.expanded && (
                  <div className="mt-6 pl-9 space-y-4">
                    {epic.userStories.map((story) => (
                      <div
                        key={story.id}
                        className="bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                {story.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {story.description}
                              </p>
                              <div className="flex items-center gap-3">
                                {story.status === "approved" && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#22C55E]/10 text-[#22C55E] text-xs font-semibold rounded">
                                    <CheckCircle className="w-3 h-3" />
                                    Approved
                                  </span>
                                )}
                                {story.status === "rejected" && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#EF4444]/10 text-[#EF4444] text-xs font-semibold rounded">
                                    <XCircle className="w-3 h-3" />
                                    Rejected
                                  </span>
                                )}
                              </div>
                              {story.feedback && (
                                <div className="mt-3 p-2 bg-[#EF4444]/5 border border-[#EF4444]/20 rounded">
                                  <p className="text-xs font-semibold text-[#EF4444] mb-1">
                                    Rejection Feedback
                                  </p>
                                  <p className="text-xs text-gray-700 dark:text-gray-300">
                                    {story.feedback}
                                  </p>
                                </div>
                              )}
                            </div>
                            {story.status === "pending" && (
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  onClick={() =>
                                    approveStory(epic.id, story.id)
                                  }
                                  className="flex items-center gap-2 px-3 py-2 bg-[#22C55E]/10 hover:bg-[#22C55E]/20 border border-[#22C55E]/30 text-[#22C55E] rounded-lg transition-all text-xs"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    rejectWithFeedback(
                                      "story",
                                      story.id,
                                      epic.id,
                                    )
                                  }
                                  className="flex items-center gap-2 px-3 py-2 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#EF4444] rounded-lg transition-all text-xs"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                                <button
                                  onClick={() =>
                                    regenerateStory(epic.id, story.id)
                                  }
                                  disabled={regeneratingStoryId === story.id}
                                  className="flex items-center gap-2 px-3 py-2 bg-[#6366F1]/10 hover:bg-[#6366F1]/20 border border-[#6366F1]/30 text-[#6366F1] rounded-lg transition-all text-xs disabled:opacity-50"
                                  title="Regenerate"
                                >
                                  <RefreshCw
                                    className={`w-4 h-4 ${regeneratingStoryId === story.id ? "animate-spin" : ""}`}
                                  />
                                  {regeneratingStoryId === story.id
                                    ? "Regenerating..."
                                    : "Regenerate"}
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Acceptance Criteria */}
                          <div className="border-t border-gray-200 dark:border-white/10 pt-4">
                            <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                              Acceptance Criteria
                            </h5>
                            <div className="space-y-2">
                              {story.acceptanceCriteria.map(
                                (criteria, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-3"
                                  >
                                    <div className="w-5 h-5 rounded border-2 border-gray-300 dark:border-white/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {index + 1}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                                      {criteria}
                                    </p>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback Modal */}
      {feedbackMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Provide Rejection Feedback
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Please explain why you're rejecting this user story and what
              changes are needed for AI regeneration.
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
                className="px-6 py-2 bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white rounded-lg hover:from-[#DC2626] hover:to-[#B91C1C] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button className="px-6 py-3 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
          Save as Draft
        </button>
        <button
          onClick={handleComplete}
          disabled={approvedCount === 0}
          className="px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl font-medium hover:from-[#5558E3] hover:to-[#7C4FE0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Jira Integration
        </button>
      </div>
    </div>
  );
}
