import { useState, useCallback, useRef, useEffect } from "react";
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
  XCircle,
  Plus,
  ChevronDown,
} from "lucide-react";

interface BRDDocument {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  summary: string;
  confidence: number;
  description?: string;
  videoName?: string;
  jiraProject?: string;
  jiraTickets?: number;
  projectType?: string;
}

interface Project {
  id: string;
  name: string;
  type: "greenfield" | "brownfield";
  lastActive: string;
  status: "active" | "planning" | "completed";
  confidence: number;
}

interface BRDUploadProps {
  onUploadComplete: (doc: BRDDocument) => void;
  existingProject?: Project | null;
}

type UploadStage = "upload" | "processing";

export function BRDUpload({
  onUploadComplete,
  existingProject,
}: BRDUploadProps) {
  const projectTypes = [
    "B2B E-Commerce",
    "B2C E-Commerce",
    "Portfolio Website",
    "Social Media",
    "Marketing Website",
    "Learning Management System (LMS)",
    "Healthcare / Medical",
    "Finance / FinTech",
    "Project Management",
    "CRM (Customer Relationship Management)",
    "HR / Employee Management",
    "Booking & Reservation",
    "Food Delivery / Restaurant",
    "Real Estate",
    "Travel & Tourism",
    "AI / SaaS Platform",
    "Others",
  ];

  const [selectedProjectType, setSelectedProjectType] = useState<string>(
    projectTypes[0],
  );
  const [customProjectType, setCustomProjectType] = useState<string>("");
  const [stage, setStage] = useState<UploadStage>("upload");
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const [resourceLinks, setResourceLinks] = useState<string[]>([""]);
  const [aiInstructions, setAiInstructions] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  // Dropdown open state and ref moved into local component below

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
      setUploadedDocuments((prev) => [...prev, ...files]);
    }
  }, []);

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedDocuments((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleRemoveDocument = (index: number) => {
    setUploadedDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddResourceLink = () => {
    setResourceLinks((prev) => [...prev, ""]);
  };

  const handleRemoveResourceLink = (index: number) => {
    setResourceLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResourceLinkChange = (index: number, value: string) => {
    setResourceLinks((prev) => {
      const newLinks = [...prev];
      newLinks[index] = value;
      return newLinks;
    });
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
    if (uploadedDocuments.length === 0) return;

    setStage("processing");
    setIsUploading(true);
    setUploadProgress(0);
    setCurrentStep("Uploading documents...");

    // Simulate upload progress with steps
    const hasResourceLinks = resourceLinks.some((link) => link.trim() !== "");
    const steps = [
      { progress: 15, message: "Uploading documents..." },
      {
        progress: 30,
        message: hasResourceLinks
          ? "Processing resource links..."
          : "Extracting text content...",
      },
      { progress: 45, message: "Extracting text content..." },
      {
        progress: 60,
        message: existingProject
          ? "Analyzing enhancement requirements..."
          : "Analyzing requirements...",
      },
      { progress: 75, message: "Identifying key features..." },
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
      const totalSize = uploadedDocuments.reduce(
        (sum, file) => sum + file.size,
        0,
      );
      const chosenProjectType =
        selectedProjectType === "Others" && customProjectType.trim()
          ? customProjectType.trim()
          : selectedProjectType;

      const mockDocument: BRDDocument = {
        id: Date.now().toString(),
        name:
          uploadedDocuments.length > 1
            ? `${uploadedDocuments.length} documents`
            : uploadedDocuments[0].name,
        size: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date().toLocaleString(),
        summary:
          aiInstructions ||
          (existingProject
            ? `Enhancement for ${existingProject.name} project`
            : "E-commerce platform with user authentication, product catalog, shopping cart, and payment integration. Includes admin dashboard and order management system."),
        confidence: 94,
        description: aiInstructions,
        jiraProject: selectedJiraProject || undefined,
        jiraTickets: jiraTicketCount || undefined,
        projectType: existingProject ? existingProject.type : chosenProjectType,
      };
      onUploadComplete(mockDocument);
    }, 3200);
  };

  // Upload Stage
  if (stage === "upload") {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {existingProject
                ? `Enhance ${existingProject.name}`
                : "Upload Project Documents"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {existingProject
                ? "Upload documents, add resource links, and provide AI instructions for project enhancements"
                : "Upload your BRD/PRD documents, add resource links, and provide AI instructions"}
            </p>
            {!existingProject && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Project Type
                </label>
                {/* Custom dropdown with scrollable options */}
                <ProjectTypeDropdown
                  projectTypes={projectTypes}
                  selected={selectedProjectType}
                  onSelect={(t) => {
                    setSelectedProjectType(t);
                    if (t !== "Others") {
                      setCustomProjectType("");
                    }
                  }}
                />

                {selectedProjectType === "Others" && (
                  <div className="mt-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0F172A] p-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Enter a custom project type
                    </label>
                    <input
                      type="text"
                      value={customProjectType}
                      onChange={(e) => setCustomProjectType(e.target.value)}
                      placeholder="e.g. AI governance platform"
                      className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#111827] px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Provide the custom project type to fetch and process that
                      variant.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Upload - Multiple Files */}
          <div className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging
                  ? "border-[#6366F1] bg-[#6366F1]/5"
                  : uploadedDocuments.length > 0
                    ? "border-[#22C55E] bg-[#22C55E]/5"
                    : "border-gray-300 dark:border-white/20 bg-white dark:bg-[#111827]"
              }`}
            >
              {uploadedDocuments.length > 0 ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-[#22C55E]/10 rounded-xl flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8 text-[#22C55E]" />
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {uploadedDocuments.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2 px-3 py-2 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 rounded-lg text-sm"
                      >
                        <div className="flex-1 min-w-0 text-left">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {(doc.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveDocument(index)}
                          className="text-[#EF4444] hover:bg-[#EF4444]/10 p-1 rounded"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="inline-block">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.txt,.doc"
                      multiple
                      onChange={handleDocumentSelect}
                    />
                    <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-lg font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 transition-all inline-block text-sm">
                      Add More Documents
                    </span>
                  </label>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Upload Documents
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Drag and drop or click to browse (multiple files supported)
                  </p>
                  <label className="inline-block">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.txt,.doc"
                      multiple
                      onChange={handleDocumentSelect}
                    />
                    <span className="px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-lg font-medium cursor-pointer hover:from-[#5558E3] hover:to-[#7C4FE0] transition-all inline-block text-sm">
                      Choose Documents
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    PDF, DOCX, TXT (Max 10MB each)
                  </p>
                </>
              )}
            </div>

            {/* Resource Links */}
            <div className="border-2 border-dashed rounded-xl p-6 bg-white dark:bg-[#111827] border-gray-300 dark:border-white/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 text-[#8B5CF6]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Resource Links
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Reference Links & Assets
                  </p>
                </div>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {resourceLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="url"
                      value={link}
                      onChange={(e) =>
                        handleResourceLinkChange(index, e.target.value)
                      }
                      placeholder="https://teams.microsoft.com/... or https://figma.com/..."
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                    />
                    {resourceLinks.length > 1 && (
                      <button
                        onClick={() => handleRemoveResourceLink(index)}
                        className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddResourceLink}
                className="mt-3 w-full px-4 py-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] rounded-lg font-medium hover:bg-[#8B5CF6]/20 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Another Link
              </button>
            </div>
          </div>

          {/* AI Instructions */}
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  AI Instructions
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {existingProject
                    ? "Provide instructions for enhancing this project"
                    : "Provide instructions for processing your project"}
                </p>
              </div>
            </div>
            <textarea
              value={aiInstructions}
              onChange={(e) => setAiInstructions(e.target.value)}
              className="w-full h-[400px] px-4 py-3 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] resize-none"
              placeholder={
                existingProject
                  ? "Example: Go through the documents and Figma links and Teams video links to understand the new requirements. Update the existing epics and user stories accordingly, and add new ones where needed."
                  : "Example: Go through the documents and Figma links and Teams video links. Extract all requirements and create comprehensive epics and user stories with acceptance criteria."
              }
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              These instructions guide the AI in processing your documents and
              resources
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-end">
          {selectedProjectType === "Others" && !customProjectType.trim() && (
            <p className="text-sm text-red-600 dark:text-red-400">
              Please enter a custom project type before continuing.
            </p>
          )}
          <button
            onClick={handleContinue}
            disabled={
              uploadedDocuments.length === 0 ||
              (selectedProjectType === "Others" && !customProjectType.trim())
            }
            className="px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl font-medium hover:from-[#5558E3] hover:to-[#7C4FE0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {existingProject
              ? "Start Enhancement Processing"
              : "Start Processing"}
          </button>
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
                Processing Project...
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

function ProjectTypeDropdown({
  projectTypes,
  selected,
  onSelect,
}: {
  projectTypes: string[];
  selected: string;
  onSelect: (s: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!(e.target instanceof Node)) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div className="mt-3">
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full pl-4 pr-3 py-3 flex items-center justify-between gap-3 bg-gradient-to-r from-white to-gray-50 dark:from-[#071022] dark:to-[#071227] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#6366F1] transition-all"
        >
          <div className="flex items-center gap-3 truncate">
            <Package className="w-5 h-5 text-[#8B5CF6] flex-shrink-0" />
            <span className="truncate">{selected}</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 dark:text-gray-500 transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <ul className="absolute z-50 mt-2 w-full bg-white dark:bg-[#071022] border border-gray-200 dark:border-white/10 rounded-lg shadow-lg max-h-48 overflow-auto divide-y divide-gray-100">
            {projectTypes.map((t) => (
              <li key={t}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(t);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-[#F3F0FF] dark:hover:bg-[#06202d] flex items-center justify-between text-sm ${t === selected ? "bg-[#F7F5FF] dark:bg-[#061827]" : ""}`}
                >
                  <span className="truncate">{t}</span>
                  {t === selected && (
                    <CheckCircle className="w-4 h-4 text-[#8B5CF6]" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Choose the category that best describes your project.
          </p>
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#071026] border border-gray-100 dark:border-white/8 text-sm text-gray-700 dark:text-gray-200 rounded-full font-medium shadow-sm">
            <span className="w-2 h-2 bg-[#8B5CF6] rounded-full inline-block" />
            {selected}
          </span>
        </div>
      </div>
    </div>
  );
}
