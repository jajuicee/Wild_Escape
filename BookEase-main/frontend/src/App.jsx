import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import BookingPage from "./pages/BookingPage";
import LoginPage from "./pages/LoginPage";
import PriceOfferPage from "./pages/PriceOfferPage";
import RegisterPage from "./pages/RegisterPage";
import Error404Page from "./pages/Error404Page";
import AdminHotels from "./pages/admin/AdminHotels";
import OwnerDashboardPage from "./pages/admin/OwnerDashboardPage";
import OwnerHotelsPage from "./pages/admin/OwnerHotelPage";
import OwnerBookingsPage from "./pages/admin/OwnerBookingsPage";
import OwnerOffersPage from "./pages/admin/OwnerOffersPage";
import OwnerRoomsPage from "./pages/admin/OwnerRoomsPage";
import CssBaseline from "@mui/material/CssBaseline";
import GuestRoute from "./routes/GuestRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import "react-toastify/dist/ReactToastify.css";
import ReviewsPage from "./pages/ReviewsPage";
import ProfilePage from "./pages/ProfilePage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      {/* Public Pages */}
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="price-offer" element={<PriceOfferPage />} />
      <Route path="booking" element={<BookingPage />} />
      <Route path="reviews" element={<ReviewsPage />} />

      {/* Protected Pages */}
      <Route path="temp" element={<ProtectedRoute></ProtectedRoute>} />
      <Route path="profile"element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/>
      {/* Hotel Owner Pages */}
      <Route
        path="/owner/dashboard"
        element={
          <AdminRoute>
            <OwnerDashboardPage />
          </AdminRoute>
        }
      />

      <Route
        path="/owner/hotels"
        element={
          <AdminRoute>
            <OwnerHotelsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/owner/rooms"
        element={
          <AdminRoute>
            <OwnerRoomsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/owner/offers"
        element={
          <AdminRoute>
            <OwnerOffersPage />
          </AdminRoute>
        }
      />
      <Route
        path="/owner/bookings"
        element={
          <AdminRoute>
            <OwnerBookingsPage />
          </AdminRoute>
        }
      />

      {/* Guest-only Pages */}
      <Route
        path="login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />

      <Route path="/404" element={<Error404Page />} />
      <Route path="*" element={<Error404Page />} />
    </Route>
  )
);

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CssBaseline />
        <ToastContainer position="bottom-right" autoClose={1500} />
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
