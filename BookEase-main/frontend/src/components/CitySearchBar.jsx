import React, { useMemo } from "react";
import { Box, TextField, Button, InputAdornment } from "@mui/material";
import { Search } from "lucide-react";
import { debounce } from "lodash";

function CitySearchBar({ cityInput, setCityInput, onSearch }) {
  // Create debounced version of setCityInput
  const debouncedCityUpdate = useMemo(
    () => debounce((value) => setCityInput(value), 300),
    []
  );

  const handleChange = (e) => {
    debouncedCityUpdate(e.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        alignItems: "center",
        p: 1,
        bgcolor: "white",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
        maxWidth: "fit-content",
      }}
    >
      <TextField
        placeholder="Where do you want to go?"
        variant="standard"
        defaultValue={cityInput}   // important: controlled via debounce
        onChange={handleChange}
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <Search size={20} />
            </InputAdornment>
          ),
          sx: { fontSize: "1rem", p: 1, width: { xs: 200, sm: 300 } },
        }}
      />

      <Button
        variant="contained"
        onClick={onSearch}
        sx={{
          bgcolor: "#007FAD",
          borderRadius: "12px",
          px: 4,
          py: 1.2,
          textTransform: "none",
          fontWeight: 700,
          fontSize: "1rem",
        }}
      >
        Search
      </Button>
    </Box>
  );
}

export default CitySearchBar;
