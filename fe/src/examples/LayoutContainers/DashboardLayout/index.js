import { useEffect, useContext } from "react";

// react-router-dom components
import { useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDSnackbar from "components/MDSnackbar/index";

// Material Dashboard 2 PRO React context
import { useMaterialUIController, setLayout } from "context";
import { messagesAlert } from "config/messages/messages";

import { AuthContext } from "context/index";


function DashboardLayout({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  return (
    <MDBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        // p: 3,
        position: "relative",

        [breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
       {authContext?.open && (
        <MDSnackbar
          icon={authContext.alert.icon}
          title={authContext.alert.title}
          content={authContext.alert.content}
          open={authContext.open}
          onClose={() =>{authContext?.openAlert()} }
          close={() => {authContext?.openAlert()}}
          color={authContext.alert.color}
        />
      )}
      {children}
    </MDBox>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
