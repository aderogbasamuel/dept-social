import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthCard from "../components/AuthCard";
import Banner from "../components/Banner";

export default function VerifyPage() {
  const { verify, regUserId } = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(regUserId || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    try {
      const data = await verify({ userId, code });
      setNotice(data?.message || "Verified. You can log in now.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthCard
      title="Verify your email"
      subtitle="Enter the code we sent to your school email"
    >
      <Banner text={error} type="error" />
      <Banner text={notice} />
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          placeholder="User ID (from registration)"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          placeholder="Verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-emerald-600 text-white text-sm rounded-lg py-2.5 font-medium"
        >
          Verify
        </button>
      </form>
    </AuthCard>
  );
}
