import { useParams } from "react-router";
import { useState } from "react";
import { SDLCTimeline } from "../components/SDLCTimeline";
import { AICopilot } from "../components/AICopilot";
import { ArtifactsExplorer } from "../components/ArtifactsExplorer";
import { PipelineExecution } from "../components/PipelineExecution";
import {
  Activity,
  Package,
  CheckCircle,
  BarChart3,
  FileText,
} from "lucide-react";

type TabType = "artifacts" | "logs" | "approvals" | "metrics" | "audit";

export function ProjectDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>("artifacts");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const timelineNodes = [
    { id: "req", name: "Req", status: "completed" as const },
    { id: "design", name: "Design", status: "completed" as const },
    { id: "development", name: "Development", status: "active" as const },
    { id: "qa", name: "QA", status: "pending" as const },
    { id: "merge", name: "Merge", status: "pending" as const },
    { id: "deploy", name: "Deploy", status: "pending" as const },
  ];

  const tabs = [
    { id: "artifacts", label: "Artifacts", icon: Package },
    { id: "logs", label: "Logs", icon: Activity },
    { id: "approvals", label: "Approvals", icon: CheckCircle },
    { id: "metrics", label: "Metrics", icon: BarChart3 },
    { id: "audit", label: "Audit", icon: FileText },
  ];

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#0A0F1E] transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Project: {id}
            </h1>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Environment:{" "}
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  staging
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Pipeline:{" "}
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  default
                </span>
              </div>
              <div>
                <span className="text-gray-400">Status: </span>
                <span className="text-[#22C55E] font-medium">● Running</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 mb-1">Confidence Score</p>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#22C55E] rounded-full"
                  style={{ width: "91%" }}
                />
              </div>
              <span className="text-2xl font-bold text-white">91%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: SDLC Timeline */}
        <div className="w-64 bg-white dark:bg-[#111827] border-r border-gray-200 dark:border-white/10 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-white/10">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              SDLC Timeline
            </h2>
          </div>
          <SDLCTimeline nodes={timelineNodes} onNodeClick={handleNodeClick} />
        </div>

        {/* Center: Tabs Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-6 pt-4 border-b border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-[#0A0F1E] text-white border-t-2 border-[#6366F1]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-[#0A0F1E]">
            {activeTab === "artifacts" && <ArtifactsExplorer />}
            {activeTab === "logs" && (
              <div className="h-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Execution Logs
                </h3>
                <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-lg p-4 font-mono text-sm space-y-1 overflow-y-auto max-h-[500px]">
                  <div className="text-gray-400">
                    [2024-05-19 10:22:15] development_agent: Starting test
                    generation...
                  </div>
                  <div className="text-gray-400">
                    [2024-05-19 10:22:18] development_agent: Generated 12 unit
                    tests
                  </div>
                  <div className="text-[#F59E0B]">
                    [2024-05-19 10:21:45] security_agent: WARNING - JWT
                    vulnerability detected
                  </div>
                  <div className="text-gray-400">
                    [2024-05-19 10:21:50] security_agent: Running security
                    scan...
                  </div>
                  <div className="text-[#22C55E]">
                    [2024-05-19 10:20:30] testing_agent: Coverage increased to
                    91%
                  </div>
                </div>
              </div>
            )}
            {activeTab === "approvals" && (
              <div className="h-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Pending Approvals
                </h3>
                <div className="space-y-4">
                  <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-lg p-4">
                    <h4 className="text-gray-900 dark:text-white font-medium mb-2">
                      Design Approval
                    </h4>
                    <p className="text-sm text-gray-400 mb-3">
                      Reviewer: Alice • Confidence: 88%
                    </p>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-[#22C55E] hover:bg-[#1FA84E] text-white rounded-lg transition-all">
                        Approve
                      </button>
                      <button className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg transition-all">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "metrics" && <PipelineExecution />}
            {activeTab === "audit" && (
              <div className="h-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Audit Trail
                </h3>
                <div className="space-y-2">
                  <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      2024-05-19 10:22 • development_agent modified
                      PaymentService.java
                    </p>
                  </div>
                  <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      2024-05-19 10:21 • security_agent flagged vulnerability
                      CVE-2024-1234
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: AI Copilot */}
        <div className="w-96 bg-white dark:bg-[#111827] border-l border-gray-200 dark:border-white/10">
          <AICopilot />
        </div>
      </div>
    </div>
  );
}
