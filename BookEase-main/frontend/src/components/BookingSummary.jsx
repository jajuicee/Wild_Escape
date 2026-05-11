import React from "react";
import { 
  Box, 
  Card, 
  Typography, 
  Button, 
  Divider, 
  Alert, 
  Stack,
  Chip 
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  CalendarDays, 
  Users, 
  Moon, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function BookingSummary({
  bookingPreview,
  confirmedBooking,
  onConfirm,
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // STICKY CARD STYLES
  const cardStyles = {
    p: 3,
    borderRadius: 4,
    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
    border: "1px solid",
    borderColor: "divider",
    width: 350,
    maxWidth: "100%",
    position: "sticky",
    top: { xs: "86px", md: "106px" },
    alignSelf: "flex-start",
    zIndex: 1,
    bgcolor: "background.paper"
  };

  // If nothing selected yet
  if (!bookingPreview && !confirmedBooking) {
    return (
      <Card sx={cardStyles} elevation={0}>
        <Typography variant="h6" fontWeight={800} textAlign="center" gutterBottom>
          Your Trip Summary
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            py={4}
            color="text.secondary"
        >
           <CalendarDays size={40} opacity={0.3} style={{ marginBottom: 16 }} />
           <Typography textAlign="center" fontWeight={500}>
             Select a room to see pricing
           </Typography>
        </Box>
      </Card>
    );
  }

  // Active display (confirmed > preview)
  const activeData = confirmedBooking || bookingPreview;

  const safePrice = activeData.estimatedPrice
    ? activeData.estimatedPrice.toLocaleString()
    : "0";

  return (
    <Card sx={cardStyles} elevation={0}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="h6" fontWeight={800}>
          Trip Summary
        </Typography>
        {confirmedBooking && (
             <Chip 
                label="Confirmed" 
                size="small" 
                color="success" 
                icon={<CheckCircle size={14} />} 
                sx={{ fontWeight: 600 }}
             />
        )}
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* HOTEL & ROOM INFO */}
      <Box mb={3}>
        {activeData.hotelName && (
            <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom textTransform="uppercase" fontSize="0.75rem">
            Hotel
            </Typography>
        )}
        {activeData.hotelName && (
            <Typography variant="body1" fontWeight={700} gutterBottom>
            {activeData.hotelName}
            </Typography>
        )}
        
        <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom textTransform="uppercase" fontSize="0.75rem" mt={2}>
          Room Type
        </Typography>
        <Typography variant="body1" fontWeight={600} color="primary.main">
            {activeData.roomType} Room
        </Typography>
      </Box>

      {/* DETAILS GRID */}
      <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
         <Stack spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
                <CalendarDays size={16} color="#64748b" />
                <Typography variant="body2" color="text.secondary">
                    {activeData.checkInDate} — {activeData.checkOutDate}
                </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1.5}>
                <Moon size={16} color="#64748b" />
                <Typography variant="body2" color="text.secondary">
                    {activeData.nights} Night{activeData.nights > 1 ? 's' : ''} stay
                </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1.5}>
                <Users size={16} color="#64748b" />
                <Typography variant="body2" color="text.secondary">
                    {activeData.guests} Guest{activeData.guests > 1 ? 's' : ''}
                </Typography>
            </Stack>
         </Stack>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* PRICE TOTAL */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" mb={3}>
         <Typography variant="body1" fontWeight={600} color="text.secondary">
            Total Price
         </Typography>
         <Typography variant="h5" fontWeight={800} color="primary.dark">
            ₱{safePrice}
         </Typography>
      </Stack>

      {/* ACTIONS */}
      {!confirmedBooking && (
        <>
          {!isAuthenticated && (
            <Alert 
                severity="warning" 
                icon={<AlertCircle size={20} />}
                sx={{ mb: 2, borderRadius: 2 }}
            >
              Log in to complete booking
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            fullWidth
            disableElevation
            disabled={!isAuthenticated}
            onClick={onConfirm}
            sx={{ 
                py: 1.5, 
                fontWeight: 700, 
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem'
            }}
          >
            Confirm & Pay
          </Button>

          {!isAuthenticated && (
            <Button
              variant="text"
              fullWidth
              sx={{ mt: 1, textTransform: 'none', fontWeight: 600 }}
              onClick={() => navigate("/login")}
            >
              Sign in to continue →
            </Button>
          )}
        </>
      )}
    </Card>
  );
}