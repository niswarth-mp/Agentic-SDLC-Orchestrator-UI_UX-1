import { useState } from "react";
import type { Epic, UserStory } from "../../utils/requirementsTypes";
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Edit2,
  Plus,
  ExternalLink,
  GitBranch,
} from "lucide-react";
import { BRDUpload } from "../requirements/BRDUpload";
import { AIGeneration } from "../requirements/AIGeneration";
import { ApprovalWorkflow } from "../requirements/ApprovalWorkflow";
import { JiraIntegration } from "../requirements/JiraIntegration";

type Step = "upload" | "generation" | "approval" | "jira" | "complete";

interface BRDDocument {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  summary: string;
  confidence: number;
}

export function Requirements() {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [uploadedDocument, setUploadedDocument] = useState<BRDDocument | null>(
    null,
  );
  const [generatedEpics, setGeneratedEpics] = useState<Epic[]>([]);
  const [approvalStatus, setApprovalStatus] = useState<
    "pending" | "approved" | "partial"
  >("pending");

  const steps = [
    { id: "upload", label: "Project Intake", icon: Upload },
    { id: "generation", label: "AI Generation", icon: Sparkles },
    { id: "approval", label: "Approval", icon: CheckCircle },
    { id: "jira", label: "Jira Sync", icon: GitBranch },
  ];

  const handleDocumentUpload = (doc: BRDDocument) => {
    setUploadedDocument(doc);
    setCurrentStep("generation");
  };

  const handleGenerationComplete = (epics: Epic[]) => {
    setGeneratedEpics(epics);
    setCurrentStep("approval");
  };

  const handleApprovalComplete = (status: "approved" | "partial") => {
    setApprovalStatus(status);
    setCurrentStep("jira");
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#0A0F1E] transition-colors">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Requirements Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Transform BRDs into actionable user stories with AI
            </p>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#0F172A]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted =
                steps.findIndex((s) => s.id === currentStep) > index;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? "bg-[#22C55E] border-[#22C55E] text-white"
                          : isActive
                            ? "bg-[#6366F1] border-[#6366F1] text-white"
                            : "bg-transparent border-gray-300 dark:border-white/20 text-gray-400 dark:text-gray-600"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-4 ${
                        isCompleted
                          ? "bg-[#22C55E]"
                          : "bg-gray-300 dark:bg-white/20"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        {currentStep === "upload" && (
          <BRDUpload onUploadComplete={handleDocumentUpload} />
        )}
        {currentStep === "generation" && uploadedDocument && (
          <AIGeneration
            document={uploadedDocument}
            onComplete={handleGenerationComplete}
          />
        )}
        {currentStep === "approval" && (
          <ApprovalWorkflow
            epics={generatedEpics}
            onComplete={handleApprovalComplete}
          />
        )}
        {currentStep === "jira" && <JiraIntegration epics={generatedEpics} />}
      </div>
    </div>
  );
}
