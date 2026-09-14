import { Search, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar"
export default function Header() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between w-full">
      <div>
        <h1 className="text-2xl font-semibold text-emerald-950">
          Hey, {user?.username || "there"} 👋
        </h1>
        <p className="text-sm text-gray-500">
          Good day — let's see what's new today
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-full bg-white shadow-sm shadow-emerald-900/5 flex items-center justify-center">
          <Search size={17} className="text-gray-500" />
        </button>
        <button className="w-10 h-10 rounded-full bg-white shadow-sm shadow-emerald-900/5 flex items-center justify-center relative">
          <Bell size={17} className="text-gray-500" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>
        <Avatar name={user?.username} size={10} />
      </div>
    </div>
  );
}
