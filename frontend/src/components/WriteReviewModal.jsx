import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  MenuItem,
} from "@mui/material";

export default function WriteReviewModal({
  open,
  onClose,
  onSubmit,
  initialData,
  reviewableHotels = [],
}) {
  const [hotelId, setHotelId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (initialData) {
      setHotelId(initialData.hotelId);
      setRating(initialData.rating);
      setComment(initialData.comment);
    } else {
      setHotelId(reviewableHotels[0]?.id || "");
      setRating(0);
      setComment("");
    }
  }, [initialData, open, reviewableHotels]);

  const handleSubmit = () => {
    onSubmit({
      hotelId,
      rating,
      comment,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {initialData ? "Edit Review" : "Write a Review"}
      </DialogTitle>

      <DialogContent>
        {!initialData && (
          <TextField
            select
            fullWidth
            label="Hotel"
            margin="dense"
            value={hotelId}
            onChange={(e) => setHotelId(e.target.value)}
          >
            {reviewableHotels.map((hotel) => (
              <MenuItem key={hotel.id} value={hotel.id}>
                {hotel.name}
              </MenuItem>
            ))}
          </TextField>
        )}

        <Rating
          value={rating}
          onChange={(_, value) => setRating(value)}
          sx={{ mt: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          margin="dense"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!rating || !comment || !hotelId}
        >
          {initialData ? "Update" : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
