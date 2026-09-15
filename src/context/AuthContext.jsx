import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE, ENDPOINTS, request } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [regUserId, setRegUserId] = useState("");
  const [loading, setLoading] = useState(true); // true while we check for an existing session

  // On first load, ask the backend "am I still logged in?" using
  // whatever cookie the browser already has — this is what makes
  // a refresh not boot you back to the login page.
  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await request(`${API_BASE}/auth/me`);
        setUser(data.user || data); // depends on whether your `me` wraps it in { user } or returns it raw
      } catch (err) {
        setUser(null); // no valid session — that's fine, not an error to show anyone
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const register = async ({ name, email, password, department }) => {
    const data = await request(ENDPOINTS.register(API_BASE), {
      method: "POST",
      body: JSON.stringify({ username: name, email, password, department }),
    });
    setRegUserId(data?.userId || "");
    return data;
  };

  const verify = async ({ userId, code }) => {
    return request(ENDPOINTS.verify(API_BASE), {
      method: "POST",
      body: JSON.stringify({ userId: userId || regUserId, code }),
    });
  };

  const login = async ({ email, password }) => {
    const data = await request(ENDPOINTS.login(API_BASE), {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(data.user || { name: email });
    return data;
  };

  const logout = async () => {
    try {
      await request(ENDPOINTS.logout(API_BASE), { method: "POST" });
    } catch (_) {
      // ignore — clear local state regardless
    }
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };

  return (
    <AuthContext.Provider
      value={{ user, regUserId, loading, register, verify, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}





















