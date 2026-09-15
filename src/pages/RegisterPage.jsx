import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthCard from "../components/AuthCard";
import { toast } from "sonner";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  const handleField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const registerRequest = register(form);
      await toast.promise(registerRequest, {
        loading: "Creating your account...",
        success: (data) =>
          data?.message || "Registered. Check for a verification code.",
        error: (err) => err.message,
      });
      navigate("/verify");
    } catch {
      return;
    }
  };

  return (
    <AuthCard title="Create account" subtitle="Sign up with your school email">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          placeholder="Name"
          value={form.name}
          onChange={handleField("name")}
        />
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          placeholder="School email"
          value={form.email}
          onChange={handleField("email")}
        />
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          placeholder="Department"
          value={form.department}
          onChange={handleField("department")}
        />
        <input
          type="password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          placeholder="Password"
          value={form.password}
          onChange={handleField("password")}
        />
        <button
          type="submit"
          className="w-full bg-emerald-600 text-white text-sm rounded-lg py-2.5 font-medium"
        >
          Register
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-4 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-emerald-600 font-medium">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
