import { StatCard } from '../components/StatCard';
import { FolderKanban, Rocket, AlertCircle, Clock, CheckCircle, Circle, Loader } from 'lucide-react';

export function Dashboard() {
  const agentActivity = [
    { time: '10:22', agent: 'testing_agent', message: 'coverage increased to 91%', type: 'success' },
    { time: '10:21', agent: 'security_agent', message: 'detected CVE-2024-1234', type: 'warning' },
    { time: '10:20', agent: 'development_agent', message: 'generating tests...', type: 'info' },
    { time: '10:18', agent: 'qa_agent', message: 'integration tests passed', type: 'success' },
    { time: '10:15', agent: 'deployment_agent', message: 'rolling out to staging', type: 'info' },
  ];

  const pipelineStages = [
    { name: 'Req', status: 'completed' },
    { name: 'Design', status: 'completed' },
    { name: 'Dev', status: 'active' },
    { name: 'QA', status: 'pending' },
    { name: 'Deploy', status: 'pending' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Command center for engineering leadership</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Active Projects"
          value={12}
          icon={FolderKanban}
          trend={{ value: '2 this week', positive: true }}
        />
        <StatCard
          label="Deployments Today"
          value={8}
          icon={Rocket}
          trend={{ value: '+3 vs avg', positive: true }}
        />
        <StatCard
          label="Failed Pipelines"
          value={3}
          icon={AlertCircle}
          trend={{ value: '-2 vs yesterday', positive: true }}
        />
        <StatCard
          label="Avg Lead Time"
          value="2.4d"
          icon={Clock}
          trend={{ value: '-0.5d', positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Health */}
        <div className="lg:col-span-2 bg-[#111827] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Pipeline Health</h2>
          <div className="flex items-center justify-between">
            {pipelineStages.map((stage, index) => (
              <div key={stage.name} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      stage.status === 'completed'
                        ? 'bg-[#22C55E]/10 border-[#22C55E] text-[#22C55E]'
                        : stage.status === 'active'
                        ? 'bg-[#6366F1]/10 border-[#6366F1] text-[#6366F1] animate-pulse'
                        : 'bg-transparent border-white/20 text-white/40'
                    }`}
                  >
                    {stage.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : stage.status === 'active' ? (
                      <Loader className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      stage.status === 'pending' ? 'text-white/40' : 'text-white'
                    }`}
                  >
                    {stage.name}
                  </span>
                </div>
                {index < pipelineStages.length - 1 && (
                  <div
                    className={`h-0.5 w-12 mx-2 ${
                      pipelineStages[index + 1].status !== 'pending'
                        ? 'bg-[#22C55E]'
                        : 'bg-white/20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* DORA Metrics */}
        <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">DORA Metrics</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Deployment Frequency</p>
              <p className="text-2xl font-bold text-white">2.5/week</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">MTTR</p>
              <p className="text-2xl font-bold text-white">45 mins</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Change Failure Rate</p>
              <p className="text-2xl font-bold text-white">15%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Agent Activity Feed */}
        <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Live Agent Activity</h2>
          <div className="space-y-3">
            {agentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
              >
                <span className="text-xs text-gray-500 font-mono mt-0.5">{activity.time}</span>
                <div className="flex-1">
                  <span className="text-sm font-medium text-[#6366F1]">{activity.agent}</span>
                  <span className="text-sm text-gray-300 ml-2">{activity.message}</span>
                </div>
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 ${
                    activity.type === 'success'
                      ? 'bg-[#22C55E]'
                      : activity.type === 'warning'
                      ? 'bg-[#F59E0B]'
                      : 'bg-[#6366F1] animate-pulse'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Token Cost Analytics */}
        <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Token Cost Analytics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-sm text-gray-400 mb-1">OpenAI</p>
                <p className="text-xl font-bold text-white">$23.12</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">This Month</p>
                <p className="text-sm text-[#22C55E]">↓ 12%</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-sm text-gray-400 mb-1">Ollama</p>
                <p className="text-xl font-bold text-white">Local</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">Usage</p>
                <p className="text-sm text-white">234k tokens</p>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">Total Monthly Cost</p>
                <p className="text-2xl font-bold text-white">$212</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
