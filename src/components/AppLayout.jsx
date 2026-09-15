import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-emerald-50/40 dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors">
      <div className="max-w-[1200px] mx-auto flex gap-6 p-6 px-4">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col gap-5">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
