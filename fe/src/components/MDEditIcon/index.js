import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import webStorageClient from "config/webStorageClient";
import colors from "assets/theme/base/colors";

const MDEditIconStyled = styled(EditIcon)(({ colorHex }) => ({
  color: `${colorHex} !important`,
  "&:hover": {
    transform: "scale(1.5)",
  },
}));

// Wrapper component cập nhật hex mỗi lần render
export default function MDEditIcon(props) {
  const sidenavColor = webStorageClient.getSidenavColor();
  const darkMode = webStorageClient.getDarkMode();

  const colorHex = darkMode
    ? colors.grey[300]
    : colors.gradients[sidenavColor].main || colors.gradients.info.main;

  return <MDEditIconStyled colorHex={colorHex} {...props} />;
}
