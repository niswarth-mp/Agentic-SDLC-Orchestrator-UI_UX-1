import { useState, useEffect } from 'react';
import { Brain, Code, Shield, FileText, TrendingUp, AlertTriangle, CheckCircle, Loader, BarChart3, Zap } from 'lucide-react';

interface AIAnalysisProps {
  config: any;
  updateConfig: (updates: any) => void;
}

type AnalysisPhase = 'idle' | 'scanning' | 'analyzing' | 'complete';

export function AIAnalysis({ config, updateConfig }: AIAnalysisProps) {
  const [phase, setPhase] = useState<AnalysisPhase>('idle');
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');

  const analysisResults = {
    codeQuality: {
      score: 72,
      totalFiles: 234,
      linesOfCode: 45678,
      testCoverage: 68,
    },
    technicalDebt: {
      high: 8,
      medium: 23,
      low: 45,
      totalHours: 156,
    },
    security: {
      critical: 2,
      high: 5,
      medium: 12,
      low: 8,
    },
    dependencies: {
      total: 87,
      outdated: 23,
      vulnerable: 5,
    },
    architecture: {
      complexity: 'Medium',
      patterns: ['Layered', 'MVC', 'Repository'],
      recommendations: 4,
    },
  };

  const handleStartAnalysis = async () => {
    setPhase('scanning');
    setProgress(0);

    const tasks = [
      { name: 'Cloning repository...', duration: 1500 },
      { name: 'Analyzing code structure...', duration: 2000 },
      { name: 'Running security scan...', duration: 1800 },
      { name: 'Detecting technical debt...', duration: 2200 },
      { name: 'Mapping dependencies...', duration: 1500 },
      { name: 'Generating recommendations...', duration: 1000 },
    ];

    let totalProgress = 0;
    const progressPerTask = 100 / tasks.length;

    for (const task of tasks) {
      setCurrentTask(task.name);
      if (task.name.includes('Analyzing') || task.name.includes('Generating')) {
        setPhase('analyzing');
      }

      await new Promise(resolve => setTimeout(resolve, task.duration));
      totalProgress += progressPerTask;
      setProgress(Math.min(totalProgress, 100));
    }

    setPhase('complete');
    updateConfig({ analysisComplete: true });
  };

  useEffect(() => {
    if (!config.analysisComplete && phase === 'idle') {
      handleStartAnalysis();
    }
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20';
      case 'high': return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
      case 'medium': return 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20';
      case 'low': return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
      default: return 'bg-white/10 text-gray-400 border-white/10';
    }
  };

  if (phase === 'scanning' || phase === 'analyzing') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#111827] border border-white/10 rounded-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 rounded-xl mb-4">
              <Brain className="w-12 h-12 text-[#6366F1] animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {phase === 'scanning' ? 'Scanning Repository' : 'Analyzing Codebase'}
            </h3>
            <p className="text-sm text-gray-400">
              Our AI is examining your codebase to identify patterns, issues, and opportunities
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">{currentTask}</span>
              <span className="text-[#6366F1] font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <Code className="w-6 h-6 text-[#6366F1] mx-auto mb-2" />
              <p className="text-xs text-gray-400">Code Analysis</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <Shield className="w-6 h-6 text-[#6366F1] mx-auto mb-2" />
              <p className="text-xs text-gray-400">Security Scan</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <BarChart3 className="w-6 h-6 text-[#6366F1] mx-auto mb-2" />
              <p className="text-xs text-gray-400">Complexity Analysis</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Success Header */}
      <div className="bg-gradient-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#22C55E]/20 rounded-lg">
            <CheckCircle className="w-6 h-6 text-[#22C55E]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Analysis Complete</h3>
            <p className="text-sm text-gray-300">
              We've analyzed {analysisResults.codeQuality.totalFiles} files ({analysisResults.codeQuality.linesOfCode.toLocaleString()} lines of code)
              and identified key insights to guide your modernization journey.
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#6366F1]/10 rounded-lg">
              <Code className="w-5 h-5 text-[#6366F1]" />
            </div>
            <span className="text-xs text-gray-400">Code Quality</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{analysisResults.codeQuality.score}%</p>
          <p className="text-xs text-gray-400">{analysisResults.codeQuality.testCoverage}% test coverage</p>
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#F59E0B]/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <span className="text-xs text-gray-400">Technical Debt</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{analysisResults.technicalDebt.totalHours}h</p>
          <p className="text-xs text-gray-400">{analysisResults.technicalDebt.high + analysisResults.technicalDebt.medium + analysisResults.technicalDebt.low} issues</p>
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#EF4444]/10 rounded-lg">
              <Shield className="w-5 h-5 text-[#EF4444]" />
            </div>
            <span className="text-xs text-gray-400">Security Issues</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {analysisResults.security.critical + analysisResults.security.high}
          </p>
          <p className="text-xs text-gray-400">{analysisResults.security.critical} critical</p>
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#06B6D4]/10 rounded-lg">
              <FileText className="w-5 h-5 text-[#06B6D4]" />
            </div>
            <span className="text-xs text-gray-400">Dependencies</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{analysisResults.dependencies.outdated}</p>
          <p className="text-xs text-gray-400">outdated packages</p>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-2 gap-6">
        {/* Technical Debt Breakdown */}
        <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            Technical Debt
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#EF4444] rounded-full" />
                <span className="text-sm text-white">High Priority</span>
              </div>
              <span className="text-lg font-bold text-white">{analysisResults.technicalDebt.high}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#F59E0B] rounded-full" />
                <span className="text-sm text-white">Medium Priority</span>
              </div>
              <span className="text-lg font-bold text-white">{analysisResults.technicalDebt.medium}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#06B6D4]/5 border border-[#06B6D4]/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#06B6D4] rounded-full" />
                <span className="text-sm text-white">Low Priority</span>
              </div>
              <span className="text-lg font-bold text-white">{analysisResults.technicalDebt.low}</span>
            </div>
          </div>
        </div>

        {/* Security Vulnerabilities */}
        <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#EF4444]" />
            Security Vulnerabilities
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#EF4444] rounded-full" />
                <span className="text-sm text-white">Critical</span>
              </div>
              <span className="text-lg font-bold text-white">{analysisResults.security.critical}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#F59E0B] rounded-full" />
                <span className="text-sm text-white">High</span>
              </div>
              <span className="text-lg font-bold text-white">{analysisResults.security.high}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#06B6D4]/5 border border-[#06B6D4]/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#06B6D4] rounded-full" />
                <span className="text-sm text-white">Medium</span>
              </div>
              <span className="text-lg font-bold text-white">{analysisResults.security.medium}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#6366F1]" />
          AI-Powered Recommendations
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-gradient-to-r from-[#6366F1]/5 to-[#8B5CF6]/5 border border-[#6366F1]/20 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#6366F1]/20 rounded-lg flex-shrink-0">
                <Code className="w-4 h-4 text-[#6366F1]" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white mb-1">Refactor Authentication Module</h4>
                <p className="text-xs text-gray-400 mb-2">
                  High complexity detected in legacy auth code. Recommend migrating to OAuth 2.0 with refresh token rotation.
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-[#F59E0B]/10 text-[#F59E0B] text-xs rounded-full">High Impact</span>
                  <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full">~24h effort</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-[#6366F1]/5 to-[#8B5CF6]/5 border border-[#6366F1]/20 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#EF4444]/20 rounded-lg flex-shrink-0">
                <Shield className="w-4 h-4 text-[#EF4444]" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white mb-1">Update Vulnerable Dependencies</h4>
                <p className="text-xs text-gray-400 mb-2">
                  5 packages with known CVEs detected. Immediate updates recommended for jackson-databind and spring-core.
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-[#EF4444]/10 text-[#EF4444] text-xs rounded-full">Critical</span>
                  <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full">~4h effort</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-[#6366F1]/5 to-[#8B5CF6]/5 border border-[#6366F1]/20 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#06B6D4]/20 rounded-lg flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-[#06B6D4]" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white mb-1">Improve Test Coverage</h4>
                <p className="text-xs text-gray-400 mb-2">
                  Payment processing module has only 45% coverage. Add integration tests for critical payment flows.
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-[#06B6D4]/10 text-[#06B6D4] text-xs rounded-full">Medium Impact</span>
                  <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full">~16h effort</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-[#6366F1]/5 to-[#8B5CF6]/5 border border-[#6366F1]/20 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#22C55E]/20 rounded-lg flex-shrink-0">
                <BarChart3 className="w-4 h-4 text-[#22C55E]" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white mb-1">Add Observability</h4>
                <p className="text-xs text-gray-400 mb-2">
                  Missing structured logging and metrics. Implement OpenTelemetry for distributed tracing.
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-[#22C55E]/10 text-[#22C55E] text-xs rounded-full">Low Impact</span>
                  <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full">~12h effort</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
