import { Grid, Paper, Typography, Box, Stack } from "@mui/material";
import { NotebookPen, MessageSquareMore, Hotel } from "lucide-react";

const ProfileStats = ({ stats }) => {
  const content = [
    {
      icon: <NotebookPen size={28} />,
      label: "Total Bookings",
      value: stats.bookings,
      color: "#2563eb", // Primary Blue
    },
    {
      icon: <MessageSquareMore size={28} />,
      label: "Reviews Posted",
      value: stats.reviews,
      color: "#10b981", // Success Green (for variety) or keep Blue
    },
    // {
    //   icon: <Hotel size={28} />,
    //   label: "Saved Hotels",
    //   value: stats.saved,
    //   color: "#f59e0b", // Warm Amber
    // },
  ];

  return (
    <Grid container spacing={3} sx={{ mt: 0 }}>
      {content.map((item, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "white",
              display: "flex",
              alignItems: "center",
              gap: 3,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "default",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.1)",
                borderColor: "rgba(37, 99, 235, 0.3)",
              },
            }}
          >
            {/* ICON CONTAINER */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: `${item.color}15`, // 15% opacity of the color
                color: item.color,
                flexShrink: 0,
              }}
            >
              {item.icon}
            </Box>

            {/* TEXT CONTENT */}
            <Stack>
              <Typography variant="h4" fontWeight={800} color="text.primary" lineHeight={1}>
                {item.value}
              </Typography>
              <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: 0.5, mt: 0.5 }}>
                {item.label}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProfileStats;