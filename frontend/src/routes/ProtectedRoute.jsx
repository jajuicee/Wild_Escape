// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Prevent route from loading until auth state is restored
  if (loading) return null;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
