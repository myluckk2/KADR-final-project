import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../Loader";

/**
 * Yalnız admin rolu olan istifadəçilərə icazə verən route mühafizəçisi.
 * - Sessiya yoxlanılırsa -> Loader
 * - Login olmayıbsa -> /login (geri dönüş yeri ilə)
 * - Login olub, amma admin deyilsə -> / (ana səhifə)
 */
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <Loader label="Sessiya yoxlanılır..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
