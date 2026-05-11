import React from "react";
import { Grid, Card, Box, Typography } from "@mui/material";

const IconCards = ( {content} ) => {
  return (
    <>
      <Grid item xs={12}>
        <Card
          elevation={6}
          sx={{
            borderRadius: "24px",
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 3,
            transition: "transform 0.4s, box-shadow 0.4s",
            "&:hover": {
              transform: "translateY(-8px)", 
              boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
            },
          }}
        >
          <Box sx={{ color: "primary.main" }}>{content.icon}</Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              {content.title}
            </Typography>
            <Typography sx={{ color: "#475569" }}>{content.desc}</Typography>
          </Box>
        </Card>
      </Grid>
    </>
  );
};

export default IconCards;
