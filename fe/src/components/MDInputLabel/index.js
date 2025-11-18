import InputLabel from "@mui/material/InputLabel";
import webStorageClient from "config/webStorageClient";
import colors from "assets/theme/base/colors";

// Wrapper component cập nhật hex mỗi lần render
export default function MDInputLabel({ textContent, sx, ...props }) {
  const sidenavColor = webStorageClient.getSidenavColor();
  const darkMode = webStorageClient.getDarkMode();

  const colorKey = darkMode ? "light" : sidenavColor;
  const colorHex =
    colors.gradients[colorKey].main || colors.gradients.info.main;

  console.log("colorHex: ", colorHex);
  return (
    <InputLabel
      sx={{
        ...sx,
        color: `${colorHex} !important`,
      }}
      {...props}
    >
      {textContent}
    </InputLabel>
  );
}
