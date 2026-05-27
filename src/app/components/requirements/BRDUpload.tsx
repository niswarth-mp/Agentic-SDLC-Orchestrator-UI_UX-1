import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Video,
  Package,
  Sparkles,
  ExternalLink,
  Loader,
} from "lucide-react";

interface BRDDocument {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  summary: string;
  confidence: number;
  projectType?: "brownfield" | "greenfield";
  description?: string;
  videoName?: string;
  jiraProject?: string;
  jiraTickets?: number;
}

interface BRDUploadProps {
  onUploadComplete: (doc: BRDDocument) => void;
}

type UploadStage = "project-type" | "upload" | "jira-import" | "processing";

export function BRDUpload({ onUploadComplete }: BRDUploadProps) {
  const [stage, setStage] = useState<UploadStage>("project-type");
  const [projectType, setProjectType] = useState<
    "brownfield" | "greenfield" | undefined
  >(undefined);
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  // Jira import state
  const [selectedJiraProject, setSelectedJiraProject] = useState("");
  const [isImportingJira, setIsImportingJira] = useState(false);
  const [jiraTicketCount, setJiraTicketCount] = useState(0);

  const jiraProjects = [
    { key: "ECOM", name: "E-Commerce Platform", tickets: 47 },
    { key: "MOBILE", name: "Mobile App", tickets: 32 },
    { key: "API", name: "API Services", tickets: 28 },
    { key: "WEB", name: "Web Portal", tickets: 55 },
    { key: "ADMIN", name: "Admin Dashboard", tickets: 19 },
  ];

  const handleProjectTypeSelect = (type: "brownfield" | "greenfield") => {
    setProjectType(type);
    setStage("upload");
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadedDocument(files[0]);
    }
  }, []);

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedDocument(files[0]);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedVideo(files[0]);
    }
  };

  const handleJiraImport = async () => {
    if (!selectedJiraProject) return;

    setIsImportingJira(true);
    // Simulate Jira import
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const project = jiraProjects.find((p) => p.key === selectedJiraProject);
    if (project) {
      setJiraTicketCount(project.tickets);
    }

    setIsImportingJira(false);
  };

  const handleContinue = async () => {
    if (!uploadedDocument) return;

    if (projectType === "brownfield" && !jiraTicketCount) {
      setStage("jira-import");
      return;
    }

    setStage("processing");
    setIsUploading(true);
    setUploadProgress(0);
    setCurrentStep("Uploading documents...");

    // Simulate upload progress with steps
    const steps = [
      { progress: 15, message: "Uploading documents..." },
      {
        progress: 30,
        message: uploadedVideo
          ? "Processing video..."
          : "Extracting text content...",
      },
      { progress: 45, message: "Extracting text content..." },
      { progress: 60, message: "Analyzing requirements..." },
      {
        progress: 75,
        message:
          projectType === "brownfield"
            ? "Analyzing existing Jira tickets..."
            : "Identifying key features...",
      },
      { progress: 90, message: "Generating summary..." },
      { progress: 100, message: "Processing complete!" },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setUploadProgress(step.progress);
      setCurrentStep(step.message);
    }

    // Simulate processing
    setTimeout(() => {
      const mockDocument: BRDDocument = {
        id: Date.now().toString(),
        name: uploadedDocument.name,
        size: `${(uploadedDocument.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date().toLocaleString(),
        summary:
          description ||
          "E-commerce platform with user authentication, product catalog, shopping cart, and payment integration. Includes admin dashboard and order management system.",
        confidence: 94,
        projectType,
        description,
        videoName: uploadedVideo?.name,
        jiraProject: selectedJiraProject || undefined,
        jiraTickets: jiraTicketCount || undefined,
      };
      onUploadComplete(mockDocument);
    }, 3200);
  };

  // Project Type Selection
  if (stage === "project-type") {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl p-8 text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Select Project Type
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Choose whether you're working on a new project or enhancing an
            existing one
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Brownfield Project */}
            <button
              onClick={() => handleProjectTypeSelect("brownfield")}
              className="group bg-white dark:bg-[#0F172A] border-2 border-gray-200 dark:border-white/10 hover:border-[#F59E0B] hover:bg-[#F59E0B]/5 rounded-2xl p-8 text-left transition-all"
            >
              <div className="w-16 h-16 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#F59E0B]/20 transition-all">
                <Package className="w-8 h-8 text-[#F59E0B]" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Brownfield Project
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Enhance or modify an existing project with established codebase
                and infrastructure
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-[#F59E0B] mt-0.5 flex-shrink-0" />
                  <span>Import existing Jira tickets</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-[#F59E0B] mt-0.5 flex-shrink-0" />
                  <span>Upload BRD/PRD documents</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-[#F59E0B] mt-0.5 flex-shrink-0" />
                  <span>Add video demonstrations</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-[#F59E0B] mt-0.5 flex-shrink-0" />
                  <span>Import Existing Jira Tickets</span>
                </li>
              </ul>
            </button>

            {/* Greenfield Project */}
            <button
              onClick={() => handleProjectTypeSelect("greenfield")}
              className="group bg-white dark:bg-[#0F172A] border-2 border-gray-200 dark:border-white/10 hover:border-[#22C55E] hover:bg-[#22C55E]/5 rounded-2xl p-8 text-left transition-all"
            >
              <div className="w-16 h-16 bg-[#22C55E]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#22C55E]/20 transition-all">
                <Sparkles className="w-8 h-8 text-[#22C55E]" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Greenfield Project
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Start a brand new project from scratch with fresh requirements
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
                  <span>Upload BRD/PRD documents</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
                  <span>Add video demonstrations</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
                  <span>Define project requirements</span>
                </li>
              </ul>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Upload Stage
  if (stage === "upload") {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Upload Project Documents -{" "}
                {projectType === "brownfield" ? "Brownfield" : "Greenfield"}{" "}
                Project
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload your BRD/PRD documents, videos, and provide project
                description
              </p>
            </div>
            <button
              onClick={() => setStage("project-type")}
              className="px-4 py-2 text-sm border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Change Type
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Upload */}
          <div className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging
                  ? "border-[#6366F1] bg-[#6366F1]/5"
                  : uploadedDocument
                    ? "border-[#22C55E] bg-[#22C55E]/5"
                    : "border-gray-300 dark:border-white/20 bg-white dark:bg-[#111827]"
              }`}
            >
              {uploadedDocument ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-[#22C55E]/10 rounded-xl flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8 text-[#22C55E]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {uploadedDocument.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(uploadedDocument.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setUploadedDocument(null)}
                    className="text-sm text-[#EF4444] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Upload BRD/PRD Document
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Drag and drop or click to browse
                  </p>
                  <label className="inline-block">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.txt,.doc"
                      onChange={handleDocumentSelect}
                    />
                    <span className="px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-lg font-medium cursor-pointer hover:from-[#5558E3] hover:to-[#7C4FE0] transition-all inline-block text-sm">
                      Choose Document
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    PDF, DOCX, TXT (Max 10MB)
                  </p>
                </>
              )}
            </div>

            {/* Video Upload */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                uploadedVideo
                  ? "border-[#22C55E] bg-[#22C55E]/5"
                  : "border-gray-300 dark:border-white/20 bg-white dark:bg-[#111827]"
              }`}
            >
              {uploadedVideo ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-[#22C55E]/10 rounded-xl flex items-center justify-center mx-auto">
                    <Video className="w-8 h-8 text-[#22C55E]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {uploadedVideo.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(uploadedVideo.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setUploadedVideo(null)}
                    className="text-sm text-[#EF4444] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Video className="w-8 h-8 text-[#8B5CF6]" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Upload Video (Optional)
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Add video demonstration or walkthrough
                  </p>
                  <label className="inline-block">
                    <input
                      type="file"
                      className="hidden"
                      accept="video/*"
                      onChange={handleVideoSelect}
                    />
                    <span className="px-4 py-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] rounded-lg font-medium cursor-pointer hover:bg-[#8B5CF6]/20 transition-all inline-block text-sm">
                      Choose Video
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    MP4, MOV, AVI (Max 100MB)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Project Description */}
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Project Description
            </h4>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-[400px] px-4 py-3 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] resize-none"
              placeholder="Provide a detailed description of your project requirements, goals, and key features..."
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              This description will help AI better understand your project
              context
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={() => setStage("project-type")}
            className="px-6 py-3 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!uploadedDocument}
            className="px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl font-medium hover:from-[#5558E3] hover:to-[#7C4FE0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {projectType === "brownfield"
              ? "Continue to Jira Import"
              : "Start Processing"}
          </button>
        </div>
      </div>
    );
  }

  // Jira Import Stage (Brownfield only)
  if (stage === "jira-import") {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#0052CC]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ExternalLink className="w-10 h-10 text-[#0052CC]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Import Existing Jira Tickets
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Connect to your Jira project to import existing tickets and
              requirements
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Jira Project
              </label>
              <div className="space-y-3">
                {jiraProjects.map((project) => (
                  <button
                    key={project.key}
                    onClick={() => setSelectedJiraProject(project.key)}
                    className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                      selectedJiraProject === project.key
                        ? "border-[#0052CC] bg-[#0052CC]/5"
                        : "border-gray-200 dark:border-white/10 hover:border-[#0052CC]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="px-3 py-1 bg-[#0052CC]/10 text-[#0052CC] text-xs font-mono font-semibold rounded">
                            {project.key}
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {project.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {project.tickets} existing tickets
                        </p>
                      </div>
                      {selectedJiraProject === project.key && (
                        <CheckCircle className="w-5 h-5 text-[#0052CC]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {jiraTicketCount > 0 && (
              <div className="p-4 bg-[#22C55E]/5 border border-[#22C55E]/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Import Successful!
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Imported {jiraTicketCount} existing tickets from{" "}
                      {selectedJiraProject}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedJiraProject && !jiraTicketCount && (
              <button
                onClick={handleJiraImport}
                disabled={isImportingJira}
                className="w-full px-6 py-3 bg-[#0052CC] text-white rounded-xl font-medium hover:bg-[#0747A6] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isImportingJira ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Importing Tickets...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-5 h-5" />
                    Import from {selectedJiraProject}
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
            <button
              onClick={() => setStage("upload")}
              className="px-6 py-3 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              className="px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl font-medium hover:from-[#5558E3] hover:to-[#7C4FE0] transition-all"
            >
              {jiraTicketCount > 0
                ? "Continue to Processing"
                : "Skip Jira Import"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Processing Stage
  if (stage === "processing" && isUploading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl p-12 text-center">
          <div className="space-y-6">
            <div className="w-20 h-20 bg-[#6366F1]/10 rounded-2xl flex items-center justify-center mx-auto">
              <FileText className="w-10 h-10 text-[#6366F1] animate-pulse" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Processing{" "}
                {projectType === "brownfield" ? "Brownfield" : "Greenfield"}{" "}
                Project...
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI is analyzing your requirements and documents
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Progress
                </span>
                <span className="text-sm font-semibold text-[#6366F1]">
                  {uploadProgress}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#6366F1]/5 border border-[#6366F1]/20 rounded-lg">
                <div className="w-2 h-2 bg-[#6366F1] rounded-full animate-pulse" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {currentStep}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
