import { CheckCircle, Circle, Loader } from 'lucide-react';

interface TimelineNode {
  id: string;
  name: string;
  status: 'completed' | 'active' | 'pending';
}

interface SDLCTimelineProps {
  nodes: TimelineNode[];
  onNodeClick: (nodeId: string) => void;
}

export function SDLCTimeline({ nodes, onNodeClick }: SDLCTimelineProps) {
  return (
    <div className="flex flex-col items-center py-8 space-y-4">
      {nodes.map((node, index) => (
        <div key={node.id} className="flex flex-col items-center">
          <button
            onClick={() => onNodeClick(node.id)}
            className={`group relative w-24 h-24 rounded-2xl border-2 flex items-center justify-center transition-all ${
              node.status === 'completed'
                ? 'bg-[#22C55E]/10 border-[#22C55E] hover:bg-[#22C55E]/20'
                : node.status === 'active'
                ? 'bg-[#6366F1]/10 border-[#6366F1] hover:bg-[#6366F1]/20 animate-pulse'
                : 'bg-transparent border-white/20 hover:bg-white/5'
            }`}
          >
            <div className="flex flex-col items-center">
              {node.status === 'completed' ? (
                <CheckCircle className="w-8 h-8 text-[#22C55E] mb-2" />
              ) : node.status === 'active' ? (
                <Loader className="w-8 h-8 text-[#6366F1] mb-2" />
              ) : (
                <Circle className="w-8 h-8 text-white/40 mb-2" />
              )}
              <span
                className={`text-sm font-medium ${
                  node.status === 'pending' ? 'text-white/40' : 'text-white'
                }`}
              >
                {node.name}
              </span>
            </div>
          </button>
          {index < nodes.length - 1 && (
            <div
              className={`w-0.5 h-12 my-2 ${
                nodes[index + 1].status !== 'pending' ? 'bg-[#22C55E]' : 'bg-white/20'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
