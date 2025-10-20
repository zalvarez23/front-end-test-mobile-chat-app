import { useState, useCallback, useMemo } from "react";
import { AuthService } from "@/src/shared/services/AuthService";
import { User } from "@/src/shared/types";

export interface UseAuthServiceReturn {
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (userId: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export function useAuthService(): UseAuthServiceReturn {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const authService = useMemo(() => new AuthService(), []);

  const login = useCallback(
    async (userId: string) => {
      setLoading(true);
      try {
        const user = await authService.login(userId);
        if (user) {
          setCurrentUser(user);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error during login in hook:", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [authService]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      if (currentUser) {
        await authService.logout(currentUser.id);
      }
      setCurrentUser(null);
    } catch (error) {
      console.error("Error during logout in hook:", error);
    } finally {
      setLoading(false);
    }
  }, [authService, currentUser]);

  const isLoggedIn = !!currentUser;

  return {
    currentUser,
    isLoggedIn,
    login,
    logout,
    loading,
  };
}
