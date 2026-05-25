import { useState } from "react";
import { ArtifactExplorer } from "../components/artifacts/ArtifactExplorer";
import { CodeViewer } from "../components/artifacts/CodeViewer";
import { AIInsights } from "../components/artifacts/AIInsights";
import { ArtifactTimeline } from "../components/artifacts/ArtifactTimeline";
import { Sparkles, GitCommit, Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface ChangeRequest {
  description: string;
  changeType: string;
  priority: string;
  submittedAt: string;
}

export function Artifacts() {
  const { theme, toggleTheme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<
    { section: string; file: string } | undefined
  >({
    section: "development",
    file: "PaymentService.java",
  });
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [pendingChangeRequest, setPendingChangeRequest] = useState<
    ChangeRequest | undefined
  >();

  const handleFileSelect = (section: string, file: string) => {
    setSelectedFile({ section, file });
    setShowTimeline(false);
  };

  const handleRequestChanges = (data: {
    description: string;
    changeType: string;
    priority: string;
  }) => {
    setPendingChangeRequest({
      ...data,
      submittedAt: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    });
    setShowTimeline(true);
  };

  if (showTimeline) {
    return (
      <ArtifactTimeline
        fileName={selectedFile?.file}
        section={selectedFile?.section}
        changeRequest={pendingChangeRequest}
        onBack={() => setShowTimeline(false)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden relative bg-gray-50 dark:bg-[#0A0F1E] transition-colors">
      {/* Main 2-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Artifact Explorer */}
        <ArtifactExplorer
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
        />

        {/* Center Panel: Code Viewer */}
        {selectedFile ? (
          <CodeViewer
            fileName={selectedFile.file}
            section={selectedFile.section}
            onRequestChanges={handleRequestChanges}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-[#0A0F1E] transition-colors">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                No artifact selected
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Choose a file from the explorer to view
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Floating CTA Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-14 h-14 bg-[#111827] hover:bg-[#1a2235] text-white rounded-2xl shadow-2xl shadow-black/50 transition-all hover:scale-105 backdrop-blur-xl border border-white/10 hover:border-[#6366F1]/40"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {/* View Timeline Button */}
        <button
          onClick={() => setShowTimeline(true)}
          className="flex items-center gap-3 px-6 py-4 bg-[#111827] hover:bg-[#1a2235] text-white rounded-2xl shadow-2xl shadow-black/50 transition-all hover:scale-105 backdrop-blur-xl border border-white/10 hover:border-[#6366F1]/40"
        >
          <GitCommit className="w-5 h-5 text-[#8B5CF6]" />
          <span className="font-semibold text-sm">View Timeline</span>
        </button>

        {/* AI Insights Button */}
        <button
          onClick={() => setAiPanelOpen(true)}
          className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C3AED] text-white rounded-2xl shadow-2xl shadow-[#6366F1]/50 transition-all hover:scale-105 backdrop-blur-xl border border-white/20"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <div className="absolute inset-0 animate-ping">
              <Sparkles className="w-5 h-5 opacity-20" />
            </div>
          </div>
          <span className="font-semibold text-sm">AI Insights</span>
        </button>
      </div>

      {/* AI Insights Slide-in Panel */}
      <AIInsights isOpen={aiPanelOpen} onClose={() => setAiPanelOpen(false)} />
    </div>
  );
}
