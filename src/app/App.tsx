import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { MainLayout } from './components/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { Pipelines } from './pages/Pipelines';
import { Approvals } from './pages/Approvals';
import { Artifacts } from './pages/Artifacts';
import { Knowledge } from './pages/Knowledge';
import { Integrations } from './pages/Integrations';
import { Metrics } from './pages/Metrics';
import { Settings } from './pages/Settings';
import { Audit } from './pages/Audit';
import { Flywheel } from './pages/Flywheel';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
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
  );
}