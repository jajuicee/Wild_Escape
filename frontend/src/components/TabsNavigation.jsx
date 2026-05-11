import React from "react";
import { Stack, Button } from "@mui/material";

export default function TabsNavigation({ tabs, activeTab, setActiveTab }) {
  return (
    <Stack direction="row" spacing={2} justifyContent="center" mb={4}>
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "contained" : "text"}
          color={activeTab === tab.id ? "primary" : "inherit"}
          onClick={() => setActiveTab(tab.id)}
          startIcon={tab.icon}
          sx={{
            borderRadius: 2,
            textTransform: "uppercase",
            fontWeight: activeTab === tab.id ? 700 : 500,
            py: 1.5,
            px: 3,
            bgcolor: activeTab === tab.id ? "#1976d2" : "transparent",
            color: activeTab === tab.id ? "#fff" : "text.secondary",
            "&:hover": {
              bgcolor: activeTab === tab.id ? "#1565c0" : "#e0e0e0",
            },
          }}
        >
          {tab.text}
        </Button>
      ))}
    </Stack>
  );
}
