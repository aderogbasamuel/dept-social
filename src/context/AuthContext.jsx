import { createContext, useContext, useState } from "react";
import { API_BASE, ENDPOINTS, request } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [regUserId, setRegUserId] = useState("");

  const register = async ({ name, email, password, department }) => {
    const data = await request(ENDPOINTS.register(API_BASE), {
      method: "POST",
      body: JSON.stringify({
        username: name,
        email,
        password,
        department,
      }),
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
    setUser(data.user || { username: email });
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

  return (
    <AuthContext.Provider
      value={{ user, regUserId, register, verify, login, logout }}
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
