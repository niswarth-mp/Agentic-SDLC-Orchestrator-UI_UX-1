import { FileText, User, Clock, GitCommit } from "lucide-react";

export function Audit() {
  const auditEvents = [
    {
      id: "1",
      timestamp: "2024-05-19 10:22:15",
      agent: "development_agent",
      action: "Modified file",
      target: "PaymentService.java",
      project: "payment-service",
      type: "code_change",
    },
    {
      id: "2",
      timestamp: "2024-05-19 10:21:45",
      agent: "security_agent",
      action: "Flagged vulnerability",
      target: "CVE-2024-1234",
      project: "payment-service",
      type: "security",
    },
    {
      id: "3",
      timestamp: "2024-05-19 10:20:30",
      agent: "testing_agent",
      action: "Updated coverage",
      target: "Coverage: 91%",
      project: "payment-service",
      type: "test",
    },
    {
      id: "4",
      timestamp: "2024-05-19 10:15:12",
      agent: "deployment_agent",
      action: "Deployed to staging",
      target: "retail-ui v1.2.3",
      project: "retail-ui",
      type: "deployment",
    },
    {
      id: "5",
      timestamp: "2024-05-19 09:45:00",
      agent: "alice.johnson",
      action: "Approved QA gate",
      target: "payment-service",
      project: "payment-service",
      type: "approval",
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "security":
        return "text-[#EF4444] bg-[#EF4444]/10";
      case "deployment":
        return "text-[#22C55E] bg-[#22C55E]/10";
      case "approval":
        return "text-[#6366F1] bg-[#6366F1]/10";
      case "test":
        return "text-[#F59E0B] bg-[#F59E0B]/10";
      default:
        return "text-gray-400 bg-white/5";
    }
  };

  return (
    <div className="p-8 space-y-6 bg-gray-50 dark:bg-[#0A0F1E] transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Audit Logs
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Complete activity trail across all projects and agents
          </p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]">
            <option>All Projects</option>
            <option>payment-service</option>
            <option>retail-ui</option>
          </select>
          <select className="px-4 py-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]">
            <option>All Events</option>
            <option>Code Changes</option>
            <option>Security</option>
            <option>Deployments</option>
            <option>Approvals</option>
          </select>
        </div>
      </div>

      {/* Audit Timeline */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
        <div className="space-y-4">
          {auditEvents.map((event, index) => (
            <div key={event.id}>
              <div className="flex items-start gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 border border-[#6366F1]/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#6366F1]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-gray-900 dark:text-white font-medium mb-1">
                        {event.action}
                      </h3>
                      <p className="text-sm text-gray-400">{event.target}</p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${getTypeColor(event.type)}`}
                    >
                      {event.type.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="text-[#6366F1] font-mono">
                        {event.agent}
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <GitCommit className="w-4 h-4" />
                      <span>{event.project}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
              {index < auditEvents.length - 1 && (
                <div className="ml-10 h-4 w-0.5 bg-gray-200/20 dark:bg-white/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
