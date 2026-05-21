import { Integration } from "./interfaces";

// --- Mock Datasets ---
export const templates = [
  {
    id: "java-microservice",
    name: "Java Microservice",
    language: "java",
    description: "Spring Boot + Maven + Docker",
    icon: "☕",
  },
  {
    id: "python-fastapi",
    name: "Python FastAPI",
    language: "python",
    description: "FastAPI + SQLAlchemy + Docker",
    icon: "🐍",
  },
  {
    id: "react-frontend",
    name: "React Frontend",
    language: "typescript",
    description: "React + TypeScript + Vite",
    icon: "⚛️",
  },
  {
    id: "node-express",
    name: "Node.js Express",
    language: "javascript",
    description: "Express + MongoDB + Docker",
    icon: "🟢",
  },
  {
    id: "ml-pipeline",
    name: "ML Pipeline",
    language: "python",
    description: "PyTorch + MLflow + Kubernetes",
    icon: "🤖",
  },
  {
    id: "blank",
    name: "Blank Project",
    language: "",
    description: "Start from scratch with no template",
    icon: "📄",
  },
];

export const integrationsData: Integration[] = [
  {
    id: "github",
    name: "GitHub Actions",
    description: "Automated CI/CD pipelines and checks.",
    icon: "🐙",
    status: "connected",
    requiredFields: [
      {
        id: "pat",
        label: "Personal Access Token",
        placeholder: "ghp_...",
        type: "password",
      },
      {
        id: "targetBranch",
        label: "Primary Target Branch",
        placeholder: "main",
        type: "text",
      },
    ],
  },
  {
    id: "sonarqube",
    name: "SonarQube",
    description: "Continuous inspection of code quality.",
    icon: "🦊",
    status: "disconnected",
    requiredFields: [
      {
        id: "host",
        label: "SonarQube Server URL",
        placeholder: "https://sonar.company.com",
        type: "text",
      },
      {
        id: "token",
        label: "Analysis Token",
        placeholder: "sqa_...",
        type: "password",
      },
    ],
  },
  {
    id: "jira",
    name: "Jira Software",
    description: "Sprint tracking and ticket reference loops.",
    icon: "🎯",
    status: "connected",
    requiredFields: [
      {
        id: "domain",
        label: "Atlassian Domain",
        placeholder: "company.atlassian.net",
        type: "text",
      },
      {
        id: "projectKey",
        label: "Jira Project Key",
        placeholder: "PROJ",
        type: "text",
      },
    ],
  },
  {
    id: "aws",
    name: "AWS Services",
    description: "Cloud deployment targets and secrets vault.",
    icon: "☁️",
    status: "disconnected",
    requiredFields: [
      {
        id: "accessKey",
        label: "AWS Access Key ID",
        placeholder: "AKIA...",
        type: "text",
      },
      {
        id: "secretKey",
        label: "AWS Secret Access Key",
        placeholder: "wJalrXUtnFEMI...",
        type: "password",
      },
      {
        id: "region",
        label: "Default Region",
        placeholder: "us-east-1",
        type: "text",
      },
    ],
  },
];
