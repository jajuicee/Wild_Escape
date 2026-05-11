import { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Stack, 
  Divider,
  Container,
  Paper
} from "@mui/material";
import ownerService from "../../api/ownerService";

// Icons
import HotelIcon from '@mui/icons-material/Hotel';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import EventBusyIcon from '@mui/icons-material/EventBusy';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const res = await ownerService.getMyBookings();
    setBookings(res.data);
  };

  // Helper for UI only - determines chip color based on status text
  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('confirm') || s.includes('paid')) return 'success';
    if (s.includes('pending')) return 'warning';
    if (s.includes('cancel')) return 'error';
    return 'default';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Box 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            p: 1, 
            borderRadius: 2, 
            display: 'flex',
            boxShadow: 2 
          }}
        >
          <BookmarkAddedIcon fontSize="medium" />
        </Box>
        <Typography variant="h4" fontWeight={800} color="text.primary">
          Booking Management
        </Typography>
      </Box>

      {bookings.length === 0 ? (
        <Paper 
          sx={{ 
            p: 6, 
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
            No bookings found