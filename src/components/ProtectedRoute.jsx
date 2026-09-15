import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Still checking whether a valid session/cookie exists — don't
  // redirect yet, or you'll bounce a legitimately logged-in user
  // to /login just because the check hasn't finished.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50/40">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}