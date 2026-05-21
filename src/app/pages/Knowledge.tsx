import { BookOpen, Shield, Layout, AlertTriangle, Search } from 'lucide-react';

export function Knowledge() {
  const knowledgeItems = [
    {
      category: 'Security Guidelines',
      icon: Shield,
      color: 'text-[#EF4444]',
      items: [
        { title: 'JWT Best Practices', lastUpdated: '2 days ago', views: 124 },
        { title: 'OWASP Top 10 Checklist', lastUpdated: '1 week ago', views: 89 },
        { title: 'Secret Management', lastUpdated: '3 days ago', views: 156 },
      ],
    },
    {
      category: 'Architecture Decisions',
      icon: Layout,
      color: 'text-[#6366F1]',
      items: [
        { title: 'ADR-001: Microservices Architecture', lastUpdated: '1 month ago', views: 234 },
        { title: 'ADR-002: Event-Driven Design', lastUpdated: '2 weeks ago', views: 178 },
        { title: 'ADR-003: API Gateway Pattern', lastUpdated: '1 week ago', views: 145 },
      ],
    },
    {
      category: 'Runbooks',
      icon: BookOpen,
      color: 'text-[#22C55E]',
      items: [
        { title: 'Database Failover Procedure', lastUpdated: '4 days ago', views: 67 },
        { title: 'Incident Response Playbook', lastUpdated: '1 week ago', views: 98 },
        { title: 'Deployment Rollback Guide', lastUpdated: '5 days ago', views: 112 },
      ],
    },
    {
      category: 'Incident Reports',
      icon: AlertTriangle,
      color: 'text-[#F59E0B]',
      items: [
        { title: 'INC-2024-05-15: Payment Service Outage', lastUpdated: '4 days ago', views: 201 },
        { title: 'INC-2024-05-10: Database Performance', lastUpdated: '9 days ago', views: 145 },
        { title: 'INC-2024-05-01: API Rate Limiting', lastUpdated: '18 days ago', views: 87 },
      ],
    },
  ];

  const skillMaturity = [
    { skill: 'Requirements', level: 'Expert', progress: 95, color: 'bg-[#22C55E]' },
    { skill: 'Development', level: 'Developing', progress: 65, color: 'bg-[#F59E0B]' },
    { skill: 'Testing', level: 'Proficient', progress: 82, color: 'bg-[#6366F1]' },
    { skill: 'Security', level: 'Expert', progress: 91, color: 'bg-[#22C55E]' },
    { skill: 'Deployment', level: 'Proficient', progress: 78, color: 'bg-[#6366F1]' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Knowledge Base</h1>
          <p className="text-gray-400">Documentation, guidelines, and organizational learning</p>
        </div>
        <button className="px-4 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg transition-all">
          Add Document
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search knowledge base..."
          className="w-full pl-12 pr-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
        />
      </div>

      {/* Skill Maturity Dashboard */}
      <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">AI Skill Maturity</h2>
        <div className="space-y-4">
          {skillMaturity.map((skill) => (
            <div key={skill.skill}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{skill.skill}</span>
                  <span className="px-3 py-1 bg-white/5 text-gray-400 text-xs rounded-full">
                    {skill.level}
                  </span>
                </div>
                <span className="text-white font-medium">{skill.progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${skill.color}`}
                  style={{ width: `${skill.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {knowledgeItems.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.category} className="bg-[#111827] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Icon className={`w-6 h-6 ${section.color}`} />
                <h3 className="text-lg font-semibold text-white">{section.category}</h3>
              </div>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <button
                    key={item.title}
                    className="w-full text-left p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-all group"
                  >
                    <h4 className="text-white font-medium mb-2 group-hover:text-[#6366F1] transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>Updated {item.lastUpdated}</span>
                      <span>•</span>
                      <span>{item.views} views</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
