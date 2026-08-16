import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // İlk yüklənmədə localStorage-dan sessiyanı bərpa edirik
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setAuthLoading(false);
  }, []);

  const persistSession = (userData, jwt) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setToken(jwt);
  };

  const login = useCallback(async (username, password) => {
    const data = await authService.login(username, password);
    persistSession(data.user, data.token);
    return data.user;
  }, []);

  const register = useCallback(async (username, password) => {
    const data = await authService.register(username, password);
    persistSession(data.user, data.token);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    isAdmin: user?.role === "admin",
    authLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth mütləq <AuthProvider> daxilində istifadə olunmalıdır.");
  }
  return ctx;
}
