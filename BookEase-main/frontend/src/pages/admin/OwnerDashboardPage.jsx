import React, { useEffect, useState } from "react";
import ownerService from "../../api/ownerService";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  Container,
  Avatar,
  Card,
  CardContent,
  Chip
} from "@mui/material";

// Standardizing on MUI Icons to match your other components
import ApartmentIcon from '@mui/icons-material/Apartment';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import StarIcon from '@mui/icons-material/Star';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import HotelIcon from '@mui/icons-material/Hotel';

/* -------------------- */
/* STAT CARD COMPONENT */
/* -------------------- */
const StatCard = ({ icon, title, value, color, bgColor }) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 4,
      border: "1px solid",
      borderColor: "divider",
      height: "100%",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
        borderColor: color,
      },
    }}
  >
    <CardContent sx={{ p: 3, display: "flex", alignItems: "center", gap: 2.5 }}>
      <Avatar
        variant="rounded"
        sx={{
          width: 56,
          height: 56,
          bgcolor: bgColor,
          color: color,
          borderRadius: 3,
        }}
      >
        {icon}
      </Avatar>

      <Box>
        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={800} color="text.primary">
          {value}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

/* -------------------- */
/* DASHBOARD PAGE */
/* -------------------- */
export default function OwnerDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ownerService
      .getDashboardSummary()
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
        }}
      >
        <Typography color="error" variant="h6">
          Unable to load dashboard data.
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* HEADER */}
      <Box mb={5}>
        <Typography variant="h3" fontWeight={900} color="text.primary" gutterBottom>
          Owner Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here is an overview of your hotel business performance and bookings.
        </Typography>
      </Box>

      {/* SECTION 1: ASSETS & RATING */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight={700} mb={2} color="text.primary">
          Business Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<ApartmentIcon fontSize="medium" />}
              title="Total Hotels"
              value={data.totalHotels}
              color="#0284c7" // Sky Blue
              bgColor="#e0f2fe"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<MeetingRoomIcon fontSize="medium" />}
              title="Total Rooms"
              value={data.totalRooms}
              color="#7c3aed" // Violet
              bgColor="#f3e8ff"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<HotelIcon fontSize="medium" />}
              title="Available Rooms"
              value={data.availableRooms}
              color="#059669" // Emerald
              bgColor="#d1fae5"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<StarIcon fontSize="medium" />}
              title="Average Rating"
              value={Number(data.averageHotelRating).toFixed(1)}
              color="#d97706" // Amber
              bgColor="#fef3c7"
            />
          </Grid>
        </Grid>
      </Box>

      {/* SECTION 2: BOOKING STATUS */}
      <Box>
        <Typography variant="h6" fontWeight={700} mb={2} color="text.primary">
          Booking Performance
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<EventAvailableIcon fontSize="medium" />}
              title="Active Bookings"
              value={data.activeBookings}
              color="#2563eb" // Blue
              bgColor="#dbeafe"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<CheckCircleIcon fontSize="medium" />}
              title="Completed"
              value={data.completedBookings}
              color="#16a34a" // Green
              bgColor="#dcfce7"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<PendingIcon fontSize="medium" />}
              title="Pending"
              value={data.pendingBookings}
              color="#ea580c" // Orange
              bgColor="#ffedd5"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<CancelIcon fontSize="medium" />}
              title="Cancelled"
              value={data.cancelledBookings}
              color="#dc2626" // Red
              bgColor="#fee2e2"
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}