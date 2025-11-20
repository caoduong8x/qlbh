import EditIcon from "@mui/icons-material/Edit";
import webStorageClient from "config/webStorageClient";
import colors from "assets/theme/base/colors";

// Wrapper component cập nhật hex mỗi lần render
export default function MDEditIcon({ sx, ...props }) {
  const sidenavColor = webStorageClient.getSidenavColor();
  const darkMode = webStorageClient.getDarkMode();

  const colorHex = darkMode
    ? colors.grey[300]
    : colors.gradients[sidenavColor].main || colors.gradients.info.main;

  return (
    <EditIcon
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
