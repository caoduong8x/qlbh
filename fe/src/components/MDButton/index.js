import { forwardRef } from "react";
import PropTypes from "prop-types";
import BaseButton from "components/MDButton//BaseButton";
import { useMaterialUIController } from "context";
import webStorageClient from "config/webStorageClient";
import colors from "assets/theme/base/colors";
import { text } from "../../../node_modules/@fortawesome/fontawesome-svg-core/index";

const MDButton = forwardRef(({ children, color, ...rest }, ref) => {
  console.log("color: ", color);
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;

  // Ưu tiên: color prop > darkMode > sidenavColor > secondary
  const effectiveColor =
    color ||
    (darkMode
      ? colors.gradients.light.main
      : colors.gradients[sidenavColor].main || colors.gradients.info.main);

  return (
    <BaseButton
      ref={ref}
      style={{ backgroundColor: effectiveColor, color: colors.white.main }}
      {...rest}
    >
      {children}
    </BaseButton>
  );
});

MDButton.defaultProps = {
  color: null,
  variant: "contained",
  size: "small",
  circular: false,
  iconOnly: false,
};

MDButton.propTypes = {
  color: PropTypes.oneOf([
    null,
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  variant: PropTypes.oneOf(["text", "contained", "outlined", "gradient"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  circular: PropTypes.bool,
  iconOnly: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default MDButton;
