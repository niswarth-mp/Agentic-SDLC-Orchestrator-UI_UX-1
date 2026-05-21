import { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Code,
  Upload,
  CheckCircle,
  FileText,
  XCircle,
  Plus,
  Settings as SettingsIcon,
} from "lucide-react";

import { ServiceConfigModal } from "../modal/ServiceConfigModal";
import {
  Integration,
  NewProjectWizardProps,
  ProjectConfig,
  ProjectMode,
  ProjectType,
} from "../../utils/interfaces";
import { integrationsData, templates } from "../../utils/mockData";

export function NewProjectWizard({
  isOpen,
  onClose,
  onComplete,
}: NewProjectWizardProps) {
  // Wizard flow states
  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  // Custom configuration modal hooks
  const [activeConfigService, setActiveConfigService] =
    useState<Integration | null>(null);
  const [savedServiceCredentials, setSavedServiceCredentials] = useState<
    Record<string, Record<string, string>>
  >({});

  const [config, setConfig] = useState<ProjectConfig>({
    mode: "greenfield",
    description: "",
    projectType: "web",
    language: "java",
    template: "java-microservice",
    appName: "",
    environment: "staging",
    pipeline: "default",
    referenceFiles: [],
  });

  const totalSteps = config.mode === "brownfield" ? 4 : 5;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = async () => {
    setIsCreating(true);
    // Combines custom base structures with configured micro-secrets data
    console.log("Publishing Application Assembly:", {
      config,
      integrationSecrets: savedServiceCredentials,
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const projectId = "proj_" + Math.random().toString(36).substr(2, 9);
    setIsCreating(false);
    onComplete(projectId);
  };

  const updateConfig = (updates: Partial<ProjectConfig>) => {
    setConfig({ ...config, ...updates });
  };

  const handleModeChange = (mode: ProjectMode) => {
    updateConfig({ mode });
    setStep(1);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      updateConfig({
        referenceFiles: [...config.referenceFiles, ...Array.from(files)],
      });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...config.referenceFiles];
    newFiles.splice(index, 1);
    updateConfig({ referenceFiles: newFiles });
  };

  const getStepLabel = () => {
    if (step === 1) return "Project Mode";

    if (config.mode === "greenfield") {
      if (step === 2) return "Basic Information";
      if (step === 3) return "Template Selection";
      if (step === 4) return "Repository Configuration";
      if (step === 5) return "Reference Files";
    } else {
      if (step === 2) return "Repository Configuration";
      if (step === 3) return "Reference Files";
      if (step === 4) return "Connected Services";
    }
    return "";
  };

  const isNextDisabled = () => {
    if (config.mode === "greenfield") {
      if (step === 2) return !config.description || !config.appName;
      if (step === 4) return !config.repo;
    } else {
      if (step === 2) return !config.repo;
    }
    return false;
  };

  const handleSaveServiceConfig = (
    serviceId: string,
    data: Record<string, string>,
  ) => {
    setSavedServiceCredentials((prev) => ({
      ...prev,
      [serviceId]: data,
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Create New Project
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    AI-powered project initialization workflow
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar Mapping */}
            <div className="flex items-center gap-2 mt-6">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center flex-1">
                  <div
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i < step ? "bg-[#6366F1]" : "bg-white/10"
                    }`}
                  />
                  {i < totalSteps - 1 && <div className="w-2" />}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-400">
                Step {step} of {totalSteps}
              </span>
              <span className="text-xs text-gray-400">{getStepLabel()}</span>
            </div>
          </div>

          {/* Core Content Body views */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 1: Mode Switcher */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Choose Project Mode
                  </h3>
                  <p className="text-sm text-gray-400">
                    Start from scratch or import an existing codebase
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleModeChange("greenfield")}
                    className={`p-6 border-2 rounded-xl transition-all text-left ${
                      config.mode === "greenfield"
                        ? "border-[#6366F1] bg-[#6366F1]/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-[#22C55E]/10 rounded-lg">
                        <Sparkles className="w-6 h-6 text-[#22C55E]" />
                      </div>
                      {config.mode === "greenfield" && (
                        <CheckCircle className="w-6 h-6 text-[#6366F1]" />
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Greenfield Project
                    </h4>
                    <p className="text-sm text-gray-400">
                      Start a brand new project from scratch with AI-generated
                      architecture and code
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="px-2 py-1 bg-[#22C55E]/10 text-[#22C55E] text-xs rounded-full">
                        Recommended
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleModeChange("brownfield")}
                    className={`p-6 border-2 rounded-xl transition-all text-left ${
                      config.mode === "brownfield"
                        ? "border-[#6366F1] bg-[#6366F1]/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                        <Code className="w-6 h-6 text-[#F59E0B]" />
                      </div>
                      {config.mode === "brownfield" && (
                        <CheckCircle className="w-6 h-6 text-[#6366F1]" />
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Brownfield Project
                    </h4>
                    <p className="text-sm text-gray-400">
                      Import an existing codebase and let AI analyze, enhance,
                      and modernize it
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="px-2 py-1 bg-[#F59E0B]/10 text-[#F59E0B] text-xs rounded-full">
                        Existing Repo
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* GREENFIELD ONLY - Step 2: Information Configuration */}
            {step === 2 && config.mode === "greenfield" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Basic Information
                  </h3>
                  <p className="text-sm text-gray-400">
                    Provide essential details about your project
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Description *
                    </label>
                    <textarea
                      value={config.description}
                      onChange={(e) =>
                        updateConfig({ description: e.target.value })
                      }
                      placeholder="Build a retail e-commerce platform with microservices..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Application Name *
                      </label>
                      <input
                        type="text"
                        value={config.appName}
                        onChange={(e) =>
                          updateConfig({ appName: e.target.value })
                        }
                        placeholder="retail-platform"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Project Type *
                      </label>
                      <select
                        value={config.projectType}
                        onChange={(e) =>
                          updateConfig({
                            projectType: e.target.value as ProjectType,
                          })
                        }
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                      >
                        <option value="web">Web Application</option>
                        <option value="api">REST API / Backend</option>
                        <option value="mobile">Mobile App</option>
                        <option value="ml">Machine Learning</option>
                        <option value="data-pipeline">Data Pipeline</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Primary Language *
                      </label>
                      <select
                        value={config.language}
                        onChange={(e) =>
                          updateConfig({ language: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                      >
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="typescript">TypeScript</option>
                        <option value="javascript">JavaScript</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Environment
                      </label>
                      <select
                        value={config.environment}
                        onChange={(e) =>
                          updateConfig({ environment: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                      >
                        <option value="development">Development</option>
                        <option value="staging">Staging</option>
                        <option value="production">Production</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GREENFIELD ONLY - Step 3: Architecture Blueprint Base Template */}
            {step === 3 && config.mode === "greenfield" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Choose a Template
                  </h3>
                  <p className="text-sm text-gray-400">
                    Select a pre-configured architecture layout
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {templates
                    .filter(
                      (t) =>
                        !t.language ||
                        t.language === config.language ||
                        t.id === "blank",
                    )
                    .map((template) => (
                      <button
                        key={template.id}
                        onClick={() => updateConfig({ template: template.id })}
                        className={`p-4 border-2 rounded-xl transition-all text-left ${
                          config.template === template.id
                            ? "border-[#6366F1] bg-[#6366F1]/10"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-3xl">{template.icon}</div>
                          {config.template === template.id && (
                            <CheckCircle className="w-5 h-5 text-[#6366F1]" />
                          )}
                        </div>
                        <h4 className="text-base font-semibold text-white mb-1">
                          {template.name}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {template.description}
                        </p>
                      </button>
                    ))}
                </div>
              </div>
            )}
            {((step === 4 && config.mode === "greenfield") ||
              (step === 2 && config.mode === "brownfield")) && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Repository Configuration
                  </h3>
                  <p className="text-sm text-gray-400">
                    {config.mode === "greenfield"
                      ? "Specify target repository destinations for boilerplate publishing"
                      : "Connect your existing codebase"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Repository URL *
                  </label>
                  <input
                    type="url"
                    value={config.repo || ""}
                    onChange={(e) => updateConfig({ repo: e.target.value })}
                    placeholder="https://github.com/yourorg/yourrepo"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {config.mode === "greenfield"
                      ? "AI agents will prepare initialized files to match this downstream repository layout"
                      : "AI will clone and analyze your codebase to understand the architecture"}
                  </p>
                </div>

                <div className="bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#6366F1] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1">
                        {config.mode === "greenfield"
                          ? "Automated Setup Action"
                          : "AI Analysis Details"}
                      </h4>
                      <p className="text-xs text-gray-300">
                        {config.mode === "greenfield"
                          ? "Upon validation processing, our generation stack will provide:"
                          : "Our AI agents will analyze your codebase to understand:"}
                      </p>
                      <ul className="text-xs text-gray-300 mt-2 space-y-1 list-disc list-inside">
                        {config.mode === "greenfield" ? (
                          <>
                            <li>
                              CI/CD pipeline config structures mirroring
                              destination environments
                            </li>
                            <li>
                              Pre-configured security posture scanning
                              configurations
                            </li>
                            <li>
                              Clean repository structure ready for an initial
                              branch push
                            </li>
                          </>
                        ) : (
                          <>
                            <li>Project structure and dependencies</li>
                            <li>Coding patterns and conventions</li>
                            <li>Security vulnerabilities</li>
                            <li>Improvement opportunities</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SHARED COMPONENT - Upload References Scope (Greenfield Step 5 OR Brownfield Step 3) */}
            {((step === 5 && config.mode === "greenfield") ||
              (step === 3 && config.mode === "brownfield")) && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Reference Documents (Optional)
                  </h3>
                  <p className="text-sm text-gray-400">
                    Upload system architectures or specs to feed analytical
                    hooks
                  </p>
                </div>

                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-[#6366F1]/50 transition-all">
                  <input
                    type="file"
                    id="wizard-file-upload"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                  <label
                    htmlFor="wizard-file-upload"
                    className="cursor-pointer"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-white font-medium mb-1">
                      Click to drop contextual blueprints
                    </p>
                  </label>
                </div>

                {config.referenceFiles.length > 0 && (
                  <div className="space-y-2">
                    {config.referenceFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-[#6366F1]" />
                          <span className="text-sm text-white">
                            {file.name}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* BROWNFIELD ONLY - Step 4: Separate Connected Pipeline Matrix */}
            {step === 4 && config.mode === "brownfield" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Connected Services
                  </h2>
                  <p className="text-sm text-gray-400">
                    Link pipeline tools, code scanners, and tracking
                    architectures
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {integrationsData.map((integration) => {
                    const isConfigured =
                      !!savedServiceCredentials[integration.id];
                    return (
                      <div
                        key={integration.id}
                        className="bg-[#111827] border border-white/10 rounded-xl p-5 hover:border-[#6366F1]/50 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-2xl">
                              {integration.icon}
                            </div>
                            {integration.status === "connected" ||
                            isConfigured ? (
                              <div className="flex items-center gap-1 bg-green-500/15 px-2 py-0.5 rounded text-[10px] font-medium text-green-400 uppercase tracking-wider">
                                <CheckCircle className="w-3 h-3 text-green-400" />{" "}
                                Ready
                              </div>
                            ) : (
                              <XCircle className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <h3 className="text-base font-semibold text-white mb-1">
                            {integration.name}
                          </h3>
                          <p className="text-xs text-gray-400 mb-4 min-h-[32px]">
                            {integration.description}
                          </p>
                        </div>

                        <div>
                          {integration.status === "connected" ||
                          isConfigured ? (
                            <button
                              onClick={() =>
                                setActiveConfigService(integration)
                              }
                              className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all flex items-center justify-center gap-2 text-xs font-medium"
                            >
                              <SettingsIcon className="w-3.5 h-3.5" />
                              {isConfigured ? "Edit Settings" : "Configure"}
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                setActiveConfigService(integration)
                              }
                              className="w-full px-4 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg transition-all flex items-center justify-center gap-2 text-xs font-medium"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Connect
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-6 border-t border-white/10 bg-[#0A0F1E]">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg"
                >
                  Cancel
                </button>
                {step < totalSteps ? (
                  <button
                    onClick={handleNext}
                    disabled={isNextDisabled()}
                    className="flex items-center gap-2 px-6 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg transition-all disabled:opacity-50"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleCreate}
                    disabled={isCreating}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-lg transition-all"
                  >
                    {isCreating ? "Creating..." : "Create Project"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable parameter-injection target config modal loaded safely as top-tier context wrapper node */}
      <ServiceConfigModal
        isOpen={activeConfigService !== null}
        onClose={() => setActiveConfigService(null)}
        service={activeConfigService}
        onSave={handleSaveServiceConfig}
      />
    </>
  );
}
