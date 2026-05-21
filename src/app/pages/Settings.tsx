import { Users, Cpu, Cloud, DollarSign, Settings as SettingsIcon } from 'lucide-react';

export function Settings() {
  const tenants = [
    { name: 'Engineering Team', projects: 12, usage: '89%', cost: '$212/mo', status: 'active' },
    { name: 'Product Team', projects: 5, usage: '45%', cost: '$87/mo', status: 'active' },
    { name: 'Data Team', projects: 8, usage: '67%', cost: '$156/mo', status: 'active' },
  ];

  const llmModels = [
    { name: 'llama3.1:70b', type: 'Local', status: 'active', usage: '234k tokens' },
    { name: 'GPT-4.1', type: 'OpenAI', status: 'active', usage: '156k tokens' },
    { name: 'Claude Sonnet', type: 'Anthropic', status: 'inactive', usage: '0 tokens' },
  ];

  const infrastructure = [
    { name: 'Kubernetes', version: '1.28', status: 'healthy', nodes: 12 },
    { name: 'ArgoCD', version: '2.9.3', status: 'healthy', apps: 24 },
    { name: 'Terraform', version: '1.6.5', status: 'healthy', workspaces: 8 },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings & Administration</h1>
        <p className="text-gray-400">Manage tenants, runtime capabilities, and system configuration</p>
      </div>

      {/* Tenant Management */}
      <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-[#6366F1]" />
            <h2 className="text-xl font-semibold text-white">Tenant Management</h2>
          </div>
          <button className="px-4 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg transition-all">
            Add Tenant
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Tenant Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Projects</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Usage</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Cost</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant.name} className="border-b border-white/5 hover:bg-white/5 transition-all">
                  <td className="px-4 py-4 text-white font-medium">{tenant.name}</td>
                  <td className="px-4 py-4 text-gray-300">{tenant.projects}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#6366F1] rounded-full"
                          style={{ width: tenant.usage }}
                        />
                      </div>
                      <span className="text-gray-300 text-sm">{tenant.usage}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-300">{tenant.cost}</td>
                  <td className="px-4 py-4">
                    <span className="px-3 py-1 bg-[#22C55E]/10 text-[#22C55E] text-xs rounded-full">
                      {tenant.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="text-[#6366F1] hover:text-[#8B5CF6] text-sm font-medium transition-colors">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Runtime Capabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LLM Models */}
        <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="w-6 h-6 text-[#6366F1]" />
            <h2 className="text-xl font-semibold text-white">LLM Models</h2>
          </div>
          <div className="space-y-3">
            {llmModels.map((model) => (
              <div
                key={model.name}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
              >
                <div>
                  <h3 className="text-white font-medium mb-1">{model.name}</h3>
                  <p className="text-sm text-gray-400">{model.type} • {model.usage}</p>
                </div>
                <div className="flex items-center gap-3">
                  {model.status === 'active' ? (
                    <span className="w-2 h-2 bg-[#22C55E] rounded-full" />
                  ) : (
                    <span className="w-2 h-2 bg-gray-500 rounded-full" />
                  )}
                  <button className="p-2 hover:bg-white/5 rounded transition-all">
                    <SettingsIcon className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all">
            Add Model
          </button>
        </div>

        {/* Infrastructure */}
        <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Cloud className="w-6 h-6 text-[#6366F1]" />
            <h2 className="text-xl font-semibold text-white">Infrastructure</h2>
          </div>
          <div className="space-y-3">
            {infrastructure.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
              >
                <div>
                  <h3 className="text-white font-medium mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-400">
                    v{service.version} • {service.nodes ? `${service.nodes} nodes` : service.apps ? `${service.apps} apps` : `${service.workspaces} workspaces`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#22C55E]/10 text-[#22C55E] text-xs rounded-full">
                    {service.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all">
            Configure Infrastructure
          </button>
        </div>
      </div>

      {/* Cost Management */}
      <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="w-6 h-6 text-[#6366F1]" />
          <h2 className="text-xl font-semibold text-white">Cost Management</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10 border border-[#6366F1]/20 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">Total Monthly Cost</p>
            <p className="text-3xl font-bold text-white mb-1">$455</p>
            <p className="text-sm text-[#22C55E]">↓ 8% vs last month</p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">LLM API Costs</p>
            <p className="text-3xl font-bold text-white mb-1">$212</p>
            <p className="text-sm text-gray-400">47% of total</p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">Infrastructure Costs</p>
            <p className="text-3xl font-bold text-white mb-1">$243</p>
            <p className="text-sm text-gray-400">53% of total</p>
          </div>
        </div>
      </div>
    </div>
  );
}
