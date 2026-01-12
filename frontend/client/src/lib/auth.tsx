import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AuthUser } from "@shared/schema";

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeToken(token: string): AuthUser | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded as AuthUser;
  } catch {
    return null;
  }
}

function isTokenExpired(user: AuthUser): boolean {
  return user.exp * 1000 < Date.now();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      if (decoded && !isTokenExpired(decoded)) {
        setToken(storedToken);
        setUser(decoded);
      } else {
        localStorage.removeItem("auth_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((newToken: string) => {
    const decoded = decodeToken(newToken);
    if (decoded) {
      localStorage.setItem("auth_token", newToken);
      setToken(newToken);
      setUser(decoded);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
