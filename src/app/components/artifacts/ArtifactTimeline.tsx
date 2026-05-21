import {
  CheckCircle,
  Clock,
  XCircle,
  User,
  GitCommit,
  Rocket,
  ArrowLeft,
  Filter,
  Download,
  MessageSquareDiff,
  AlertCircle,
} from "lucide-react";

interface TimelineIteration {
  id: number;
  timestamp: string;
  agent: string;
  confidence: number;
  status: "approved" | "pending" | "rejected" | "review_requested";
  changes: string;
  approver?: string;
  deployment?: string;
  changeType?: string;
  priority?: string;
  requestedBy?: string;
}

interface ChangeRequest {
  description: string;
  changeType: string;
  priority: string;
  submittedAt: string;
}

interface ArtifactTimelineProps {
  fileName?: string;
  section?: string;
  onBack?: () => void;
  changeRequest?: ChangeRequest;
}

const CHANGE_TYPE_LABELS: Record<string, string> = {
  bug: "Bug Fix",
  enhancement: "Enhancement",
  security: "Security",
  refactor: "Refactor",
  docs: "Documentation",
};

const PRIORITY_CONFIG: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  low: { label: "Low", color: "text-gray-400", dot: "bg-gray-400" },
  medium: { label: "Medium", color: "text-[#F59E0B]", dot: "bg-[#F59E0B]" },
  high: { label: "High", color: "text-[#EF4444]", dot: "bg-[#EF4444]" },
  critical: {
    label: "Critical",
    color: "text-[#EF4444]",
    dot: "bg-[#EF4444] animate-pulse",
  },
};

export function ArtifactTimeline({
  fileName,
  section,
  onBack,
  changeRequest,
}: ArtifactTimelineProps) {
  const baseIterations: TimelineIteration[] = [
    {
      id: 3,
      timestamp: "2024-05-19 10:22",
      agent: "development_agent",
      confidence: 91,
      status: "pending",
      changes: "Added notification service integration",
    },
    {
      id: 2,
      timestamp: "2024-05-19 10:15",
      agent: "development_agent",
      confidence: 85,
      status: "approved",
      changes: "Enhanced JWT validation and retry mechanism",
      approver: "Alice Johnson",
      deployment: "staging-v12",
    },
    {
      id: 1,
      timestamp: "2024-05-19 09:45",
      agent: "development_agent",
      confidence: 61,
      status: "rejected",
      changes: "Initial payment service implementation",
      approver: "Bob Smith",
    },
  ];

  const iterations: TimelineIteration[] = changeRequest
    ? [
        {
          id: baseIterations.length + 1,
          timestamp: changeRequest.submittedAt,
          agent: "human_reviewer",
          confidence: 0,
          status: "review_requested",
          changes: changeRequest.description,
          changeType: changeRequest.changeType,
          priority: changeRequest.priority,
          requestedBy: "You",
        },
        ...baseIterations,
      ]
    : baseIterations;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return {
          icon: CheckCircle,
          color: "text-[#22C55E]",
          bgColor: "bg-[#22C55E]/10",
          borderColor: "border-[#22C55E]/30",
          glowColor: "shadow-[#22C55E]/20",
          label: "Approved",
        };
      case "pending":
        return {
          icon: Clock,
          color: "text-[#F59E0B]",
          bgColor: "bg-[#F59E0B]/10",
          borderColor: "border-[#F59E0B]/30",
          glowColor: "shadow-[#F59E0B]/20",
          label: "Pending",
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "text-[#EF4444]",
          bgColor: "bg-[#EF4444]/10",
          borderColor: "border-[#EF4444]/30",
          glowColor: "shadow-[#EF4444]/20",
          label: "Rejected",
        };
      case "review_requested":
        return {
          icon: MessageSquareDiff,
          color: "text-[#6366F1]",
          bgColor: "bg-[#6366F1]/10",
          borderColor: "border-[#6366F1]/40",
          glowColor: "shadow-[#6366F1]/20",
          label: "Review Requested",
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-400",
          bgColor: "bg-white/5",
          borderColor: "border-white/10",
          glowColor: "",
          label: "Unknown",
        };
    }
  };

  const totalIterations = iterations.length;
  const approved = iterations.filter((i) => i.status === "approved").length;
  const pending = iterations.filter((i) => i.status === "pending").length;
  const rejected = iterations.filter((i) => i.status === "rejected").length;
  const reviewRequested = iterations.filter(
    (i) => i.status === "review_requested",
  ).length;

  return (
    <div className="h-full flex flex-col bg-[#0A0F1E] overflow-hidden">
      {/* Page Header */}
      <div className="bg-[#111827] border-b border-white/10 px-6 py-5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-xl transition-all text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Code
              </button>
            )}
            <div className="h-5 w-px bg-white/10" />
            <div>
              <div className="flex items-center gap-3">
                <GitCommit className="w-5 h-5 text-[#8B5CF6]" />
                <h1 className="text-lg font-bold text-white">
                  Artifact Timeline
                </h1>
              </div>
              {fileName && (
                <p className="text-xs text-gray-400 mt-0.5 pl-8">
                  <span className="text-gray-500 capitalize">{section}</span>
                  <span className="text-gray-600 mx-1.5">/</span>
                  <span className="text-[#6366F1] font-medium">{fileName}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl transition-all text-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl transition-all text-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Change Request Submitted Banner */}
      {changeRequest && (
        <div className="bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 border-b border-[#6366F1]/20 px-8 py-4 flex-shrink-0">
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <div className="p-2 bg-[#6366F1]/20 border border-[#6366F1]/30 rounded-xl flex-shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 text-[#6366F1]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white mb-0.5">
                Change request submitted
              </p>
              <p className="text-sm text-gray-400 leading-relaxed truncate">
                "{changeRequest.description}"
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {changeRequest.priority &&
                PRIORITY_CONFIG[changeRequest.priority] && (
                  <span
                    className={`flex items-center gap-1.5 text-xs font-semibold ${PRIORITY_CONFIG[changeRequest.priority].color}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${PRIORITY_CONFIG[changeRequest.priority].dot}`}
                    />
                    {PRIORITY_CONFIG[changeRequest.priority].label}
                  </span>
                )}
              {changeRequest.changeType && (
                <span className="px-2.5 py-1 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] text-xs font-semibold rounded-lg">
                  {CHANGE_TYPE_LABELS[changeRequest.changeType] ??
                    changeRequest.changeType}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="bg-[#0D1321] border-b border-white/5 px-8 py-4 flex items-center gap-8 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">
            {totalIterations}
          </span>
          <span className="text-sm text-gray-400">total iterations</span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#22C55E] rounded-full" />
            <span className="text-sm text-gray-300 font-medium">
              {approved}
            </span>
            <span className="text-xs text-gray-500">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#F59E0B] rounded-full animate-pulse" />
            <span className="text-sm text-gray-300 font-medium">{pending}</span>
            <span className="text-xs text-gray-500">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#EF4444] rounded-full" />
            <span className="text-sm text-gray-300 font-medium">
              {rejected}
            </span>
            <span className="text-xs text-gray-500">Rejected</span>
          </div>
          {reviewRequested > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#6366F1] rounded-full animate-pulse" />
              <span className="text-sm text-gray-300 font-medium">
                {reviewRequested}
              </span>
              <span className="text-xs text-gray-500">In Review</span>
            </div>
          )}
        </div>
        <div className="flex-1 ml-4">
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden flex">
            {reviewRequested > 0 && (
              <div
                className="h-full bg-[#6366F1] transition-all"
                style={{
                  width: `${(reviewRequested / totalIterations) * 100}%`,
                }}
              />
            )}
            <div
              className="h-full bg-[#22C55E] transition-all"
              style={{ width: `${(approved / totalIterations) * 100}%` }}
            />
            <div
              className="h-full bg-[#F59E0B] transition-all"
              style={{ width: `${(pending / totalIterations) * 100}%` }}
            />
            <div
              className="h-full bg-[#EF4444] transition-all"
              style={{ width: `${(rejected / totalIterations) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-10">
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#6366F1] via-[#8B5CF6] to-transparent" />

            {/* Timeline Items */}
            <div className="space-y-8">
              {iterations.map((iteration) => {
                const config = getStatusConfig(iteration.status);
                const StatusIcon = config.icon;
                const isReviewRequested =
                  iteration.status === "review_requested";
                const priorityCfg = iteration.priority
                  ? PRIORITY_CONFIG[iteration.priority]
                  : null;

                return (
                  <div key={iteration.id} className="relative pl-28">
                    {/* Node */}
                    <div className="absolute left-0 top-0 flex items-start gap-4">
                      <div
                        className={`w-20 h-20 ${config.bgColor} border-2 ${config.borderColor} rounded-2xl flex items-center justify-center shadow-lg ${config.glowColor} ${
                          isReviewRequested || iteration.status === "pending"
                            ? "animate-pulse"
                            : ""
                        }`}
                      >
                        {isReviewRequested ? (
                          <MessageSquareDiff className="w-8 h-8 text-[#6366F1]" />
                        ) : (
                          <div className="text-center">
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                              Iter
                            </p>
                            <p className="text-2xl font-bold text-white leading-none mt-0.5">
                              {iteration.id}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Card */}
                    <div
                      className={`${config.bgColor} border ${config.borderColor} rounded-2xl p-5 hover:border-white/20 transition-all ${
                        isReviewRequested ? "ring-1 ring-[#6366F1]/20" : ""
                      }`}
                    >
                      {/* Header Row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h4 className="text-base font-semibold text-white leading-snug">
                              {iteration.changes}
                            </h4>
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${config.bgColor} border ${config.borderColor} ${config.color} text-xs rounded-full font-semibold uppercase tracking-wide flex-shrink-0`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {config.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <GitCommit className="w-3.5 h-3.5 text-[#6366F1]" />
                              <span className="font-mono text-[#6366F1]">
                                {iteration.agent}
                              </span>
                            </div>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-400">
                              {iteration.timestamp}
                            </span>
                            {(iteration.approver || iteration.requestedBy) && (
                              <>
                                <span className="text-gray-600">•</span>
                                <div className="flex items-center gap-1.5">
                                  <User className="w-3.5 h-3.5" />
                                  <span>
                                    {iteration.requestedBy ??
                                      iteration.approver}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Change type + priority tags for review_requested */}
                          {isReviewRequested &&
                            (iteration.changeType || iteration.priority) && (
                              <div className="flex items-center gap-2 mt-3">
                                {iteration.changeType && (
                                  <span className="px-2 py-0.5 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] text-xs font-semibold rounded-md">
                                    {CHANGE_TYPE_LABELS[iteration.changeType] ??
                                      iteration.changeType}
                                  </span>
                                )}
                                {priorityCfg && (
                                  <span
                                    className={`flex items-center gap-1.5 text-xs font-semibold ${priorityCfg.color}`}
                                  >
                                    <span
                                      className={`w-2 h-2 rounded-full ${priorityCfg.dot}`}
                                    />
                                    {priorityCfg.label} Priority
                                  </span>
                                )}
                              </div>
                            )}
                        </div>

                        {/* Confidence Score — hide for review_requested */}
                        {!isReviewRequested && (
                          <div className="text-right flex-shrink-0">
                            <p className="text-[10px] text-gray-500 mb-1.5 uppercase tracking-wider">
                              Confidence
                            </p>
                            <div className="flex items-center gap-2.5 justify-end">
                              <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    iteration.confidence >= 90
                                      ? "bg-[#22C55E]"
                                      : iteration.confidence >= 75
                                        ? "bg-[#F59E0B]"
                                        : "bg-[#EF4444]"
                                  }`}
                                  style={{ width: `${iteration.confidence}%` }}
                                />
                              </div>
                              <span className="text-base font-bold text-white w-10 text-right">
                                {iteration.confidence}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Deployment Badge */}
                      {iteration.deployment && (
                        <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                          <Rocket className="w-3.5 h-3.5 text-[#8B5CF6]" />
                          <span className="text-xs text-gray-300">
                            Deployed to:{" "}
                            <span className="text-[#8B5CF6] font-medium">
                              {iteration.deployment}
                            </span>
                          </span>
                        </div>
                      )}

                      {/* Awaiting AI regeneration notice */}
                      {isReviewRequested && (
                        <div className="pt-3 border-t border-[#6366F1]/20 flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#6366F1] rounded-full animate-ping" />
                          <span className="text-xs text-[#6366F1] font-medium">
                            Awaiting AI agent to generate next iteration...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Origin Marker */}
              <div className="relative pl-28">
                <div className="absolute left-0 top-0 w-20 flex justify-center">
                  <div className="w-3 h-3 bg-[#6366F1] rounded-full ring-4 ring-[#6366F1]/20" />
                </div>
                <p className="text-xs text-gray-500 italic pt-0.5">
                  Artifact generation started
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
