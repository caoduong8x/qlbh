import Checkbox from "@mui/material/Checkbox";
import webStorageClient from "config/webStorageClient";
import colors from "assets/theme/base/colors";

// Wrapper component cập nhật hex mỗi lần render
export default function MDCheckbox({ isDeleteCheckbox = false, ...props }) {
  const sidenavColor = webStorageClient.getSidenavColor();
  const darkMode = webStorageClient.getDarkMode();

  const colorKey = darkMode ? "light" : sidenavColor;
  const colorHex = isDeleteCheckbox
    ? colors.error.main
    : colors.gradients[colorKey].main || colors.gradients.info.main;

  const UncheckedIcon = ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );

  const CheckedIcon = ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        stroke={color}
        strokeWidth="2"
        fill={color}
      />
      <polyline
        points="7,12 11,16 17,9"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );

  return (
    <Checkbox
      icon={<UncheckedIcon color={colorHex} />}
      checkedIcon={<CheckedIcon color={colorHex} />}
      {...props}
    />
  );
}
