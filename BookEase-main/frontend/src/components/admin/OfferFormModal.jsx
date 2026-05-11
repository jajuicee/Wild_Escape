import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  InputAdornment,
  Typography,
  Box
} from "@mui/material";
import { toast } from "react-toastify";

// Icons
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Or generic money icon
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

export default function OfferFormModal({
  open,
  roomId = null,
  initialOffer = null,
  onClose,
  onSubmit, // parent handles create/update
}) {
  const [form, setForm] = useState({ pricePerNight: 0, currency: "₱" });
  const [saving, setSaving] = useState(false);

  const change = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // Load editing data
  useEffect(() => {
    if (initialOffer) {
      setForm({
        pricePerNight: initialOffer.pricePerNight,
        currency: initialOffer.currency,
      });
    } else {
      setForm({ pricePerNight: 0, currency: "₱" });
    }
  }, [initialOffer]);

  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit(roomId, form); // ← parent handles logic
      onClose(true);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => onClose(false)} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, padding: 1 }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Box 
            sx={{ 
              bgcolor: 'secondary.light', 
              color: 'secondary.main', 
              p: 1.5, 
              borderRadius: '50%', 
              display: 'flex',
              opacity: 0.9
            }}
          >
            <LocalOfferIcon fontSize="large" />
          </Box>
          <Typography variant="h5" fontWeight="bold">
            {initialOffer ? "Edit Offer" : "Create Offer"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Set the pricing details for this room
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2.5} mt={2}>
          <Grid item xs={6}>
            <TextField
              label="Price Per Night"
              type="number"
              fullWidth
              variant="outlined"
              value={form.pricePerNight}
              onChange={change("pricePerNight")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Currency"
              fullWidth
              variant="outlined"
              value={form.currency}
              onChange={change("currency")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CurrencyExchangeIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, justifyContent: 'space-between' }}>
        <Button 
          onClick={() => onClose(false)} 
          disabled={saving}
          color="inherit"
          sx={{ borderRadius: 2, px: 3 }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={submit} 
          disabled={saving}
          disableElevation
          sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}
        >
          {saving ? "Saving..." : initialOffer ? "Update Offer" : "Create Offer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}