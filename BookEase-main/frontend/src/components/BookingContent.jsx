import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  Snackbar,
  Alert,
  Fade,
  Container,
  Paper,
} from "@mui/material";
import {
  NavigateNext,
  Home,
  Hotel,
  CreditCard,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";

import TabsNavigation from "./TabsNavigation";
import BookingForm from "./BookingForm";
import BookingSummary from "./BookingSummary";
import PlaceholderTab from "./PlaceholderTab";
import BookingStatusTab from "./BookingStatusTab";

import api from "../api/authInterceptor";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function BookingContent() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [guests, setGuests] = useState(1);
  const [hotelId, setHotelId] = useState(null);

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const [availableRooms, setAvailableRooms] = useState([]);
  const [bookingPreview, setBookingPreview] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [removedRooms, setRemovedRooms] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") === "status" ? "status" : "book"
  );

  // ============================================================
  // AUTO-CLEAR SELECTED ROOM IF GUESTS EXCEED CAPACITY
  // ============================================================
  useEffect(() => {
    if (selectedRoom && guests > selectedRoom.capacity) {
      setSelectedRoom(null);
      setBookingPreview(null);
    }
  }, [guests]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/booking?tab=${tabId}`);
  };

  // ============================================================
  // CALCULATE NIGHTS
  // ============================================================
  const nights =
    checkIn && checkOut ? dayjs(checkOut).diff(dayjs(checkIn), "day") : 0;

  // ============================================================
  // SEARCH HOTELS + ROOMS
  // ============================================================
  const fetchHotelsByCity = async (cityName) => {
    const res = await api.get("/api/hotels", { params: { city: cityName } });
    return res.data;
  };

  const fetchAvailableRooms = async (hotelId, checkIn, checkOut, guests) => {
    const res = await api.get(`/api/hotels/${hotelId}/rooms/available`, {
      params: {
        checkIn: checkIn.format("YYYY-MM-DD"),
        checkOut: checkOut.format("YYYY-MM-DD"),
        guests,
      },
    });
    return res.data;
  };

  const handleSearch = async () => {
    setError("");
    setBookingPreview(null);
    setSelectedRoom(null);
    setAvailableRooms([]);

    if (!city) return setError("Please select a city.");
    if (!checkIn || !checkOut) return setError("Please select valid dates.");

    setLoading(true);

    try {
      const hotels = await fetchHotelsByCity(city);

      if (hotels.length === 0) {
        setError("No hotels found in this city.");
        setLoading(false);
        return;
      }

      const selectedHotel = hotels[0];
      setHotelId(selectedHotel.id);

      const rooms = await fetchAvailableRooms(
        selectedHotel.id,
        checkIn,
        checkOut,
        guests
      );

      setAvailableRooms(rooms);

      if (rooms.length === 0) {
        setError("No rooms available for the selected dates.");
      }
    } catch (err) {
      console.error(err);
      setError("Search failed. Please try again.");
    }

    setLoading(false);
  };

  // ============================================================
  // ROOM SELECTED → BUILD BOOKING PREVIEW
  // ============================================================
  const handleSelectRoom = (room) => {
    if (nights <= 0) return setError("Invalid date range.");
    if (guests > room.capacity)
      return toast.error("Guests exceed room capacity!");

    setSelectedRoom(room);

    setBookingPreview({
      roomId: room.id,
      hotelId,
      hotelName: room.hotelName,
      city,
      roomType: room.roomType,
      pricePerNight: room.pricePerNight,
      guests,
      nights,
      estimatedPrice: room.pricePerNight * nights,

      checkInDateISO: checkIn.format("YYYY-MM-DD"),
      checkOutDateISO: checkOut.format("YYYY-MM-DD"),

      checkInDate: checkIn.format("MMM DD, YYYY"),
      checkOutDate: checkOut.format("MMM DD, YYYY"),
    });
  };

  // ============================================================
  // CONFIRM BOOKING
  // ============================================================
  const handleConfirmBooking = async () => {
    if (!bookingPreview) return;

    if (!isAuthenticated) {
      toast.error("Please log in to complete your booking.");
      navigate("/login");
      return;
    }

    try {
      await api.post("/api/bookings", {
        roomId: bookingPreview.roomId,
        checkInDate: bookingPreview.checkInDateISO,
        checkOutDate: bookingPreview.checkOutDateISO,
        guests: bookingPreview.guests,
      });

      // ✅ REMOVE BOOKED ROOM FROM AVAILABLE ROOMS
      setAvailableRooms((prevRooms) =>
        prevRooms.filter((room) => room.id !== bookingPreview.roomId)
      );

      setRemovedRooms((prev) => ({
        ...prev,
        [bookingPreview.roomId]: selectedRoom,
      }));

      // ✅ CLEAR SELECTION + PREVIEW
      setBookingPreview(null);
      setSelectedRoom(null);

      setSuccessOpen(true);
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data || "Booking failed.");
    }
  };

  const handleCloseSnackbar = () => setSuccessOpen(false);

  const tabs = [
    { id: "book", text: "Reserve a Room", icon: <Hotel /> },
    { id: "status", text: "My Bookings", icon: <CreditCard /> },
  ];

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box 
        sx={{ 
          minHeight: "100vh", 
          // Clean, professional, subtle grey gradient
          background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
          pt: 8, 
          pb: 12,
        }}
      >
        {/* Main Content Container */}
        <Container maxWidth="lg">
          
          {/* Professional Clean Card Wrapper */}
          <Paper
            elevation={0}
            sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                bgcolor: '#ffffff', // Solid white
                border: '1px solid',
                borderColor: 'divider',
                // Refined, professional shadow
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
              {/* HEADER SECTION */}
              <Box mb={6}>
                <Breadcrumbs
                  separator={<NavigateNext fontSize="small" sx={{ opacity: 0.6 }} />}
                  sx={{ mb: 3 }}
                >
                  <Link 
                    href="/" 
                    underline="hover" 
                    color="inherit" 
                    sx={{ display: 'flex', alignItems: 'center', opacity: 0.8, '&:hover': { opacity: 1 } }}
                  >
                    <Home sx={{ mr: 0.5, fontSize: 18 }} /> Home
                  </Link>
                  <Typography color="text.primary" fontWeight={600}>
                    {activeTab === 'book' ? 'Reservations' : 'Manage Bookings'}
                  </Typography>
                </Breadcrumbs>

                <Box textAlign="center" mb={5}>
                    <Typography variant="h3" fontWeight={800} color="text.primary" gutterBottom sx={{ letterSpacing: '-0.02em' }}>
                    {activeTab === 'book' ? 'Find Your Perfect Stay' : 'Your Trip Status'}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
                    {activeTab === 'book' 
                        ? 'Discover luxury and comfort at exclusive rates across top-rated destinations.'
                        : 'Track your upcoming trips and manage your reservation details below.'
                    }
                    </Typography>
                </Box>
              </Box>

              {/* TABS */}
              <Box mb={8} sx={{ display: 'flex', justifyContent: 'center' }}>
                 <TabsNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={handleTabChange}
                 />
              </Box>

              {/* MAIN CONTENT FADE IN */}
              <Fade in={true} timeout={600}>
                <Grid container spacing={6} justifyContent="center">
                    {activeTab === "book" && (
                    <>
                        <Grid item xs={12} lg={7}>
                        <BookingForm
                            city={city}
                            setCity={setCity}
                            hotelId={hotelId}
                            setHotelId={setHotelId}
                            checkIn={checkIn}
                            setCheckIn={setCheckIn}
                            checkOut={checkOut}
                            setCheckOut={setCheckOut}
                            guests={guests}
                            setGuests={setGuests}
                            availableRooms={availableRooms}
                            loading={loading}
                            error={error}
                            handleSearch={handleSearch}
                            onSelectRoom={handleSelectRoom}
                            selectedRoom={selectedRoom}
                            setSelectedRoom={setSelectedRoom}
                        />
                        </Grid>

                        <Grid item xs={12} lg={5}>
                        <BookingSummary
                            bookingPreview={bookingPreview}
                            onConfirm={handleConfirmBooking}
                        />
                        </Grid>
                    </>
                    )}

                    {activeTab === "status" && (
                    <Grid item xs={12}>
                        <BookingStatusTab
                        onBookingCancelled={(cancelledBooking) => {
                            const restoredRoom = removedRooms[cancelledBooking.roomId];
                            if (!restoredRoom) return;

                            setAvailableRooms((prev) => [...prev, restoredRoom]);
                        }}
                        />
                    </Grid>
                    )}

                    {activeTab === "checkin" && (
                    <Grid item xs={12}>
                        <PlaceholderTab activeTab={activeTab} />
                    </Grid>
                    )}
                </Grid>
              </Fade>
          </Paper>

          <Snackbar
            open={successOpen}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              severity="success"
              variant="filled"
              onClose={handleCloseSnackbar}
              sx={{ 
                  borderRadius: 2, 
                  fontWeight: 600,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }}
            >
              Booking successfully confirmed!
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </LocalizationProvider>
  );
}