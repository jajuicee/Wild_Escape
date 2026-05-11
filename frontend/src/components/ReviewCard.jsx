import React from "react";
import {
  Box,
  Typography,
  Rating,
  Avatar,
  Card,
  Button,
  Stack,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import { CalendarDays, Hotel, Edit2, Trash2 } from "lucide-react"; // Added icons for buttons if you want, but kept text as fallback

const ReviewCard = ({ review, sx }) => (
  <Card
    elevation={0} // Flat design is more professional, using border instead
    sx={{
      borderRadius: 4,
      border: "1px solid",
      borderColor: "divider",
      bgcolor: "background.paper",
      transition: "transform 0.2s, box-shadow 0.2s",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      "&:hover": {
        borderColor: "primary.light",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      },
      ...sx,
    }}
  >
    <CardContent
      sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3 }}
    >
      {/* Header: User Info + Date + Rating */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={2}
      >
        <Box display="flex" gap={2}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 48,
              height: 48,
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {(review.name ?? "U")
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Avatar>

          <Box>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
              {review.name}
            </Typography>
            <Rating
              value={review.rating}
              readOnly
              size="small"
              sx={{ mt: 0.5, color: "warning.main" }}
            />
          </Box>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          gap={0.5}
          color="text.disabled"
          sx={{ typography: "caption", fontWeight: 500 }}
        >
          <CalendarDays size={14} /> {review.createdAt}
        </Box>
      </Box>

      {/* Body: Comment */}
      <Box mb={3} flex={1}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: 1.6,
            fontSize: "0.95rem",
          }}
        >
          {review.comment}
        </Typography>
      </Box>

      {/* Footer: Hotel Badge + Actions */}
      <Divider sx={{ mb: 2, opacity: 0.6 }} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {/* Hotel Badge */}
        <Chip
          icon={<Hotel size={14} />}
          label={review.hotelName}
          size="small"
          variant="outlined"
          sx={{
            color: "text.secondary",
            borderColor: "divider",
            fontWeight: 500,
          }}
        />

        {/* Action Buttons (Only visible if owner) */}
        {review.isOwner && (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="text"
              color="primary"
              onClick={review.onEdit}
              sx={{ minWidth: "auto", textTransform: "none", fontWeight: 600 }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="text"
              color="error"
              onClick={review.onDelete}
              sx={{ minWidth: "auto", textTransform: "none", fontWeight: 600 }}
            >
              Delete
            </Button>
          </Stack>
        )}
      </Stack>
    </CardContent>
  </Card>
);

export default ReviewCard;
