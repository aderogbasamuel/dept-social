import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import ProfileSettings from "../components/ProfileSettings";

export default function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-emerald-50/40 text-gray-800">
      <div className="max-w-[1200px] mx-auto flex gap-6 p-6">
        <Sidebar />

        <main className="flex-1 min-w-0 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-emerald-950">
              Profile
            </h1>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-400"
            >
              Log out
            </button>
          </div>

          <ProfileSettings />
        </main>
      </div>
    </div>
  );
}