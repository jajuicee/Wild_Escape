import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Slide,
} from "@mui/material";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmDialog({ 
  open, 
  title = "Confirm", 
  message, 
  onClose, 
  onConfirm, 
  loading = false 
}) {
  return (
    <Dialog 
      open={open} 
      onClose={() => onClose(false)}
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 4,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", 
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider"
        }
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(4px)", 
          backgroundColor: "rgba(0, 0, 0, 0.15)"
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1, fontSize: '1.25rem' }}>
        {title}
      </DialogTitle>
      
      <DialogContent sx={{ pb: 3 }}>
        <Typography color="text.secondary" sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button 
          onClick={() => onClose(false)} 
          disabled={loading}
          sx={{ 
            color: "text.secondary", 
            fontWeight: 600, 
            borderRadius: 2,
            textTransform: 'none',
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button 
          color="error" 
          variant="contained" 
          onClick={onConfirm} 
          disabled={loading}
          disableElevation
          sx={{ 
            borderRadius: 2, 
            textTransform: 'none',
            fontWeight: 700,
            px: 4,
            boxShadow: "0 4px 12px rgba(211, 47, 47, 0.2)"
          }}
        >
          {loading ? "Working..." : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}