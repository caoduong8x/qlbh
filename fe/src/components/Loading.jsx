// src/components/Loading.tsx
import { Box, Typography } from "@mui/material";
import { CircularProgress } from "@mui/material";

export default function Loading({ text = "Đang tải thông tin..." }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: "200px",
      }}
    >
      <CircularProgress color="inherit" />
      <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
        {text}
      </Typography>
    </Box>
  );
}
