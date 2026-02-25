import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const ALERT_KEY = "adminGuardAlertShown";

function AdminRoute({ children, redirectTo = "/" }) {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!isAdmin()) {
      const hasShown = sessionStorage.getItem(ALERT_KEY) === "true";
      if (!hasShown) {
        sessionStorage.setItem(ALERT_KEY, "true");
      }
    }
  }, [loading, isAdmin]);

  if (loading) return null;
  if (!isAdmin()) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children;
}

export default AdminRoute;

