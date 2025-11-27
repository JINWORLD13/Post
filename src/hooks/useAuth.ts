import { useState, useCallback } from "react";

export interface User {
  id: string;
  email: string;
}

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const accessToken = localStorage.getItem("accessToken");
    return !!accessToken;
  });

  const getUser = useCallback((): User | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }, []);

  const getUserId = useCallback((): string | null => {
    const user = getUser();
    return user?.id || null;
  }, [getUser]);

  const login = (token: string, user: User) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    user: getUser(),
    userId: getUserId(),
    login,
    logout,
  };
};

export default useAuth;
