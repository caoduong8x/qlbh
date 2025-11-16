import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import webStorageClient from "config/webStorageClient";
import colors from "assets/theme/base/colors";

// Styled Tooltip nhận prop colorHex và apply vào nội dung tooltip
const MDTooltipStyled = styled(
  ({ className, colorHex, isError = false, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  )
)(({ colorHex, isError }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: isError ? colors.error.main : colorHex,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: `${isError ? colors.error.main : colorHex} !important`,
    color: "white",
    fontSize: 15,
  },
}));

export default function MDTooltip(props) {
  const sidenavColor = webStorageClient.getSidenavColor();
  const darkMode = webStorageClient.getDarkMode();

  const colorHex = darkMode
    ? colors.grey[700]
    : colors.gradients[sidenavColor].main || colors.gradients.info.main;

  return <MDTooltipStyled colorHex={colorHex} {...props} />;
}
