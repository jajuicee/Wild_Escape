import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  Typography,
  InputAdornment,
} from "@mui/material";
import { uploadRoomImage } from "../../api/uploadService";

// Icons
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';

const ROOM_TYPES = ["Standard", "Deluxe", "Suite"];

export default function RoomFormModal({
  open,
  initial = null,
  hotelId = null,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    roomType: "Standard",
    capacity: 2,
    description: "",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm(initial);
      setPreview(
        initial.imageUrl ? `https://wild-escape.onrender.com${initial.imageUrl}` : ""
      );
    } else {
      setForm({
        roomType: "Standard",
        capacity: 2,
        description: "",
        imageUrl: "",
      });
      setImageFile(null);
      setPreview("");
    }
  }, [initial, open]);

  const change = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Kept for logic preservation, even if the inline handler below does the work
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit(hotelId, form);
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
        sx: { borderRadius: 3, padding: 1 }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Box 
            sx={{ 
              bgcolor: 'primary.light', 
              color: 'primary.main', 
              p: 1.5, 
              borderRadius: '50%', 
              display: 'flex',
              opacity: 0.9 
            }}
          >
            <BedroomParentIcon fontSize="large" />
          </Box>
          <Typography variant="h5" fontWeight="bold">
            {initial ? "Edit Room Details" : "Add New Room"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure room specifications and media
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2.5} mt={2}>
          
          {/* Room Type */}
          <Grid item xs={6}>
            <TextField
              select
              label="Room Type"
              fullWidth
              variant="outlined"
              value={form.roomType}
              onChange={change("roomType")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BedroomParentIcon color="action" />
                  </InputAdornment>
                ),
              }}
            >
              {ROOM_TYPES.map((rt) => (
                <MenuItem key={rt} value={rt}>
                  {rt}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Capacity */}
          <Grid item xs={6}>
            <TextField
              label="Capacity"
              type="number"
              fullWidth
              variant="outlined"
              value={form.capacity}
              onChange={change("capacity")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PeopleIcon color="action" />
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
              rows={3}
              variant="outlined"
              value={form.description}
              onChange={change("description")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mt: 1.5, alignSelf: 'flex-start' }}>
                    <DescriptionIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* IMAGE UPLOAD SECTION */}
          <Grid item xs={12}>
            <Box 
              sx={{ 
                border: '1px dashed', 
                borderColor: 'divider', 
                borderRadius: 2, 
                p: 2, 
                textAlign: 'center',
                bgcolor: 'background.default'
              }}
            >
              <Button 
                variant="outlined" 
                component="label" 
                startIcon={<CloudUploadIcon />}
                sx={{ mb: preview ? 2 : 0, borderRadius: 2, textTransform: 'none' }}
              >
                {preview ? "Change Image" : "Upload Room Image"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    // UI Preview Update (Local)
                    setImageFile(file);
                    setPreview(URL.createObjectURL(file));

                    // Immediate Upload Logic (Preserved)
                    const res = await uploadRoomImage(file);
                    setForm((f) => ({
                      ...f,
                      imageUrl: res.data.url,
                    }));
                  }}
                />
              </Button>

              {preview ? (
                <Box
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    boxShadow: 2,
                    mt: 1,
                    position: 'relative'
                  }}
                >
                   <img
                    src={preview}
                    alt="Room Preview"
                    style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                  />
                </Box>
              ) : (
                 <Box sx={{ mt: 1, color: 'text.disabled', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ImageIcon fontSize="large" />
                    <Typography variant="caption">No image selected</Typography>
                 </Box>
              )}
            </Box>
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, justifyContent: 'space-between' }}>
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
          {saving ? "Saving..." : initial ? "Update Room" : "Create Room"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}