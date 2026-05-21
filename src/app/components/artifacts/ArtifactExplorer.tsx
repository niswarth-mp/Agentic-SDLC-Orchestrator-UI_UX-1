import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  File,
  FileText,
  FileCode,
  Shield,
  Database,
  Rocket,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

interface ArtifactFile {
  name: string;
  type: "file";
  icon: "file" | "code" | "doc" | "config";
  status?: "approved" | "pending" | "rejected";
  agent?: string;
}

interface ArtifactSection {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  expanded: boolean;
  files: ArtifactFile[];
}

interface ArtifactExplorerProps {
  onFileSelect: (section: string, file: string) => void;
  selectedFile?: { section: string; file: string };
}

export function ArtifactExplorer({
  onFileSelect,
  selectedFile,
}: ArtifactExplorerProps) {
  const [sections, setSections] = useState<ArtifactSection[]>([
    {
      id: "requirements",
      name: "Requirements",
      icon: FileText,
      color: "text-[#6366F1]",
      expanded: true,
      files: [
        {
          name: "PRD.md",
          type: "file",
          icon: "doc",
          status: "approved",
          agent: "requirements_agent",
        },
        {
          name: "user_stories.json",
          type: "file",
          icon: "config",
          status: "approved",
          agent: "requirements_agent",
        },
        {
          name: "acceptance_criteria.md",
          type: "file",
          icon: "doc",
          status: "approved",
          agent: "requirements_agent",
        },
      ],
    },
    {
      id: "development",
      name: "Development",
      icon: FileCode,
      color: "text-[#22C55E]",
      expanded: true,
      files: [
        {
          name: "PaymentService.java",
          type: "file",
          icon: "code",
          status: "pending",
          agent: "development_agent",
        },
        {
          name: "PaymentServiceTest.java",
          type: "file",
          icon: "code",
          status: "approved",
          agent: "testing_agent",
        },
        {
          name: "PaymentController.java",
          type: "file",
          icon: "code",
          status: "pending",
          agent: "development_agent",
        },
        {
          name: "PaymentDTO.java",
          type: "file",
          icon: "code",
          status: "approved",
          agent: "development_agent",
        },
      ],
    },
    {
      id: "security",
      name: "Security",
      icon: Shield,
      color: "text-[#EF4444]",
      expanded: false,
      files: [
        {
          name: "SECURITY.md",
          type: "file",
          icon: "doc",
          status: "approved",
          agent: "security_agent",
        },
        {
          name: "vulnerability_report.json",
          type: "file",
          icon: "config",
          status: "rejected",
          agent: "security_agent",
        },
        {
          name: "auth_audit.log",
          type: "file",
          icon: "file",
          status: "pending",
          agent: "security_agent",
        },
      ],
    },
    {
      id: "infrastructure",
      name: "Infrastructure",
      icon: Database,
      color: "text-[#F59E0B]",
      expanded: false,
      files: [
        {
          name: "main.tf",
          type: "file",
          icon: "config",
          status: "approved",
          agent: "infra_agent",
        },
        {
          name: "variables.tf",
          type: "file",
          icon: "config",
          status: "approved",
          agent: "infra_agent",
        },
        {
          name: "outputs.tf",
          type: "file",
          icon: "config",
          status: "pending",
          agent: "infra_agent",
        },
      ],
    },
    {
      id: "deployments",
      name: "Deployments",
      icon: Rocket,
      color: "text-[#8B5CF6]",
      expanded: false,
      files: [
        {
          name: "deployment.yaml",
          type: "file",
          icon: "config",
          status: "approved",
          agent: "deployment_agent",
        },
        {
          name: "service.yaml",
          type: "file",
          icon: "config",
          status: "approved",
          agent: "deployment_agent",
        },
        {
          name: "rollout_plan.md",
          type: "file",
          icon: "doc",
          status: "pending",
          agent: "deployment_agent",
        },
      ],
    },
    {
      id: "compliance",
      name: "Compliance",
      icon: CheckCircle,
      color: "text-[#06B6D4]",
      expanded: false,
      files: [
        {
          name: "coverage.xml",
          type: "file",
          icon: "config",
          status: "approved",
          agent: "testing_agent",
        },
        {
          name: "compliance_report.pdf",
          type: "file",
          icon: "file",
          status: "approved",
          agent: "compliance_agent",
        },
        {
          name: "audit_trail.log",
          type: "file",
          icon: "file",
          status: "approved",
          agent: "audit_agent",
        },
      ],
    },
  ]);

  const toggleSection = (sectionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, expanded: !section.expanded }
          : section,
      ),
    );
  };

  const getFileIcon = (iconType: string) => {
    switch (iconType) {
      case "code":
        return FileCode;
      case "doc":
        return FileText;
      case "config":
        return File;
      default:
        return File;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-3.5 h-3.5 text-[#22C55E]" />;
      case "rejected":
        return <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" />;
      case "pending":
        return <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-[280px] bg-[#0F172A] border-r border-white/10 flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-white/10">
        <h2 className="text-base font-bold text-white mb-4">Artifacts</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-3">
        {sections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <div key={section.id} className="mb-3">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl transition-all group"
              >
                {section.expanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
                <SectionIcon className={`w-4 h-4 ${section.color}`} />
                <span className="text-sm font-semibold text-white flex-1 text-left">
                  {section.name}
                </span>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                  {section.files.length}
                </span>
              </button>

              {/* Files */}
              {section.expanded && (
                <div className="ml-7 mt-2 space-y-1">
                  {section.files.map((file) => {
                    const FileIcon = getFileIcon(file.icon);
                    const isSelected =
                      selectedFile?.section === section.id &&
                      selectedFile?.file === file.name;

                    return (
                      <button
                        key={file.name}
                        onClick={() => onFileSelect(section.id, file.name)}
                        className={`relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all group ${
                          isSelected
                            ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-[#6366F1]/20"
                            : "hover:bg-white/5 text-gray-300 hover:text-white"
                        }`}
                      >
                        <FileIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs flex-1 text-left truncate font-medium">
                          {file.name}
                        </span>
                        {getStatusIcon(file.status)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats Footer */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-t from-white/5 to-transparent">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-lg">
            <p className="text-lg text-[#22C55E] font-bold">18</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">
              Approved
            </p>
          </div>
          <div className="text-center p-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg">
            <p className="text-lg text-[#F59E0B] font-bold">4</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">
              Pending
            </p>
          </div>
          <div className="text-center p-2 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
            <p className="text-lg text-[#EF4444] font-bold">1</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">
              Rejected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
