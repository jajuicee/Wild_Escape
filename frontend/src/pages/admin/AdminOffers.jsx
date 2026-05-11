import { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Container, 
  Paper,
  Avatar,
  Chip,
  Divider
} from "@mui/material";
import ownerService from "../../api/ownerService";

// Icons
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import SellIcon from '@mui/icons-material/Sell';

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    const res = await ownerService.getMyOffers();
    setOffers(res.data);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Box 
          sx={{ 
            bgcolor: 'secondary.main', 
            color: 'white', 
            p: 1.5, 
            borderRadius: 3, 
            display: 'flex',
            boxShadow: 3
          }}
        >
          <LocalOfferIcon fontSize="medium" />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Price Offers
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your room pricing and active deals
          </Typography>
        </Box>
      </Box>

      {offers.length === 0 ? (
        <Paper 
          sx={{ 
            p: 8, 
            textAlign: 'center', 
            borderRadius: 4, 
            bgcolor: 'background.default',
            border: '1px dashed',
            borderColor: 'divider'
          }}
          elevation={0}
        >
          <SellIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No active offers
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Create offers in your Room management settings.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {offers.map((offer) => (
            <Grid item xs={12} sm={6} md={3} key={offer.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  borderRadius: 4, 
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    borderColor: 'secondary.main'
                  }
                }}
                elevation={0}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  
                  {/* Icon Badge */}
                  <Avatar 
                    sx={{ 
                      bgcolor: 'secondary.light', 
                      color: 'secondary.main', 
                      width: 56, 
                      height: 56, 
                      margin: '0 auto',
                      mb: 2
                    }}
                  >
                    <PriceCheckIcon fontSize="large" />
                  </Avatar>

                  <Typography variant="overline" color="text.secondary" fontWeight="bold">
                    Rate Per Night
                  </Typography>

                  <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="baseline" 
                    mt={1} 
                    mb={2}
                  >
                    <Typography 
                      component="span" 
                      variant="h4" 
                      fontWeight="bold" 
                      color="text.primary"
                    >
                      {offer.currency === 'PHP' || offer.currency === '₱' ? '₱' : offer.currency}
                      {offer.pricePerNight?.toLocaleString()}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" justifyContent="center" gap={1}>
                    <Chip 
                      label="Active" 
                      size="small" 
                      color="success" 
                      variant="soft" 
                      sx={{ fontWeight: 'bold' }} 
                    />
                    <Chip 
                      icon={<AttachMoneyIcon fontSize="small" />}
                      label={offer.currency} 
                      size="small" 
                      variant="outlined" 
                    />
                  </Box>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}