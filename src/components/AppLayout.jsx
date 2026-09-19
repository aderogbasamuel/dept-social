import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
import { ArrowLeft, ArrowLeftCircle, ChevronLeft } from "lucide-react";

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-emerald-50/40 dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors">
      <div className="max-w-[1200px] mx-auto flex gap-6 p-6 px-4">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col gap-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 w-fit"
          >
            <div className="flex w-8 h-8 rounded-full border-gray-500 dark:border-gray-400 items-center justify-center">
              <ChevronLeft size={18} />
            </div>
          </button>
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
