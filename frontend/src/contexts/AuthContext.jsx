import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api.js";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const storeSession = (userData, accessToken) => {
  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("accessToken", accessToken);
};

const clearSession = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
};

const toUserData = (response) => ({
  email: response.email,
  username: response.username,
  roles: response.roles ?? [],
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    setUser(null);
    clearSession();
  };

  useEffect(() => {
    const hasSession = localStorage.getItem("accessToken") && localStorage.getItem("user");

    if (hasSession) {
      authApi.me()
        .then((data) => setUser(toUserData(data)))
        .catch(() => clearAuth())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    const handleSessionExpired = () => clearAuth();
    window.addEventListener("session-expired", handleSessionExpired);
    return () => window.removeEventListener("session-expired", handleSessionExpired);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      const userData = toUserData(response);
      setUser(userData);
      storeSession(userData, response.accessToken);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await authApi.register(username, email, password);
      const userData = toUserData(response);
      setUser(userData);
      storeSession(userData, response.accessToken);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.roles?.includes("ROLE_ADMIN") ?? false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
