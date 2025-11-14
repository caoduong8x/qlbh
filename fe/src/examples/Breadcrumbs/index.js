// react-router-dom components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";

function Breadcrumbs({ icon, title, route, light }) {
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  // const routes = route.slice(0, -1);
  return (
    <MDBox mr={{ xs: 0, xl: 8 }}>
      <MDBox display="flex" alignItems="center" gap={1}>
        <MuiBreadcrumbs
          sx={{
            "& .MuiBreadcrumbs-separator": {
              color: ({ palette: { white, grey } }) =>
                light ? white.main : grey[600],
            },
          }}
        >
          <Link to="/">
            <MDTypography
              component="span"
              variant="body2"
              color={light ? "white" : "dark"}
              // opacity={light ? 0.8 : 0.5}
              sx={{ lineHeight: 0 }}
            >
              <Icon
                fontSize="medium"
                color={
                  darkMode ? "dark" : sidenavColor ? sidenavColor : "inherit"
                }
              >
                {icon}
              </Icon>
            </MDTypography>
          </Link>
          {route?.map((el) => (
            <MDTypography
              component="span"
              variant="button"
              fontWeight="regular"
              textTransform="capitalize"
              color={light ? "white" : "dark"}
              opacity={light ? 0.8 : 0.5}
              sx={{ lineHeight: 0 }}
            >
              {el}
            </MDTypography>
          ))}
        </MuiBreadcrumbs>
        <MDTypography
          sx={{ pt: 0.6 }}
          fontWeight="bold"
          textTransform="capitalize"
          variant="h6"
          color={darkMode ? "dark" : sidenavColor ? sidenavColor : "inherit"}
          noWrap
        >
          {title.replace("-", " ")}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of Breadcrumbs
Breadcrumbs.defaultProps = {
  light: false,
};

// Typechecking props for the Breadcrumbs
Breadcrumbs.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  light: PropTypes.bool,
};

export default Breadcrumbs;
