import { useState, useEffect } from "react";
import { Box, Avatar, Typography, Button, Chip, Stack } from "@mui/material";
import { User, Edit, ShieldCheck, Sparkles } from "lucide-react";

const ProfileHeader = ({ user, onEdit }) => {
  const [scrollY, setScrollY] = useState(0);

  // Scroll Listener for subtle parallax
  useEffect(() => {
    const handleScroll = () => requestAnimationFrame(() => setScrollY(window.scrollY));
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 4,
        overflow: "hidden",
        // Professional Gradient: Deep Blue to Vivid Blue
        background: `linear-gradient(${135 + scrollY * 0.02}deg, #1e3a8a 0%, #2563eb 100%)`,
        boxShadow: "0 20px 40px -10px rgba(37, 99, 235, 0.4)", // Deep blue shadow
        p: { xs: 4, md: 5 },
        transition: "background 0.3s ease",
        color: "white",
      }}
    >
      {/* --- PARALLAX BACKGROUND SHAPES (Subtle) --- */}
      <Box
        sx={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 250,
          height: 250,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.05)",
          bgcolor: "rgba(255,255,255,0.02)",
          transform: `translateY(${scrollY * 0.15}px)`, // Moves slightly
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -40,
          left: -20,
          width: 180,
          height: 180,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.03)",
          filter: "blur(40px)",
          transform: `translateY(${scrollY * 0.08}px)`,
          zIndex: 0,
        }}
      />

      {/* --- CONTENT LAYOUT --- */}
      <Stack
        direction={{ xs: "column", md: "row" }} // Stack on mobile, Row on desktop
        alignItems="center"
        justifyContent="space-between"
        spacing={{ xs: 3, md: 4 }}
        position="relative"
        zIndex={1}
      >
        
        {/* 1. LEFT: AVATAR (Parallax Scale) */}
        <Box
          sx={{
            position: "relative",
            transform: `scale(${Math.max(1 - scrollY * 0.0005, 0.9)})`, // Gentle shrink on scroll
            transition: "transform 0.1s ease-out",
          }}
        >
          <Avatar
            sx={{
              width: { xs: 100, md: 110 },
              height: { xs: 100, md: 110 },
              bgcolor: "rgba(255, 255, 255, 0.95)",
              color: "#2563eb",
              border: "4px solid rgba(255,255,255,0.3)", // Glass border
              boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
            }}
          >
            {user?.name ? (
              <Typography variant="h3" fontWeight={800} sx={{ color: "#2563eb" }}>
                {user.name.charAt(0).toUpperCase()}
              </Typography>
            ) : (
              <User size={48} />
            )}
          </Avatar>
          
          {/* Online Status Dot */}
          <Box
            sx={{
              position: "absolute",
              bottom: 6,
              right: 6,
              width: 22,
              height: 22,
              bgcolor: "#10b981", // Success Green
              border: "4px solid #1e40af", // Matches dark blue bg
              borderRadius: "50%",
            }}
          />
        </Box>

        {/* 2. CENTER: USER DETAILS */}
        <Box sx={{ flexGrow: 1, textAlign: { xs: "center", md: "left" } }}>
          <Stack 
            direction="row" 
            alignItems="center" 
            justifyContent={{ xs: "center", md: "flex-start" }} 
            spacing={1} 
            mb={0.5}
          >
            <Sparkles size={16} style={{ opacity: 0.7 }} />
            <Typography variant="overline" sx={{ fontWeight: 700, opacity: 0.8, letterSpacing: 1.2 }}>
              Welcome Back
            </Typography>
          </Stack>

          <Typography 
            variant="h3" 
            fontWeight={800} 
            sx={{ 
              mb: 0.5, 
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              textShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
          >
            {user?.name || "Guest User"}
          </Typography>

          <Typography variant="body1" sx={{ opacity: 0.7, mb: 2, fontWeight: 500 }}>
            {user?.email || "No email provided"}
          </Typography>

          {/* Badges Row */}
          <Stack 
            direction="row" 
            spacing={1} 
            justifyContent={{ xs: "center", md: "flex-start" }}
          >
            <Chip
              icon={<ShieldCheck size={14} color="white" />}
              label="Verified Member"
              size="small"
              sx={{
                height: 28,
                bgcolor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(4px)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
                fontWeight: 600,
                "& .MuiChip-icon": { color: "white" }
              }}
            />
          </Stack>
        </Box>

        {/* 3. RIGHT: ACTION BUTTON */}
        <Box>
          <Button
            startIcon={<Edit size={18} />}
            variant="contained"
            onClick={onEdit}
            sx={{
              bgcolor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px) saturate(180%)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              fontWeight: 700,
              textTransform: "none",
              fontSize: "0.95rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: "white",
                color: "#2563eb", // Primary Blue text on hover
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
              },
            }}
          >
            Edit Profile
          </Button>
        </Box>

      </Stack>
    </Box>
  );
};

export default ProfileHeader;