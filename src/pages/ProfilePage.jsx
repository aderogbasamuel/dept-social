import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import ProfileSettings from "../components/ProfileSettings";
import MobileBottomNav from "../components/MobileBottomNav";
import AppLayout from "../components/AppLayout";
export default function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-emerald-950 dark:text-emerald-100">Profile</h1>
        <button onClick={handleLogout} className="text-xs text-gray-400 dark:text-gray-500 px-6">
          Log out
        </button>
      </div>
      <ProfileSettings />
    </AppLayout>
  );
}
