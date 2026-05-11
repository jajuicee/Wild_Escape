import { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia,
  Grid, 
  Container, 
  Paper,
  Chip,
  Divider
} from "@mui/material";
import ownerService from "../../api/ownerService";

// Icons
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import PeopleIcon from '@mui/icons-material/People';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LocalHotelIcon from '@mui/icons-material/LocalHotel';

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const res = await ownerService.getMyRooms();
    setRooms(res.data);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Box 
          sx={{ 
            bgcolor: 'primary.dark', 
            color: 'white', 
            p: 1.5, 
            borderRadius: 3, 
            display: 'flex',
            boxShadow: 3
          }}
        >
          <BedroomParentIcon fontSize="medium" />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            My Rooms
          </Typography>
          <Typography variant="body1" color="text.secondary">
             Manage room inventory and specifications
          </Typography>
        </Box>
      </Box>

      {rooms.length === 0 ? (
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
          <MeetingRoomIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No rooms added yet
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Start by adding rooms to your hotels.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  borderRadius: 4, 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 8
                  }
                }}
              >
                {/* Image or Placeholder Gradient */}
                {room.imageUrl ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`https://wild-escape.onrender.com${room.imageUrl}`}
                    alt={room.roomType}
                  />
                ) : (
                  <Box 
                    sx={{ 
                      height: 140, 
                      bgcolor: 'primary.light', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'primary.main',
                      opacity: 0.8
                    }}
                  >
                    <LocalHotelIcon sx={{ fontSize: 60, opacity: 0.5 }} />
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="h6" fontWeight="bold">
                      {room.roomType}
                    </Typography>
                  </Box>

                  {/* Description truncated if it exists */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                    {room.description 
                      ? (room.description.length > 80 ? room.description.substring(0, 80) + "..." : room.description)
                      : "No description provided."}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />

                  {/* Specifications */}
                  <Box display="flex" alignItems="center" gap={2}>
                     <Chip 
                        icon={<PeopleIcon />} 
                        label={`Capacity: ${room.capacity}`} 
                        size="small"
                        color="primary"
                        variant="soft" 
                        sx={{ fontWeight: 600 }}
                     />
                     <Chip 
                        label="Available" 
                        size="small"
                        color="success"
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