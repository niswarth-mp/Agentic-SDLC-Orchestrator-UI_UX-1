import { CheckCircle, GitBranch, Trello, Code, BarChart3, FileText, AlertCircle, Sparkles } from 'lucide-react';

interface ReviewAndCreateProps {
  config: any;
  updateConfig: (updates: any) => void;
}

export function ReviewAndCreate({ config, updateConfig }: ReviewAndCreateProps) {
  const sections = [
    {
      title: 'Project Details',
      icon: FileText,
      items: [
        { label: 'Project Name', value: config.projectName },
        { label: 'Description', value: config.description },
        { label: 'Type', value: config.projectType },
        { label: 'Primary Language', value: config.primaryLanguage },
      ],
    },
    {
      title: 'Repository Connection',
      icon: GitBranch,
      items: [
        { label: 'Git Provider', value: config.gitProvider?.toUpperCase() || 'Not set' },
        { label: 'Repository URL', value: config.repositoryUrl },
        { label: 'Branch', value: config.branch },
        { label: 'Access Token', value: config.accessToken ? '••••••••••••' : 'Not set' },
      ],
    },
    {
      title: 'Jira Integration',
      icon: Trello,
      items: [
        { label: 'Workspace', value: config.jiraWorkspace },
        { label: 'Project Key', value: config.jiraProjectKey },
        { label: 'Sprint Data', value: config.includeSprints ? 'Enabled' : 'Disabled' },
      ],
    },
    {
      title: 'User Stories',
      icon: Code,
      items: [
        { label: 'Stories Selected', value: `${config.selectedStories?.length || 0} stories` },
        { label: 'Status', value: config.selectedStories?.length > 0 ? 'Ready for import' : 'None selected' },
      ],
    },
    {
      title: 'AI Analysis',
      icon: BarChart3,
      items: [
        { label: 'Status', value: config.analysisComplete ? 'Complete' : 'Pending' },
        { label: 'Repository Scan', value: config.analysisComplete ? 'Analyzed' : 'Not started' },
      ],
    },
  ];

  const hasAllRequired =
    config.projectName &&
    config.description &&
    config.gitProvider &&
    config.repositoryUrl &&
    config.branch &&
    config.jiraWorkspace &&
    config.jiraProjectKey &&
    config.selectedStories?.length > 0 &&
    config.analysisComplete;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex p-4 bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 rounded-xl mb-4">
          <Sparkles className="w-8 h-8 text-[#6366F1]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Review Your Configuration</h2>
        <p className="text-gray-400">
          Please review all settings before creating your brownfield project. You can go back to make changes if needed.
        </p>
      </div>

      {/* Configuration Review */}
      <div className="grid grid-cols-1 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-[#111827] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#6366F1]/10 rounded-lg">
                  <Icon className="w-5 h-5 text-[#6366F1]" />
                </div>
                <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                <CheckCircle className="w-5 h-5 text-[#22C55E] ml-auto" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {section.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p className="text-sm text-white font-medium truncate">{item.value || 'Not specified'}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* What Happens Next */}
      <div className="bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10 border border-[#6366F1]/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#6366F1]" />
          What Happens Next
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-white">1</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-1">Repository Clone & Analysis</h4>
              <p className="text-xs text-gray-400">
                We'll clone your repository and run a deep AI-powered analysis to understand your codebase architecture and patterns.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-white">2</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-1">Jira User Stories Import</h4>
              <p className="text-xs text-gray-400">
                Import selected user stories from Jira to align AI-generated code changes with your business requirements.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-white">3</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-1">AI Orchestration Setup</h4>
              <p className="text-xs text-gray-400">
                Configure specialized AI agents for each SDLC phase (requirements, design, development, testing, deployment).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-white">4</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-1">Project Dashboard Ready</h4>
              <p className="text-xs text-gray-400">
                Access your project dashboard with real-time pipeline visibility, agent activity feeds, and code artifact management.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Check */}
      {!hasAllRequired && (
        <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-[#F59E0B] mb-1">Configuration Incomplete</h4>
            <p className="text-xs text-gray-300">
              Please complete all required steps before creating the project. Go back to fill in missing information.
            </p>
          </div>
        </div>
      )}

      {/* Confirmation Checkbox */}
      <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
        <label className="flex items-start gap-4 cursor-pointer">
          <input
            type="checkbox"
            checked={config.confirmReady || false}
            onChange={(e) => updateConfig({ confirmReady: e.target.checked })}
            className="w-5 h-5 mt-1 bg-[#0A0F1E] border border-white/20 rounded text-[#6366F1] focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-0"
          />
          <div>
            <h4 className="text-sm font-medium text-white mb-2">
              I confirm that all information is correct and I'm ready to create this brownfield project
            </h4>
            <p className="text-xs text-gray-400">
              By checking this box, you authorize the system to clone your repository, import Jira data, and set up AI orchestration agents.
              This process may take 2-5 minutes depending on repository size.
            </p>
          </div>
        </label>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-white/10 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-400 mb-2">Estimated Setup Time</p>
          <p className="text-2xl font-bold text-white">2-5 min</p>
        </div>
        <div className="bg-[#111827] border border-white/10 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-400 mb-2">AI Agents</p>
          <p className="text-2xl font-bold text-[#6366F1]">6</p>
        </div>
        <div className="bg-[#111827] border border-white/10 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-400 mb-2">User Stories</p>
          <p className="text-2xl font-bold text-[#6366F1]">{config.selectedStories?.length || 0}</p>
        </div>
      </div>
    </div>
  );
}
