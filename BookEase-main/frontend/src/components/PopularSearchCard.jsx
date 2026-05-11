import {
  Box,
  Typography,
  Card,
  CardMedia,
} from "@mui/material";
import React, { useState } from "react";


const PopularSearchCard = ({ city, hotels, avgPrice, imageUrl }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        height: 320,
        minWidth: 260,
        boxShadow: isHovered
          ? "0 12px 24px rgba(0,0,0,0.2)"
          : "0 4px 12px rgba(0,0,0,0.1)",
        border: "none",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
      }}
    >
      {/* Parallax-like Image Effect */}
      <Box sx={{ height: "100%", width: "100%", overflow: "hidden" }}>
        <CardMedia
          component="img"
          height="100%"
          image={imageUrl}
          alt={city}
          sx={{
            objectFit: "cover",
            transition: "transform 0.8s ease-out",
            transform: isHovered ? "scale(1.15)" : "scale(1)",
            filter: "brightness(0.9)",
          }}
        />
        {/* Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)",
            transition: "opacity 0.3s ease",
          }}
        />
      </Box>

      {/* Floating Content */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          p: 3,
          color: "white",
          zIndex: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            mb: 0.5,
            transform: isHovered ? "translateY(-4px)" : "translateY(0)",
            transition: "transform 0.3s ease",
          }}
        >
          {city}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: isHovered ? 1 : 0.9,
            transform: isHovered ? "translateY(-2px)" : "translateY(0)",
            transition: "all 0.3s ease 0.05s",
          }}
        >
          <Box>
            <Typography variant="body2" fontWeight={500} sx={{ opacity: 0.9 }}>
              {hotels.toLocaleString()} properties
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              px: 1.5,
              py: 0.5,
              borderRadius: "20px",
            }}
          >
            <Typography variant="subtitle2" fontWeight={700}>
              ₱{avgPrice.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default PopularSearchCard;