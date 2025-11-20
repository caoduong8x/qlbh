import { forwardRef } from "react";
import PropTypes from "prop-types";
import BaseButton from "components/MDButton//BaseButton";
import { useMaterialUIController } from "context";
import colors from "assets/theme/base/colors";

const MDButton = forwardRef(
  ({ children, color, isDeleteButton = false, sx, ...rest }, ref) => {
    const [controller] = useMaterialUIController();
    const { darkMode, sidenavColor } = controller;

    // Ưu tiên: color prop > darkMode > sidenavColor > secondary
    const effectiveColor =
      color ||
      (darkMode
        ? colors.grey[600]
        : colors.gradients[sidenavColor].main || colors.gradients.info.main);

    return (
      <BaseButton
        ref={ref}
        sx={
          isDeleteButton
            ? {
                ...sx,
                backgroundColor: `${colors.gradients.error.main} !important`,
                color: `${colors.white.main} !important`,
                "&:hover": {
                  backgroundColor: colors.gradients.error.state + " !important",
                },
              }
            : {
                ...sx,
                backgroundColor: `${effectiveColor} !important`,
                color: `${colors.white.main} !important`,
                "&:hover": {
                  backgroundColor:
                    (colors.gradients[sidenavColor].state ||
                      colors.gradients.info.state) + " !important",
                },
              }
        }
        {...rest}
      >
        {children}
      </BaseButton>
    );
  }
);

MDButton.defaultProps = {
  color: null,
  variant: "contained",
  size: "medium",
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
