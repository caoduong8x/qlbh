import { useEffect, useContext, useState } from "react";

// react-router components
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Icon from "@mui/material/Icon";

import { setupAxiosInterceptors } from "services/interceptor";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";

// Material Dashboard 2 PRO React themes
import theme from "assets/theme";

// Material Dashboard 2 PRO React Dark Mode themes
import themeDark from "assets/theme-dark";

// Material Dashboard 2 PRO React routes
import routes from "routes";

// Material Dashboard 2 PRO React contexts
import {
  useMaterialUIController,
  AuthContext,
  setOpenConfigurator,
  setMiniSidenav,
} from "context";

import Login from "auth/login/index";
import webStorageClient from "config/webStorageClient";
import Sidenav from "examples/Sidenav";
import MDBox from "components/MDBox";
import Configurator from "examples/Configurator";
import NotFound from "pages/NotFound/NotFound";
import is from "date-fns/locale/is/index.js";
export default function App({ ability }) {
  const { getRole, getIsAdmin } = useContext(AuthContext);
  const [controller, dispatch] = useMaterialUIController();
  const {
    darkMode,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    brandDark,
    brandWhite,
    miniSidenav,
    openConfigurator,
  } = controller;
  const { pathname } = useLocation();

  const authContext = useContext(AuthContext);

  const [onMouseEnter, setOnMouseEnter] = useState(false);

  const roleUser = webStorageClient.getRole();
  const isAuth = webStorageClient.getAuth();
  // const isAuth = true;

  // if the token expired or other errors it logs out and goes to the login page
  const navigate = useNavigate();
  setupAxiosInterceptors(() => {
    authContext.logout();
    // navigate("/login");
  });

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [location.pathname]);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);

  useEffect(() => {
    if (location.pathname?.includes("/logout")) {
      navigate("/login");
      webStorageClient.removeAll();
    }
  }, [location.pathname]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (webStorageClient?.getToken() === "") {
        navigate("/login");
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [webStorageClient]);

  const getRoleArray = getRole();

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  const flattenRoutes = (routes) => {
    return routes?.reduce((acc, route) => {
      acc.push(route);
      if (route.collapse) {
        acc.push(...flattenRoutes(route.collapse)); // Gọi đệ quy nếu có con
      }
      return acc;
    }, []);
  };

  const getRoutes = (allRoutes) => {
    const flatRoutes = flattenRoutes(allRoutes); // Phẳng hóa allRoutes
    const routeList = flatRoutes
      ?.concat(routes?.map((el) => el?.collapse)?.flat())
      ?.filter((el) => el !== undefined)
      ?.filter((item) => {
        const roles = item.role;
        return roles?.includes("*") || roles?.includes(roleUser);
      });

    return (
      <>
        {routeList?.map((route) => (
          <Route
            exact
            path={route?.route}
            element={route?.component}
            key={route?.key}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </>
    );
  };

  return (
    <>
      <ThemeProvider theme={darkMode ? themeDark : theme}>
        <>
          {isAuth && (
            <>
              <Sidenav
                color={sidenavColor}
                brand={
                  (transparentSidenav && !darkMode) || whiteSidenav
                    ? brandDark
                    : brandWhite
                }
                brandName="Quản lý bán hàng"
                routes={routes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
              <Configurator />
              {/* {configsButton} */}
            </>
          )}
        </>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}
