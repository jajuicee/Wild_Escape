import { createContext, useContext, useState, useEffect } from "react";
import { getConfirmedBookingCount } from "../api/bookingService";
import api from "../api/authInterceptor";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    bookingsCount: 0,
  });

  // Load auth state from storage when app loads
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    setAccessToken(token);

    api.get("/api/users/me")
      .then(res => {
        console.log("USER FROM /me:", res.data);      // ✅ HERE
        console.log("ROLE VALUE:", res.data.role);    // ✅ HERE

        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });

    localStorage.setItem("accessToken", res.data.token);
    setAccessToken(res.data.token);

    // Immediately load user securely
    const me = await api.get("/api/users/me");
    setUser(me.data);


    return me.data;
  };


  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      try {
        const [bookingsRes, reviewsRes] = await Promise.all([
          api.get(`/api/users/${user.id}/confirmed-bookings/count`),
          api.get(`/api/users/${user.id}/reviews/count`),
        ]);

        setStats({
          bookingsCount: bookingsRes.data.count,
          reviewsCount: reviewsRes.data.count,
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };

    loadStats();
  }, [user]);

  // LOGOUT
  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (e) {
      console.warn("Logout warning:", e);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setAccessToken(null);
    setUser(null);
  };

  // UPDATE USER
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    accessToken,
    loading,
    login,
    logout,
    updateUser,
    stats,
    isAuthenticated: !!accessToken,
    isAdmin: user?.role === "ROLE_ADMIN",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ⛔ THIS WAS MISSING
export const useAuth = () => useContext(AuthContext);
