import { useEffect, useState } from "react";
import { 
  Box, 
  Button, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Container, 
  Avatar,
  Chip,
  Paper
} from "@mui/material";
import ownerService from "../../api/ownerService";

// Icons
import AddIcon from '@mui/icons-material/Add';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';

export default function AdminHotels() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    const res = await ownerService.getMyHotels();
    setHotels(res.data);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4}
        flexWrap="wrap"
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box 
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white', 
              p: 1.5, 
              borderRadius: 3, 
              display: 'flex',
              boxShadow: 3
            }}
          >
            <BusinessIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800} color="text.primary">
              My Hotels
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your properties and locations
            </Typography>
          </Box>
        </Box>

        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          size="large"
          sx={{ 
            borderRadius: 2, 
            px: 3, 
            fontWeight: 'bold',
            textTransform: 'none',
            boxShadow: 4
          }}
        >
          Add New Hotel
        </Button>
      </Box>

      {/* Content Grid */}
      {hotels.length === 0 ? (
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
          <ApartmentIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hotels listed yet
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Click the button above to add your first property.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {hotels.map((hotel) => (
            <Grid item xs={12} sm={6} md={4} key={hotel.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  borderRadius: 4, 
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 10
                  }
                }}
              >
                {/* Decorative Gradient Header */}
                <Box 
                  sx={{ 
                    height: 80, 
                    background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                    borderRadius: '16px 16px 0 0',
                    mb: 3
                  }}
                />

                <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
                  {/* Floating Icon */}
                  <Avatar 
                    sx={{ 
                      width: 64, 
                      height: 64, 
                      bgcolor: 'background.paper', 
                      color: 'primary.main',
                      boxShadow: 3,
                      marginTop: '-48px',
                      marginBottom: 2,
                      border: '4px solid',
                      borderColor: 'background.paper'
                    }}
                  >
                    <ApartmentIcon fontSize="large" />
                  </Avatar>

                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {hotel.name}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {hotel.city}, {hotel.country}
                    </Typography>
                  </Box>

                  <Box display="flex" gap={1} mt={2}>
                    <Chip 
                      label="Active" 
                      size="small" 
                      color="success" 
                      variant="outlined" 
                      sx={{ fontWeight: 'bold' }} 
                    />
                    {/* Placeholder for future tags/features */}
                    <Chip 
                      label="Verified" 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                      sx={{ fontWeight: 'bold' }} 
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