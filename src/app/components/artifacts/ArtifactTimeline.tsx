import { CheckCircle, Clock, XCircle, User, GitCommit, Rocket } from 'lucide-react';

interface TimelineIteration {
  id: number;
  timestamp: string;
  agent: string;
  confidence: number;
  status: 'approved' | 'pending' | 'rejected';
  changes: string;
  approver?: string;
  deployment?: string;
}

export function ArtifactTimeline() {
  const iterations: TimelineIteration[] = [
    {
      id: 3,
      timestamp: '2024-05-19 10:22',
      agent: 'development_agent',
      confidence: 91,
      status: 'pending',
      changes: 'Added notification service integration',
      deployment: undefined,
    },
    {
      id: 2,
      timestamp: '2024-05-19 10:15',
      agent: 'development_agent',
      confidence: 85,
      status: 'approved',
      changes: 'Enhanced JWT validation and retry mechanism',
      approver: 'Alice Johnson',
      deployment: 'staging-v12',
    },
    {
      id: 1,
      timestamp: '2024-05-19 09:45',
      agent: 'development_agent',
      confidence: 61,
      status: 'rejected',
      changes: 'Initial payment service implementation',
      approver: 'Bob Smith',
      deployment: undefined,
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-[#22C55E]',
          bgColor: 'bg-[#22C55E]/10',
          borderColor: 'border-[#22C55E]/30',
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-[#F59E0B]',
          bgColor: 'bg-[#F59E0B]/10',
          borderColor: 'border-[#F59E0B]/30',
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-[#EF4444]',
          bgColor: 'bg-[#EF4444]/10',
          borderColor: 'border-[#EF4444]/30',
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-400',
          bgColor: 'bg-white/5',
          borderColor: 'border-white/10',
        };
    }
  };

  return (
    <div className="bg-[#111827] border-t border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-white">Artifact History</h3>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-[#22C55E] rounded-full" />
            <span>Approved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-[#F59E0B] rounded-full" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-[#EF4444] rounded-full" />
            <span>Rejected</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#6366F1] via-[#8B5CF6] to-transparent" />

        {/* Timeline Items */}
        <div className="space-y-6">
          {iterations.map((iteration, index) => {
            const config = getStatusConfig(iteration.status);
            const StatusIcon = config.icon;

            return (
              <div key={iteration.id} className="relative pl-20">
                {/* Timeline Node */}
                <div className="absolute left-0 top-0 flex items-center gap-3">
                  <div
                    className={`w-16 h-16 ${config.bgColor} border-2 ${config.borderColor} rounded-xl flex items-center justify-center ${
                      iteration.status === 'pending' ? 'animate-pulse' : ''
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-xs text-gray-400 font-medium">Iter</p>
                      <p className="text-lg font-bold text-white">{iteration.id}</p>
                    </div>
                  </div>
                </div>

                {/* Content Card */}
                <div
                  className={`${config.bgColor} border ${config.borderColor} rounded-xl p-4 hover:border-white/30 transition-all`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-sm font-semibold text-white">{iteration.changes}</h4>
                        <span
                          className={`px-2 py-1 ${config.bgColor} ${config.color} text-xs rounded-full font-medium uppercase flex items-center gap-1`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {iteration.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <GitCommit className="w-3.5 h-3.5" />
                          <span className="font-mono text-[#6366F1]">{iteration.agent}</span>
                        </div>
                        <span>•</span>
                        <span>{iteration.timestamp}</span>
                        {iteration.approver && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" />
                              <span>{iteration.approver}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-1">Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              iteration.confidence >= 90
                                ? 'bg-[#22C55E]'
                                : iteration.confidence >= 75
                                ? 'bg-[#F59E0B]'
                                : 'bg-[#EF4444]'
                            }`}
                            style={{ width: `${iteration.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-white">{iteration.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Deployment Badge */}
                  {iteration.deployment && (
                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                      <Rocket className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      <span className="text-xs text-gray-300">
                        Deployed to:{' '}
                        <span className="text-[#8B5CF6] font-medium">{iteration.deployment}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Start Marker */}
        <div className="relative pl-20 mt-6">
          <div className="absolute left-0 top-0 w-16 h-12 bg-gradient-to-b from-transparent to-[#111827] flex items-center justify-center">
            <div className="w-3 h-3 bg-[#6366F1] rounded-full" />
          </div>
          <p className="text-xs text-gray-500 italic">Artifact generation started</p>
        </div>
      </div>
    </div>
  );
}
