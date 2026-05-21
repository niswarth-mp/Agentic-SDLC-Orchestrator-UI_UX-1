import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  FolderKanban,
  GitBranch,
  CheckCircle,
  Package,
  BookOpen,
  Plug,
  BarChart3,
  Settings as SettingsIcon,
  FileText,
  Search,
  Zap,
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/projects', label: 'Projects', icon: FolderKanban },
      { path: '/pipelines', label: 'Pipelines', icon: GitBranch },
    ],
  },
  {
    title: 'Governance',
    items: [
      { path: '/approvals', label: 'Approvals', icon: CheckCircle, badge: 12, badgeColor: 'bg-[#EF4444]' },
      { path: '/artifacts', label: 'Artifacts', icon: Package },
      { path: '/audit', label: 'Audit Logs', icon: FileText },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { path: '/metrics', label: 'Metrics', icon: BarChart3 },
      { path: '/knowledge', label: 'Knowledge', icon: BookOpen },
      { path: '/flywheel', label: 'Flywheel', icon: Zap },
    ],
  },
  {
    title: 'Platform',
    items: [
      { path: '/integrations', label: 'Integrations', icon: Plug },
      { path: '/settings', label: 'Settings', icon: SettingsIcon },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#0F172A] border-r border-white/10 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-white">Agentic SDLC</h1>
        </div>
        <p className="text-xs text-gray-400 mt-1">AI-Native Platform</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-white/10">
        <button className="w-full flex items-center gap-3 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
          <Search className="w-4 h-4" />
          <span className="text-sm">Search</span>
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && (
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path ||
                                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`${item.badgeColor || 'bg-[#6366F1]'} text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] text-center ${
                          item.badgeColor === 'bg-[#EF4444]' ? 'animate-pulse' : ''
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="px-3 py-2.5 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
            <span className="text-sm text-white">Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
