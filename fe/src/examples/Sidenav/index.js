import { useEffect, useState, useContext } from "react";

// react-router-dom components
import { useLocation, NavLink, useNavigate } from "react-router-dom";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 PRO React examples
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavList from "examples/Sidenav/SidenavList";
import SidenavItem from "examples/Sidenav/SidenavItem";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";
import { getRequest } from "services/request/index";
import { API_SERVER } from "services/constants";
import webStorageClient from "config/webStorageClient";
import { endpointAuth } from "services/endpoint";

// Material Dashboard 2 PRO React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  AuthContext,
} from "context";

import logo from "assets/images/illustrations/logo_QNA.png";

import AuthService from "services/auth-service";
import { Can } from "Can";
import colors from "assets/theme/base/colors";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const authContext = useContext(AuthContext);

  const [openCollapse, setOpenCollapse] = useState([]);
  const [openNestedCollapse, setOpenNestedCollapse] = useState(false);
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } =
    controller;
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const collapseName = pathname.split("/").slice(1)[0];
  const items = pathname.split("/").slice(1);
  const itemParentName = items[1];
  const itemName = items[items.length - 1];
  const [activeRoute, setActiveRoute] = useState(null);

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  // useEffect(() => {
  //   setOpenCollapse(collapseName);
  //   setOpenNestedCollapse(itemParentName);
  // }, [pathname]);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(
        dispatch,
        window.innerWidth < 1200 ? false : transparentSidenav
      );
      setWhiteSidenav(
        dispatch,
        window.innerWidth < 1200 ? false : whiteSidenav
      );
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  const handleLogOut = async () => {
    try {
      authContext.logout();
      // await AuthService.logout();
      // console.log('"logout"', "logout");
      // const idtoken = webStorageClient.getIDToken();
      // const urlDetail = `${API_SERVER}${
      //   endpointAuth?.SIGNOUT
      // }?idtoken=${idtoken}&email=${webStorageClient.getUser()}`;
      // let res = await getRequest(urlDetail);
      // // navigate(res?.logoutUrl);
      // window.location.href = res?.logoutUrl;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const renderRoutes = (routes) => {
    return routes
      ?.filter((item) => item.show !== false)
      .map((route) =>
        route?.collapse?.length > 0 ? (
          <div style={{ paddingLeft: route?.level >= 2 ? "7px" : "0px" }}>
            <SidenavCollapse
              key={route?.key}
              name={route?.name}
              icon={route?.icon}
              active={route?.key === activeRoute} // Kiểm tra xem route có đang active không
              open={openCollapse.includes(route?.key)}
              onClick={() => {
                setActiveRoute(route?.key); // Cập nhật activeRoute khi click
                setOpenCollapse((prevArray) => {
                  if (prevArray.includes(route?.key)) {
                    return prevArray.filter((i) => i !== route?.key);
                  } else {
                    return [...prevArray, route?.key];
                  }
                });
              }}
              style={{
                transition: "background-color 0.3s ease",
                backgroundColor:
                  route?.key === activeRoute ? colors.grey[700] : "transparent", // Đổi màu nếu là active
              }}
              onMouseEnter={(e) => {
                if (route?.key !== activeRoute) {
                  e.currentTarget.style.backgroundColor = colors.grey[700];
                }
              }}
              onMouseLeave={(e) => {
                if (route?.key !== activeRoute) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {renderRoutes(route?.collapse)}
            </SidenavCollapse>
          </div>
        ) : (
          <div style={{ paddingLeft: route?.level >= 2 ? "7px" : "0px" }}>
            <SidenavCollapse
              key={route?.key}
              name={route?.name}
              icon={route?.icon}
              active={route?.key === activeRoute} // Kiểm tra xem route có đang active không
              noCollapse={true}
              onClick={() => {
                setActiveRoute(route?.key); // Cập nhật activeRoute khi click
                route.name === "Logout"
                  ? handleLogOut()
                  : navigate(route?.route);
              }}
              style={{
                transition: "background-color 0.3s ease",
                backgroundColor:
                  route?.key === activeRoute ? colors.grey[600] : "transparent", // Đổi màu nếu là active
              }}
              onMouseEnter={(e) => {
                if (route?.key !== activeRoute) {
                  e.currentTarget.style.backgroundColor = colors.grey[700];
                }
              }}
              onMouseLeave={(e) => {
                if (route?.key !== activeRoute) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            />
          </div>
        )
      );
  };

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>
        <MDBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && (
            <MDBox component="img" src={brand} alt="Brand" width="2rem" />
          )}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
            display="flex"
            alignItems="center"
            gap="15px"
          >
            <MDBox component="img" src={logo} alt="Brand" width="2rem" />
            <MDTypography
              component="h6"
              variant="button"
              fontWeight="medium"
              color={textColor}
            >
              CSDL Ngành TTTT
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>{renderRoutes(routes)}</List>
    </SidenavRoot>
  );
}

export default Sidenav;
