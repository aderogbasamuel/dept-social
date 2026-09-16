import { Link, useLocation } from "react-router-dom";
import { Home, Search, Users, Calendar, MessageCircle, Bell, User, Bookmark, Plus } from "lucide-react";

const nav = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Search, label: "Explore", path: "/explore" },
  { icon: Users, label: "Groups", path: "/groups" },
  { icon: Calendar, label: "Events", path: "/events" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Bookmark, label: "Saved", path: "/saved" },
];

function NavItem({ icon: Icon, label, path, active }) {
  return (
    <Link
      to={path}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
        active
          ? "bg-emerald-600 text-white font-medium dark:text-gray-"
          : "text-gray-600 hover:bg-emerald-50"
      }`}
    >
      <Icon size={18} />
      <span className="flex-1 text-left">{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-60 shrink-0 hidden lg:flex flex-col gap-6">
      <Link to="/dashboard" className="flex items-center gap-2 px-2">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
          <Users size={18} className="text-white" />
        </div>
        <span className="font-semibold text-lg text-emerald-900">
          Dept Social
        </span>
      </Link>

      <nav className="flex flex-col gap-1 bg-white dark:bg-gray-900 rounded-2xl p-3 shadow-sm shadow-emerald-900/5">
        {nav.map((item) => (
          <NavItem
            key={item.label}
            {...item}
            active={location.pathname === item.path}
          />
        ))}
      </nav>

      <div className="bg-emerald-900 text-emerald-50 rounded-2xl p-5">
        <p className="font-semibold text-base leading-snug mb-1">
          Grow together.
        </p>
        <p className="text-sm text-emerald-200 mb-4">
          One department, one feed.
        </p>
        <button className="w-full bg-emerald-400 text-emerald-950 text-sm font-medium rounded-xl py-2.5 flex items-center justify-center gap-1.5">
          <Plus size={16} /> Create Post
        </button>
      </div>
    </aside>
  );
}