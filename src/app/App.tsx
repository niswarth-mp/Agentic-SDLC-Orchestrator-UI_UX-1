import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MainLayout } from "./components/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { AIWorkspace } from "./pages/AIWorkspace";
import { Projects } from "./pages/Projects";
import { ProjectDetails } from "./pages/ProjectDetails";
import { Requirements } from "./pages/Requirements";
import { Pipelines } from "./pages/Pipelines";
import { Approvals } from "./pages/Approvals";
import { Artifacts } from "./pages/Artifacts";
import { Knowledge } from "./pages/Knowledge";
import { Integrations } from "./pages/Integrations";
import { Metrics } from "./pages/Metrics";
import { Settings } from "./pages/Settings";
import { Audit } from "./pages/Audit";
import { Flywheel } from "./pages/Flywheel";

export default function App() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const getAllProjects = async (limit: number) => {
      try {
        const data = await fetch(
          `http://localhost:8002/api/projects?limit=${limit}`,
        );
        if (!data.ok) return;
        const result = await data.json();
        // API may return { projects: [...] } or a single object
        const fetched = Array.isArray(result.projects)
          ? result.projects
          : result && result.project_id
            ? [result]
            : [];

        const normalized = fetched.map((p: any) => ({
          id: p.project_id ?? p.id ?? String(Math.random()).slice(2),
          name: p.config?.app_name ?? p.description ?? p.name ?? "Untitled",
          type: p.project_type === "web" ? "greenfield" : "brownfield",
          phase: p.phase ?? p.stage ?? "unknown",
          lastActive: p.created ?? "",
          status: undefined,
          confidence: 0,
        }));

        setProjects(normalized);
      } catch (e) {
        // ignore fetch errors for now
        // console.error(e);
      }
    };

    getAllProjects(50);
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="ai-workspace" element={<AIWorkspace />} />
            <Route
              path="projects"
              element={<Projects initialProjects={projects} />}
            />
            <Route path="projects/:id" element={<ProjectDetails />} />
            <Route path="requirements" element={<Requirements />} />
            <Route path="pipelines" element={<Pipelines />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="artifacts" element={<Artifacts />} />
            <Route path="audit" element={<Audit />} />
            <Route path="knowledge" element={<Knowledge />} />
            <Route path="metrics" element={<Metrics />} />
            <Route path="flywheel" element={<Flywheel />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
