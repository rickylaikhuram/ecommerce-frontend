// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import axios from "../utils/axios";
import { userService } from "../services/user.services";
import type { User, AuthStatus } from "../types/user.types";

interface AuthContextType {
  authStatus: AuthStatus | null;
  userProfile: User | null;
  profileLoading: boolean;
  profileError: string | null;
  refreshAuth: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateUserProfile: (
    data: Partial<Pick<User, "name" | "phone">>
  ) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with default dummy values
const AuthContext = createContext<AuthContextType>({
  authStatus: null,
  userProfile: null,
  profileLoading: false,
  profileError: null,
  refreshAuth: async () => {},
  refreshProfile: async () => {},
  updateUserProfile: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  const refreshProfile = async () => {
    if (!authStatus?.isAuthenticated) {
      setUserProfile(null);
      return;
    }

    try {
      setProfileLoading(true);
      setProfileError(null);
      const profile = await userService.getProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setProfileError("Failed to load profile");
      setUserProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const refreshAuth = async () => {
    try {
      const res = await axios.get("/api/auth/me", { withCredentials: true });
      const userData = res.data.user;

      if (userData.role === "guest") {
        setAuthStatus({ isAuthenticated: false, role: "guest" });
        setUserProfile(null);
        return;
      }

      const newAuthStatus: AuthStatus = {
        isAuthenticated: true,
        role: userData.isAdmin ? "admin" : ("user" as "admin" | "user"),
      };

      setAuthStatus(newAuthStatus);

      if (userData.id && userData.name && userData.email && userData.phone) {
        setUserProfile({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          isAdmin: userData.isAdmin,
          createdAt: userData.createdAt,
        });
      }
    } catch {
      setAuthStatus({ isAuthenticated: false, role: "guest" });
      setUserProfile(null);
    }
  };

  const updateUserProfile = async (
    data: Partial<Pick<User, "name" | "phone">>
  ) => {
    try {
      const updatedProfile = await userService.updateProfile(data);
      setUserProfile(updatedProfile);
    } catch (error) {
      throw new Error("Failed to update profile");
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      setAuthStatus({ isAuthenticated: false, role: "guest" });
      setUserProfile(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // On mount: perform auth check
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      refreshAuth();
    }
  }, []);

  // On successful auth: fetch user profile
  useEffect(() => {
    if (authStatus?.isAuthenticated && !userProfile && !profileLoading) {
      refreshProfile();
    }
  }, [authStatus?.isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        authStatus,
        userProfile,
        profileLoading,
        profileError,
        refreshAuth,
        refreshProfile,
        updateUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
