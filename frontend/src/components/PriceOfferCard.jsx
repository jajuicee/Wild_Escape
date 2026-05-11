import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton,
  Stack,
} from "@mui/material";
import { Heart } from "lucide-react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WifiIcon from "@mui/icons-material/Wifi";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Single fallback image ONLY if DB doesn't provide one
const FALLBACK = "/images/rooms/default.jpg";

const PriceOfferCard = ({
  hotelName,
  roomType,
  pricePerNight,
  currency,
  description,
  city,
  imageUrl,
  amenities = [],
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Use backend URL OR fallback
  const resolveImage = (url) => {
    if (!url) return "/images/rooms/default.jpg";

    // If backend already returns absolute URL
    if (url.startsWith("http")) return url;

    // Default backend URL fallback
    return `https://wild-escape.onrender.com${url}`;
  };

  return (
    <Card
      elevation={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        width: 350,
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        bgcolor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
          transform: "translateY(-4px)",
        },
      }}
      onClick={onSelect}
    >
      {/* IMAGE */}
      <Box sx={{ position: "relative", height: 180, overflow: "hidden" }}>
        <CardMedia
          component="img"
          height="180"
          image={resolveImage(imageUrl)}
          alt={roomType}
          sx={{
            objectFit: "cover",
            transition: "transform 0.5s ease",
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
        />

        {/* Favorite */}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            bgcolor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            "&:hover": { bgcolor: "#f8fafc" },
          }}
        >
          <Heart
            size={18}
            color={isFavorite ? "red" : "#6b7280"}
            fill={isFavorite ? "red" : "none"}
          />
        </IconButton>
      </Box>

      <CardContent sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
          {hotelName}
        </Typography>

        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ color: "#374151", mb: 1 }}
        >
          {roomType}
        </Typography>

        {/* Location */}
        <Box display="flex" alignItems="center" gap={0.6} mb={1}>
          <LocationOnIcon sx={{ fontSize: 16, color: "#6b7280" }} />
          <Typography variant="caption" color="#6b7280">
            {city}, Philippines
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            height: 40,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {amenities.includes("wifi") && <WifiIcon fontSize="small" />}
          {amenities.includes("breakfast") && (
            <FreeBreakfastIcon fontSize="small" />
          )}
        </Stack>

        {/* PRICE */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: "auto" }}
        >
          <Box>
            <Typography variant="caption" color="#6b7280" display="block">
              Price per night
            </Typography>
            <Typography variant="h6" fontWeight={800} color="#111827">
              {currency || "₱"} {(pricePerNight ?? 0).toLocaleString()}
            </Typography>
          </Box>

          <Button
            variant="contained"
            endIcon={<ChevronRightIcon />}
            sx={{
              bgcolor: "#1976d2",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "8px",
              "&:hover": { bgcolor: "#0d5ca6" },
            }}
          >
            View Deal
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default React.memo(PriceOfferCard);
