import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthCard from "../components/AuthCard";
import { toast } from "sonner";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginRequest = login({ email, password });
      await toast.promise(loginRequest, {
        loading: "Logging in...",
        success: "Welcome back",
        error: (err) => err.message,
      });
      navigate("/dashboard");
    } catch {
      return;
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Log in to your department feed">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-emerald-600 text-white text-sm rounded-lg py-2.5 font-medium"
        >
          Log in
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-4 text-center">
        No account?{" "}
        <Link to="/register" className="text-emerald-600 font-medium">
          Register
        </Link>
      </p>
    </AuthCard>
  );
}
