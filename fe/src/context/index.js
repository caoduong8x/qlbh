import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import AuthService from "services/auth-service";
import webStorage from "config/webStorageClient";
import webStorageClient from "config/webStorageClient";

// The Material Dashboard 2 PRO React main context
const MaterialUI = createContext();

// the authentication context
export const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  register: () => {},
  logout: () => {},
  getCurrentIDToken: () => {},
  getCurrentUser: () => {},
  getRole: () => {},
  getDonViId: () => {},
  getMaNhomQuyen: () => {},
  getTenNhomQuyen: () => {},
  getIsAdmin: () => {},
  open: false,
  alert: {},
  setOpen: () => {},
  getTokenAdminSuperSet: () => {},
  toUnsigned: (text) => {},
});

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({});

  const navigate = useNavigate();

  const token = webStorage.getToken();

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      navigate(location.pathname);
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    navigate("/");
  };

  const logout = () => {
    webStorage.removeAll();
    setIsAuthenticated(false);
    navigate("/login");
  };

  const getCurrentUser = () => {
    try {
      return webStorageClient.getUser();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getRole = () => {
    try {
      return webStorageClient.getRole();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getDonViId = () => {
    try {
      return webStorageClient.getDonViId();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getMaNhomQuyen = () => {
    try {
      return webStorageClient.getMaNhomQuyen();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getTenNhomQuyen = () => {
    try {
      return webStorageClient.getTenNhomQuyen();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getIsAdmin = () => {
    try {
      return webStorageClient.getIsAdmin();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getCurrentIDToken = () => {
    try {
      return webStorageClient.getIDToken();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const toUnsigned = (text) => {
    if (!text || !text.trim()) {
      return "";
    }

    let str = text.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");

    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      "_"
    );
    str = str.replace(/_+_/g, "_");

    str = str.trim();
    return str;
  };
  const openAlert = () => {
    setOpen(!open);
  };

  const alertInfo = (data) => {
    setAlert(data);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        getRole,
        getDonViId,
        getIsAdmin,
        getCurrentUser,
        getCurrentIDToken,
        getMaNhomQuyen,
        getTenNhomQuyen,
        toUnsigned,
        openAlert,
        alertInfo,
        alert,
        open,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Setting custom name for the context which is visible on react dev tools
MaterialUI.displayName = "MaterialUIContext";

// Material Dashboard 2 PRO React reducer
function reducer(state, action) {
  switch (action.type) {
    case "MINI_SIDENAV": {
      return { ...state, miniSidenav: action.value };
    }
    case "TRANSPARENT_SIDENAV": {
      return { ...state, transparentSidenav: action.value };
    }
    case "WHITE_SIDENAV": {
      return { ...state, whiteSidenav: action.value };
    }
    case "SIDENAV_COLOR": {
      webStorageClient.setSidenavColor(action.value);
      return { ...state, sidenavColor: action.value };
    }
    case "TRANSPARENT_NAVBAR": {
      return { ...state, transparentNavbar: action.value };
    }
    case "FIXED_NAVBAR": {
      return { ...state, fixedNavbar: action.value };
    }
    case "OPEN_CONFIGURATOR": {
      return { ...state, openConfigurator: action.value };
    }
    case "DIRECTION": {
      return { ...state, direction: action.value };
    }
    case "LAYOUT": {
      return { ...state, layout: action.value };
    }
    case "DARKMODE": {
      return { ...state, darkMode: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

// Material Dashboard 2 PRO React context provider
function MaterialUIControllerProvider({ children }) {
  const initialState = {
    miniSidenav: false,
    transparentSidenav: false,
    whiteSidenav: false,
    sidenavColor: webStorageClient.getSidenavColor() || "info",
    transparentNavbar: true,
    fixedNavbar: true,
    openConfigurator: false,
    direction: "ltr",
    layout: "dashboard",
    darkMode: false,
  };

  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

  return <MaterialUI.Provider value={value}>{children}</MaterialUI.Provider>;
}

// Material Dashboard 2 PRO React custom hook for using context
function useMaterialUIController() {
  const context = useContext(MaterialUI);

  if (!context) {
    throw new Error(
      "useMaterialUIController should be used inside the MaterialUIControllerProvider."
    );
  }
  return context;
}

// Typechecking props for the MaterialUIControllerProvider
MaterialUIControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Context module functions
const setMiniSidenav = (dispatch, value) =>
  dispatch({ type: "MINI_SIDENAV", value });
const setTransparentSidenav = (dispatch, value) =>
  dispatch({ type: "TRANSPARENT_SIDENAV", value });
const setWhiteSidenav = (dispatch, value) =>
  dispatch({ type: "WHITE_SIDENAV", value });
const setSidenavColor = (dispatch, value) =>
  dispatch({ type: "SIDENAV_COLOR", value });
const setTransparentNavbar = (dispatch, value) =>
  dispatch({ type: "TRANSPARENT_NAVBAR", value });
const setFixedNavbar = (dispatch, value) =>
  dispatch({ type: "FIXED_NAVBAR", value });
const setOpenConfigurator = (dispatch, value) =>
  dispatch({ type: "OPEN_CONFIGURATOR", value });
const setDirection = (dispatch, value) =>
  dispatch({ type: "DIRECTION", value });
const setLayout = (dispatch, value) => dispatch({ type: "LAYOUT", value });
const setDarkMode = (dispatch, value) => dispatch({ type: "DARKMODE", value });

export {
  AuthContextProvider,
  MaterialUIControllerProvider,
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setDirection,
  setLayout,
  setDarkMode,
};
