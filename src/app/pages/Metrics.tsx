import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function Metrics() {
  const deploymentData = [
    { date: "Mon", deployments: 4 },
    { date: "Tue", deployments: 6 },
    { date: "Wed", deployments: 3 },
    { date: "Thu", deployments: 8 },
    { date: "Fri", deployments: 5 },
    { date: "Sat", deployments: 2 },
    { date: "Sun", deployments: 1 },
  ];

  const tokenUsageData = [
    { month: "Jan", cost: 156 },
    { month: "Feb", cost: 189 },
    { month: "Mar", cost: 201 },
    { month: "Apr", cost: 178 },
    { month: "May", cost: 212 },
  ];

  const governanceMetrics = [
    { name: "Security", score: 90, color: "#22C55E" },
    { name: "Compliance", score: 75, color: "#F59E0B" },
    { name: "Testing", score: 82, color: "#6366F1" },
    { name: "Documentation", score: 68, color: "#F59E0B" },
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-50 dark:bg-[#0A0F1E] transition-colors">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Metrics & Analytics
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          DORA metrics, token usage, and performance analytics
        </p>
      </div>

      {/* DORA Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-[#6366F1]/10 rounded-lg">
              <Activity className="w-6 h-6 text-[#6366F1]" />
            </div>
            <div className="flex items-center gap-1 text-[#22C55E] text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            2.5/week
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Deployment Frequency
          </p>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-[#22C55E]/10 rounded-lg">
              <Zap className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div className="flex items-center gap-1 text-[#22C55E] text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>-8m</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            45 mins
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mean Time to Recovery
          </p>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
              <Activity className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div className="flex items-center gap-1 text-[#EF4444] text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+3%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            15%
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Change Failure Rate
          </p>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-[#6366F1]/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-[#6366F1]" />
            </div>
            <div className="flex items-center gap-1 text-[#22C55E] text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>-0.4d</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            2.4 days
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Lead Time for Changes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deployment Frequency Chart */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Deployment Frequency
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deploymentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
              <XAxis dataKey="date" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid rgba(148,163,184,0.2)",
                  borderRadius: "8px",
                  color: "#0F172A",
                }}
              />
              <Bar dataKey="deployments" fill="#6366F1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Token Cost Trend */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Token Cost Trend
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={tokenUsageData}>
              <defs>
                <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
              <XAxis dataKey="month" stroke="#64748B" />
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
                dataKey="cost"
                stroke="#6366F1"
                strokeWidth={2}
                fill="url(#costGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Governance Heatmap */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Governance Heatmap
        </h2>
        <div className="space-y-4">
          {governanceMetrics.map((metric) => (
            <div key={metric.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-900 dark:text-white font-medium">
                  {metric.name}
                </span>
                <span className="text-gray-900 dark:text-white font-bold">
                  {metric.score}%
                </span>
              </div>
              <div className="h-8 bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden">
                <div
                  className="h-full flex items-center justify-end pr-4 text-white text-sm font-medium transition-all"
                  style={{
                    width: `${metric.score}%`,
                    backgroundColor: metric.color,
                  }}
                >
                  {"█".repeat(Math.floor(metric.score / 10))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Token Usage */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Live Token Usage by Agent
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              development_agent
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Input:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  12k tokens
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Output:
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  6k tokens
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-white/10">
                <span className="text-gray-500 dark:text-gray-400">Cost:</span>
                <span className="text-[#6366F1] font-bold">$0.42</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              security_agent
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Input:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  8k tokens
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Output:
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  3k tokens
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-white/10">
                <span className="text-gray-500 dark:text-gray-400">Cost:</span>
                <span className="text-[#6366F1] font-bold">$0.28</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              testing_agent
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Input:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  15k tokens
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Output:
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  9k tokens
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-white/10">
                <span className="text-gray-500 dark:text-gray-400">Cost:</span>
                <span className="text-[#6366F1] font-bold">$0.56</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
