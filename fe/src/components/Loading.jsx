// src/components/Loading.tsx
import { Box, Typography } from "@mui/material";
import { CircularProgress } from "@mui/material";
import webStorageClient from "config/webStorageClient";
import colors from "assets/theme/base/colors";

export default function Loading({ text = "Đang tải thông tin..." }) {
  const sidenavColor = webStorageClient.getSidenavColor();
  const darkMode = webStorageClient.getDarkMode();

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
      <Typography
        variant="body2"
        sx={{
          mt: 2,
          color: darkMode ? colors.light.main : colors.text.secondary,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}
