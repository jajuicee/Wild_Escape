import React, { useState, useEffect, forwardRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Slide,
  Box,
  Typography,
  IconButton
} from "@mui/material";
import { UserPen, X } from "lucide-react"; // Or use MUI icons

// Smooth Slide Transition
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditProfileModal = ({ open, onClose, user, onSave }) => {
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Transition}
      keepMounted
      // --- VISUAL TWEAKS ---
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 4,
          overflow: "hidden", // Ensures header gradient clips correctly
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", // Deep, professional shadow
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(5px)", // Cool frosted background effect
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      {/* --- HEADER --- */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "white",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <UserPen size={20} color="white" style={{ opacity: 0.9 }} />
          <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: 0.5 }}>
            Update Profile
          </Typography>
        </Stack>
        
        <IconButton onClick={onClose} sx={{ color: "white", opacity: 0.8, "&:hover": { opacity: 1, bgcolor: "rgba(255,255,255,0.1)" } }}>
            <X size={20} />
        </IconButton>
      </Box>

      {/* --- CONTENT --- */}
      <DialogContent sx={{ pt: 4, pb: 2 }}>
        <Stack spacing={3} mt={1}>
          <TextField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            // Styling the Input to look softer
            InputProps={{
                sx: { borderRadius: 3 }
            }}
            sx={{
                "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#2563eb", borderWidth: 2 },
                }
            }}
          />
          <TextField
            label="Email Address"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputProps={{
                sx: { borderRadius: 3 }
            }}
            sx={{
                "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#2563eb", borderWidth: 2 },
                }
            }}
          />
        </Stack>
      </DialogContent>

      {/* --- ACTIONS --- */}
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, bgcolor: "#fafafa", borderTop: "1px solid", borderColor: "divider" }}>
        <Button 
            onClick={onClose}
            sx={{ 
                color: "text.secondary", 
                fontWeight: 600, 
                textTransform: 'none',
                borderRadius: 2,
                px: 3
            }}
        >
            Cancel
        </Button>
        <Button 
            variant="contained" 
            onClick={handleSubmit}
            sx={{
                bgcolor: "#2563eb",
                boxShadow: "0 4px 14px 0 rgba(37, 99, 235, 0.3)",
                fontWeight: 700,
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                py: 1,
                "&:hover": {
                    bgcolor: "#1d4ed8",
                    boxShadow: "0 6px 20px rgba(37, 99, 235, 0.4)",
                    transform: "translateY(-1px)"
                },
                transition: "all 0.2s"
            }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;