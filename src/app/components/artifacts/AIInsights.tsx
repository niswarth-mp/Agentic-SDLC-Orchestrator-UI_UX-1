import { useState } from "react";
import {
  Sparkles,
  Shield,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Send,
  Lightbulb,
  Target,
  Activity,
  X,
} from "lucide-react";

interface AIInsightsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIInsights({ isOpen, onClose }: AIInsightsProps) {
  const [chatInput, setChatInput] = useState("");

  if (!isOpen) return null;

  const insights = [
    {
      type: "warning",
      icon: AlertTriangle,
      color: "text-[#F59E0B]",
      bgColor: "bg-[#F59E0B]/10",
      title: "Optimization Available",
      description:
        "Retry logic missing circuit breaker pattern. Consider adding fallback.",
      action: "View Suggestion",
    },
    {
      type: "success",
      icon: TrendingUp,
      color: "text-[#22C55E]",
      bgColor: "bg-[#22C55E]/10",
      title: "Coverage Improved",
      description: "Test coverage increased from 79% to 91% (+12%)",
      action: "View Tests",
    },
    {
      type: "info",
      icon: Shield,
      color: "text-[#6366F1]",
      bgColor: "bg-[#6366F1]/10",
      title: "Security Status",
      description: "Risk Level: LOW. JWT validation follows OWASP guidelines.",
      action: "View Report",
    },
    {
      type: "info",
      icon: Zap,
      color: "text-[#8B5CF6]",
      bgColor: "bg-[#8B5CF6]/10",
      title: "Performance Insight",
      description:
        "Expected latency: 45ms. Consider caching for high-traffic endpoints.",
      action: "Optimize",
    },
  ];

  const relatedArtifacts = [
    { name: "PaymentServiceTest.java", type: "Test", status: "linked" },
    { name: "PaymentController.java", type: "Dependency", status: "linked" },
    { name: "deployment.yaml", type: "Deployment", status: "pending" },
  ];

  const metrics = [
    { label: "Lines Changed", value: "42", trend: "+12" },
    { label: "Complexity", value: "3.2", trend: "-0.5" },
    { label: "Test Coverage", value: "91%", trend: "+12%" },
    { label: "Security Score", value: "95", trend: "+8" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
      />

      {/* Slide-in Panel */}
      <div className="fixed inset-y-0 right-0 w-[440px] bg-[#0A0F1E] border-l border-white/10 flex flex-col z-50 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#6366F1]/5 to-[#8B5CF6]/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">AI Insights</h3>
                <p className="text-xs text-gray-400">
                  Powered by Agentic Intelligence
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metrics Grid */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">
              Artifact Metrics
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all"
                >
                  <p className="text-xs text-gray-400 mb-2">{metric.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">
                      {metric.value}
                    </span>
                    <span className="text-xs text-[#22C55E] font-medium">
                      {metric.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Smart Recommendations
            </h4>
            <div className="space-y-3">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div
                    key={index}
                    className={`${insight.bgColor} border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all cursor-pointer group`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 ${insight.bgColor} rounded-lg`}>
                        <Icon className={`w-4 h-4 ${insight.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-semibold text-white mb-2">
                          {insight.title}
                        </h5>
                        <p className="text-xs text-gray-300 leading-relaxed mb-3">
                          {insight.description}
                        </p>
                        <button className="text-xs text-[#6366F1] hover:text-[#8B5CF6] font-medium transition-colors group-hover:underline">
                          {insight.action} →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Related Artifacts */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4" />
              Related Files
            </h4>
            <div className="space-y-2">
              {relatedArtifacts.map((artifact, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all group cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-[#6366F1] transition-colors">
                      {artifact.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {artifact.type}
                    </p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-[#22C55E] flex-shrink-0 ml-3" />
                </div>
              ))}
            </div>
          </div>

          {/* Deployment Health */}
          <div className="bg-gradient-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-[#22C55E]/20 rounded-lg">
                <Activity className="w-4 h-4 text-[#22C55E]" />
              </div>
              <h4 className="text-sm font-semibold text-white">
                Deployment Health
              </h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Environment</span>
                <span className="text-sm text-white font-semibold">
                  staging-v12
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Pods Healthy</span>
                <span className="text-sm text-[#22C55E] font-semibold">
                  12/12
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Latency</span>
                <span className="text-sm text-white font-semibold">45ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Error Rate</span>
                <span className="text-sm text-[#22C55E] font-semibold">
                  0.01%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chat Input */}
        <div className="p-6 border-t border-white/10 bg-gradient-to-t from-[#0A0F1E] to-transparent">
          <div className="relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask AI anything about this artifact..."
              className="w-full pl-5 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C3AED] rounded-lg transition-all">
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 hover:text-white transition-all">
              Why retry logic?
            </button>
            <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 hover:text-white transition-all">
              Security improvements
            </button>
            <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 hover:text-white transition-all">
              Optimize performance
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
