import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";

export default function PlaceholderTab({ activeTab }) {
  return (
    <Card sx={{ p: 4, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
      <CardContent>
        <Box textAlign="center" py={5}>
          <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>
            {activeTab === "checkin" ? "Online Check-In" : "Booking Status"}
          </Typography>
          <Typography color="text.secondary">
            {activeTab === "checkin"
              ? "This feature is currently under development. Please check-in at the hotel front desk."
              : "Enter your booking reference number above to check your reservation status."}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
