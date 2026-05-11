import React from "react";
import { Box } from "@mui/material";

const ImageCard = ( {content} ) => {
  return (
    <>
      <Box
        component="img"
        src= {content.img}
        alt= {content.alt}
        sx={{
          width: "100%",
          maxHeight: { xs: 280, md: 380 },
          objectFit: "cover",
          borderRadius: "24px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
          transition: "transform 0.5s",
          "&:hover": { transform: "scale(1.03)" },
        }}
      />
    </>
  );
};

export default ImageCard;
