// src/components/Loading.tsx
import { Box, Typography } from "@mui/material";
import { CircularProgress } from "@mui/material";
import webStorageClient from "config/webStorageClient";

export default function Loading({ text = "Đang tải thông tin..." }) {
  const sidenavColor = webStorageClient.getSidenavColor();

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
      <CircularProgress color={sidenavColor ? sidenavColor : "inherit"} />
      <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
        {text}
      </Typography>
    </Box>
  );
}
