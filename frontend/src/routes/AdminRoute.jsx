import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

export default function AdminRoute({ children }) {
  const { isAdmin, isAuthenticated, loading } = useAuth();

  // ⏳ Wait until auth is resolved
  if (loading) {
    return (
      <Box className="flex items-center justify-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/404" replace />;
  }

  return children;
}
