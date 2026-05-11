import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Grid,
  Button,
  Container,
  Stack,
  Avatar,
  Paper
} from "@mui/material";

// Icons
import HotelIcon from '@mui/icons-material/Hotel';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import PaymentsIcon from '@mui/icons-material/Payments';
import CancelIcon from '@mui/icons-material/Cancel';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import api from "../api/authInterceptor";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function BookingStatusTab({ onBookingCancelled }) {
  const { user, isAuthenticated } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // Fetch User Bookings
  // Correct endpoint: /api/bookings/my
  // because BookingController has @GetMapping("/my")
  // ================================
  const fetchBookings = async () => {
    if (!isAuthenticated) return;

    try {
      const res = await api.get("/api/bookings/my");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [isAuthenticated]);

  // ================================
  // Payment Handler
  // Calls backend /api/bookings/{id}/pay
  // ================================
  const handlePay = async (bookingId) => {
    try {
      await api.put(`/api/bookings/${bookingId}/pay`);
      toast.success("Payment successful!");
      fetchBookings(); // reload updated data
    } catch (error) {
      toast.error(error.response?.data || "Payment failed.");
    }
  };

  // ================================
  // Cancel Booking
  // Optional but functional
  // ================================
  const handleCancel = async (booking) => {
    try {
      await api.put(`/api/bookings/${booking.id}/status`, null, {
        params: { status: "Cancelled" },
      });

      toast.info("Booking cancelled.");

      onBookingCancelled?.({
        roomId: booking.roomId,
      });

      fetchBookings();
    } catch (error) {
      toast.error("Failed to cancel booking.");
    }
  };

  const statusColor = {
    Pending: "warning",
    Confirmed: "info",
    Completed: "success",
    Cancelled: "error",
  };

  if (!isAuthenticated) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
         <EventBusyIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
         <Typography textAlign="center" color="error" variant="h6">
          You must be logged in to view your bookings.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 8, mb: 8 }}>
        <CircularProgress size={50} thickness={4} />
        <Typography mt={2} color="text.secondary">Loading your bookings...</Typography>
      </Box>
    );
  }

  if (bookings.length === 0) {
    return (
      <Paper 
        sx={{ 
          p: 6, 
          textAlign: 'center', 
          borderRadius: 4, 
          bgcolor: 'background.default',
          border: '1px dashed',
          borderColor: 'divider',
          mt: 4
        }}
        elevation={0}
      >
        <ReceiptLongIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          You have no bookings yet.
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Book a room to see your reservation details here.
        </Typography>
      </Paper>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={4} justifyContent="center">
        <Typography
          variant="h4"
          fontWeight={800}
          color="text.primary"
        >
          Your Bookings
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {bookings.map((b) => (
          <Grid item xs={12} md={6} lg={4} key={b.id}>
            <Card
              sx={{
                width: 300,
                height: '100%',
                borderRadius: 4,
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
                overflow: 'visible',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
              elevation={0}
            >
              {/* Card Header (Hotel Name) */}
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'primary.main', 
                  color: 'primary.contrastText',
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}
              >
                 <HotelIcon />
                 <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {b.hotelName}
                 </Typography>
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                        #{b.id}
                    </Typography>
                    <Box>
                      <Chip
                        label={b.bookingStatus}
                        color={statusColor[b.bookingStatus] || "default"}
                        size="small"
                        sx={{ fontWeight: 'bold', mr: 1 }}
                      />
                       <Chip
                        label={b.paymentStatus}
                        color={b.paymentStatus === "Paid" ? "success" : "warning"}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />

                <Stack spacing={2}>
                    {/* Room Type */}
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.light', color: 'secondary.main' }}>
                            <BedroomParentIcon fontSize="small" />
                        </Avatar>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Room Type</Typography>
                            <Typography variant="body2" fontWeight="bold">{b.roomType}</Typography>
                        </Box>
                    </Box>

                    {/* Dates */}
                    <Box 
                        sx={{ 
                            p: 1.5, 
                            bgcolor: 'background.default', 
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Check-in</Typography>
                            <Typography variant="body2" fontWeight="bold" display="flex" alignItems="center" gap={0.5}>
                                <CalendarMonthIcon fontSize="small" color="action" /> {b.checkInDate}
                            </Typography>
                        </Box>
                        <ArrowForwardIcon color="action" fontSize="small" />
                        <Box textAlign="right">
                            <Typography variant="caption" color="text.secondary" display="block">Check-out</Typography>
                            <Typography variant="body2" fontWeight="bold" display="flex" alignItems="center" gap={0.5} justifyContent="flex-end">
                                {b.checkOutDate}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Total Price */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" pt={1}>
                        <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                        <Typography variant="h5" fontWeight={800} color="primary.main">
                            ₱{parseFloat(b.totalPrice || 0).toLocaleString()}
                        </Typography>
                    </Box>
                </Stack>

                {/* Actions */}
                <Box mt={3}>
                    {b.paymentStatus === "Unpaid" && b.bookingStatus === "Pending" && (
                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            startIcon={<PaymentsIcon />}
                            onClick={() => handlePay(b.id)}
                            sx={{ mb: 1, borderRadius: 2, fontWeight: 'bold' }}
                        >
                            Pay Now
                        </Button>
                    )}

                    {b.bookingStatus === "Pending" && (
                        <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            startIcon={<CancelIcon />}
                            onClick={() => handleCancel(b)}
                            sx={{ borderRadius: 2 }}
                        >
                            Cancel Booking
                        </Button>
                    )}
                </Box>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}