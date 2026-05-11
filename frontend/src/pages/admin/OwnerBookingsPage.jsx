// src/pages/admin/OwnerBookingsPage.jsx
import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Stack, 
  Container, 
  Paper,
  Divider,
  Avatar 
} from "@mui/material";
import ownerService from "../../api/ownerService";
import { toast } from "react-toastify";

// Icons
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HotelIcon from '@mui/icons-material/Hotel';

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await ownerService.getMyBookings();
      setBookings(res.data);
    } catch (e) {
      toast.error("Failed to load bookings");
    }
  };

  // Helper for status colors
  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('confirm') || s.includes('paid')) return 'info';
    if (s.includes('pending')) return 'warning';
    if (s.includes('cancel')) return 'error';
    if (s.includes('complete')) return 'success';
    return 'default';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Box 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            p: 1.5, 
            borderRadius: 3, 
            display: 'flex',
            boxShadow: 3
          }}
        >
          <BookmarkAddedIcon fontSize="medium" />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Booking Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track reservations and guest details
          </Typography>
        </Box>
      </Box>

      {/* Empty State */}
      {bookings.length === 0 ? (
        <Paper 
          sx={{ 
            p: 8, 
            textAlign: 'center', 
            borderRadius: 4, 
            bgcolor: 'background.default',
            border: '1px dashed',
            borderColor: 'divider'
          }}
          elevation={0}
        >
          <EventBusyIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No bookings received yet
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((b) => (
            <Grid item xs={12} md={6} lg={4} key={b.id}>
              <Card 
                sx={{ 
                  width: 300,
                  height: '100%', 
                  borderRadius: 4, 
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  
                  {/* Top Row: Hotel Name & Price */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" gap={1.5}>
                      <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 40, height: 40 }} variant="rounded">
                        <HotelIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>
                          {b.hotelName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {b.roomType}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={`₱${b.totalPrice?.toLocaleString()}`} 
                      color="primary" 
                      variant="soft" // Uses Joy UI variant if available, else standard
                      sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Date Range */}
                  <Stack spacing={2}>
                    <Box 
                      sx={{ 
                        bgcolor: 'background.default', 
                        p: 1.5, 
                        borderRadius: 2, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between' 
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <CalendarTodayIcon fontSize="small" color="action" />
                        <Typography variant="body2" fontWeight={500}>
                          {b.checkInDate}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.disabled">→</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {b.checkOutDate}
                      </Typography>
                    </Box>

                    {/* Footer: Guest & Status */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap={1}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          ID: {b.userId}
                        </Typography>
                      </Box>

                      <Chip 
                        label={b.bookingStatus} 
                        color={getStatusColor(b.bookingStatus)}
                        size="small"
                        sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
                      />
                    </Box>
                  </Stack>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}