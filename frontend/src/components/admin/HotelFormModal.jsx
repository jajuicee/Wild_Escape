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
  Box,
} from "@mui/material";

// Icons for better UX
import HotelIcon from "@mui/icons-material/Hotel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import PublicIcon from "@mui/icons-material/Public";
import PhoneIcon from "@mui/icons-material/Phone";
import DescriptionIcon from "@mui/icons-material/Description";

export default function HotelFormModal({
  open,
  initial = null,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    description: "",
    contactNumber: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) setForm({ ...form, ...initial });
    // eslint-disable-next-line
  }, [initial]);

  const change = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit(form);
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
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, padding: 1 }, // Modern rounded look
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Box
            sx={{
              bgcolor: "primary.light",
              color: "primary.main",
              p: 1.5,
              borderRadius: "50%",
              display: "flex",
              bgOpacity: 0.1,
            }}
          >
            <HotelIcon fontSize="large" />
          </Box>
          <Typography variant="h5" fontWeight="bold">
            {initial ? "Edit Hotel Details" : "Add New Hotel"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please fill in the information below
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2.5} mt={2}>
          {/* Hotel Name */}
          <Grid item xs={12}>
            <TextField
              label="Hotel Name"
              fullWidth
              variant="outlined"
              value={form.name}
              onChange={change("name")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HotelIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <TextField
              label="Street Address"
              fullWidth
              variant="outlined"
              value={form.address}
              onChange={change("address")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* City */}
          <Grid item xs={6}>
            <TextField
              label="City"
              fullWidth
              variant="outlined"
              value={form.city}
              onChange={change("city")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MapIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Country */}
          <Grid item xs={6}>
            <TextField
              label="Country"
              fullWidth
              variant="outlined"
              value={form.country}
              onChange={change("country")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PublicIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Contact */}
          <Grid item xs={12}>
            <TextField
              label="Contact Number"
              fullWidth
              variant="outlined"
              placeholder="1234567890"
              value={form.contactNumber}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");
                change("contactNumber")({
                  target: { value: digitsOnly },
                });
              }}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={form.description}
              onChange={change("description")}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ mt: 1.5, alignSelf: "flex-start" }}
                  >
                    <DescriptionIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{ px: 3, pb: 3, pt: 1, justifyContent: "space-between" }}
      >
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
          size="large"
          disableElevation
          sx={{ borderRadius: 2, px: 4, fontWeight: "bold" }}
        >
          {saving ? "Saving..." : initial ? "Update Hotel" : "Create Hotel"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
