import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ExternalLink, CheckCircle } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  options?: { label: string; value: string }[];
  integration?: "jira" | "ada";
}

interface ProjectSetupChatProps {
  onClose: () => void;
  onTaskUpdate?: (tasks: any[]) => void;
  onProjectComplete?: (project: any) => void;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hi! I'm here to help you set up your new project. Let's start by choosing the type of project you'd like to create:",
    timestamp: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
    options: [
      { label: "Greenfield Project", value: "greenfield" },
      { label: "Brownfield Project", value: "brownfield" },
    ],
  },
];

export function ProjectSetupChat({
  onClose,
  onTaskUpdate,
  onProjectComplete,
}: ProjectSetupChatProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [projectType, setProjectType] = useState<
    "greenfield" | "brownfield" | null
  >(null);
  const [jiraConnected, setJiraConnected] = useState(false);
  const [adaConnected, setAdaConnected] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [conversationStep, setConversationStep] = useState<
    "type" | "name" | "stack" | "features" | "complete"
  >("type");
  const [projectName, setProjectName] = useState("");
  const [techStack, setTechStack] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Update suggestions based on conversation step
    if (conversationStep === "name") {
      setSuggestions([
        "E-commerce Platform",
        "Payment Gateway",
        "Analytics Dashboard",
        "Mobile App Backend",
      ]);
    } else if (conversationStep === "stack") {
      setSuggestions([
        "React + Node.js",
        "Python + FastAPI",
        "Next.js + PostgreSQL",
        "Vue.js + Express",
      ]);
    } else if (conversationStep === "features") {
      setSuggestions([
        "Authentication & Authorization",
        "Payment Integration",
        "Real-time Analytics",
        "API Gateway",
      ]);
    } else {
      setSuggestions([]);
    }
  }, [conversationStep]);

  const addMessage = (
    role: "user" | "assistant",
    content: string,
    options?: { label: string; value: string }[],
    integration?: "jira" | "ada",
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      options,
      integration,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleOptionClick = (value: string) => {
    addMessage("user", value);

    setTimeout(() => {
      if (value === "greenfield") {
        setProjectType("greenfield");
        setConversationStep("name");
        addMessage(
          "assistant",
          "Great! For a greenfield project, I'll help you set up everything from scratch. What would you like to name your project?",
        );
      } else if (value === "brownfield") {
        setProjectType("brownfield");
        addMessage(
          "assistant",
          "Perfect! For a brownfield project, I can help you integrate with existing systems. Would you like to connect to Jira or Azure DevOps (ADA) to import your existing project data?",
        );
        setTimeout(() => {
          addMessage(
            "assistant",
            "Click below to connect your tools:",
            undefined,
            "jira",
          );
        }, 500);
      }
    }, 500);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userInput = input.trim();
    addMessage("user", userInput);
    setInput("");

    // AI response simulation based on conversation step
    setTimeout(() => {
      if (conversationStep === "name") {
        setProjectName(userInput);
        setConversationStep("stack");
        addMessage(
          "assistant",
          `Perfect! "${userInput}" is a great name. Now, what technology stack would you like to use for this project?`,
        );

        // Update tasks: Start analyzing requirements
        if (onTaskUpdate) {
          onTaskUpdate([
            {
              id: "1",
              name: "Analyzing project requirements",
              status: "in-progress",
              icon: "file",
            },
            {
              id: "2",
              name: "Setting up project structure",
              status: "pending",
              icon: "code",
            },
            {
              id: "3",
              name: "Configuring database schema",
              status: "pending",
              icon: "database",
            },
            {
              id: "4",
              name: "Creating CI/CD pipeline",
              status: "pending",
              icon: "git",
            },
            {
              id: "5",
              name: "Installing dependencies",
              status: "pending",
              icon: "package",
            },
            {
              id: "6",
              name: "Configuring environment",
              status: "pending",
              icon: "settings",
            },
          ]);

          setTimeout(() => {
            if (onTaskUpdate) {
              onTaskUpdate([
                {
                  id: "1",
                  name: "Analyzing project requirements",
                  status: "completed",
                  icon: "file",
                },
                {
                  id: "2",
                  name: "Setting up project structure",
                  status: "pending",
                  icon: "code",
                },
                {
                  id: "3",
                  name: "Configuring database schema",
                  status: "pending",
                  icon: "database",
                },
                {
                  id: "4",
                  name: "Creating CI/CD pipeline",
                  status: "pending",
                  icon: "git",
                },
                {
                  id: "5",
                  name: "Installing dependencies",
                  status: "pending",
                  icon: "package",
                },
                {
                  id: "6",
                  name: "Configuring environment",
                  status: "pending",
                  icon: "settings",
                },
              ]);
            }
          }, 1500);
        }
      } else if (conversationStep === "stack") {
        setTechStack(userInput);
        setConversationStep("features");
        addMessage(
          "assistant",
          `Excellent choice! ${userInput} is a solid stack. What key features would you like to include in your project?`,
        );

        // Update tasks: Start setting up project structure
        if (onTaskUpdate) {
          onTaskUpdate([
            {
              id: "1",
              name: "Analyzing project requirements",
              status: "completed",
              icon: "file",
            },
            {
              id: "2",
              name: "Setting up project structure",
              status: "in-progress",
              icon: "code",
            },
            {
              id: "3",
              name: "Configuring database schema",
              status: "pending",
              icon: "database",
            },
            {
              id: "4",
              name: "Creating CI/CD pipeline",
              status: "pending",
              icon: "git",
            },
            {
              id: "5",
              name: "Installing dependencies",
              status: "pending",
              icon: "package",
            },
            {
              id: "6",
              name: "Configuring environment",
              status: "pending",
              icon: "settings",
            },
          ]);

          setTimeout(() => {
            if (onTaskUpdate) {
              onTaskUpdate([
                {
                  id: "1",
                  name: "Analyzing project requirements",
                  status: "completed",
                  icon: "file",
                },
                {
                  id: "2",
                  name: "Setting up project structure",
                  status: "completed",
                  icon: "code",
                },
                {
                  id: "3",
                  name: "Configuring database schema",
                  status: "pending",
                  icon: "database",
                },
                {
                  id: "4",
                  name: "Creating CI/CD pipeline",
                  status: "pending",
                  icon: "git",
                },
                {
                  id: "5",
                  name: "Installing dependencies",
                  status: "pending",
                  icon: "package",
                },
                {
                  id: "6",
                  name: "Configuring environment",
                  status: "pending",
                  icon: "settings",
                },
              ]);
            }
          }, 1500);
        }
      } else if (conversationStep === "features") {
        setConversationStep("complete");
        setSuggestions([]);
        addMessage(
          "assistant",
          `Great! I'm now setting up your project with ${userInput}. I'll start by creating the project structure, configuring your environment, and setting up the initial codebase. You can track my progress in the AI Progress panel on the right.`,
        );

        // Update tasks: Start configuring database
        if (onTaskUpdate) {
          onTaskUpdate([
            {
              id: "1",
              name: "Analyzing project requirements",
              status: "completed",
              icon: "file",
            },
            {
              id: "2",
              name: "Setting up project structure",
              status: "completed",
              icon: "code",
            },
            {
              id: "3",
              name: "Configuring database schema",
              status: "in-progress",
              icon: "database",
            },
            {
              id: "4",
              name: "Creating CI/CD pipeline",
              status: "pending",
              icon: "git",
            },
            {
              id: "5",
              name: "Installing dependencies",
              status: "pending",
              icon: "package",
            },
            {
              id: "6",
              name: "Configuring environment",
              status: "pending",
              icon: "settings",
            },
          ]);

          setTimeout(() => {
            if (onTaskUpdate) {
              onTaskUpdate([
                {
                  id: "1",
                  name: "Analyzing project requirements",
                  status: "completed",
                  icon: "file",
                },
                {
                  id: "2",
                  name: "Setting up project structure",
                  status: "completed",
                  icon: "code",
                },
                {
                  id: "3",
                  name: "Configuring database schema",
                  status: "completed",
                  icon: "database",
                },
                {
                  id: "4",
                  name: "Creating CI/CD pipeline",
                  status: "in-progress",
                  icon: "git",
                },
                {
                  id: "5",
                  name: "Installing dependencies",
                  status: "pending",
                  icon: "package",
                },
                {
                  id: "6",
                  name: "Configuring environment",
                  status: "pending",
                  icon: "settings",
                },
              ]);
            }
          }, 1000);

          setTimeout(() => {
            if (onTaskUpdate) {
              onTaskUpdate([
                {
                  id: "1",
                  name: "Analyzing project requirements",
                  status: "completed",
                  icon: "file",
                },
                {
                  id: "2",
                  name: "Setting up project structure",
                  status: "completed",
                  icon: "code",
                },
                {
                  id: "3",
                  name: "Configuring database schema",
                  status: "completed",
                  icon: "database",
                },
                {
                  id: "4",
                  name: "Creating CI/CD pipeline",
                  status: "completed",
                  icon: "git",
                },
                {
                  id: "5",
                  name: "Installing dependencies",
                  status: "in-progress",
                  icon: "package",
                },
                {
                  id: "6",
                  name: "Configuring environment",
                  status: "pending",
                  icon: "settings",
                },
              ]);
            }
          }, 1800);

          setTimeout(() => {
            if (onTaskUpdate) {
              onTaskUpdate([
                {
                  id: "1",
                  name: "Analyzing project requirements",
                  status: "completed",
                  icon: "file",
                },
                {
                  id: "2",
                  name: "Setting up project structure",
                  status: "completed",
                  icon: "code",
                },
                {
                  id: "3",
                  name: "Configuring database schema",
                  status: "completed",
                  icon: "database",
                },
                {
                  id: "4",
                  name: "Creating CI/CD pipeline",
                  status: "completed",
                  icon: "git",
                },
                {
                  id: "5",
                  name: "Installing dependencies",
                  status: "completed",
                  icon: "package",
                },
                {
                  id: "6",
                  name: "Configuring environment",
                  status: "in-progress",
                  icon: "settings",
                },
              ]);
            }
          }, 2500);

          setTimeout(() => {
            if (onTaskUpdate) {
              onTaskUpdate([
                {
                  id: "1",
                  name: "Analyzing project requirements",
                  status: "completed",
                  icon: "file",
                },
                {
                  id: "2",
                  name: "Setting up project structure",
                  status: "completed",
                  icon: "code",
                },
                {
                  id: "3",
                  name: "Configuring database schema",
                  status: "completed",
                  icon: "database",
                },
                {
                  id: "4",
                  name: "Creating CI/CD pipeline",
                  status: "completed",
                  icon: "git",
                },
                {
                  id: "5",
                  name: "Installing dependencies",
                  status: "completed",
                  icon: "package",
                },
                {
                  id: "6",
                  name: "Configuring environment",
                  status: "completed",
                  icon: "settings",
                },
              ]);
            }

            const successMessage = `✅ Project setup complete! Your project "${projectName}" is ready with ${userInput}. I've added it to your projects list. You can now start working on it or explore other projects.`;

            addMessage("assistant", successMessage);

            // Create and save the new project
            if (onProjectComplete) {
              const newProject = {
                id: `project-${Date.now()}`,
                name: projectName,
                type: projectType || "greenfield",
                lastActive: "Just now",
                status: "active" as const,
                confidence: 92,
              };
              onProjectComplete(newProject);
            }
          }, 3200);
        }
      } else {
        addMessage(
          "assistant",
          "Thanks for that information! Let me help you further. What else would you like to configure?",
        );
      }
    }, 800);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleConnectJira = () => {
    setJiraConnected(true);
    addMessage(
      "assistant",
      "✅ Successfully connected to Jira! I can now import your existing issues, sprints, and project structure. Would you like me to analyze your current workflow?",
    );

    setTimeout(() => {
      setConversationStep("name");
      setSuggestions([
        "Yes, analyze my workflow",
        "No, let me configure manually",
        "Import all issues and sprints",
      ]);
    }, 1000);
  };

  const handleConnectADA = () => {
    setAdaConnected(true);
    addMessage(
      "assistant",
      "✅ Successfully connected to Azure DevOps! I have access to your repositories, work items, and pipelines. Shall I start analyzing your project?",
    );

    setTimeout(() => {
      setConversationStep("name");
      setSuggestions([
        "Yes, analyze everything",
        "No, let me choose what to import",
        "Import repositories only",
      ]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#0A0F1E] transition-colors">
      {/* Header */}
      <div className="h-14 border-b border-gray-200 dark:border-white/10 px-6 flex items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Project Setup Assistant
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-500">
              Let's create your project together
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 min-h-0">
        {messages.map((message) => (
          <div key={message.id}>
            <div
              className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {message.role === "assistant" ? (
                  <div className="w-8 h-8 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-[#22C55E] to-[#10B981] rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div
                className={`flex-1 max-w-2xl ${message.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === "assistant"
                      ? "bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10"
                      : "bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]"
                  }`}
                >
                  <p
                    className={`text-sm leading-relaxed whitespace-pre-wrap ${message.role === "assistant" ? "text-gray-900 dark:text-white" : "text-white"}`}
                  >
                    {message.content}
                  </p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 px-2">
                  {message.timestamp}
                </span>
              </div>
            </div>

            {/* Options Buttons */}
            {message.options && message.role === "assistant" && (
              <div className="flex gap-3 mt-4 ml-12">
                {message.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className="px-5 py-2.5 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 hover:border-[#6366F1]/50 text-gray-900 dark:text-white rounded-xl transition-all hover:bg-[#6366F1]/10 text-sm font-medium"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {/* Integration Cards */}
            {message.integration === "jira" && message.role === "assistant" && (
              <div className="ml-12 mt-4 space-y-3">
                <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#0052CC] rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.5 15.5h-9v-7h9v7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Jira Integration
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Import issues, sprints, and workflows
                        </p>
                      </div>
                    </div>
                    {jiraConnected ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                        <span className="text-xs font-semibold text-[#22C55E]">
                          Connected
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={handleConnectJira}
                        className="px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-lg hover:from-[#5558E3] hover:to-[#7C4FE0] transition-all text-sm font-medium flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Connect Jira
                      </button>
                    )}
                  </div>
                  {!jiraConnected && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                      Connect your Jira workspace to automatically import your
                      project structure, backlog, and team workflows.
                    </p>
                  )}
                </div>

                <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#0078D4] rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M0 12l3-3 3 3v6H0v-6zm9-9l3-3 3 3v15H9V3zm9 6l3-3 3 3v9h-6V9z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Azure DevOps (ADA)
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Connect repos, boards, and pipelines
                        </p>
                      </div>
                    </div>
                    {adaConnected ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                        <span className="text-xs font-semibold text-[#22C55E]">
                          Connected
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={handleConnectADA}
                        className="px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-lg hover:from-[#5558E3] hover:to-[#7C4FE0] transition-all text-sm font-medium flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Connect Azure
                      </button>
                    )}
                  </div>
                  {!adaConnected && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                      Link your Azure DevOps organization to sync repositories,
                      work items, and existing CI/CD pipelines.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-white/10 p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Suggestion Chips */}
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 hover:border-[#6366F1]/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all hover:bg-[#6366F1]/10 text-sm font-medium"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl flex items-end gap-3 p-3 focus-within:border-[#6366F1]/50 transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response..."
              rows={1}
              className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm resize-none focus:outline-none min-h-[24px] max-h-32"
              style={{ lineHeight: "1.5" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-lg hover:from-[#5558E3] hover:to-[#7C4FE0] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
