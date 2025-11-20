import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import webStorageClient from "config/webStorageClient";
import colors from "assets/theme/base/colors";

// Wrapper component cập nhật hex mỗi lần render
export default function MDViewIcon({ sx, ...props }) {
  const sidenavColor = webStorageClient.getSidenavColor();
  const darkMode = webStorageClient.getDarkMode();

  const colorHex = darkMode
    ? colors.grey[300]
    : colors.gradients[sidenavColor].main || colors.gradients.info.main;

  return (
    <RemoveRedEyeIcon
      sx={{
        ...sx,
        color: `${colorHex} !important`,
        "&:hover": {
          transform: "scale(1.5)",
        },
      }}
      {...props}
    />
  );
}
