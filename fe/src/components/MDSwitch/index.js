import Switch from "@mui/material/Switch";
import webStorageClient from "config/webStorageClient";
import colors from "assets/theme/base/colors";

// Wrapper component cập nhật hex mỗi lần render
export default function MDSwitch({ sx, ...props }) {
  const sidenavColor = webStorageClient.getSidenavColor();
  const darkMode = webStorageClient.getDarkMode();

  const colorKey = darkMode ? "light" : sidenavColor;
  const colorHex =
    colors.gradients[colorKey].main || colors.gradients.info.main;

  return (
    <Switch
      sx={{
        ...sx,
        "&& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
          border: `1px solid ${colorHex}`,
          backgroundColor: `${colorHex} !important`,
        },
        "&& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
          border: `1px solid ${colorHex} !important`,
          backgroundColor: `${colorHex} !important`,
        },

        "&& .MuiSwitch-thumb": {
          backgroundColor: `${colorHex} !important`,
          border: `1px solid ${colorHex} !important`,
        },
        "&& .Mui-checked .MuiSwitch-thumb": {
          border: `1px solid #ffffffff !important`,
          backgroundColor: `${colorHex} !important`,
        },
      }}
      {...props}
    />
  );
}
