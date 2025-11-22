import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "@/types/auth";
import { AuthAPI } from "@/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      // Check if token was passed in URL by OAuth redirect
      const urlToken = new URLSearchParams(window.location.search).get("token");

      if (urlToken) {
        localStorage.setItem("token", urlToken);
        window.history.replaceState({}, "", "/dashboard");
      }

      // check for existing JWT
      const stored = localStorage.getItem("token");

      if (!stored) {
        if (isMounted) setLoading(false);
        return;
      }

      // Fetch current user
      try {
        const userData = await AuthAPI.getCurrentUser();
        if (isMounted) setUser(userData);
      } catch {
        localStorage.removeItem("token");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };