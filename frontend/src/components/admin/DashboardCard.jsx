import { Card, CardContent, Typography, Box } from "@mui/material";

export default function DashboardCard({ title, value }) {
  return (
    <Card 
      elevation={0} 
      sx={{ 
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.1)",
          borderColor: "rgba(37, 99, 235, 0.4)", // Blue tint on hover
        }
      }}
    >
      {/* Decorative Accent Top Bar */}
      <Box 
        sx={{ 
            height: 4, 
            width: "100%", 
            background: "linear-gradient(90deg, #2563eb, #60a5fa)" 
        }} 
      />

      <CardContent sx={{ p: 4 }}>
        <Typography 
            variant="overline" 
            color="text.secondary" 
            fontWeight={700}
            sx={{ letterSpacing: 1.5, textTransform: "uppercase", display: "block", mb: 1 }}
        >
          {title}
        </Typography>
        
        <Typography 
            variant="h3" 
            fontWeight={800} 
            sx={{ 
                // Gradient Text Effect
                background: "linear-gradient(45deg, #1e293b 30%, #475569 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "text.primary" // Fallback
            }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}