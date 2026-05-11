import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Container,
  Paper,
  Avatar,
  Tooltip,
  Divider,
  Chip
} from "@mui/material";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import SellIcon from "@mui/icons-material/Sell";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";

import ownerService from "../../api/ownerService";
import OfferFormModal from "../../components/admin/OfferFormModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { toast } from "react-toastify";

export default function OwnerOffersPage() {
  const [offers, setOffers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [openCreate, setOpenCreate] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [rRes, oRes] = await Promise.all([
        ownerService.getMyRooms(),
        ownerService.getMyOffers(),
      ]);
      setRooms(rRes.data);
      setOffers(oRes.data);
      if (rRes.data.length) setSelectedRoom(rRes.data[0].id);
    } catch (e) {
      toast.error("Failed to load offers/rooms");
    }
  };

  const openCreateModal = () => {
    if (!selectedRoom) return toast.error("Select a room first");
    setOpenCreate(true);
  };

  const handleSubmitOffer = async (roomId, payload) => {
    try {
      if (editing) {
        await ownerService.updateOffer(editing.id, payload);
        toast.success("Offer updated");
      } else {
        await ownerService.createOffer(roomId, payload);
        toast.success("Offer created");
      }

      await loadAll();
    } catch (e) {
      toast.error("Failed to save offer");
      throw e;
    }
  };

  const confirmDelete = (offer) => {
    setToDelete(offer);
    setConfirmOpen(true);
  };

  const doDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await ownerService.deleteOffer(toDelete.id);
      toast.success("Offer deleted");
      setOffers((prev) => prev.filter((o) => o.id !== toDelete.id));
      setConfirmOpen(false);
      setToDelete(null);
    } catch (e) {
      toast.error("Delete failed");
    }
    setDeleting(false);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Box 
          sx={{ 
            bgcolor: 'secondary.main', 
            color: 'white', 
            p: 1.5, 
            borderRadius: 3, 
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
            Manage pricing strategies and room rates
          </Typography>
        </Box>
      </Box>

      {/* Action Toolbar */}
      <Paper 
        elevation={0} 
        variant="outlined" 
        sx={{ p: 2.5, mb: 4, borderRadius: 3, bgcolor: 'background.paper' }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main', width: 40, height: 40 }} variant="rounded">
                <MeetingRoomIcon fontSize="small" />
              </Avatar>
              <FormControl fullWidth size="small" sx={{ maxWidth: 400 }}>
                <InputLabel>Select Room to Add Offer</InputLabel>
                <Select
                  value={selectedRoom ?? ""}
                  label="Select Room to Add Offer"
                  onChange={(e) => setSelectedRoom(e.target.value)}
                >
                  {rooms.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.hotelName} — {r.roomType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
             <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={openCreateModal}
                disabled={!rooms.length}
                sx={{ borderRadius: 2, px: 3, fontWeight: 'bold' }}
             >
                Create Offer
             </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Content Grid */}
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
            No active offers found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Select a room above and create your first price offer.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {offers.map((o) => (
            <Grid item xs={12} sm={6} md={4} key={o.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  borderRadius: 4, 
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 8
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                   {/* Top Section: Price */}
                   <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Box>
                        <Typography variant="overline" color="text.secondary" fontWeight="bold">
                          Price Per Night
                        </Typography>
                        <Typography variant="h4" fontWeight={800} color="primary.main">
                           {o.currency === 'PHP' || o.currency === '₱' ? '₱' : o.currency}
                           {o.pricePerNight?.toLocaleString()}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: 'primary.50', color: 'primary.main' }}>
                        <PriceCheckIcon />
                      </Avatar>
                   </Box>

                   <Divider sx={{ my: 2 }} />

                   {/* Middle Section: Details */}
                   <Box display="flex" flexDirection="column" gap={1}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {o.roomType}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                         <MeetingRoomIcon fontSize="small" sx={{ fontSize: 16 }} />
                         {o.hotelName}
                      </Typography>
                   </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                   <Tooltip title="Edit Offer">
                      <IconButton 
                        size="small"
                        onClick={() => {
                            setEditing(o);
                            setOpenCreate(true);
                        }}
                        sx={{ color: 'primary.main', bgcolor: 'primary.50', '&:hover': { bgcolor: 'primary.100' } }}
                      >
                         <EditIcon fontSize="small" />
                      </IconButton>
                   </Tooltip>
                   <Tooltip title="Delete Offer">
                      <IconButton 
                        size="small"
                        onClick={() => confirmDelete(o)}
                        sx={{ color: 'error.main', bgcolor: 'error.50', '&:hover': { bgcolor: 'error.100' } }}
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

      <OfferFormModal
        open={openCreate}
        roomId={selectedRoom}
        initialOffer={editing}
        onClose={() => {
          setOpenCreate(false);
          setEditing(null);
        }}
        onSubmit={handleSubmitOffer}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Offer"
        message={`Delete this offer of ₱${toDelete?.pricePerNight}?`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={doDelete}
        loading={deleting}
      />
    </Container>
  );
}