/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/**
 * The base colors for the Material Dashboard 2 PRO React.
 * You can add new color using this file.
 * You can customized the colors for the entire Material Dashboard 2 PRO React using thie file.
 */

const colors = {
  background: {
    default: "#1a2035",
    sidenav: "#1f283e",
    card: "#202940",
  },

  text: {
    main: "#ffffffcc",
    focus: "#ffffffcc",
  },

  transparent: {
    main: "transparent",
  },

  white: {
    main: "#ffffff",
    focus: "#ffffff",
  },

  black: {
    light: "#000000",
    main: "#000000",
    focus: "#000000",
  },

  primary: {
    main: "#e91e63",
    focus: "#e91e63",
  },

  secondary: {
    main: "#7b809a",
    focus: "#8f93a9",
  },

  info: {
    main: "#1A73E8",
    focus: "#1662C4",
  },

  success: {
    main: "#4CAF50",
    focus: "#67bb6a",
  },

  warning: {
    main: "#fb8c00",
    focus: "#fc9d26",
  },

  error: {
    main: "#F44335",
    focus: "#f65f53",
  },

  light: {
    main: "#f0f2f566",
    focus: "#f0f2f566",
  },

  dark: {
    main: "#344767",
    focus: "#2c3c58",
  },

  grey: {
    100: "#f8f9fa",
    200: "#f0f2f5",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#6c757d",
    700: "#495057",
    800: "#343a40",
    900: "#212529",
  },

  gradients: {
    primary: {
      main: "#EC407A",
      state: "#D81B60",
    },

    secondary: {
      main: "#747b8a",
      state: "#495361",
    },

    info: {
      main: "#49a3f1",
      state: "#1A73E8",
    },

    success: {
      main: "#66BB6A",
      state: "#43A047",
    },

    warning: {
      main: "#FFA726",
      state: "#FB8C00",
    },

    error: {
      main: "#EF5350",
      state: "#E53935",
    },

    light: {
      main: "#EBEFF4",
      state: "#CED4DA",
    },

    dark: {
      main: "#323a54",
      state: "#1a2035",
    },
  },

  socialMediaColors: {
    facebook: {
      main: "#3b5998",
      dark: "#344e86",
    },

    twitter: {
      main: "#55acee",
      dark: "#3ea1ec",
    },

    instagram: {
      main: "#125688",
      dark: "#0e456d",
    },

    linkedin: {
      main: "#0077b5",
      dark: "#00669c",
    },

    pinterest: {
      main: "#cc2127",
      dark: "#b21d22",
    },

    youtube: {
      main: "#e52d27",
      dark: "#d41f1a",
    },

    vimeo: {
      main: "#1ab7ea",
      dark: "#13a3d2",
    },

    slack: {
      main: "#3aaf85",
      dark: "#329874",
    },

    dribbble: {
      main: "#ea4c89",
      dark: "#e73177",
    },

    github: {
      main: "#24292e",
      dark: "#171a1d",
    },

    reddit: {
      main: "#ff4500",
      dark: "#e03d00",
    },

    tumblr: {
      main: "#35465c",
      dark: "#2a3749",
    },
  },

  badgeColors: {
    primary: {
      background: "#f8b3ca",
      text: "#cc084b",
    },

    secondary: {
      background: "#d7d9e1",
      text: "#6c757d",
    },

    info: {
      background: "#aecef7",
      text: "#095bc6",
    },

    success: {
      background: "#bce2be",
      text: "#339537",
    },

    warning: {
      background: "#ffd59f",
      text: "#c87000",
    },

    error: {
      background: "#fcd3d0",
      text: "#f61200",
    },

    light: {
      background: "#ffffff",
      text: "#c7d3de",
    },

    dark: {
      background: "#8097bf",
      text: "#1e2e4a",
    },
  },

  coloredShadows: {
    primary: "#e91e62",
    secondary: "#110e0e",
    info: "#00bbd4",
    success: "#4caf4f",
    warning: "#ff9900",
    error: "#f44336",
    light: "#adb5bd",
    dark: "#404040",
  },

  inputBorderColor: "#d2d6da",

  tabs: {
    indicator: { boxShadow: "#ddd" },
  },

  arrayColor: {
    primary: {
      100: "#fde4ec",
      200: "#f9bcd0",
      300: "#f493b3",
      400: "#ef6a96",
      500: "#eb437a",
      600: "#e91e62", // màu bạn đưa
      700: "#c2185b",
      800: "#8e1344",
      900: "#5a0c2d",
    },

    secondary: {
      100: "#d6d4d4",
      200: "#adaaaa",
      300: "#858080",
      400: "#5d5656",
      500: "#362d2d",
      600: "#110e0e", // màu bạn đưa
      700: "#0d0b0b",
      800: "#090707",
      900: "#050404",
    },

    info: {
      100: "#ccf3f9",
      200: "#99e8f4",
      300: "#66dcef",
      400: "#33d1ea",
      500: "#00bbd4bd",
      600: "#00bbd4", // màu bạn đưa
      700: "#0092a4",
      800: "#006b76",
      900: "#004449",
    },

    success: {
      100: "#dff3e0",
      200: "#bfe6c2",
      300: "#9fd9a3",
      400: "#7fcc85",
      500: "#60bf67",
      600: "#4caf4f", // màu bạn đưa
      700: "#3d8c3e",
      800: "#2e692e",
      900: "#1e461f",
    },

    warning: {
      100: "#ffefd6",
      200: "#ffdfa8",
      300: "#ffcf7a",
      400: "#ffbf4d",
      500: "#ffaf1f",
      600: "#ff9900", // màu bạn đưa
      700: "#cc7a00",
      800: "#995b00",
      900: "#663d00",
    },

    error: {
      100: "#fde0e0",
      200: "#fab4b3",
      300: "#f68786",
      400: "#f35a59",
      500: "#f35a59",
      600: "#f44336", // màu bạn đưa
      700: "#c3372b",
      800: "#922a21",
      900: "#611c16",
    },
    light: {
      100: "#f8f9fa",
      200: "#e9ecef",
      300: "#dee2e6",
      400: "#ced4da",
      500: "#bfc5cb",
      600: "#adb5bd", // màu bạn đưa
      700: "#8a9198",
      800: "#676d72",
      900: "#45494c",
    },
    dark: {
      100: "#e0e0e0",
      200: "#b3b3b3",
      300: "#808080",
      400: "#4d4d4d",
      500: "#2b2b2b",
      600: "#404040", // màu bạn đưa
      700: "#333333",
      800: "#262626",
      900: "#1a1a1a",
    },
  },
};

export default colors;
