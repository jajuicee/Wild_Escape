import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  IconButton, 
  Card, 
  CardContent, 
  CardActions,
  Container,
  Avatar,
  Paper,
  Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import EventBusyIcon from "@mui/icons-material/EventBusy";

import ownerService from "../../api/ownerService";
import HotelFormModal from "../../components/admin/HotelFormModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { toast } from "react-toastify";

export default function OwnerHotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { loadHotels(); }, []);

  const loadHotels = async () => {
    setLoading(true);
    try {
      const res = await ownerService.getMyHotels();
      setHotels(res.data);
    } catch (e) {
      toast.error("Failed to load hotels");
    }
    setLoading(false);
  };

  const handleCreate = () => { setEditing(null); setOpenForm(true); };
  const handleEdit = (hotel) => { setEditing(hotel); setOpenForm(true); };

  const submitHotel = async (payload) => {
    try {
      if (editing) {
        await ownerService.updateHotel(editing.id, payload);
        toast.success("Hotel updated");
      } else {
        await ownerService.createHotel(payload);
        toast.success("Hotel created");
      }
      await loadHotels();
    } catch (e) {
      toast.error("Save failed");
      throw e;
    }
  };

  const confirmDelete = (hotel) => { setToDelete(hotel); setConfirmOpen(true); };

  const doDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await ownerService.deleteHotel(toDelete.id);
      toast.success("Hotel deleted");
      setHotels((prev) => prev.filter((h) => h.id !== toDelete.id));
      setConfirmOpen(false);
      setToDelete(null);
    } catch (e) {
      toast.error("Delete failed");
    }
    setDeleting(false);
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
          onClick={handleCreate}
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
      {hotels.length === 0 && !loading ? (
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
          <EventBusyIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hotels listed yet
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Click "Add New Hotel" to get started.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {hotels.map((h) => (
            <Grid item xs={12} sm={6} md={4} key={h.id}>
              <Card 
                sx={{ 
                  width: 250,
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
                {/* Gradient Header */}
                <Box 
                  sx={{ 
                    height: 60, 
                    background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                    borderRadius: '16px 16px 0 0',
                    mb: 4
                  }}
                />

                <CardContent sx={{ pt: 0, px: 3, pb: 1 }}>
                  {/* Floating Icon */}
                  <Avatar 
                    sx={{ 
                      width: 56, 
                      height: 56, 
                      bgcolor: 'background.paper', 
                      color: 'primary.main',
                      boxShadow: 3,
                      marginTop: '-50px',
                      marginBottom: 1,
                      border: '4px solid',
                      borderColor: 'background.paper'
                    }}
                  >
                    <ApartmentIcon fontSize="large" />
                  </Avatar>

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {h.name}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={0.5} mb={2}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {h.city}, {h.country}
                    </Typography>
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
                    {h.description || "No description provided."}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                  <Tooltip title="Edit Hotel">
                    <IconButton 
                      onClick={() => handleEdit(h)} 
                      color="primary"
                      sx={{ bgcolor: 'primary.50', '&:hover': { bgcolor: 'primary.100' } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Hotel">
                    <IconButton 
                      onClick={() => confirmDelete(h)} 
                      color="error"
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

      <HotelFormModal
        open={openForm}
        initial={editing}
        onClose={() => setOpenForm(false)}
        onSubmit={submitHotel}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Hotel"
        message={`Delete "${toDelete?.name}"? This cannot be undone.`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={doDelete}
        loading={deleting}
      />
    </Container>
  );
}