import { Home, Plus, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function NavLink({ icon: Icon, label, path, active }) {
  return (
    <Link
      to={path}
      aria-label={label}
      className={`flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors ${
        active ? "text-emerald-600" : "text-gray-400"
      }`}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      <span>{label}</span>
    </Link>
  );
}

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/dashboard";

  const handleCreatePost = () => {
    if (!isDashboard) {
      navigate("/dashboard");
      return;
    }

    document.getElementById("create-post")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white/95 px-6 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(6,78,59,0.08)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between">
        <NavLink
          icon={Home}
          label="Home"
          path="/dashboard"
          active={isDashboard}
        />
        <button
          type="button"
          aria-label="Create post"
          onClick={handleCreatePost}
          className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 transition-transform active:scale-95"
        >
          <Plus size={22} />
        </button>
        <NavLink
          icon={User}
          label="Profile"
          path="/profile"
          active={location.pathname === "/profile"}
        />
      </div>
    </nav>
  );
}
