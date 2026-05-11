import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Grid,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Fade,
  Paper,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  MapPin,
} from "lucide-react";
import React, { useState, useRef } from "react";
import PriceOfferCard from "../components/PriceOfferCard";
import PopularSearchCard from "../components/PopularSearchCard";
import CitySearchBar from "../components/CitySearchBar";
import dayjs from "dayjs";
import api from "../api/authInterceptor";

// --- Theme Colors ---
const THEME = {
  primary: "#2563eb",
  secondary: "#1e40af",
  text: "#0f172a",
  subText: "#64748b",
  border: "#e2e8f0",
  bg: "#ffffff",
  heroBg: "#f8fafc",
};

// --- Animations ---
const fadeUpStyle = {
  "@keyframes fadeUp": {
    "0%": {
      opacity: 0,
      transform: "translateY(20px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
};

// --- Main Component ---
const PriceOfferPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const scrollContainerRef = useRef(null);
  const [featuredOfferIndex, setFeaturedOfferIndex] = useState(0);
  const [city, setCity] = useState("Cebu");
  const [cityInput, setCityInput] = useState("Cebu");
  // eslint-disable-next-line no-unused-vars
  const [guests, setGuests] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [checkIn, setCheckIn] = useState(dayjs());
  // eslint-disable-next-line no-unused-vars
  const [checkOut, setCheckOut] = useState(dayjs().add(1, "day"));
  const [offers, setOffers] = useState([]);

  const loadOffers = async (searchCity) => {
    try {
      const rooms = await fetchPriceOffers(searchCity);
      setOffers(rooms);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPriceOffers = async (city) => {
    const res = await api.get("/api/hotels", { params: { city } });
    if (!res.data.length) return [];
    const hotelId = res.data[0].id;
    const roomsRes = await api.get(`/api/hotels/${hotelId}/rooms`);
    return roomsRes.data;
  };

  const popularCities = [
    {
      city: "Manila",
      hotels: 3199,
      avgPrice: 2957,
      imageUrl: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&q=80",
    },
    {
      city: "Cebu City",
      hotels: 1317,
      avgPrice: 3053,
      imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    },
    {
      city: "Makati",
      hotels: 666,
      avgPrice: 3759,
      imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
    },
    {
      city: "Boracay",
      hotels: 892,
      avgPrice: 5200,
      imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
    },
    {
      city: "El Nido",
      hotels: 567,
      avgPrice: 4800,
      imageUrl: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=600&q=80",
    },
    {
      city: "Subic",
      hotels: 290,
      avgPrice: 3500,
      imageUrl: "https://images.unsplash.com/photo-1534008897995-27a23e859048?w=800&q=80",
    },
    {
      city: "Zambales",
      hotels: 180,
      avgPrice: 2800,
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    },
  ];

  const ITEMS_PER_PAGE = 4;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  const handleFeaturedPrevious = () =>
    setFeaturedOfferIndex((prev) => Math.max(0, prev - ITEMS_PER_PAGE));
  const handleFeaturedNext = () =>
    setFeaturedOfferIndex((prev) =>
      Math.min(offers.length - ITEMS_PER_PAGE, prev + ITEMS_PER_PAGE)
    );

  const visibleOffers = offers.slice(
    featuredOfferIndex,
    featuredOfferIndex + ITEMS_PER_PAGE
  );

  const NavButton = ({ onClick, disabled, icon: Icon }) => (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      sx={{
        bgcolor: "white",
        border: `1px solid ${THEME.border}`,
        borderRadius: "50%",
        width: 44,
        height: 44,
        color: disabled ? "#cbd5e1" : THEME.text,
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: THEME.primary,
          color: "white",
          borderColor: THEME.primary,
          transform: "translateY(-2px)",
        },
        "&:disabled": {
          bgcolor: "#f1f5f9",
          borderColor: "transparent",
        },
      }}
    >
      <Icon size={20} />
    </IconButton>
  );

  return (
    <Box
      sx={{
        ...fadeUpStyle,
        minHeight: "100vh",
        bgcolor: THEME.bg,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* --- HERO SECTION --- */}
      <Box
        sx={{
          background: `linear-gradient(180deg, ${THEME.heroBg} 0%, #ffffff 100%)`,
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 10 },
          borderBottom: "1px solid",
          borderColor: "rgba(0,0,0,0.04)",
        }}
      >
        <Container maxWidth="xl">
          <Fade in={true} timeout={600}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                width: "100%",
              }}
            >
              {/* Badge */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                mb={3}
                sx={{
                  bgcolor: "rgba(37, 99, 235, 0.1)",
                  px: 2,
                  py: 0.8,
                  borderRadius: "100px",
                }}
              >
                <Sparkles size={16} color={THEME.primary} />
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="primary"
                  sx={{ letterSpacing: 1, textTransform: "uppercase" }}
                >
                  Plan Your Escape
                </Typography>
              </Stack>

              {/* Main Headline */}
              <Typography
                variant="h1"
                fontWeight={900}
                color={THEME.text}
                sx={{
                  fontSize: { xs: "2.5rem", md: "4.5rem" },
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  mb: 2,
                  maxWidth: "900px",
                }}
              >
                Unlock your next stay
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="h6"
                color={THEME.subText}
                fontWeight={400}
                mb={6}
                sx={{ maxWidth: 650, fontSize: "1.2rem", lineHeight: 1.6 }}
              >
                Discover exclusive deals and hidden gems across the Philippines.
                Updated daily for the best rates.
              </Typography>

              {/* SEARCH BAR CONTAINER */}
              <Paper
                elevation={0}
                sx={{
                  width: "100%",
                  maxWidth: "700px",
                  mx: "auto",
                  p: 0,
                  bgcolor: "transparent",
                  
                  // --- STYLE FIXES FOR ALIGNMENT AND COLOR ---
                  "& .MuiInputBase-root": {
                    alignItems: "center", // Vertically align input and button
                  },
                  "& .MuiInputBase-input": {
                     display: "flex",
                     alignItems: "center", // Ensures text sits in the middle
                     height: "100%",
                  },
                  "& .MuiButton-root": {
                    backgroundColor: `${THEME.primary} !important`,
                    fontWeight: "700 !important",
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                    // Ensure button doesn't have weird margins offsetting it
                    my: 0,
                    "&:hover": {
                      backgroundColor: "#1d4ed8 !important",
                    },
                  },
                }}
              >
                <CitySearchBar
                  cityInput={cityInput}
                  setCityInput={setCityInput}
                  onSearch={() => {
                    setCity(cityInput);
                    loadOffers(cityInput);
                  }}
                />
              </Paper>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* --- MAIN CONTENT AREA --- */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        {/* Popular Destinations Section */}
        <Box sx={{ mb: 10 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "flex-end" }}
            spacing={4}
            mb={5}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                color={THEME.text}
                sx={{ letterSpacing: "-0.02em" }}
              >
                Popular Destinations
              </Typography>
              <Typography variant="body1" color={THEME.subText} mt={1}>
                Trending locations travellers are booking right now
              </Typography>
            </Box>

            <Tabs
              value={tabValue}
              onChange={(e, v) => setTabValue(v)}
              sx={{
                minHeight: "unset",
                "& .MuiTabs-indicator": { display: "none" },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  minHeight: 40,
                  px: 2.5,
                  mr: 1,
                  borderRadius: "8px",
                  color: THEME.subText,
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.03)",
                    color: THEME.text,
                  },
                  "&.Mui-selected": {
                    color: "white",
                    bgcolor: THEME.text,
                  },
                },
              }}
            >
              <Tab label="All Cities" disableRipple />
              <Tab
                label="Beaches"
                disableRipple
                icon={<Sparkles size={14} />}
                iconPosition="start"
              />
              <Tab
                label="Mountains"
                disableRipple
                icon={<MapPin size={14} />}
                iconPosition="start"
              />
            </Tabs>
          </Stack>

          <Box sx={{ position: "relative" }}>
            <Box
              ref={scrollContainerRef}
              sx={{
                display: "flex",
                gap: 3,
                overflowX: "auto",
                pb: 4,
                px: 1,
                scrollSnapType: "x mandatory",
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
              }}
            >
              {popularCities.map((city, index) => (
                <Box
                  key={index}
                  sx={{
                    scrollSnapAlign: "start",
                    flexShrink: 0,
                    width: { xs: "80%", sm: "40%", md: "28%", lg: "22%" },
                    cursor: "pointer",

                    // --- STAGGERED FADE UP ANIMATION ---
                    opacity: 0, 
                    animation: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                    animationDelay: `${index * 0.1}s`, 

                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                    },
                  }}
                >
                  <PopularSearchCard {...city} />
                </Box>
              ))}
            </Box>

            {/* Navigation Arrows */}
            <Box
              sx={{
                position: "absolute",
                top: "40%",
                left: -20,
                display: { xs: "none", xl: "block" },
              }}
            >
              <NavButton onClick={scrollLeft} icon={ChevronLeft} />
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: "40%",
                right: -20,
                display: { xs: "none", xl: "block" },
              }}
            >
              <NavButton onClick={scrollRight} icon={ChevronRight} />
            </Box>
          </Box>
        </Box>

        <Divider
          sx={{ mb: 10, borderColor: THEME.border, borderStyle: "dashed" }}
        />

        {/* Featured Offers Grid */}
        <Box sx={{ mb: 8 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={6}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                color={THEME.text}
                sx={{ letterSpacing: "-0.02em" }}
              >
                Flash Deals
              </Typography>
              <Typography variant="body1" color={THEME.subText} mt={1}>
                Limited time offers ending soon
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <NavButton
                onClick={handleFeaturedPrevious}
                disabled={featuredOfferIndex === 0}
                icon={ChevronLeft}
              />
              <NavButton
                onClick={handleFeaturedNext}
                disabled={featuredOfferIndex >= offers.length - ITEMS_PER_PAGE}
                icon={ChevronRight}
              />
            </Stack>
          </Stack>

          <Grid container spacing={4}>
            {visibleOffers.map((room, index) => (
              <Grid item xs={12} sm={6} md={3} key={room.id}>
                <Box
                  sx={{
                    height: "100%",

                    // --- STAGGERED FADE UP ANIMATION ---
                    opacity: 0, 
                    animation: "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                    animationDelay: `${index * 0.1}s`,

                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                    },
                  }}
                >
                  <PriceOfferCard
                    hotelName={room.hotelName}
                    roomType={room.roomType}
                    description={room.description}
                    pricePerNight={room.pricePerNight}
                    currency={room.currency ?? "₱"}
                    city={city}
                    imageUrl={room.imageUrl}
                    amenities={room.amenities ?? []}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default PriceOfferPage;