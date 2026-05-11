import { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Container,
  Paper 
} from "@mui/material";
import ownerService from "../../api/ownerService";

// Icons
import ApartmentIcon from '@mui/icons-material/Apartment';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    hotels: 0,
    rooms: 0,
    offers: 0,
    bookings: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const hotels = await ownerService.getMyHotels();
    const rooms = await ownerService.getMyRooms();
    const offers = await ownerService.getMyOffers();
    const bookings = await ownerService.getMyBookings();

    setStats({
      hotels: hotels.data.length,
      rooms: rooms.data.length,
      offers: offers.data.length,
      bookings: bookings.data.length,
    });
  };

  // UI Configuration for the cards
  const statConfig = [
    { 
      title: "Hotels", 
      value: stats.hotels, 
      icon: <ApartmentIcon />, 
      color: "#1976d2", // Blue
      bgColor: "#e3f2fd"
    },
    { 
      title: "Rooms", 
      value: stats.rooms, 
      icon: <BedroomParentIcon />, 
      color: "#9c27b0", // Purple
      bgColor: "#f3e5f5"
    },
    { 
      title: "Active Offers", 
      value: stats.offers, 
      icon: <LocalOfferIcon />, 
      color: "#ed6c02", // Orange
      bgColor: "#fff3e0"
    },
    { 
      title: "Total Bookings", 
      value: stats.bookings, 
      icon: <BookOnlineIcon />, 
      color: "#2e7d32", // Green
      bgColor: "#e8f5e9"
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 1.5, 
            borderRadius: 3, 
            bgcolor: 'primary.main', 
            color: 'white',
            display: 'flex' 
          }}
        >
          <DashboardIcon fontSize="medium" />
        </Paper>
        <Box>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, here's what's happening with your properties.
          </Typography>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {statConfig.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%', 
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography 
                      variant="subtitle2" 
                      color="text.secondary" 
                      fontWeight={600}
                      sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography variant="h3" fontWeight={800} sx={{ mt: 1, color: 'text.primary' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar 
                    variant="rounded"
                    sx={{ 
                      bgcolor: stat.bgColor, 
                      color: stat.color, 
                      width: 56, 
                      height: 56,
                      borderRadius: 3
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}