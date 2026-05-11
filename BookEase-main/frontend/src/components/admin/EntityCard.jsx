import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function EntityCard({ title, subtitle, children }) {
  return (
    <Card 
      elevation={0}
      sx={{ 
        mb: 2, 
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 8px 24px -4px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)"
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" mt={0.5} fontWeight={500}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        
        <Box sx={{ mt: 1 }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}