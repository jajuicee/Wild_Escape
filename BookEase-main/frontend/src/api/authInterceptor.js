// src/api/authInterceptor.js

import axios from "axios";
import { toast } from "react-toastify";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // allow cookies
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =======================================
// RESPONSE INTERCEPTOR (AUTO REFRESH)
// =======================================
let isRefreshing = false;
let failedQueue = [];

// Helper: retry failed requests once token refresh completes
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // 🚫 Prevent token refresh from running on login/register/logout errors
    const url = originalRequest?.url || "";
    if (
      url.includes("/api/auth/login") ||
      url.includes("/api/auth/register") ||
      url.includes("/api/auth/logout")
    ) {
      // Pass error back to login page so it can show the correct message
      return Promise.reject(error);
    }

    // If access token expired → backend returns 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await api.post("/api/auth/refresh", {}, { withCredentials: true });
        const newAccessToken = res.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);
        processQueue(null, newAccessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;

        // Refresh failed → logout user
        localStorage.removeItem("accessToken");
        toast.error("Session expired. Please log in again.");

        window.dispatchEvent(new Event("authChanged"));
        window.location.href = "/login";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
