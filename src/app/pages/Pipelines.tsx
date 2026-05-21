import { Play, Pause, StopCircle, CheckCircle, AlertCircle } from 'lucide-react';

export function Pipelines() {
  const pipelines = [
    {
      id: '1',
      name: 'payment-api-dev',
      project: 'Payment API',
      status: 'running',
      progress: 65,
      currentPhase: 'Development',
      agents: [
        { name: 'development_agent', status: 'running', progress: 85 },
        { name: 'security_agent', status: 'pending', progress: 0 },
        { name: 'testing_agent', status: 'pending', progress: 0 },
      ],
      startedAt: '10:20 AM',
      estimatedCompletion: '11:45 AM',
    },
    {
      id: '2',
      name: 'retail-ui-qa',
      project: 'Retail UI',
      status: 'completed',
      progress: 100,
      currentPhase: 'QA',
      agents: [
        { name: 'qa_agent', status: 'completed', progress: 100 },
        { name: 'testing_agent', status: 'completed', progress: 100 },
      ],
      startedAt: '09:15 AM',
      estimatedCompletion: '10:30 AM',
    },
    {
      id: '3',
      name: 'analytics-deploy',
      project: 'Analytics Pipeline',
      status: 'failed',
      progress: 42,
      currentPhase: 'Deploy',
      agents: [
        { name: 'deployment_agent', status: 'failed', progress: 42 },
      ],
      startedAt: '08:00 AM',
      estimatedCompletion: 'N/A',
    },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Pipelines</h1>
          <p className="text-gray-400">Real-time orchestration and agent execution</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all">
            View History
          </button>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111827] border border-white/10 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Active Pipelines</p>
          <p className="text-2xl font-bold text-white">3</p>
        </div>
        <div className="bg-[#111827] border border-white/10 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Completed Today</p>
          <p className="text-2xl font-bold text-[#22C55E]">12</p>
        </div>
        <div className="bg-[#111827] border border-white/10 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Failed Today</p>
          <p className="text-2xl font-bold text-[#EF4444]">2</p>
        </div>
        <div className="bg-[#111827] border border-white/10 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Avg Duration</p>
          <p className="text-2xl font-bold text-white">1.2h</p>
        </div>
      </div>

      {/* Active Pipelines */}
      <div className="space-y-4">
        {pipelines.map((pipeline) => (
          <div
            key={pipeline.id}
            className="bg-[#111827] border border-white/10 rounded-xl p-6 hover:border-[#6366F1]/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-white">{pipeline.name}</h3>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      pipeline.status === 'running'
                        ? 'bg-[#6366F1]/10 text-[#6366F1]'
                        : pipeline.status === 'completed'
                        ? 'bg-[#22C55E]/10 text-[#22C55E]'
                        : 'bg-[#EF4444]/10 text-[#EF4444]'
                    }`}
                  >
                    {pipeline.status === 'running' && '● '}
                    {pipeline.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {pipeline.project} • {pipeline.currentPhase} Phase
                </p>
              </div>
              <div className="flex gap-2">
                {pipeline.status === 'running' && (
                  <>
                    <button className="p-2 bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#F59E0B] rounded-lg transition-all">
                      <Pause className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] rounded-lg transition-all">
                      <StopCircle className="w-5 h-5" />
                    </button>
                  </>
                )}
                {pipeline.status === 'failed' && (
                  <button className="px-4 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg transition-all flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Retry
                  </button>
                )}
              </div>
            </div>

            {/* Overall Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Overall Progress</span>
                <span className="text-sm text-white font-medium">{pipeline.progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    pipeline.status === 'running'
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]'
                      : pipeline.status === 'completed'
                      ? 'bg-[#22C55E]'
                      : 'bg-[#EF4444]'
                  }`}
                  style={{ width: `${pipeline.progress}%` }}
                />
              </div>
            </div>

            {/* Agent Progress */}
            <div className="space-y-3">
              {pipeline.agents.map((agent) => (
                <div
                  key={agent.name}
                  className="flex items-center gap-4 p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-mono text-[#6366F1]">{agent.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white">{agent.progress}%</span>
                        {agent.status === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                        )}
                        {agent.status === 'failed' && (
                          <AlertCircle className="w-4 h-4 text-[#EF4444]" />
                        )}
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          agent.status === 'running'
                            ? 'bg-[#6366F1] animate-pulse'
                            : agent.status === 'completed'
                            ? 'bg-[#22C55E]'
                            : agent.status === 'failed'
                            ? 'bg-[#EF4444]'
                            : 'bg-white/20'
                        }`}
                        style={{ width: `${agent.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline Info */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10 text-sm">
              <span className="text-gray-400">
                Started: <span className="text-white">{pipeline.startedAt}</span>
              </span>
              <span className="text-gray-400">
                ETA: <span className="text-white">{pipeline.estimatedCompletion}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
