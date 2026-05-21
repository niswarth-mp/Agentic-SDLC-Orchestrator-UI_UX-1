import { Link, useNavigate } from 'react-router';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { NewProjectWizard } from '../components/project/NewProjectWizard';

export function Projects() {
  const navigate = useNavigate();
  const [showWizard, setShowWizard] = useState(false);
  const projects = [
    {
      id: 'payment-api',
      name: 'Payment API',
      phase: 'Dev',
      status: 'Active',
      confidence: 92,
      updated: '2m ago',
      statusColor: 'success',
    },
    {
      id: 'retail-ui',
      name: 'Retail UI',
      phase: 'QA',
      status: 'Pending',
      confidence: 87,
      updated: '5m ago',
      statusColor: 'warning',
    },
    {
      id: 'auth-service',
      name: 'Auth Service',
      phase: 'Design',
      status: 'Active',
      confidence: 78,
      updated: '12m ago',
      statusColor: 'success',
    },
    {
      id: 'notification-worker',
      name: 'Notification Worker',
      phase: 'Deploy',
      status: 'Active',
      confidence: 95,
      updated: '1h ago',
      statusColor: 'success',
    },
    {
      id: 'analytics-pipeline',
      name: 'Analytics Pipeline',
      phase: 'Dev',
      status: 'Failed',
      confidence: 45,
      updated: '3h ago',
      statusColor: 'error',
    },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage all your SDLC projects</p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg font-medium transition-all shadow-lg shadow-[#6366F1]/20"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 bg-[#111827] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
          />
        </div>
        <select className="px-4 py-2 bg-[#111827] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]">
          <option>All Phases</option>
          <option>Requirements</option>
          <option>Design</option>
          <option>Development</option>
          <option>QA</option>
          <option>Deploy</option>
        </select>
        <select className="px-4 py-2 bg-[#111827] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Failed</option>
        </select>
      </div>

      {/* Projects Table */}
      <div className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Project Name</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Phase</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Confidence</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Updated</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-b border-white/5 hover:bg-white/5 transition-all"
              >
                <td className="px-6 py-4">
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-white font-medium hover:text-[#6366F1] transition-colors"
                  >
                    {project.name}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-[#6366F1]/10 text-[#6366F1] text-sm rounded-full">
                    {project.phase}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      project.statusColor === 'success'
                        ? 'bg-[#22C55E]/10 text-[#22C55E]'
                        : project.statusColor === 'warning'
                        ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                        : 'bg-[#EF4444]/10 text-[#EF4444]'
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/10 rounded-full h-2 max-w-[100px]">
                      <div
                        className={`h-2 rounded-full ${
                          project.confidence >= 80
                            ? 'bg-[#22C55E]'
                            : project.confidence >= 60
                            ? 'bg-[#F59E0B]'
                            : 'bg-[#EF4444]'
                        }`}
                        style={{ width: `${project.confidence}%` }}
                      />
                    </div>
                    <span className="text-white text-sm font-medium">{project.confidence}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">{project.updated}</td>
                <td className="px-6 py-4">
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-[#6366F1] hover:text-[#8B5CF6] text-sm font-medium transition-colors"
                  >
                    View Details →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Project Wizard */}
      <NewProjectWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onComplete={(projectId) => {
          setShowWizard(false);
          navigate(`/projects/${projectId}`);
        }}
      />
    </div>
  );
}
