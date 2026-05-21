import { useState } from 'react';
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
} from 'lucide-react';

export function AIInsights() {
  const [chatInput, setChatInput] = useState('');

  const insights = [
    {
      type: 'warning',
      icon: AlertTriangle,
      color: 'text-[#F59E0B]',
      bgColor: 'bg-[#F59E0B]/10',
      title: 'Optimization Available',
      description: 'Retry logic missing circuit breaker pattern. Consider adding fallback.',
      action: 'View Suggestion',
    },
    {
      type: 'success',
      icon: TrendingUp,
      color: 'text-[#22C55E]',
      bgColor: 'bg-[#22C55E]/10',
      title: 'Coverage Improved',
      description: 'Test coverage increased from 79% to 91% (+12%)',
      action: 'View Tests',
    },
    {
      type: 'info',
      icon: Shield,
      color: 'text-[#6366F1]',
      bgColor: 'bg-[#6366F1]/10',
      title: 'Security Status',
      description: 'Risk Level: LOW. JWT validation follows OWASP guidelines.',
      action: 'View Report',
    },
    {
      type: 'info',
      icon: Zap,
      color: 'text-[#8B5CF6]',
      bgColor: 'bg-[#8B5CF6]/10',
      title: 'Performance Insight',
      description: 'Expected latency: 45ms. Consider caching for high-traffic endpoints.',
      action: 'Optimize',
    },
  ];

  const relatedArtifacts = [
    { name: 'PaymentServiceTest.java', type: 'Test', status: 'linked' },
    { name: 'PaymentController.java', type: 'Dependency', status: 'linked' },
    { name: 'deployment.yaml', type: 'Deployment', status: 'pending' },
  ];

  const metrics = [
    { label: 'Lines Changed', value: '42', trend: '+12' },
    { label: 'Complexity', value: '3.2', trend: '-0.5' },
    { label: 'Test Coverage', value: '91%', trend: '+12%' },
    { label: 'Security Score', value: '95', trend: '+8' },
  ];

  return (
    <div className="w-[380px] bg-[#0F172A] border-l border-white/10 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-white">AI Insights</h3>
        </div>
        <p className="text-xs text-gray-400">Powered by Agentic Intelligence</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Metrics Grid */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
            Artifact Metrics
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-[#111827] rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">{metric.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-white">{metric.value}</span>
                  <span className="text-xs text-[#22C55E]">{metric.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-3.5 h-3.5" />
            Recommendations
          </h4>
          <div className="space-y-2">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div
                  key={index}
                  className={`${insight.bgColor} border border-white/10 rounded-lg p-3 hover:border-white/20 transition-all`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <Icon className={`w-4 h-4 ${insight.color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-white mb-1">{insight.title}</h5>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                  <button className="text-xs text-[#6366F1] hover:text-[#8B5CF6] font-medium transition-colors">
                    {insight.action} →
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Artifacts */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Target className="w-3.5 h-3.5" />
            Related Artifacts
          </h4>
          <div className="space-y-2">
            {relatedArtifacts.map((artifact, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all group cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate group-hover:text-[#6366F1] transition-colors">
                    {artifact.name}
                  </p>
                  <p className="text-[10px] text-gray-500">{artifact.type}</p>
                </div>
                <CheckCircle className="w-3.5 h-3.5 text-[#22C55E] flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Deployment Health */}
        <div className="bg-gradient-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-[#22C55E]" />
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Deployment Status
            </h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300">Environment</span>
              <span className="text-white font-medium">staging-v12</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300">Pods Healthy</span>
              <span className="text-[#22C55E] font-medium">12/12</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300">Latency</span>
              <span className="text-white font-medium">45ms</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300">Error Rate</span>
              <span className="text-[#22C55E] font-medium">0.01%</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Input */}
      <div className="p-4 border-t border-white/10 bg-[#111827]">
        <div className="relative">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask AI about this artifact..."
            className="w-full pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#6366F1] hover:bg-[#5558E3] rounded-lg transition-all">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-[10px] text-gray-500 mt-2 text-center">
          Try: "Why was retry logic added?" or "Show security improvements"
        </p>
      </div>
    </div>
  );
}
