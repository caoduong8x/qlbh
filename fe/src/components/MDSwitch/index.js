import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import webStorageClient from "config/webStorageClient";
import colors from "assets/theme/base/colors";

// Styled Switch nhận props hex
const MDSwitchStyled = styled(Switch)(({ hex }) => ({
  "&& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
    border: `1px solid ${hex}`,
    backgroundColor: `${hex} !important`,
  },
  "&& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    border: `1px solid ${hex} !important`,
    backgroundColor: `${hex} !important`,
  },

  "&& .MuiSwitch-thumb": {
    backgroundColor: `${hex} !important`,
    border: `1px solid ${hex} !important`,
  },
  "&& .Mui-checked .MuiSwitch-thumb": {
    border: `1px solid #ffffffff !important`,
    backgroundColor: `${hex} !important`,
  },
}));

// Wrapper component cập nhật hex mỗi lần render
export default function MDSwitch(props) {
  const sidenavColor = webStorageClient.getSidenavColor();
  const darkMode = webStorageClient.getDarkMode();

  const colorKey = darkMode ? "light" : sidenavColor;
  const colorHex =
    colors.gradients[colorKey].main || colors.gradients.info.main;

  return <MDSwitchStyled hex={colorHex} {...props} />;
}
