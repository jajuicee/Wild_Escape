import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import backgroundImage from "../assets/hero.jpg";

const HeroSection = () => {
  const phrases = ["Booking Made Easy", "Travel Made Smarter", "Trips Made Fun"];
  const [currentText, setCurrentText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentText(phrases[currentPhraseIndex].substring(0, charIndex + 1));

      if (charIndex + 1 === phrases[currentPhraseIndex].length) {
        setTimeout(() => {
          setCharIndex(0);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 1500);
      } else {
        setCharIndex(charIndex + 1);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [charIndex, currentPhraseIndex, phrases]);

  return (
    <Box
      sx={{
        width: "100vw",
         maxWidth: "100%",  
         height: "65vh", 
        minHeight: "500px",
        lineHeight: "1.5rem",
        overflow: "hidden",
        overflowX: "hidden", 
        position: "relative",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        pb: { xs: 4, md: 6 }, 
      }}
    >
      {/* Dark overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.45)",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 650,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            mb: 1,
            fontStyle: "italic",
            fontFamily: "'Roboto', sans-serif",
            letterSpacing: 1,
            fontWeight: 400,
          }}
        >
          Your Journey, Just One Click Away.
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 3,
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          {currentText}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: { xs: "1rem", md: "1.125rem" },
            lineHeight: 1.7,
            color: "#f0f0f0",
          }}
        >
          Explore amazing destinations with ease and plan your next trip with confidence.
        </Typography>
      </Box>
    </Box>
  );
};

export default HeroSection;
