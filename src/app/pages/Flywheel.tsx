import { TrendingUp, Brain, Zap, Target } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function Flywheel() {
  const learningData = [
    { week: "Week 1", accuracy: 65, feedback: 12 },
    { week: "Week 2", accuracy: 71, feedback: 18 },
    { week: "Week 3", accuracy: 78, feedback: 24 },
    { week: "Week 4", accuracy: 84, feedback: 31 },
    { week: "Week 5", accuracy: 89, feedback: 38 },
    { week: "Week 6", accuracy: 92, feedback: 42 },
  ];

  const skillProgression = [
    {
      skill: "Requirements Analysis",
      baseline: 65,
      current: 92,
      improvement: 27,
    },
    { skill: "Code Generation", baseline: 58, current: 85, improvement: 27 },
    { skill: "Test Creation", baseline: 72, current: 88, improvement: 16 },
    { skill: "Security Scanning", baseline: 81, current: 94, improvement: 13 },
    {
      skill: "Infrastructure as Code",
      baseline: 45,
      current: 73,
      improvement: 28,
    },
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-50 dark:bg-[#0A0F1E] transition-colors">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Flywheel
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Continuous learning and improvement through feedback loops
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-[#6366F1]/10 rounded-lg">
              <Brain className="w-6 h-6 text-[#6366F1]" />
            </div>
            <div className="flex items-center gap-1 text-[#22C55E] text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+18%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            92%
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overall Accuracy
          </p>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-[#22C55E]/10 rounded-lg">
              <Target className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div className="flex items-center gap-1 text-[#22C55E] text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+45</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            287
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Learning Iterations
          </p>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
              <Zap className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div className="flex items-center gap-1 text-[#22C55E] text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            145
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Feedback Loops
          </p>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-[#8B5CF6]/10 rounded-lg">
              <Brain className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <div className="flex items-center gap-1 text-[#22C55E] text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+8</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            23
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Model Improvements
          </p>
        </div>
      </div>

      {/* Learning Curve */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Learning Curve Over Time
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={learningData}>
            <defs>
              <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
            <XAxis dataKey="week" stroke="#64748B" />
            <YAxis stroke="#64748B" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#F8FAFC",
                border: "1px solid rgba(148,163,184,0.2)",
                borderRadius: "8px",
                color: "#0F172A",
              }}
            />
            <Area
              type="monotone"
              dataKey="accuracy"
              stroke="#6366F1"
              strokeWidth={2}
              fill="url(#accuracyGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Skill Progression */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          AI Skill Progression
        </h2>
        <div className="space-y-6">
          {skillProgression.map((skill) => (
            <div key={skill.skill}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 dark:text-white font-medium">
                  {skill.skill}
                </h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Baseline:{" "}
                    <span className="text-gray-900 dark:text-white font-medium">
                      {skill.baseline}%
                    </span>
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    Current:{" "}
                    <span className="text-[#22C55E] font-bold">
                      {skill.current}%
                    </span>
                  </span>
                  <span className="px-2 py-1 bg-[#22C55E]/10 text-[#22C55E] text-xs rounded-full font-medium">
                    +{skill.improvement}%
                  </span>
                </div>
              </div>
              <div className="relative h-3 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-gray-600 rounded-full"
                  style={{ width: `${skill.baseline}%` }}
                />
                <div
                  className="absolute h-full bg-gradient-to-r from-[#6366F1] to-[#22C55E] rounded-full"
                  style={{ width: `${skill.current}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Sources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Human Feedback
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Approvals
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                234
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Corrections
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                45
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Suggestions
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                67
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Automated Feedback
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Test Results
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                1,234
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Security Scans
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                456
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Performance Metrics
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                789
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Production Feedback
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Deployment Success
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                98.5%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Incidents
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                12
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Rollbacks
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                3
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
