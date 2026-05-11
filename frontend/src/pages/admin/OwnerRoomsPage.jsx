import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Container,
  Paper,
  Avatar,
  Chip,
  Tooltip,
  Divider
} from "@mui/material";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import BedroomParentIcon from "@mui/icons-material/BedroomParent";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PeopleIcon from "@mui/icons-material/People";
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

import ownerService from "../../api/ownerService";
import RoomFormModal from "../../components/admin/RoomFormModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { toast } from "react-toastify";

export default function OwnerRoomsPage() {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [rooms, setRooms] = useState([]);

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load Hotels
  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      const res = await ownerService.getMyHotels();
      const hotelList = res.data || [];

      setHotels(hotelList);

      if (hotelList.length > 0) {
        setSelectedHotel(hotelList[0].id);
        loadRooms(hotelList[0].id);
      }
    } catch (e) {
      toast.error("Failed to load hotels");
    }
  };

  // Load Rooms
  const loadRooms = async (hotelId) => {
    try {
      const res = await ownerService.getMyRooms();
      setRooms(res.data.filter((r) => r.hotelId === hotelId));
    } catch (e) {
      toast.error("Failed to load rooms");
    }
  };

  // Change hotel
  const handleHotelChange = (e) => {
    const id = e.target.value;
    setSelectedHotel(id);
    loadRooms(id);
  };

  // Create Room
  const handleCreate = () => {
    setEditing(null);
    setOpenForm(true);
  };

  // Edit Room
  const handleEdit = (room) => {
    setEditing(room);
    setOpenForm(true);
  };

  const submitRoom = async (hotelId, payload) => {
    try {
      if (editing) {
        await ownerService.updateRoom(editing.id, payload);
        toast.success("Room updated");
      } else {
        await ownerService.createRoom(hotelId, payload);
        toast.success("Room created");
      }

      loadRooms(hotelId);
    } catch (e) {
      toast.error("Failed to save room");
      throw e;
    }
  };

  const confirmDelete = (room) => {
    setToDelete(room);
    setConfirmOpen(true);
  };

  const doDelete = async () => {
    if (!toDelete) return;

    setDeleting(true);
    try {
      await ownerService.deleteRoom(toDelete.id);
      toast.success("Room deleted");

      setRooms((prev) => prev.filter((r) => r.id !== toDelete.id));

      setConfirmOpen(false);
    } catch (e) {
      toast.error("Failed to delete");
    }
    setDeleting(false);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Box 
          sx={{ 
            bgcolor: 'primary.dark', 
            color: 'white', 
            p: 1.5, 
            borderRadius: 3, 
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
            Manage inventory, photos, and capacity
          </Typography>
        </Box>
      </Box>

      {/* Toolbar */}
      <Paper 
        elevation={0} 
        variant="outlined" 
        sx={{ p: 2.5, mb: 4, borderRadius: 3, bgcolor: 'background.paper' }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 40, height: 40 }} variant="rounded">
                <ApartmentIcon fontSize="small" />
              </Avatar>
              <FormControl fullWidth size="small" sx={{ maxWidth: 300 }}>
                <InputLabel>Filter by Hotel</InputLabel>
                <Select
                  value={selectedHotel}
                  label="Filter by Hotel"
                  onChange={handleHotelChange}
                >
                  {hotels.length === 0 ? (
                    <MenuItem disabled>No hotels available</MenuItem>
                  ) : (
                    hotels.map((h) => (
                      <MenuItem key={h.id} value={h.id}>
                        {h.name} — {h.city}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
             <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleCreate}
                disabled={!selectedHotel}
                sx={{ borderRadius: 2, px: 3, fontWeight: 'bold' }}
             >
                Add Room
             </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Rooms Grid */}
      {rooms.length === 0 ? (
        <Paper 
          sx={{ 
            p: 8, 
            textAlign: 'center', 
            borderRadius: 4, 
            width: 320,
            bgcolor: 'background.default',
            border: '1px dashed',
            borderColor: 'divider'
          }}
          elevation={0}
        >
          <MeetingRoomIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No rooms found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {hotels.length === 0 
              ? "Add a hotel first to start managing rooms." 
              : "This hotel has no rooms yet. Click 'Add Room' to create one."}
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
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 8
                  }
                }}
              >
                {/* Room Image or Placeholder */}
                {room.imageUrl ? (
                  <CardMedia
                    component="img"
                    height="180"
                    image={`https://wild-escape.onrender.com${room.imageUrl}`}
                    alt={room.roomType}
                  />
                ) : (
                  <Box 
                    sx={{ 
                      height: 180, 
                      bgcolor: 'grey.100', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'text.disabled'
                    }}
                  >
                    <ImageNotSupportedIcon fontSize="large" />
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Typography variant="h6" fontWeight="bold">
                      {room.roomType}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Chip 
                      icon={<PeopleIcon fontSize="small" />} 
                      label={`Capacity: ${room.capacity}`} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>

                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      minHeight: 40,
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                    }}
                  >
                    {room.description || "No description provided."}
                  </Typography>
                </CardContent>

                <Divider />

                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Tooltip title="Edit Room">
                    <IconButton 
                      onClick={() => handleEdit(room)} 
                      color="primary"
                      size="small"
                      sx={{ bgcolor: 'primary.50', '&:hover': { bgcolor: 'primary.100' } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Room">
                    <IconButton 
                      onClick={() => confirmDelete(room)} 
                      color="error"
                      size="small"
                      sx={{ bgcolor: 'error.50', '&:hover': { bgcolor: 'error.100' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modals & Dialogs */}
      <RoomFormModal
        open={openForm}
        initial={editing}
        hotelId={selectedHotel}
        onClose={() => setOpenForm(false)}
        onSubmit={submitRoom}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Room"
        message={`Delete room "${toDelete?.roomType}"? This action cannot be undone.`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={doDelete}
        loading={deleting}
      />
    </Container>
  );
}