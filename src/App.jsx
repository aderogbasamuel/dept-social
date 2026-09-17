import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyPage from "./pages/VerifyPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "sonner";
import SettingsPage from "./pages/SettingsPage";
import { ThemeProvider } from "./context/ThemeContext";
import UserProfilePage from "./pages/UserProfilePage";
import GroupsPage from "./pages/Groupsage";
import GroupDetailPage from "./pages/GroupDetailPage"
import PostDetailPage from "./pages/PostDetailPage";
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              classNames: {
                toast: "rounded-xl border border-emerald-100 shadow-lg dark:border-gray-700 dark:bg-gray-800",
                title: "font-semibold text-gray-800 dark:text-gray-100",
                description: "text-sm text-gray-500 dark:text-gray-400",
                success: "border-emerald-200 dark:border-emerald-300",
                error: "border-red-200 dark:border-red-300",
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups"
              element={
                <ProtectedRoute>
                  <GroupsPage />
                </ProtectedRoute>
              }
            />
             <Route
              path="/groups/:id"
              element={
                <ProtectedRoute>
                  <GroupDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users/:id"
              element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
  path="/posts/:id"
  element={
    <ProtectedRoute>
      <PostDetailPage />
    </ProtectedRoute>
  }
/>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
