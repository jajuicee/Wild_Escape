import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Divider,
  CardMedia,
  CircularProgress,
  Grid,
  Chip,
  Stack
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function BookingForm({
  city,
  setCity,
  hotelId,
  setHotelId,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
  availableRooms,
  loading,
  error,
  handleSearch,
  onSelectRoom,
  selectedRoom,
  setSelectedRoom,
}) {
  const resolveImage = (url) => {
    if (!url) return "/images/rooms/default.jpg";

    // If backend already returns absolute URL
    if (url.startsWith("http")) return url;

    // Default backend URL fallback
    return `http://localhost:8080${url}`;
  };

  // AUTO-CLEAR selected room if guests are too many
  const handleGuestChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setGuests(value);

    // If selected room can’t handle new guest count → clear selection
    if (selectedRoom && value > selectedRoom.capacity) {
      setSelectedRoom(null);
    }
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        p: 4, 
        borderRadius: 4, 
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper"
      }}
    >
      <Box mb={4}>
        <Typography variant="h5" fontWeight={800} color="primary.main">
          Reserve Your Stay
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Find the perfect room for your trip
        </Typography>
      </Box>

      {/* SEARCH FORM GRID */}
      <Grid container spacing={3}>
        {/* CITY */}
        <Grid item xs={12}>
          <TextField
            label="Destination City"
            fullWidth
            variant="outlined"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setHotelId(null);
              setSelectedRoom(null);
            }}
            placeholder="Where are you going?"
          />
        </Grid>

        {/* DATES */}
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Check-in"
            value={checkIn}
            onChange={(v) => setCheckIn(v ? dayjs(v) : null)}
            minDate={dayjs()}
            slotProps={{ 
              textField: { 
                fullWidth: true,
                variant: "outlined" 
              } 
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Check-out"
            value={checkOut}
            onChange={(v) => setCheckOut(v ? dayjs(v) : null)}
            minDate={checkIn || dayjs()}
            slotProps={{ 
              textField: { 
                fullWidth: true,
                variant: "outlined"
              } 
            }}
          />
        </Grid>

        {/* GUESTS */}
        <Grid item xs={12}>
          <TextField
            label="Number of Guests"
            type="number"
            fullWidth
            value={guests}
            onChange={handleGuestChange}
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Grid>

        {/* SEARCH BUTTON */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !city || !checkIn || !checkOut}
            onClick={handleSearch}
            sx={{ 
              py: 2, 
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem',
              borderRadius: 2,
              boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Search Availability"}
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Box mt={3} p={2} bgcolor="error.light" borderRadius={2}>
          <Typography color="error.dark" fontWeight={600} align="center">
            {error}
          </Typography>
        </Box>
      )}

      {/* ROOMS RESULTS */}
      {availableRooms.length > 0 && (
        <Box mt={5}>
          <Divider>
            <Chip label="Available Rooms" sx={{ fontWeight: 600 }} />
          </Divider>

          <Grid container spacing={3} mt={1}>
            {availableRooms.map((room) => {
              const exceedsCapacity = guests > room.capacity;
              const isSelected = selectedRoom?.id === room.id;

              return (
                <Grid item xs={12} md={6} key={room.id}>
                  <Card
                    elevation={isSelected ? 4 : 0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: "hidden",
                      cursor: exceedsCapacity ? "not-allowed" : "pointer",
                      opacity: exceedsCapacity ? 0.6 : 1,
                      border: "2px solid",
                      borderColor: isSelected ? "primary.main" : "divider",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: 'relative',
                      "&:hover": !exceedsCapacity && {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 24px -10px rgba(0,0,0,0.15)",
                        borderColor: isSelected ? "primary.main" : "grey.400"
                      },
                    }}
                    onClick={() => !exceedsCapacity && onSelectRoom(room)}
                  >
                    {/* ROOM IMAGE */}
                    <Box position="relative">
                      <CardMedia
                        component="img"
                        height="200"
                        image={resolveImage(room.imageUrl)}
                        alt={room.roomType}
                        sx={{ objectFit: "cover" }}
                      />
                      <Chip 
                        label={`₱${room.pricePerNight?.toLocaleString()}`} 
                        color="primary"
                        sx={{ 
                          position: 'absolute', 
                          top: 16, 
                          right: 16, 
                          fontWeight: 800,
                          boxShadow: 2
                        }} 
                      />
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Box>
                          <Typography variant="h6" fontWeight={800} lineHeight={1.2}>
                            {room.roomType}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                            {room.hotelName}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" mb={2} sx={{ 
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                      }}>
                        {room.description}
                      </Typography>

                      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <Chip 
                          label={`${room.capacity} Guests`} 
                          size="small" 
                          variant="outlined" 
                          color={exceedsCapacity ? "error" : "default"}
                        />
                      </Stack>

                      {exceedsCapacity && (
                        <Typography variant="caption" color="error" fontWeight={700} display="block" mb={2}>
                          ⚠ Capacity exceeded
                        </Typography>
                      )}

                      <Button
                        variant={isSelected ? "contained" : "outlined"}
                        fullWidth
                        disableElevation
                        disabled={exceedsCapacity}
                        sx={{ 
                          mt: 'auto',
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        {isSelected ? "Selected" : "Select This Room"}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Card>
  );
}