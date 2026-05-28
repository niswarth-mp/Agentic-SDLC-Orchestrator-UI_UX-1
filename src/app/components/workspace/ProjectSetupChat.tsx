import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Upload,
  Video,
  FileText,
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader,
  ExternalLink,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import userStoriesData from "../../../imports/pasted_text/user-stories.json";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  type?:
    | "text"
    | "project-type"
    | "file-upload"
    | "video-upload"
    | "jira-import"
    | "epic-review"
    | "story-review"
    | "jira-project-selection"
    | "jira-sync";
  data?: any;
}

interface Epic {
  id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  userStories: UserStory[];
  expanded?: boolean;
}

interface UserStory {
  id: string;
  epic_id: string;
  title: string;
  description: string;
  priority: string;
  story_points: number;
  acceptance_criteria: string[];
  status?: "pending" | "approved" | "rejected";
  feedback?: string;
}

interface ProjectSetupChatProps {
  onClose: () => void;
  onTaskUpdate?: (tasks: any[]) => void;
  onProjectComplete?: (project: any) => void;
}

const PRIORITY_COLORS: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  P0: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-300",
    dot: "bg-red-500",
  },
  P1: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  P2: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  P3: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-300",
    dot: "bg-gray-500",
  },
};

// Epic titles and descriptions based on epic_id
const EPIC_METADATA: Record<string, { title: string; description: string }> = {
  "EP-01": {
    title: "Hybrid Search & Retrieval",
    description:
      "Implement hybrid BM25 + vector search with RRF fusion and shadow evaluation framework",
  },
  "EP-02": {
    title: "Query Understanding",
    description:
      "Build query understanding pipeline with intent classification, attribute extraction, and typo tolerance",
  },
  "EP-03": {
    title: "Personalized Ranking",
    description:
      "Implement personalized ranking with real-time features and experiment framework",
  },
  "EP-04": {
    title: "Merchandising & Inventory",
    description:
      "Enable merchandising rules authoring and inventory-aware ranking",
  },
  "EP-05": {
    title: "Multi-Modal Search",
    description: "Support voice and image search with graceful degradation",
  },
  "EP-06": {
    title: "International Localization",
    description:
      "Implement locale-specific analyzers and embedding models for global markets",
  },
  "EP-07": {
    title: "Autocomplete & Suggestions",
    description:
      "Build type-ahead autocomplete with personalization and trending highlights",
  },
  "EP-08": {
    title: "Indexing & Observability",
    description:
      "Implement streaming catalog ingestion, A/B variant indexing, and explainability APIs",
  },
  "EP-09": {
    title: "Facets & Result Diversity",
    description: "Enable dynamic facets and result diversity controls",
  },
};

// Group user stories by epic_id
function groupStoriesByEpic(stories: UserStory[]): Epic[] {
  const epicMap = new Map<string, UserStory[]>();

  stories.forEach((story) => {
    if (!epicMap.has(story.epic_id)) {
      epicMap.set(story.epic_id, []);
    }
    epicMap.get(story.epic_id)!.push({ ...story, status: "pending" });
  });

  return Array.from(epicMap.entries()).map(([epicId, userStories]) => ({
    id: epicId,
    title: EPIC_METADATA[epicId]?.title || `Epic ${epicId}`,
    description: EPIC_METADATA[epicId]?.description || "Epic description",
    status: "pending",
    expanded: false,
    userStories,
  }));
}

const MOCK_EPICS: Epic[] = groupStoriesByEpic(userStoriesData as UserStory[]);

export function ProjectSetupChat({
  onClose,
  onTaskUpdate,
  onProjectComplete,
}: ProjectSetupChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your AI Requirements Assistant. Let's transform your business requirements into actionable user stories. First, what type of project are you working on?",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      type: "project-type",
    },
  ]);
  const [input, setInput] = useState("");
  const [projectType, setProjectType] = useState<
    "brownfield" | "greenfield" | null
  >(null);
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [regeneratingEpicId, setRegeneratingEpicId] = useState<string | null>(
    null,
  );
  const [regeneratingStoryId, setRegeneratingStoryId] = useState<string | null>(
    null,
  );
  const [selectedJiraProject, setSelectedJiraProject] = useState<string | null>(
    null,
  );
  const [feedbackMode, setFeedbackMode] = useState<{
    type: "reject" | "regenerate";
    itemType: "epic" | "story";
    id: string;
    epicId?: string;
  } | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [currentStage, setCurrentStage] = useState<
    | "project-type"
    | "upload"
    | "processing"
    | "epic-review"
    | "story-review"
    | "jira-project-selection"
    | "jira-sync"
    | "complete"
  >("project-type");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const jiraProjects = [
    { key: "ECOM", name: "E-Commerce Platform", tickets: 47 },
    { key: "MOBILE", name: "Mobile App", tickets: 32 },
    { key: "API", name: "API Services", tickets: 28 },
    { key: "WEB", name: "Web Portal", tickets: 55 },
    { key: "ADMIN", name: "Admin Dashboard", tickets: 19 },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (
    role: "user" | "assistant",
    content: string,
    type?: Message["type"],
    data?: any,
  ) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      role,
      content,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      type: type || "text",
      data,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleProjectTypeSelect = (type: "brownfield" | "greenfield") => {
    setProjectType(type);
    setCurrentStage("upload");
    addMessage(
      "user",
      type === "brownfield" ? "Brownfield Project" : "Greenfield Project",
    );

    setTimeout(() => {
      if (type === "brownfield") {
        addMessage(
          "assistant",
          "Great! For a brownfield project, you can upload your BRD/PRD documents, add videos, provide a description, and import existing Jira tickets. Let's start by uploading your documents:",
          "file-upload",
        );
      } else {
        addMessage(
          "assistant",
          "Perfect! For a greenfield project, you can upload your BRD/PRD documents, add videos, and provide a project description. Let's start:",
          "file-upload",
        );
      }
    }, 500);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDocument(file);
      addMessage("user", `Uploaded document: ${file.name}`);
      setTimeout(() => {
        addMessage(
          "assistant",
          "Document uploaded successfully! Would you like to add a video demonstration? (Optional)",
          "video-upload",
        );
      }, 500);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedVideo(file);
      addMessage("user", `Uploaded video: ${file.name}`);
    }
  };

  const handleSkipVideo = () => {
    addMessage("user", "Skip video upload");
    setTimeout(() => {
      addMessage(
        "assistant",
        "No problem! Now, please provide a description of your project requirements and goals:",
      );
    }, 500);
  };

  const handleDescriptionSubmit = (desc: string) => {
    if (!desc.trim()) return;

    addMessage("user", desc);
    setDescription(desc);
    setInput("");

    setTimeout(() => {
      startProcessing();
    }, 500);
  };

  const startProcessing = async () => {
    setCurrentStage("processing");
    setIsProcessing(true);
    addMessage(
      "assistant",
      "🔄 Processing your documents and generating epics... This may take a moment.",
    );

    // Update tasks
    if (onTaskUpdate) {
      onTaskUpdate([
        {
          id: "1",
          name: "Uploading documents",
          status: "in-progress",
          icon: "file",
        },
        {
          id: "2",
          name: "Analyzing requirements",
          status: "pending",
          icon: "sparkles",
        },
        {
          id: "3",
          name: "Generating epics",
          status: "pending",
          icon: "layers",
        },
        {
          id: "4",
          name: "Creating user stories",
          status: "pending",
          icon: "list",
        },
      ]);
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (onTaskUpdate) {
      onTaskUpdate([
        {
          id: "1",
          name: "Uploading documents",
          status: "completed",
          icon: "file",
        },
        {
          id: "2",
          name: "Analyzing requirements",
          status: "in-progress",
          icon: "sparkles",
        },
        {
          id: "3",
          name: "Generating epics",
          status: "pending",
          icon: "layers",
        },
        {
          id: "4",
          name: "Creating user stories",
          status: "pending",
          icon: "list",
        },
      ]);
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (onTaskUpdate) {
      onTaskUpdate([
        {
          id: "1",
          name: "Uploading documents",
          status: "completed",
          icon: "file",
        },
        {
          id: "2",
          name: "Analyzing requirements",
          status: "completed",
          icon: "sparkles",
        },
        {
          id: "3",
          name: "Generating epics",
          status: "in-progress",
          icon: "layers",
        },
        {
          id: "4",
          name: "Creating user stories",
          status: "pending",
          icon: "list",
        },
      ]);
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (onTaskUpdate) {
      onTaskUpdate([
        {
          id: "1",
          name: "Uploading documents",
          status: "completed",
          icon: "file",
        },
        {
          id: "2",
          name: "Analyzing requirements",
          status: "completed",
          icon: "sparkles",
        },
        {
          id: "3",
          name: "Generating epics",
          status: "completed",
          icon: "layers",
        },
        {
          id: "4",
          name: "Creating user stories",
          status: "completed",
          icon: "list",
        },
      ]);
    }

    setIsProcessing(false);
    setEpics(MOCK_EPICS);
    setCurrentStage("epic-review");

    addMessage(
      "assistant",
      `✅ Processing complete! I've generated ${MOCK_EPICS.length} epics from your requirements. Please review and approve, reject, or regenerate each epic:`,
      "epic-review",
      { epics: MOCK_EPICS },
    );
  };

  const handleApproveEpic = (epicId: string) => {
    setEpics(
      epics.map((e) =>
        e.id === epicId ? { ...e, status: "approved" as const } : e,
      ),
    );
    addMessage(
      "user",
      `Approved epic: ${epics.find((e) => e.id === epicId)?.title}`,
    );
  };

  const openRejectEpicModal = (epicId: string) => {
    setFeedbackMode({ type: "reject", itemType: "epic", id: epicId });
  };

  const openRegenerateEpicModal = (epicId: string) => {
    setFeedbackMode({ type: "regenerate", itemType: "epic", id: epicId });
  };

  const handleRejectEpic = (epicId: string) => {
    if (!feedbackText.trim()) return;
    setEpics(
      epics.map((e) =>
        e.id === epicId ? { ...e, status: "rejected" as const } : e,
      ),
    );
    addMessage(
      "user",
      `Rejected epic: ${epics.find((e) => e.id === epicId)?.title}`,
    );
    setFeedbackMode(null);
    setFeedbackText("");
  };

  const handleRegenerateEpic = async (epicId: string) => {
    if (!feedbackText.trim()) return;
    setRegeneratingEpicId(epicId);
    addMessage(
      "user",
      `Regenerating epic: ${epics.find((e) => e.id === epicId)?.title}`,
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRegeneratingEpicId(null);
    addMessage("assistant", "✅ Epic regenerated successfully!");
    setFeedbackMode(null);
    setFeedbackText("");
  };

  const handleContinueToStories = () => {
    const approvedEpics = epics.filter((e) => e.status === "approved");
    if (approvedEpics.length === 0) {
      addMessage(
        "assistant",
        "⚠️ Please approve at least one epic before continuing.",
      );
      return;
    }

    setCurrentStage("story-review");
    addMessage(
      "user",
      `Continue to story review (${approvedEpics.length} epics approved)`,
    );
    setTimeout(() => {
      addMessage(
        "assistant",
        `Great! Now let's review the user stories for your approved epics. Please approve, reject, or regenerate each story:`,
        "story-review",
        { epics: approvedEpics },
      );
    }, 500);
  };

  const handleApproveStory = (epicId: string, storyId: string) => {
    setEpics(
      epics.map((epic) =>
        epic.id === epicId
          ? {
              ...epic,
              userStories: epic.userStories.map((story) =>
                story.id === storyId
                  ? { ...story, status: "approved" as const }
                  : story,
              ),
            }
          : epic,
      ),
    );
    const story = epics
      .find((e) => e.id === epicId)
      ?.userStories.find((s) => s.id === storyId);
    addMessage("user", `Approved story: ${story?.title}`);
  };

  const openRejectStoryModal = (epicId: string, storyId: string) => {
    setFeedbackMode({ type: "reject", itemType: "story", id: storyId, epicId });
  };

  const openRegenerateStoryModal = (epicId: string, storyId: string) => {
    setFeedbackMode({
      type: "regenerate",
      itemType: "story",
      id: storyId,
      epicId,
    });
  };

  const handleRejectStory = (epicId: string, storyId: string) => {
    if (!feedbackText.trim()) return;
    setEpics(
      epics.map((epic) =>
        epic.id === epicId
          ? {
              ...epic,
              userStories: epic.userStories.map((story) =>
                story.id === storyId
                  ? { ...story, status: "rejected" as const }
                  : story,
              ),
            }
          : epic,
      ),
    );
    const story = epics
      .find((e) => e.id === epicId)
      ?.userStories.find((s) => s.id === storyId);
    addMessage("user", `Rejected story: ${story?.title}`);
    setFeedbackMode(null);
    setFeedbackText("");
  };

  const handleRegenerateStory = async (epicId: string, storyId: string) => {
    if (!feedbackText.trim()) return;
    setRegeneratingStoryId(storyId);
    const story = epics
      .find((e) => e.id === epicId)
      ?.userStories.find((s) => s.id === storyId);
    addMessage("user", `Regenerating story: ${story?.title}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRegeneratingStoryId(null);
    addMessage("assistant", "✅ Story regenerated successfully!");
    setFeedbackMode(null);
    setFeedbackText("");
  };

  const submitFeedback = () => {
    if (!feedbackMode || !feedbackText.trim()) return;

    if (feedbackMode.itemType === "epic") {
      if (feedbackMode.type === "reject") {
        handleRejectEpic(feedbackMode.id);
      } else {
        handleRegenerateEpic(feedbackMode.id);
      }
    } else {
      if (feedbackMode.type === "reject") {
        handleRejectStory(feedbackMode.epicId!, feedbackMode.id);
      } else {
        handleRegenerateStory(feedbackMode.epicId!, feedbackMode.id);
      }
    }
  };

  const handleInitiateJiraSync = () => {
    const approvedEpics = epics.filter((e) => e.status === "approved");
    const approvedStories = approvedEpics.reduce(
      (count, epic) =>
        count + epic.userStories.filter((s) => s.status === "approved").length,
      0,
    );

    if (approvedStories === 0) {
      addMessage(
        "assistant",
        "⚠️ Please approve at least one user story before syncing to Jira.",
      );
      return;
    }

    setCurrentStage("jira-project-selection");
    addMessage("user", "Sync to Jira");
    addMessage(
      "assistant",
      "Great! Please select which Jira project you'd like to sync to:",
      "jira-project-selection",
    );
  };

  const handleJiraProjectSelect = (projectKey: string) => {
    setSelectedJiraProject(projectKey);
    const project = jiraProjects.find((p) => p.key === projectKey);
    addMessage(
      "user",
      `Selected Jira project: ${project?.name} (${projectKey})`,
    );

    setTimeout(() => {
      startJiraSync();
    }, 500);
  };

  const startJiraSync = async () => {
    const approvedEpics = epics.filter((e) => e.status === "approved");
    const approvedStories = approvedEpics.reduce(
      (count, epic) =>
        count + epic.userStories.filter((s) => s.status === "approved").length,
      0,
    );

    setCurrentStage("jira-sync");
    addMessage("assistant", "🔄 Syncing to Jira...", "jira-sync");

    if (onTaskUpdate) {
      onTaskUpdate([
        {
          id: "1",
          name: "Syncing epics to Jira",
          status: "in-progress",
          icon: "layers",
        },
        {
          id: "2",
          name: "Syncing user stories to Jira",
          status: "pending",
          icon: "list",
        },
        { id: "3", name: "Finalizing sync", status: "pending", icon: "check" },
      ]);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (onTaskUpdate) {
      onTaskUpdate([
        {
          id: "1",
          name: "Syncing epics to Jira",
          status: "completed",
          icon: "layers",
        },
        {
          id: "2",
          name: "Syncing user stories to Jira",
          status: "in-progress",
          icon: "list",
        },
        { id: "3", name: "Finalizing sync", status: "pending", icon: "check" },
      ]);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (onTaskUpdate) {
      onTaskUpdate([
        {
          id: "1",
          name: "Syncing epics to Jira",
          status: "completed",
          icon: "layers",
        },
        {
          id: "2",
          name: "Syncing user stories to Jira",
          status: "completed",
          icon: "list",
        },
        {
          id: "3",
          name: "Finalizing sync",
          status: "completed",
          icon: "check",
        },
      ]);
    }

    setCurrentStage("complete");
    addMessage(
      "assistant",
      `✅ Sync complete! Successfully created ${approvedEpics.length} epics and ${approvedStories} user stories in Jira. Your requirements are ready for development!`,
    );
  };

  const toggleEpic = (epicId: string) => {
    setEpics(
      epics.map((e) => (e.id === epicId ? { ...e, expanded: !e.expanded } : e)),
    );
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userInput = input.trim();

    // Handle description submission
    setInput("");
    handleDescriptionSubmit(userInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
              AI Requirements Assistant
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-500">
              Transform BRDs into user stories
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
                className={`flex-1 max-w-3xl ${message.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}
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

            {/* Project Type Selection */}
            {message.type === "project-type" &&
              message.role === "assistant" && (
                <div className="flex gap-3 mt-4 ml-12">
                  <button
                    onClick={() => handleProjectTypeSelect("brownfield")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 hover:border-[#F59E0B] text-gray-900 dark:text-white rounded-xl transition-all hover:bg-[#F59E0B]/10 text-sm font-medium"
                  >
                    <div className="w-5 h-5 bg-[#F59E0B]/20 rounded flex items-center justify-center">
                      <span className="text-xs">🏗️</span>
                    </div>
                    Brownfield Project
                  </button>
                  <button
                    onClick={() => handleProjectTypeSelect("greenfield")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 hover:border-[#22C55E] text-gray-900 dark:text-white rounded-xl transition-all hover:bg-[#22C55E]/10 text-sm font-medium"
                  >
                    <div className="w-5 h-5 bg-[#22C55E]/20 rounded flex items-center justify-center">
                      <span className="text-xs">✨</span>
                    </div>
                    Greenfield Project
                  </button>
                </div>
              )}

            {/* File Upload */}
            {message.type === "file-upload" &&
              message.role === "assistant" &&
              !uploadedDocument && (
                <div className="mt-4 ml-12">
                  <label className="block bg-white dark:bg-[#111827] border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-6 hover:border-[#6366F1] hover:bg-[#6366F1]/5 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt,.doc"
                      onChange={handleDocumentUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Upload Document
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          PDF, DOCX, TXT (Max 10MB)
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              )}

            {/* Video Upload */}
            {message.type === "video-upload" &&
              message.role === "assistant" &&
              !uploadedVideo && (
                <div className="mt-4 ml-12 space-y-3">
                  <label className="block bg-white dark:bg-[#111827] border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-6 hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/5 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center">
                        <Video className="w-6 h-6 text-[#8B5CF6]" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Upload Video (Optional)
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          MP4, MOV, AVI (Max 100MB)
                        </p>
                      </div>
                    </div>
                  </label>
                  <button
                    onClick={handleSkipVideo}
                    className="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                  >
                    Skip video upload
                  </button>
                </div>
              )}

            {/* Epic Review */}
            {message.type === "epic-review" &&
              message.role === "assistant" &&
              message.data?.epics && (
                <div className="mt-4 ml-12 space-y-3">
                  {epics.map((epic) => (
                    <div
                      key={epic.id}
                      className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {epic.title}
                              </h4>
                              {epic.status === "approved" && (
                                <span className="px-2 py-1 bg-[#22C55E]/10 text-[#22C55E] text-xs font-semibold rounded">
                                  APPROVED
                                </span>
                              )}
                              {epic.status === "rejected" && (
                                <span className="px-2 py-1 bg-[#EF4444]/10 text-[#EF4444] text-xs font-semibold rounded">
                                  REJECTED
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {epic.description}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              {epic.userStories.length} user stories
                            </p>
                          </div>
                        </div>
                        {epic.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApproveEpic(epic.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#22C55E]/10 hover:bg-[#22C55E]/20 border border-[#22C55E]/30 text-[#22C55E] rounded-lg transition-all text-xs"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </button>
                            <button
                              onClick={() => openRejectEpicModal(epic.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#EF4444] rounded-lg transition-all text-xs"
                            >
                              <XCircle className="w-3 h-3" />
                              Reject
                            </button>
                            <button
                              onClick={() => openRegenerateEpicModal(epic.id)}
                              disabled={regeneratingEpicId === epic.id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#6366F1]/10 hover:bg-[#6366F1]/20 border border-[#6366F1]/30 text-[#6366F1] rounded-lg transition-all text-xs disabled:opacity-50"
                            >
                              <RefreshCw
                                className={`w-3 h-3 ${regeneratingEpicId === epic.id ? "animate-spin" : ""}`}
                              />
                              {regeneratingEpicId === epic.id
                                ? "Regenerating..."
                                : "Regenerate"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleContinueToStories}
                    className="w-full px-4 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl font-medium hover:from-[#5558E3] hover:to-[#7C4FE0] transition-all text-sm"
                  >
                    Continue to User Story Review (
                    {epics.filter((e) => e.status === "approved").length} epics
                    approved)
                  </button>
                </div>
              )}

            {/* Story Review */}
            {message.type === "story-review" &&
              message.role === "assistant" &&
              message.data?.epics && (
                <div className="mt-4 ml-12 space-y-4">
                  {epics
                    .filter((e) => e.status === "approved")
                    .map((epic) => (
                      <div
                        key={epic.id}
                        className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden"
                      >
                        <div className="p-4">
                          <button
                            onClick={() => toggleEpic(epic.id)}
                            className="w-full flex items-center gap-2 mb-3"
                          >
                            {epic.expanded ? (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {epic.title}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              (
                              {
                                epic.userStories.filter(
                                  (s) => s.status === "approved",
                                ).length
                              }
                              /{epic.userStories.length} approved)
                            </span>
                          </button>

                          {epic.expanded && (
                            <div className="space-y-3">
                              {epic.userStories.map((story) => (
                                <div
                                  key={story.id}
                                  className="bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 rounded-lg p-3"
                                >
                                  <div className="mb-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                                        {story.title}
                                      </h5>
                                      {story.status === "approved" && (
                                        <span className="px-2 py-0.5 bg-[#22C55E]/10 text-[#22C55E] text-xs font-semibold rounded">
                                          APPROVED
                                        </span>
                                      )}
                                      {story.status === "rejected" && (
                                        <span className="px-2 py-0.5 bg-[#EF4444]/10 text-[#EF4444] text-xs font-semibold rounded">
                                          REJECTED
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                      {story.description}
                                    </p>

                                    {/* Acceptance Criteria */}
                                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-white/10">
                                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Acceptance Criteria:
                                      </p>
                                      <div className="space-y-1">
                                        {story.acceptance_criteria.map(
                                          (criteria, index) => (
                                            <div
                                              key={index}
                                              className="flex items-start gap-2"
                                            >
                                              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {index + 1}.
                                              </span>
                                              <p className="text-xs text-gray-700 dark:text-gray-300 flex-1">
                                                {criteria}
                                              </p>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {story.status === "pending" && (
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() =>
                                          handleApproveStory(epic.id, story.id)
                                        }
                                        className="flex items-center gap-1 px-2 py-1 bg-[#22C55E]/10 hover:bg-[#22C55E]/20 border border-[#22C55E]/30 text-[#22C55E] rounded text-xs"
                                      >
                                        <CheckCircle className="w-3 h-3" />
                                        Approve
                                      </button>
                                      <button
                                        onClick={() =>
                                          openRejectStoryModal(
                                            epic.id,
                                            story.id,
                                          )
                                        }
                                        className="flex items-center gap-1 px-2 py-1 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#EF4444] rounded text-xs"
                                      >
                                        <XCircle className="w-3 h-3" />
                                        Reject
                                      </button>
                                      <button
                                        onClick={() =>
                                          openRegenerateStoryModal(
                                            epic.id,
                                            story.id,
                                          )
                                        }
                                        disabled={
                                          regeneratingStoryId === story.id
                                        }
                                        className="flex items-center gap-1 px-2 py-1 bg-[#6366F1]/10 hover:bg-[#6366F1]/20 border border-[#6366F1]/30 text-[#6366F1] rounded text-xs disabled:opacity-50"
                                      >
                                        <RefreshCw
                                          className={`w-3 h-3 ${regeneratingStoryId === story.id ? "animate-spin" : ""}`}
                                        />
                                        Regenerate
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  <button
                    onClick={handleInitiateJiraSync}
                    className="w-full px-4 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl font-medium hover:from-[#5558E3] hover:to-[#7C4FE0] transition-all text-sm"
                  >
                    Sync to Jira
                  </button>
                </div>
              )}

            {/* Jira Project Selection */}
            {message.type === "jira-project-selection" &&
              message.role === "assistant" && (
                <div className="mt-4 ml-12 space-y-3">
                  {jiraProjects.map((project) => (
                    <button
                      key={project.key}
                      onClick={() => handleJiraProjectSelect(project.key)}
                      className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                        selectedJiraProject === project.key
                          ? "border-[#6366F1] bg-[#6366F1]/5"
                          : "border-gray-200 dark:border-white/10 hover:border-[#6366F1]/50 hover:bg-[#6366F1]/5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-1 bg-[#6366F1]/10 text-[#6366F1] text-xs font-mono font-semibold rounded">
                              {project.key}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {project.name}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {project.tickets} existing tickets
                          </p>
                        </div>
                        {selectedJiraProject === project.key && (
                          <CheckCircle className="w-5 h-5 text-[#6366F1]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-white/10 p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl flex items-end gap-3 p-3 focus-within:border-[#6366F1]/50 transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm resize-none focus:outline-none min-h-[24px] max-h-32"
              style={{ lineHeight: "1.5" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() && currentStage !== "upload"}
              className="p-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-lg hover:from-[#5558E3] hover:to-[#7C4FE0] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {feedbackMode.type === "reject"
                ? "Provide Rejection Feedback"
                : "Provide Regenerate Feedback"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {feedbackMode.type === "reject"
                ? `Please explain why you're rejecting this ${feedbackMode.itemType} and what changes are needed for AI regeneration.`
                : `Please explain why you're regenerating this ${feedbackMode.itemType} and what changes are needed for AI regeneration.`}
            </p>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] resize-none"
              placeholder="Enter your feedback here..."
            />
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setFeedbackMode(null);
                  setFeedbackText("");
                }}
                className="px-6 py-2 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                disabled={!feedbackText.trim()}
                className={`px-6 py-2 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  feedbackMode.type === "reject"
                    ? "bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C]"
                    : "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4FE0]"
                }`}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
