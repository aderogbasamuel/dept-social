import { Home, Plus, User, Settings, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function NavLink({ icon: Icon, label, path, active }) {
  return (
    <Link
      to={path}
      aria-label={label}
      className={`pt-3 hover:text-neutral-900 flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors ${
        active ? "text-emerald-600 dark:text-emerald-500" : "text-neutral-800 dark:text-neutral-300"
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
    <>


        <nav className="mx-2 fixed inset-x-0 rounded-full bottom-2 z-40  pb-[env(safe-area-inset-bottom)]  lg:hidden  bg-white/80 border border-white/20 dark:bg-neutral-900/20 px-6 backdrop-blur-xl shadow-lg shadow-black/5 transition-all duration-300 hover:bg-white/15 dark:hover:bg-neutral-900/30">
      <div className="mx-auto flex max-w-md items-center justify-between">
        <NavLink
          icon={Home}
          label="Home"
          path="/dashboard"
          active={isDashboard}
        />
        <NavLink
          icon={Users}
          label="Groups"
          path="/Groups"
          active={location.pathname === "/Groups"}
        />
        <button
          type="button"
          aria-label="Create post"
          onClick={handleCreatePost}
          className="flex h-15 w-15 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 transition-transform scale-110 hover:scale-105 active:scale-95"
        >
          <Plus size={22} />
        </button>
        <NavLink
          icon={User}
          label="Profile"
          path="/profile"
          active={location.pathname === "/profile"}
        />
        <NavLink
          icon={Settings}
          label="Settings"
          path="/settings"
          active={location.pathname === "/settings"}
        />
      </div>
    </nav>
    </>
  );
}
