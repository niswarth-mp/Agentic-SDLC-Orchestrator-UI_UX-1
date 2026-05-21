import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function MainLayout() {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#0A0F1E] overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-[#0A0F1E]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
