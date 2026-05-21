import { useState } from 'react';
import { Trello, CheckCircle, Loader, AlertCircle, ExternalLink } from 'lucide-react';

interface JiraIntegrationProps {
  config: any;
  updateConfig: (updates: any) => void;
}

type ConnectionStatus = 'idle' | 'connecting' | 'success' | 'error';

export function JiraIntegration({ config, updateConfig }: JiraIntegrationProps) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);

  const handleConnect = async () => {
    setConnectionStatus('connecting');
    await new Promise(resolve => setTimeout(resolve, 2000));

    setAvailableProjects([
      { key: 'LEGACY', name: 'Legacy Modernization', issueCount: 156 },
      { key: 'PAY', name: 'Payment System', issueCount: 89 },
      { key: 'AUTH', name: 'Authentication Service', issueCount: 43 },
    ]);
    setConnectionStatus('success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Jira Connection Info */}
      <div className="bg-gradient-to-br from-[#0052CC]/10 to-[#2684FF]/10 border border-[#0052CC]/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#0052CC]/20 rounded-lg">
            <Trello className="w-6 h-6 text-[#0052CC]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Connect Jira Workspace</h3>
            <p className="text-sm text-gray-300 mb-3">
              Link your Jira workspace to import user stories, epics, and sprint data. This helps our AI understand your existing requirements and backlog.
            </p>
            <a
              href="https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#0052CC] hover:text-[#2684FF] transition-colors"
            >
              How to create a Jira API token
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Workspace Configuration */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Jira Workspace URL *
          </label>
          <input
            type="url"
            value={config.jiraWorkspace}
            onChange={(e) => updateConfig({ jiraWorkspace: e.target.value })}
            placeholder="https://yourcompany.atlassian.net"
            className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
          />
          <p className="mt-2 text-xs text-gray-400">
            Your Jira Cloud workspace URL (e.g., yourcompany.atlassian.net)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={config.jiraEmail || ''}
              onChange={(e) => updateConfig({ jiraEmail: e.target.value })}
              placeholder="your.email@company.com"
              className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              API Token *
            </label>
            <input
              type="password"
              value={config.jiraApiToken}
              onChange={(e) => updateConfig({ jiraApiToken: e.target.value })}
              placeholder="••••••••••••••••"
              className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            />
          </div>
        </div>

        {/* Test Connection Button */}
        <div>
          <button
            onClick={handleConnect}
            disabled={!config.jiraWorkspace || !config.jiraApiToken || connectionStatus === 'connecting'}
            className="w-full px-6 py-3 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {connectionStatus === 'connecting' ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Connecting to Jira...
              </>
            ) : connectionStatus === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                Connected Successfully
              </>
            ) : (
              'Test Connection'
            )}
          </button>
        </div>

        {/* Success - Project Selection */}
        {connectionStatus === 'success' && availableProjects.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Select Project *
              </label>
              <div className="space-y-2">
                {availableProjects.map((project) => {
                  const isSelected = config.jiraProjectKey === project.key;

                  return (
                    <button
                      key={project.key}
                      onClick={() => updateConfig({ jiraProjectKey: project.key })}
                      className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                        isSelected
                          ? 'border-[#0052CC] bg-[#0052CC]/10'
                          : 'border-white/10 bg-[#111827] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-[#0052CC]/20' : 'bg-white/5'
                          }`}>
                            <Trello className={`w-5 h-5 ${isSelected ? 'text-[#0052CC]' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <h4 className={`font-medium mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                              {project.name}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {project.key} • {project.issueCount} issues
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Connection Summary */}
            <div className="bg-gradient-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#22C55E]/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-[#22C55E]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-3">Jira Connected</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Workspace</p>
                      <p className="text-sm font-medium text-white">
                        {config.jiraWorkspace.replace('https://', '').replace('http://', '')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Projects Found</p>
                      <p className="text-sm font-medium text-white">{availableProjects.length} projects</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {connectionStatus === 'error' && (
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-[#EF4444] mb-1">Connection Failed</h4>
              <p className="text-xs text-gray-300">
                Unable to connect to Jira workspace. Please verify your workspace URL and API token.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Optional: Sprint Selection */}
      {config.jiraProjectKey && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.includeSprints || false}
              onChange={(e) => updateConfig({ includeSprints: e.target.checked })}
              className="w-5 h-5 bg-[#111827] border border-white/20 rounded text-[#6366F1] focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-0"
            />
            <div>
              <span className="text-sm font-medium text-white">Import Sprint Data</span>
              <p className="text-xs text-gray-400 mt-1">
                Include sprint timelines and velocity metrics for better AI analysis
              </p>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}
