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
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    setUser(null);
    setAccessToken(null);
    clearSession();
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");

    if (storedUser && storedToken) {
      authApi.me()
        .then((data) => {
          const userData = toUserData(data);
          setUser(userData);
          setAccessToken(storedToken);
          localStorage.setItem("user", JSON.stringify(userData));
        })
        .catch(() => clearAuth())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    const handleSessionExpired = () => clearAuth();
    window.addEventListener("session-expired", handleSessionExpired);
    return () => window.removeEventListener("session-expired", handleSessionExpired);
  }, []);

  const applySession = (response) => {
    const userData = toUserData(response);
    setUser(userData);
    setAccessToken(response.accessToken);
    storeSession(userData, response.accessToken);
  };

  const login = async (email, password) => {
    try {
      applySession(await authApi.login(email, password));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (username, email, password) => {
    try {
      applySession(await authApi.register(username, email, password));
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
        accessToken,
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
