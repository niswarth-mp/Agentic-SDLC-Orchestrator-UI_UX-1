import { useState } from 'react';
import { Github, Gitlab, Code2, CheckCircle, Loader, AlertCircle } from 'lucide-react';

interface RepositoryConnectionProps {
  config: any;
  updateConfig: (updates: any) => void;
}

type GitProvider = 'github' | 'gitlab' | 'bitbucket';
type ConnectionStatus = 'idle' | 'connecting' | 'success' | 'error';

export function RepositoryConnection({ config, updateConfig }: RepositoryConnectionProps) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [repoInfo, setRepoInfo] = useState<any>(null);

  const providers = [
    {
      id: 'github' as GitProvider,
      name: 'GitHub',
      icon: Github,
      color: 'text-white',
      bgColor: 'bg-[#181717]',
      borderColor: 'border-[#30363D]',
    },
    {
      id: 'gitlab' as GitProvider,
      name: 'GitLab',
      icon: Gitlab,
      color: 'text-[#FC6D26]',
      bgColor: 'bg-[#FC6D26]/10',
      borderColor: 'border-[#FC6D26]/30',
    },
    {
      id: 'bitbucket' as GitProvider,
      name: 'Bitbucket',
      icon: Code2,
      color: 'text-[#2684FF]',
      bgColor: 'bg-[#2684FF]/10',
      borderColor: 'border-[#2684FF]/30',
    },
  ];

  const handleConnect = async () => {
    setConnectionStatus('connecting');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRepoInfo({
      name: config.repositoryUrl.split('/').pop()?.replace('.git', ''),
      branches: ['main', 'develop', 'staging'],
      lastCommit: '2 hours ago',
      contributors: 12,
      languages: ['Java 67%', 'JavaScript 25%', 'CSS 8%'],
    });
    setConnectionStatus('success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Provider Selection */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Select Git Provider</h3>
        <div className="grid grid-cols-3 gap-4">
          {providers.map((provider) => {
            const Icon = provider.icon;
            const isSelected = config.gitProvider === provider.id;

            return (
              <button
                key={provider.id}
                onClick={() => updateConfig({ gitProvider: provider.id })}
                className={`p-6 border-2 rounded-xl transition-all ${
                  isSelected
                    ? `${provider.borderColor} ${provider.bgColor}`
                    : 'border-white/10 bg-[#111827] hover:border-white/20'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`p-4 rounded-lg ${isSelected ? provider.bgColor : 'bg-white/5'}`}>
                    <Icon className={`w-8 h-8 ${isSelected ? provider.color : 'text-gray-400'}`} />
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                    {provider.name}
                  </span>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Repository Details */}
      {config.gitProvider && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Repository URL *
            </label>
            <input
              type="url"
              value={config.repositoryUrl}
              onChange={(e) => updateConfig({ repositoryUrl: e.target.value })}
              placeholder={`https://${config.gitProvider}.com/yourorg/yourrepo.git`}
              className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Branch *
              </label>
              <input
                type="text"
                value={config.branch}
                onChange={(e) => updateConfig({ branch: e.target.value })}
                placeholder="main"
                className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Access Token *
              </label>
              <input
                type="password"
                value={config.accessToken}
                onChange={(e) => updateConfig({ accessToken: e.target.value })}
                placeholder="ghp_xxxxxxxxxxxx"
                className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              />
            </div>
          </div>

          {/* Test Connection Button */}
          <div>
            <button
              onClick={handleConnect}
              disabled={!config.repositoryUrl || !config.branch || connectionStatus === 'connecting'}
              className="w-full px-6 py-3 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {connectionStatus === 'connecting' ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Connecting to repository...
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

          {/* Repository Info Card */}
          {connectionStatus === 'success' && repoInfo && (
            <div className="bg-gradient-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#22C55E]/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-[#22C55E]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-3">Repository Connected</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Repository Name</p>
                      <p className="text-sm font-medium text-white">{repoInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Last Commit</p>
                      <p className="text-sm font-medium text-white">{repoInfo.lastCommit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Available Branches</p>
                      <p className="text-sm font-medium text-white">{repoInfo.branches.length} branches</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Contributors</p>
                      <p className="text-sm font-medium text-white">{repoInfo.contributors} developers</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-400 mb-2">Detected Languages</p>
                    <div className="flex gap-2">
                      {repoInfo.languages.map((lang: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-white/10 text-white text-xs rounded-full">
                          {lang}
                        </span>
                      ))}
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
                  Unable to connect to repository. Please check your URL and access token.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help Card */}
      <div className="bg-[#6366F1]/5 border border-[#6366F1]/20 rounded-xl p-4">
        <h4 className="text-sm font-medium text-white mb-2">Need help generating a token?</h4>
        <p className="text-xs text-gray-400 leading-relaxed">
          {config.gitProvider === 'github' && 'Go to Settings → Developer settings → Personal access tokens → Generate new token'}
          {config.gitProvider === 'gitlab' && 'Go to User Settings → Access Tokens → Add new token'}
          {config.gitProvider === 'bitbucket' && 'Go to Personal settings → App passwords → Create app password'}
          {!config.gitProvider && 'Select a provider above to see specific instructions'}
        </p>
      </div>
    </div>
  );
}
