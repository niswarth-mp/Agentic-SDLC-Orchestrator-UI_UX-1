import { useState } from 'react';
import { ArtifactExplorer } from '../components/artifacts/ArtifactExplorer';
import { CodeViewer } from '../components/artifacts/CodeViewer';
import { AIInsights } from '../components/artifacts/AIInsights';
import { ArtifactTimeline } from '../components/artifacts/ArtifactTimeline';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function Artifacts() {
  const [selectedFile, setSelectedFile] = useState<{ section: string; file: string } | undefined>({
    section: 'development',
    file: 'PaymentService.java',
  });
  const [timelineExpanded, setTimelineExpanded] = useState(true);

  const handleFileSelect = (section: string, file: string) => {
    setSelectedFile({ section, file });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Main 3-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Artifact Explorer */}
        <ArtifactExplorer onFileSelect={handleFileSelect} selectedFile={selectedFile} />

        {/* Center Panel: Code Viewer */}
        {selectedFile ? (
          <CodeViewer fileName={selectedFile.file} section={selectedFile.section} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#0A0F1E]">
            <div className="text-center">
              <p className="text-gray-500 text-lg mb-2">No artifact selected</p>
              <p className="text-gray-600 text-sm">Choose a file from the explorer to view</p>
            </div>
          </div>
        )}

        {/* Right Panel: AI Insights */}
        <AIInsights />
      </div>

      {/* Bottom Panel: Artifact Timeline (Collapsible) */}
      <div className="border-t border-white/10">
        <button
          onClick={() => setTimelineExpanded(!timelineExpanded)}
          className="w-full flex items-center justify-between px-6 py-2 bg-[#111827] hover:bg-[#1a1f2e] transition-all"
        >
          <span className="text-sm font-medium text-white">Artifact Timeline</span>
          {timelineExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          )}
        </button>
        {timelineExpanded && (
          <div className="max-h-[400px] overflow-y-auto">
            <ArtifactTimeline />
          </div>
        )}
      </div>
    </div>
  );
}
