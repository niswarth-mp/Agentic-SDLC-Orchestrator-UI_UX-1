import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export function MainLayout() {
  return (
    <div className="h-screen w-screen flex flex-col bg-white dark:bg-[#0A0F1E] overflow-hidden transition-colors">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-[#0A0F1E] transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
