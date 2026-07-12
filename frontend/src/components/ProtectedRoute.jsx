
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * @param {React.ReactNode} children - The protected content to render.
 * @param {string[]} [allowedRoles] - Optional list of roles permitted to
 *        view this route. If omitted, any authenticated user may access it.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <p style={styles.loadingText}>Checking authentication...</p>
      </div>
    );
  }


  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

if (
  allowedRoles &&
  allowedRoles.length > 0 &&
  !allowedRoles.includes(user?.role)
) {
  return <Navigate to="/dashboard" replace />;
}

  return children;
};

const styles = {
  loadingWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "sans-serif",
  },
  loadingText: {
    fontSize: "1rem",
    color: "#555",
  },
};

export default ProtectedRoute;
