// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );

  const login = async (email, password) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);

    return user; // kembalikan user untuk redirect berdasarkan role
  };

  const register = async (name, email, password) => {
    const res = await axiosInstance.post("/auth/register", {
      name,
      email,
      password,
    });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === "admin";
  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, isAdmin, isLoggedIn, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return context;
};
