import { CheckCircle, XCircle, Settings as SettingsIcon, Webhook, Plus } from 'lucide-react';
import { useState } from 'react';

export function Integrations() {
  const [webhookEvent, setWebhookEvent] = useState('deployment.completed');
  const [webhookUrl, setWebhookUrl] = useState('');

  const integrations = [
    { name: 'GitHub', status: 'connected', description: 'Source code management', icon: '🐙' },
    { name: 'Jira', status: 'connected', description: 'Issue tracking', icon: '📋' },
    { name: 'Slack', status: 'connected', description: 'Team communication', icon: '💬' },
    { name: 'Backstage', status: 'connected', description: 'Developer portal', icon: '🏠' },
    { name: 'ArgoCD', status: 'connected', description: 'GitOps deployment', icon: '🚀' },
    { name: 'Datadog', status: 'disconnected', description: 'Monitoring & observability', icon: '📊' },
    { name: 'PagerDuty', status: 'disconnected', description: 'Incident management', icon: '🚨' },
    { name: 'Sentry', status: 'disconnected', description: 'Error tracking', icon: '🐛' },
  ];

  const webhooks = [
    {
      id: '1',
      event: 'deployment.completed',
      destination: 'https://hooks.slack.com/services/...',
      status: 'active',
    },
    {
      id: '2',
      event: 'security.vulnerability_detected',
      destination: 'https://api.pagerduty.com/incidents',
      status: 'active',
    },
    {
      id: '3',
      event: 'pipeline.failed',
      destination: 'https://hooks.slack.com/services/...',
      status: 'paused',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Integrations</h1>
        <p className="text-gray-400">Connect external services and configure webhooks</p>
      </div>

      {/* Connected Services */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Connected Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="bg-[#111827] border border-white/10 rounded-xl p-6 hover:border-[#6366F1]/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-2xl">
                  {integration.icon}
                </div>
                {integration.status === 'connected' ? (
                  <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{integration.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{integration.description}</p>
              {integration.status === 'connected' ? (
                <button className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all flex items-center justify-center gap-2">
                  <SettingsIcon className="w-4 h-4" />
                  Configure
                </button>
              ) : (
                <button className="w-full px-4 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Webhook Builder */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Webhook Builder</h2>
        <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Event</label>
              <select
                value={webhookEvent}
                onChange={(e) => setWebhookEvent(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              >
                <option value="deployment.completed">deployment.completed</option>
                <option value="deployment.failed">deployment.failed</option>
                <option value="security.vulnerability_detected">security.vulnerability_detected</option>
                <option value="pipeline.started">pipeline.started</option>
                <option value="pipeline.completed">pipeline.completed</option>
                <option value="pipeline.failed">pipeline.failed</option>
                <option value="approval.required">approval.required</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Destination URL</label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.slack.com/..."
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              />
            </div>
          </div>
          <button className="px-6 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg transition-all font-medium">
            Create Webhook
          </button>
        </div>
      </div>

      {/* Existing Webhooks */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Active Webhooks</h2>
        <div className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Event</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Destination</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {webhooks.map((webhook) => (
                <tr key={webhook.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Webhook className="w-4 h-4 text-[#6366F1]" />
                      <span className="text-white font-mono text-sm">{webhook.event}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400 text-sm font-mono">{webhook.destination}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        webhook.status === 'active'
                          ? 'bg-[#22C55E]/10 text-[#22C55E]'
                          : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                      }`}
                    >
                      {webhook.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-[#6366F1] hover:text-[#8B5CF6] text-sm font-medium transition-colors">
                        Edit
                      </button>
                      <button className="text-[#EF4444] hover:text-[#DC2626] text-sm font-medium transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
