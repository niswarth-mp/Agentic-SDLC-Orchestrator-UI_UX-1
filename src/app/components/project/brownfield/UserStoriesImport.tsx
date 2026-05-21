import { useState } from 'react';
import { Search, Filter, CheckCircle, Circle, Grid3x3, List, Users, Clock, Flag } from 'lucide-react';

interface UserStoriesImportProps {
  config: any;
  updateConfig: (updates: any) => void;
}

type ViewMode = 'kanban' | 'table';

const mockStories = [
  {
    id: 'LEGACY-123',
    title: 'Migrate user authentication to OAuth 2.0',
    description: 'Replace legacy session-based auth with modern OAuth 2.0 flow',
    status: 'To Do',
    priority: 'High',
    storyPoints: 8,
    assignee: 'Sarah Chen',
    labels: ['security', 'breaking-change'],
  },
  {
    id: 'LEGACY-124',
    title: 'Refactor payment processing module',
    description: 'Break monolithic payment service into microservices',
    status: 'To Do',
    priority: 'High',
    storyPoints: 13,
    assignee: 'Mike Johnson',
    labels: ['architecture', 'payments'],
  },
  {
    id: 'LEGACY-125',
    title: 'Add API rate limiting',
    description: 'Implement token bucket rate limiter for public APIs',
    status: 'In Progress',
    priority: 'Medium',
    storyPoints: 5,
    assignee: 'Emma Davis',
    labels: ['api', 'security'],
  },
  {
    id: 'LEGACY-126',
    title: 'Database migration to PostgreSQL 15',
    description: 'Upgrade from PostgreSQL 12 to 15 for better performance',
    status: 'To Do',
    priority: 'Medium',
    storyPoints: 8,
    assignee: 'Alex Kumar',
    labels: ['database', 'infrastructure'],
  },
  {
    id: 'LEGACY-127',
    title: 'Implement audit logging',
    description: 'Add comprehensive audit trail for compliance requirements',
    status: 'Done',
    priority: 'High',
    storyPoints: 5,
    assignee: 'Rachel Green',
    labels: ['compliance', 'logging'],
  },
  {
    id: 'LEGACY-128',
    title: 'Update deprecated dependencies',
    description: 'Upgrade all packages with known security vulnerabilities',
    status: 'In Progress',
    priority: 'High',
    storyPoints: 3,
    assignee: 'Tom Wilson',
    labels: ['security', 'maintenance'],
  },
];

export function UserStoriesImport({ config, updateConfig }: UserStoriesImportProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const selectedStories = config.selectedStories || [];

  const handleToggleStory = (storyId: string) => {
    const isSelected = selectedStories.includes(storyId);
    const newSelection = isSelected
      ? selectedStories.filter((id: string) => id !== storyId)
      : [...selectedStories, storyId];
    updateConfig({ selectedStories: newSelection });
  };

  const handleSelectAll = () => {
    const allIds = filteredStories.map(s => s.id);
    updateConfig({ selectedStories: allIds });
  };

  const handleDeselectAll = () => {
    updateConfig({ selectedStories: [] });
  };

  const filteredStories = mockStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          story.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || story.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-[#EF4444] bg-[#EF4444]/10';
      case 'Medium': return 'text-[#F59E0B] bg-[#F59E0B]/10';
      case 'Low': return 'text-[#06B6D4] bg-[#06B6D4]/10';
      default: return 'text-gray-400 bg-white/5';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'text-[#22C55E] bg-[#22C55E]/10';
      case 'In Progress': return 'text-[#6366F1] bg-[#6366F1]/10';
      case 'To Do': return 'text-gray-400 bg-white/5';
      default: return 'text-gray-400 bg-white/5';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#111827] border border-white/10 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Total Stories</p>
          <p className="text-2xl font-bold text-white">{mockStories.length}</p>
        </div>
        <div className="bg-[#111827] border border-white/10 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Selected</p>
          <p className="text-2xl font-bold text-[#6366F1]">{selectedStories.length}</p>
        </div>
        <div className="bg-[#111827] border border-white/10 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Total Story Points</p>
          <p className="text-2xl font-bold text-white">
            {mockStories.filter(s => selectedStories.includes(s.id)).reduce((sum, s) => sum + s.storyPoints, 0)}
          </p>
        </div>
        <div className="bg-[#111827] border border-white/10 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">High Priority</p>
          <p className="text-2xl font-bold text-[#EF4444]">
            {mockStories.filter(s => s.priority === 'High' && selectedStories.includes(s.id)).length}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories..."
              className="w-full pl-10 pr-4 py-2 bg-[#111827] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-[#111827] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
          >
            <option value="all">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAll}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-lg transition-all"
          >
            Select All
          </button>
          <button
            onClick={handleDeselectAll}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-lg transition-all"
          >
            Clear
          </button>
          <div className="flex items-center gap-1 ml-2 bg-[#111827] border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded transition-all ${
                viewMode === 'table' ? 'bg-[#6366F1] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded transition-all ${
                viewMode === 'kanban' ? 'bg-[#6366F1] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400 w-12"></th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Story ID</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Priority</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Points</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Assignee</th>
              </tr>
            </thead>
            <tbody>
              {filteredStories.map((story) => {
                const isSelected = selectedStories.includes(story.id);
                return (
                  <tr
                    key={story.id}
                    onClick={() => handleToggleStory(story.id)}
                    className={`border-b border-white/5 cursor-pointer transition-all ${
                      isSelected ? 'bg-[#6366F1]/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <td className="px-4 py-4">
                      {isSelected ? (
                        <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-500" />
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-mono text-[#6366F1]">{story.id}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-white mb-1">{story.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{story.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(story.status)}`}>
                        {story.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${getPriorityColor(story.priority)}`}>
                        <Flag className="w-3 h-3" />
                        {story.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-white">{story.storyPoints}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                          <span className="text-xs font-medium text-white">{story.assignee.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <span className="text-sm text-gray-300">{story.assignee}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-3 gap-4">
          {['To Do', 'In Progress', 'Done'].map((status) => {
            const statusStories = filteredStories.filter(s => s.status === status);
            return (
              <div key={status} className="bg-[#111827] border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">{status}</h3>
                  <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-full">
                    {statusStories.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {statusStories.map((story) => {
                    const isSelected = selectedStories.includes(story.id);
                    return (
                      <div
                        key={story.id}
                        onClick={() => handleToggleStory(story.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#6366F1] bg-[#6366F1]/10'
                            : 'border-white/10 bg-[#0A0F1E] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-mono text-[#6366F1]">{story.id}</span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-[#22C55E]" />}
                        </div>
                        <h4 className="text-sm font-medium text-white mb-2">{story.title}</h4>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getPriorityColor(story.priority)}`}>
                            <Flag className="w-3 h-3" />
                            {story.priority}
                          </span>
                          <span className="text-xs text-gray-400">{story.storyPoints} pts</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selection Summary */}
      {selectedStories.length > 0 && (
        <div className="bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/10 border border-[#6366F1]/20 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">
                {selectedStories.length} {selectedStories.length === 1 ? 'story' : 'stories'} selected
              </h4>
              <p className="text-xs text-gray-400">
                These user stories will be used to guide AI code analysis and modernization
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Total Effort</p>
              <p className="text-2xl font-bold text-white">
                {mockStories.filter(s => selectedStories.includes(s.id)).reduce((sum, s) => sum + s.storyPoints, 0)} pts
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
