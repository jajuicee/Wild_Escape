import React from 'react'
import { Box, Typography } from "@mui/material";

function FeatureCards({ content }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 6,
          py: 5,
          borderRadius: 4,
          bgcolor: "white",
          color: "#333",
          boxShadow: 4,
          cursor: "default",
          transition: "transform 0.3s ease, boxShadow 0.3s ease",
          "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
          minWidth: 200,
          textAlign: "center",
        }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontFamily: "'Montserrat', sans-serif",
            }}
            >
            {content.title}
          </Typography>

          <Typography
            variant="body2"
              sx={{
              fontFamily: "'Roboto', sans-serif",
              color: "#555",
              lineHeight: 1.6,
          }}
          >
            {content.desc}
          </Typography>
      </Box>
    </>
  );
}

export default FeatureCards