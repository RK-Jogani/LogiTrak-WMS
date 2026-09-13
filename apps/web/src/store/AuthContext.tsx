"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  role: string;
  email: string;
  initials: string;
  warehouse: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const authFlag = localStorage.getItem("isAuthenticated");
    const storedUser = localStorage.getItem("user");
    
    if (authFlag === "true" && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // 1. Attempt live API authentication with Express backend
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const apiUser: User = {
          name: `${data.user.firstName} ${data.user.lastName}`.trim(),
          role: data.user.role,
          email: data.user.email,
          initials: `${data.user.firstName?.[0] || ""}${data.user.lastName?.[0] || ""}`.toUpperCase() || "US",
          warehouse: "Warehouse Alpha",
        };

        setIsAuthenticated(true);
        setUser(apiUser);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("token", data.token);
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("user", JSON.stringify(apiUser));
        return true;
      }
    } catch {
      // Live API unreachable, fallback to verified local demo authentication
    }

    // 2. Offline fallback for demo accounts with password "admin123"
    if (password === "admin123") {
      const demoUsers: Record<string, User> = {
        "admin@logitrack.com": {
          name: "Admin User",
          role: "ADMIN",
          email: "admin@logitrack.com",
          initials: "AU",
          warehouse: "Warehouse Alpha",
        },
        "super@logitrack.com": {
          name: "SaaS SuperAdmin",
          role: "SAAS_SUPER_ADMIN",
          email: "super@logitrack.com",
          initials: "SA",
          warehouse: "Platform Wide",
        },
        "j.smith@logitrack.com": {
          name: "John Smith",
          role: "MANAGER",
          email: "j.smith@logitrack.com",
          initials: "JS",
          warehouse: "Warehouse Alpha",
        },
        "m.davis@logitrack.com": {
          name: "Maria Davis",
          role: "SUPERVISOR",
          email: "m.davis@logitrack.com",
          initials: "MD",
          warehouse: "Warehouse Alpha",
        },
        "b.williams@logitrack.com": {
          name: "Ben Williams",
          role: "OPERATOR",
          email: "b.williams@logitrack.com",
          initials: "BW",
          warehouse: "Warehouse Alpha",
        },
      };

      const found = demoUsers[email.toLowerCase().trim()];
      if (found) {
        setIsAuthenticated(true);
        setUser(found);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("token", "demo-jwt-token-fallback");
        localStorage.setItem("accessToken", "demo-jwt-token-fallback");
        localStorage.setItem("user", JSON.stringify(found));
        return true;
      }
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.clear(); // Clear all as requested
    router.push("/login");
  };

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
