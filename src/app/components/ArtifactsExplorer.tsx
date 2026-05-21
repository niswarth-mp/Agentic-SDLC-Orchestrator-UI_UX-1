import { File, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
}

const sampleFiles: FileNode[] = [
  {
    name: 'req_design',
    type: 'folder',
    children: [
      {
        name: 'PRD.md',
        type: 'file',
        content: '# Product Requirements Document\n\n## Overview\nPayment processing service...',
      },
      {
        name: 'user_stories.json',
        type: 'file',
        content: '{\n  "stories": [\n    {\n      "id": "US-001",\n      "title": "Process payment"\n    }\n  ]\n}',
      },
    ],
  },
  {
    name: 'development',
    type: 'folder',
    children: [
      {
        name: 'PaymentService.java',
        type: 'file',
        content:
          'public class PaymentService {\n  public void processPayment(Payment payment) {\n    // Implementation\n  }\n}',
      },
      {
        name: 'PaymentServiceTest.java',
        type: 'file',
        content: 'public class PaymentServiceTest {\n  @Test\n  public void testProcessPayment() {\n    // Test implementation\n  }\n}',
      },
    ],
  },
  {
    name: 'infra_provision',
    type: 'folder',
    children: [
      {
        name: 'main.tf',
        type: 'file',
        content: 'resource "aws_instance" "payment_service" {\n  ami = "ami-12345678"\n  instance_type = "t3.medium"\n}',
      },
    ],
  },
];

export function ArtifactsExplorer() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['req_design']));
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const renderTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => (
      <div key={node.name}>
        <button
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.name);
            } else {
              setSelectedFile(node);
            }
          }}
          className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-all text-left ${
            selectedFile?.name === node.name ? 'bg-white/10' : ''
          }`}
          style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
        >
          {node.type === 'folder' ? (
            <>
              {expandedFolders.has(node.name) ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              <Folder className="w-4 h-4 text-[#F59E0B]" />
            </>
          ) : (
            <>
              <div className="w-4" />
              <File className="w-4 h-4 text-[#6366F1]" />
            </>
          )}
          <span className="text-sm text-white">{node.name}</span>
        </button>
        {node.type === 'folder' && expandedFolders.has(node.name) && node.children && (
          <div>{renderTree(node.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-full flex">
      {/* File Tree */}
      <div className="w-80 border-r border-white/10 overflow-y-auto">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white">File Tree</h3>
        </div>
        <div className="py-2">{renderTree(sampleFiles)}</div>
      </div>

      {/* File Viewer */}
      <div className="flex-1 overflow-y-auto">
        {selectedFile ? (
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-1">{selectedFile.name}</h3>
              <p className="text-sm text-gray-400">
                {selectedFile.name.endsWith('.md') ? 'Markdown Document' : 'Code File'}
              </p>
            </div>
            <div className="bg-[#0A0F1E] border border-white/10 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm text-gray-300 font-mono">{selectedFile.content}</pre>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Select a file to view its contents</p>
          </div>
        )}
      </div>
    </div>
  );
}
