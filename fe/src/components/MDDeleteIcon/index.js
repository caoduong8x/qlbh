import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import webStorageClient from "config/webStorageClient";
import colors from "assets/theme/base/colors";

const MDDeleteIconStyled = styled(DeleteIcon)(({ colorHex }) => ({
  "&:hover": {
    transform: "scale(1.5)",
  },
}));

// Wrapper component cập nhật hex mỗi lần render
export default function MDDeleteIcon(props) {
  const sidenavColor = webStorageClient.getSidenavColor();
  const darkMode = webStorageClient.getDarkMode();

  const colorHex = darkMode
    ? colors.grey[300]
    : colors.gradients[sidenavColor].main || colors.gradients.info.main;

  return <MDDeleteIconStyled colorHex={colorHex} color="error" {...props} />;
}
