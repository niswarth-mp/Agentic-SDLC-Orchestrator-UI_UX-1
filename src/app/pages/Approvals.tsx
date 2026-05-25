import {
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  TestTube,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

type ApprovalCategory =
  | "all"
  | "design"
  | "qa"
  | "merge"
  | "infrastructure"
  | "compliance";

interface Approval {
  id: string;
  project: string;
  type: string;
  category: ApprovalCategory;
  confidence: number;
  reviewer: string;
  gateSummary: {
    security: "PASS" | "FAIL" | "WARNING";
    coverage: number;
    tests: { passed: number; total: number };
    infraCost: string;
    complianceRisk: "LOW" | "MEDIUM" | "HIGH";
  };
  timestamp: string;
  urgency: "critical" | "high" | "normal";
}

export function Approvals() {
  const [activeCategory, setActiveCategory] = useState<ApprovalCategory>("all");

  const approvals: Approval[] = [
    {
      id: "1",
      project: "payment-service",
      type: "QA Approval",
      category: "qa",
      confidence: 91,
      reviewer: "Alice Johnson",
      gateSummary: {
        security: "PASS",
        coverage: 91,
        tests: { passed: 120, total: 120 },
        infraCost: "$120/month",
        complianceRisk: "LOW",
      },
      timestamp: "5m ago",
      urgency: "critical",
    },
    {
      id: "2",
      project: "retail-ui",
      type: "Design Review",
      category: "design",
      confidence: 88,
      reviewer: "Bob Smith",
      gateSummary: {
        security: "PASS",
        coverage: 85,
        tests: { passed: 45, total: 48 },
        infraCost: "$45/month",
        complianceRisk: "LOW",
      },
      timestamp: "12m ago",
      urgency: "high",
    },
    {
      id: "3",
      project: "auth-service",
      type: "Merge Review",
      category: "merge",
      confidence: 76,
      reviewer: "Carol White",
      gateSummary: {
        security: "WARNING",
        coverage: 78,
        tests: { passed: 89, total: 92 },
        infraCost: "$67/month",
        complianceRisk: "MEDIUM",
      },
      timestamp: "1h ago",
      urgency: "normal",
    },
    {
      id: "4",
      project: "analytics-pipeline",
      type: "Infrastructure Approval",
      category: "infrastructure",
      confidence: 82,
      reviewer: "David Lee",
      gateSummary: {
        security: "PASS",
        coverage: 68,
        tests: { passed: 34, total: 35 },
        infraCost: "$234/month",
        complianceRisk: "LOW",
      },
      timestamp: "2h ago",
      urgency: "normal",
    },
  ];

  const categories = [
    { id: "all" as ApprovalCategory, label: "All", count: approvals.length },
    {
      id: "design" as ApprovalCategory,
      label: "Design Reviews",
      count: approvals.filter((a) => a.category === "design").length,
    },
    {
      id: "qa" as ApprovalCategory,
      label: "QA Gates",
      count: approvals.filter((a) => a.category === "qa").length,
    },
    {
      id: "merge" as ApprovalCategory,
      label: "Merge Reviews",
      count: approvals.filter((a) => a.category === "merge").length,
    },
    {
      id: "infrastructure" as ApprovalCategory,
      label: "Infrastructure",
      count: approvals.filter((a) => a.category === "infrastructure").length,
    },
    {
      id: "compliance" as ApprovalCategory,
      label: "Compliance",
      count: approvals.filter((a) => a.category === "compliance").length,
    },
  ];

  const filteredApprovals =
    activeCategory === "all"
      ? approvals
      : approvals.filter((a) => a.category === activeCategory);

  return (
    <div className="p-8 space-y-6 bg-gray-50 dark:bg-[#0A0F1E] transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Approvals
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Review and approve pending changes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-[#EF4444]/10 text-[#EF4444] rounded-lg text-sm font-medium animate-pulse">
            {approvals.filter((a) => a.urgency === "critical").length} Critical
          </span>
          <span className="px-3 py-1.5 bg-[#F59E0B]/10 text-[#F59E0B] rounded-lg text-sm font-medium">
            {approvals.filter((a) => a.urgency === "high").length} High Priority
          </span>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeCategory === category.id
                ? "bg-[#6366F1] text-white"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {category.label} {category.count > 0 && `(${category.count})`}
          </button>
        ))}
      </div>

      {/* Pending Approvals */}
      <div className="space-y-4">
        {filteredApprovals.map((approval) => (
          <div
            key={approval.id}
            className={`bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6 hover:border-[#6366F1]/50 transition-all ${
              approval.urgency === "critical"
                ? "border-[#EF4444]/30"
                : approval.urgency === "high"
                  ? "border-[#F59E0B]/30"
                  : "border-white/10"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {approval.project}
                  </h3>
                  {approval.urgency === "critical" && (
                    <span className="px-2 py-1 bg-[#EF4444]/10 text-[#EF4444] text-xs rounded-full font-medium animate-pulse">
                      CRITICAL
                    </span>
                  )}
                  {approval.urgency === "high" && (
                    <span className="px-2 py-1 bg-[#F59E0B]/10 text-[#F59E0B] text-xs rounded-full font-medium">
                      HIGH PRIORITY
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-3">{approval.type}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>
                    Reviewer:{" "}
                    <span className="text-gray-900 dark:text-white">
                      {approval.reviewer}
                    </span>
                  </span>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{approval.timestamp}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">Confidence Score</p>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        approval.confidence >= 90
                          ? "bg-[#22C55E]"
                          : approval.confidence >= 75
                            ? "bg-[#F59E0B]"
                            : "bg-[#EF4444]"
                      }`}
                      style={{ width: `${approval.confidence}%` }}
                    />
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {approval.confidence}%
                  </span>
                </div>
              </div>
            </div>

            {/* Gate Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield
                  className={`w-5 h-5 ${
                    approval.gateSummary.security === "PASS"
                      ? "text-[#22C55E]"
                      : approval.gateSummary.security === "WARNING"
                        ? "text-[#F59E0B]"
                        : "text-[#EF4444]"
                  }`}
                />
                <div>
                  <p className="text-xs text-gray-400">Security</p>
                  <p
                    className={`text-sm font-medium ${
                      approval.gateSummary.security === "PASS"
                        ? "text-[#22C55E]"
                        : approval.gateSummary.security === "WARNING"
                          ? "text-[#F59E0B]"
                          : "text-[#EF4444]"
                    }`}
                  >
                    {approval.gateSummary.security}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TestTube className="w-5 h-5 text-[#6366F1]" />
                <div>
                  <p className="text-xs text-gray-400">Coverage</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {approval.gateSummary.coverage}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                <div>
                  <p className="text-xs text-gray-400">Tests</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {approval.gateSummary.tests.passed}/
                    {approval.gateSummary.tests.total}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#F59E0B]" />
                <div>
                  <p className="text-xs text-gray-400">Infra Cost</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {approval.gateSummary.infraCost}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <AlertTriangle
                  className={`w-5 h-5 ${
                    approval.gateSummary.complianceRisk === "LOW"
                      ? "text-[#22C55E]"
                      : approval.gateSummary.complianceRisk === "MEDIUM"
                        ? "text-[#F59E0B]"
                        : "text-[#EF4444]"
                  }`}
                />
                <div>
                  <p className="text-xs text-gray-400">Compliance</p>
                  <p
                    className={`text-sm font-medium ${
                      approval.gateSummary.complianceRisk === "LOW"
                        ? "text-[#22C55E]"
                        : approval.gateSummary.complianceRisk === "MEDIUM"
                          ? "text-[#F59E0B]"
                          : "text-[#EF4444]"
                    }`}
                  >
                    {approval.gateSummary.complianceRisk}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 px-6 py-3 bg-[#22C55E] hover:bg-[#1FA84E] text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Approve
              </button>
              <button className="flex-1 px-6 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                <XCircle className="w-5 h-5" />
                Reject
              </button>
              <button className="px-6 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg font-medium transition-all">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
