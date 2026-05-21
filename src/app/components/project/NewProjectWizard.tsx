import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Code, Upload, CheckCircle, FileText } from 'lucide-react';

interface NewProjectWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (projectId: string) => void;
}

type ProjectMode = 'greenfield' | 'brownfield';
type ProjectType = 'web' | 'api' | 'mobile' | 'ml' | 'data-pipeline';

interface ProjectConfig {
  mode: ProjectMode;
  description: string;
  projectType: ProjectType;
  language: string;
  template: string;
  appName: string;
  environment: string;
  pipeline: string;
  repo?: string;
  referenceFiles: File[];
}

const templates = [
  { id: 'java-microservice', name: 'Java Microservice', language: 'java', description: 'Spring Boot + Maven + Docker', icon: '☕' },
  { id: 'python-fastapi', name: 'Python FastAPI', language: 'python', description: 'FastAPI + SQLAlchemy + Docker', icon: '🐍' },
  { id: 'react-frontend', name: 'React Frontend', language: 'typescript', description: 'React + TypeScript + Vite', icon: '⚛️' },
  { id: 'node-express', name: 'Node.js Express', language: 'javascript', description: 'Express + MongoDB + Docker', icon: '🟢' },
  { id: 'ml-pipeline', name: 'ML Pipeline', language: 'python', description: 'PyTorch + MLflow + Kubernetes', icon: '🤖' },
  { id: 'blank', name: 'Blank Project', language: '', description: 'Start from scratch with no template', icon: '📄' },
];

export function NewProjectWizard({ isOpen, onClose, onComplete }: NewProjectWizardProps) {
  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [config, setConfig] = useState<ProjectConfig>({
    mode: 'greenfield',
    description: '',
    projectType: 'web',
    language: 'java',
    template: 'java-microservice',
    appName: '',
    environment: 'staging',
    pipeline: 'default',
    referenceFiles: [],
  });

  const totalSteps = config.mode === 'brownfield' ? 5 : 4;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = async () => {
    setIsCreating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const projectId = 'proj_' + Math.random().toString(36).substr(2, 9);
    setIsCreating(false);
    onComplete(projectId);
  };

  const updateConfig = (updates: Partial<ProjectConfig>) => {
    setConfig({ ...config, ...updates });
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      updateConfig({ referenceFiles: [...config.referenceFiles, ...Array.from(files)] });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...config.referenceFiles];
    newFiles.splice(index, 1);
    updateConfig({ referenceFiles: newFiles });
  };

  if (!isOpen) return null;

  return (
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
                <h2 className="text-2xl font-bold text-white">Create New Project</h2>
                <p className="text-sm text-gray-400 mt-1">AI-powered project initialization workflow</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-6">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center flex-1">
                <div
                  className={`h-1 flex-1 rounded-full transition-all ${
                    i < step ? 'bg-[#6366F1]' : 'bg-white/10'
                  }`}
                />
                {i < totalSteps - 1 && <div className="w-2" />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-400">Step {step} of {totalSteps}</span>
            <span className="text-xs text-gray-400">
              {step === 1 && 'Project Mode'}
              {step === 2 && 'Basic Information'}
              {step === 3 && 'Template Selection'}
              {step === 4 && config.mode === 'brownfield' && 'Repository'}
              {step === 4 && config.mode === 'greenfield' && 'Reference Files'}
              {step === 5 && 'Reference Files'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Project Mode */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Choose Project Mode</h3>
                <p className="text-sm text-gray-400">Start from scratch or import an existing codebase</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => updateConfig({ mode: 'greenfield' })}
                  className={`p-6 border-2 rounded-xl transition-all text-left ${
                    config.mode === 'greenfield'
                      ? 'border-[#6366F1] bg-[#6366F1]/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-[#22C55E]/10 rounded-lg">
                      <Sparkles className="w-6 h-6 text-[#22C55E]" />
                    </div>
                    {config.mode === 'greenfield' && (
                      <CheckCircle className="w-6 h-6 text-[#6366F1]" />
                    )}
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Greenfield Project</h4>
                  <p className="text-sm text-gray-400">
                    Start a brand new project from scratch with AI-generated architecture and code
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="px-2 py-1 bg-[#22C55E]/10 text-[#22C55E] text-xs rounded-full">
                      Recommended
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => updateConfig({ mode: 'brownfield' })}
                  className={`p-6 border-2 rounded-xl transition-all text-left ${
                    config.mode === 'brownfield'
                      ? 'border-[#6366F1] bg-[#6366F1]/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <Code className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    {config.mode === 'brownfield' && (
                      <CheckCircle className="w-6 h-6 text-[#6366F1]" />
                    )}
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Brownfield Project</h4>
                  <p className="text-sm text-gray-400">
                    Import an existing codebase and let AI analyze, enhance, and modernize it
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

          {/* Step 2: Basic Information */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Basic Information</h3>
                <p className="text-sm text-gray-400">Provide essential details about your project</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    value={config.description}
                    onChange={(e) => updateConfig({ description: e.target.value })}
                    placeholder="Build a retail e-commerce platform with microservices..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] resize-none"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Describe what you want to build. AI will use this to generate requirements.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Application Name *
                    </label>
                    <input
                      type="text"
                      value={config.appName}
                      onChange={(e) => updateConfig({ appName: e.target.value })}
                      placeholder="retail-platform"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Type *
                    </label>
                    <select
                      value={config.projectType}
                      onChange={(e) => updateConfig({ projectType: e.target.value as ProjectType })}
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
                      onChange={(e) => updateConfig({ language: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                    >
                      <option value="java">Java</option>
                      <option value="python">Python</option>
                      <option value="typescript">TypeScript</option>
                      <option value="javascript">JavaScript</option>
                      <option value="go">Go</option>
                      <option value="rust">Rust</option>
                      <option value="csharp">C#</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Environment
                    </label>
                    <select
                      value={config.environment}
                      onChange={(e) => updateConfig({ environment: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                    >
                      <option value="development">Development</option>
                      <option value="staging">Staging</option>
                      <option value="production">Production</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pipeline
                  </label>
                  <select
                    value={config.pipeline}
                    onChange={(e) => updateConfig({ pipeline: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                  >
                    <option value="default">Default (Full SDLC)</option>
                    <option value="fast">Fast (Skip QA)</option>
                    <option value="secure">Secure (Enhanced Security)</option>
                    <option value="custom">Custom Pipeline</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Template Selection */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Choose a Template</h3>
                <p className="text-sm text-gray-400">
                  Select a pre-configured template or start from scratch
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {templates
                  .filter(t => !t.language || t.language === config.language || t.id === 'blank')
                  .map((template) => (
                    <button
                      key={template.id}
                      onClick={() => updateConfig({ template: template.id })}
                      className={`p-4 border-2 rounded-xl transition-all text-left ${
                        config.template === template.id
                          ? 'border-[#6366F1] bg-[#6366F1]/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-3xl">{template.icon}</div>
                        {config.template === template.id && (
                          <CheckCircle className="w-5 h-5 text-[#6366F1]" />
                        )}
                      </div>
                      <h4 className="text-base font-semibold text-white mb-1">{template.name}</h4>
                      <p className="text-xs text-gray-400">{template.description}</p>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Step 4: Repository (Brownfield) */}
          {step === 4 && config.mode === 'brownfield' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Repository Configuration</h3>
                <p className="text-sm text-gray-400">Connect your existing codebase</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Repository URL *
                </label>
                <input
                  type="url"
                  value={config.repo || ''}
                  onChange={(e) => updateConfig({ repo: e.target.value })}
                  placeholder="https://github.com/yourorg/yourrepo"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  AI will clone and analyze your codebase to understand the architecture
                </p>
              </div>

              <div className="bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#6366F1] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">AI Analysis</h4>
                    <p className="text-xs text-gray-300">
                      Our AI agents will analyze your codebase to understand:
                    </p>
                    <ul className="text-xs text-gray-300 mt-2 space-y-1 list-disc list-inside">
                      <li>Project structure and dependencies</li>
                      <li>Coding patterns and conventions</li>
                      <li>Security vulnerabilities</li>
                      <li>Improvement opportunities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4/5: Reference Files */}
          {((step === 4 && config.mode === 'greenfield') || (step === 5 && config.mode === 'brownfield')) && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Reference Documents (Optional)</h3>
                <p className="text-sm text-gray-400">
                  Upload PDFs, wikis, or documentation to provide context
                </p>
              </div>

              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-[#6366F1]/50 transition-all">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.md"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-white font-medium mb-1">Click to upload files</p>
                  <p className="text-sm text-gray-400">
                    PDF, DOC, TXT, or MD files up to 10MB each
                  </p>
                </label>
              </div>

              {config.referenceFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-300">Uploaded Files</p>
                  {config.referenceFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-[#6366F1]" />
                        <span className="text-sm text-white">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-[#EF4444] transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-[#0A0F1E]">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all"
              >
                Cancel
              </button>
              {step < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={
                    (step === 2 && (!config.description || !config.appName)) ||
                    (step === 4 && config.mode === 'brownfield' && !config.repo)
                  }
                  className="flex items-center gap-2 px-6 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#6366F1]/20"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C3AED] text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#6366F1]/20"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Create Project
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
