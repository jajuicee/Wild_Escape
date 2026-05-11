import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import heroImage from "../assets/temple.jpg"; // Make sure the path is correct

const BookingHeader = ({ scrollToBooking }) => {
  const [offsetY, setOffsetY] = useState(0);

  // Handle scroll event to update position
  const handleScroll = () => {
    setOffsetY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // Cleanup listener on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "60vh", md: "70vh" },
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        overflow: "hidden", // Crucial: hides the image overflowing when translated
      }}
      role="banner"
    >
      {/* Background Image + Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "110%", // Increased height to prevent gaps during scroll
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          // Parallax Logic: Move the background down at half the speed of the scroll
          transform: `translateY(${offsetY * 0.5}px)`, 
          zIndex: 0,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          textAlign: "center",
          zIndex: 1,
          px: { xs: 2, md: 3 },
          maxWidth: "800px",
          // Optional: Add a subtle reverse parallax to text (fades/moves up faster)
          transform: `translateY(${offsetY * -0.1}px)`,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
            mb: 2,
            lineHeight: 1.2,
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            "&:hover": { transform: "scale(1.02)", transition: "transform 0.3s ease" },
          }}
          aria-label="Book Your Stay - Main Heading"
        >
          Book Your <span style={{ color: "#3b82f6" }}>Stay</span>
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 500,
            color: "rgba(255,255,255,0.9)",
            mb: 4,
            lineHeight: 1.5,
            fontSize: { xs: "1.1rem", md: "1.5rem" },
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
          }}
          aria-label="Discover the best hotels worldwide"
        >
          Discover the best hotels, resorts, and suites worldwide — all in one place.
        </Typography>
      </Box>
    </Box>
  );
};

export default BookingHeader;