// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axios";

interface AuthStatus {
  role: "user" | "admin" | "guest";
}

interface AuthContextType {
  authStatus: AuthStatus | null;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authStatus: null,
  refreshAuth: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);

  const refreshAuth = async () => {
    try {
      const res = await axios.get("/api/auth/me", { withCredentials: true });
      setAuthStatus(res.data.user);
    } catch {
      setAuthStatus({ role: "guest" });
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ authStatus, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
