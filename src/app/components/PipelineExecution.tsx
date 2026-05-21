import { CheckCircle } from 'lucide-react';

interface Agent {
  name: string;
  progress: number;
  status: 'running' | 'completed' | 'pending';
}

interface Iteration {
  number: number;
  confidence: number;
  completed: boolean;
}

export function PipelineExecution() {
  const agents: Agent[] = [
    { name: 'development_agent', progress: 100, status: 'completed' },
    { name: 'security_agent', progress: 70, status: 'running' },
    { name: 'testing_agent', progress: 85, status: 'running' },
    { name: 'deployment_agent', progress: 0, status: 'pending' },
  ];

  const iterations: Iteration[] = [
    { number: 1, confidence: 0.61, completed: true },
    { number: 2, confidence: 0.78, completed: true },
    { number: 3, confidence: 0.92, completed: true },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Real-Time Orchestration View */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-6">Real-Time Orchestration</h2>
        <div className="space-y-4">
          {agents.map((agent) => (
            <div key={agent.name} className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-mono text-[#6366F1]">{agent.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white font-medium">{agent.progress}%</span>
                  {agent.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                  )}
                </div>
              </div>
              <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                    agent.status === 'completed'
                      ? 'bg-[#22C55E]'
                      : agent.status === 'running'
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] animate-pulse'
                      : 'bg-white/20'
                  }`}
                  style={{ width: `${agent.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inner Loop Visualization */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-6">Inner Loop Visualization</h2>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="space-y-4">
            {iterations.map((iteration, index) => (
              <div key={iteration.number} className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    iteration.completed
                      ? 'bg-[#22C55E]/10 text-[#22C55E] border-2 border-[#22C55E]'
                      : 'bg-white/10 text-white border-2 border-white/20'
                  }`}
                >
                  {iteration.number}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white">
                      Iteration {iteration.number}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        iteration.confidence >= 0.9
                          ? 'text-[#22C55E]'
                          : iteration.confidence >= 0.7
                          ? 'text-[#F59E0B]'
                          : 'text-gray-400'
                      }`}
                    >
                      Confidence: {iteration.confidence.toFixed(2)}
                      {iteration.confidence >= 0.9 && ' ✓'}
                    </span>
                  </div>
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        iteration.confidence >= 0.9
                          ? 'bg-[#22C55E]'
                          : iteration.confidence >= 0.7
                          ? 'bg-[#F59E0B]'
                          : 'bg-[#6366F1]'
                      }`}
                      style={{ width: `${iteration.confidence * 100}%` }}
                    />
                  </div>
                </div>
                {index < iterations.length - 1 && (
                  <div className="text-gray-500 text-xl">→</div>
                )}
              </div>
            ))}
          </div>

          {iterations[iterations.length - 1]?.confidence >= 0.9 && (
            <div className="mt-6 p-4 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-lg">
              <p className="text-sm text-[#22C55E] font-medium">
                ✓ Pipeline converged successfully! Confidence threshold met.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
