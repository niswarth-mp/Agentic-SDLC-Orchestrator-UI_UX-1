export interface UserStory {
  id: string;
  epicId?: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical" | string;
  storyPoints?: number;
  story_points?: number;
  acceptanceCriteria?: string[];
  acceptance_criteria?: string[];
  status?: "pending" | "approved" | "rejected";
  expanded?: boolean;
  jiraKey?: string;
  syncStatus?: "pending" | "syncing" | "synced" | "error";
  feedback?: string;
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  status?: "pending" | "approved" | "rejected";
  userStories: UserStory[];
  expanded?: boolean;
  jiraKey?: string;
  syncStatus?: "pending" | "syncing" | "synced" | "error";
}

export type ApprovalState = "pending" | "approved" | "partial";
