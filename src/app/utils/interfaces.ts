export interface IntegrationField {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "password";
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "connected" | "disconnected";
  requiredFields: IntegrationField[];
}

export interface NewProjectWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (projectId: string) => void;
}

export type ProjectMode = "greenfield" | "brownfield";
export type ProjectType = "web" | "api" | "mobile" | "ml" | "data-pipeline";

export interface ProjectConfig {
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
