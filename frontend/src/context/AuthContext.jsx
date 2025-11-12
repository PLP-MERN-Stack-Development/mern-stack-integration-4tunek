import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const decoded = JSON.parse(atob(token.split(".")[1]));
          const res = await api.get(`/api/auth/user/${decoded.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } catch (err) {
          console.error("Failed to fetch user:", err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);
      setUser(user);
      return res.data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post("/api/auth/register", { name, email, password });
      return res.data;
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // Helper to get auth headers
  const getAuthHeaders = () => ({
    Authorization: token ? `Bearer ${token}` : "",
  });

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
};
