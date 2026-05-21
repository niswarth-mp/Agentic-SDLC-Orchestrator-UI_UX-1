import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, CheckCircle, Code, GitBranch, Trello, FileText, BarChart3, Rocket } from 'lucide-react';
import { RepositoryConnection } from './brownfield/RepositoryConnection';
import { JiraIntegration } from './brownfield/JiraIntegration';
import { UserStoriesImport } from './brownfield/UserStoriesImport';
import { AIAnalysis } from './brownfield/AIAnalysis';
import { ReviewAndCreate } from './brownfield/ReviewAndCreate';

interface BrownfieldWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (projectId: string) => void;
}

interface BrownfieldConfig {
  // Step 1: Project Details
  projectName: string;
  description: string;
  projectType: string;
  primaryLanguage: string;

  // Step 2: Repository
  gitProvider: 'github' | 'gitlab' | 'bitbucket' | null;
  repositoryUrl: string;
  branch: string;
  accessToken: string;

  // Step 3: Jira
  jiraWorkspace: string;
  jiraProjectKey: string;
  jiraApiToken: string;

  // Step 4: User Stories
  selectedStories: string[];

  // Step 5: AI Analysis
  analysisComplete: boolean;

  // Step 6: Review
  confirmReady: boolean;
}

const steps = [
  { id: 1, name: 'Project Details', icon: FileText, description: 'Basic information' },
  { id: 2, name: 'Repository', icon: GitBranch, description: 'Connect Git repository' },
  { id: 3, name: 'Jira Integration', icon: Trello, description: 'Link Jira workspace' },
  { id: 4, name: 'User Stories', icon: Code, description: 'Import requirements' },
  { id: 5, name: 'AI Analysis', icon: BarChart3, description: 'Repository scan' },
  { id: 6, name: 'Review', icon: Rocket, description: 'Confirm & create' },
];

export function BrownfieldWizard({ isOpen, onClose, onComplete }: BrownfieldWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [config, setConfig] = useState<BrownfieldConfig>({
    projectName: '',
    description: '',
    projectType: 'web',
    primaryLanguage: 'java',
    gitProvider: null,
    repositoryUrl: '',
    branch: 'main',
    accessToken: '',
    jiraWorkspace: '',
    jiraProjectKey: '',
    jiraApiToken: '',
    selectedStories: [],
    analysisComplete: false,
    confirmReady: false,
  });

  const updateConfig = (updates: Partial<BrownfieldConfig>) => {
    setConfig({ ...config, ...updates });
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const projectId = 'proj_' + Math.random().toString(36).substr(2, 9);
    setIsCreating(false);
    onComplete(projectId);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return config.projectName && config.description;
      case 2:
        return config.gitProvider && config.repositoryUrl && config.branch;
      case 3:
        return config.jiraWorkspace && config.jiraProjectKey;
      case 4:
        return config.selectedStories.length > 0;
      case 5:
        return config.analysisComplete;
      case 6:
        return config.confirmReady;
      default:
        return true;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0F1E] border border-white/10 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex shadow-2xl">
        {/* Left Sidebar - Progress Steps */}
        <div className="w-80 bg-gradient-to-b from-[#111827] to-[#0F172A] border-r border-white/10 p-6 flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-white">Brownfield Import</h2>
            </div>
            <p className="text-xs text-gray-400">Import existing codebase with AI analysis</p>
          </div>

          <nav className="flex-1 space-y-2">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isPending = currentStep < step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => !isPending && setCurrentStep(step.id)}
                  disabled={isPending}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all text-left ${
                    isActive
                      ? 'bg-[#6366F1]/10 border-2 border-[#6366F1]'
                      : isCompleted
                      ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                      : 'bg-transparent border border-white/5 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isActive
                        ? 'bg-[#6366F1] text-white'
                        : isCompleted
                        ? 'bg-[#22C55E]/10 text-[#22C55E]'
                        : 'bg-white/5 text-gray-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm font-semibold mb-1 ${
                        isActive ? 'text-white' : isCompleted ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </h3>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10">
            <div className="bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 border border-[#6366F1]/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#6366F1]" />
                <span className="text-xs font-semibold text-white">AI-Powered</span>
              </div>
              <p className="text-xs text-gray-300">
                Our AI will analyze your codebase, detect patterns, and identify improvement opportunities
              </p>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-[#111827]/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {steps[currentStep - 1].name}
                </h2>
                <p className="text-sm text-gray-400">{steps[currentStep - 1].description}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#0A0F1E]">
            {currentStep === 1 && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={config.projectName}
                    onChange={(e) => updateConfig({ projectName: e.target.value })}
                    placeholder="legacy-payment-system"
                    className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    value={config.description}
                    onChange={(e) => updateConfig({ description: e.target.value })}
                    placeholder="Describe your existing project, its purpose, and what you'd like to achieve..."
                    className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] resize-none"
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Type
                    </label>
                    <select
                      value={config.projectType}
                      onChange={(e) => updateConfig({ projectType: e.target.value })}
                      className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                    >
                      <option value="web">Web Application</option>
                      <option value="api">REST API / Backend</option>
                      <option value="mobile">Mobile App</option>
                      <option value="desktop">Desktop Application</option>
                      <option value="microservices">Microservices</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Primary Language
                    </label>
                    <select
                      value={config.primaryLanguage}
                      onChange={(e) => updateConfig({ primaryLanguage: e.target.value })}
                      className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                    >
                      <option value="java">Java</option>
                      <option value="python">Python</option>
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="csharp">C#</option>
                      <option value="go">Go</option>
                      <option value="ruby">Ruby</option>
                      <option value="php">PHP</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && <RepositoryConnection config={config} updateConfig={updateConfig} />}
            {currentStep === 3 && <JiraIntegration config={config} updateConfig={updateConfig} />}
            {currentStep === 4 && <UserStoriesImport config={config} updateConfig={updateConfig} />}
            {currentStep === 5 && <AIAnalysis config={config} updateConfig={updateConfig} />}
            {currentStep === 6 && <ReviewAndCreate config={config} updateConfig={updateConfig} />}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-white/10 bg-[#111827]/50">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">
                  Step {currentStep} of {steps.length}
                </span>
                {currentStep < steps.length ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#6366F1]/20"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleCreate}
                    disabled={!canProceed() || isCreating}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C3AED] text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#6366F1]/20"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4" />
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
    </div>
  );
}
