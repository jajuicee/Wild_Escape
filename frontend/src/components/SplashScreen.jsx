import React, { useState, useEffect } from "react";
import { Box, LinearProgress, Fade } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { Tent } from "lucide-react";

// --- 0. ANIMATION DEFINITIONS ---
const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.5; }
  100% { transform: scale(1); opacity: 0.3; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// --- BACKGROUND BLOB COMPONENT ---
const BackgroundBlob = styled(Box)(
  ({ color, top, left, right, bottom, delay }) => ({
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    filter: "blur(80px)",
    backgroundColor: color,
    top: top,
    left: left,
    right: right,
    bottom: bottom,
    animation: `${pulse} 4s infinite ease-in-out`,
    animationDelay: delay || "0s",
    zIndex: 0,
  })
);

// --- SPLASH SCREEN COMPONENT ---
const SplashScreen = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Fade in={visible} timeout={800} onExited={onFinish}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          bgcolor: "primary.main",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <BackgroundBlob color="#4dabf5" top="-10%" left="-10%" delay="0s" />
        <BackgroundBlob color="#00e5ff" bottom="-10%" right="-10%" delay="2s" />

        <Box sx={{ position: "relative", zIndex: 10, textAlign: "center" }}>
          <Box
            sx={{
              animation: `${float} 3s ease-in-out infinite`,
              display: "inline-flex",
              p: 2,
              bgcolor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: 4,
              mb: 3,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <Tent size={64} color="white" strokeWidth={1.5} />
          </Box>

          <Box
            component="h1"
            sx={{ color: "white", fontWeight: 800, fontSize: "2.5rem", mb: 1 }}
          >
            Wild{" "}
            <Box component="span" sx={{ color: "lightblue" }}>
              Escape
            </Box>
          </Box>

          <Box
            sx={{
              color: "rgba(255,255,255,0.8)",
              letterSpacing: 3,
              textTransform: "uppercase",
              mb: 4,
            }}
          >
            Your Journey Begins
          </Box>

          <Box sx={{ width: "200px", mt: 4, mx: "auto" }}>
            <LinearProgress
              variant="indeterminate"
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.2)",
                "& .MuiLinearProgress-bar": { backgroundColor: "white" },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};

export default SplashScreen;
