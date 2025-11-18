import Cookies from "js-cookie";
import _ from "lodash";
import {
  ACCESS_TOKEN,
  ID_TOKEN,
  IS_AUTH,
  ROLE,
  USER_INFO,
  IS_ADMIN,
  MA_NHOM_QUYEN,
  TEN_NHOM_QUYEN,
  SIDENAV_COLOR,
  DARK_MODE,
  REMEMBER_ME,
} from "services/constants";

const webStorageClient = {
  set(key, rawValue, option) {
    const value = _.isString(rawValue) ? rawValue : JSON?.stringify(rawValue);
    Cookies.set(key, value, option);
  },

  get(key) {
    const value = Cookies.get(key) || "";
    try {
      return JSON?.parse(value);
    } catch {
      return value;
    }
  },

  remove(key) {
    Cookies.remove(key);
  },

  removeAll() {
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(IS_AUTH);
  },

  setToken(value, option) {
    const remember = this.getRememberMe();
    if (remember) {
      localStorage.setItem(ACCESS_TOKEN, JSON.stringify(value));
    } else {
      this.set(ACCESS_TOKEN, value, option);
    }
  },

  setIDToken(value, option) {
    this.set(ID_TOKEN, value, option);
  },

  setUser(value, option) {
    this.set(USER_INFO, value, option);
  },
  setAuth(value, option) {
    this.set(IS_AUTH, value, option);
  },
  setRole(value, option) {
    this.set(ROLE, value, option);
  },

  setIsAdmin(value, option) {
    this.set(IS_ADMIN, value, option);
  },

  setMaNhomQuyen(value, option) {
    this.set(MA_NHOM_QUYEN, value, option);
  },

  setTenNhomQuyen(value, option) {
    this.set(TEN_NHOM_QUYEN, value, option);
  },

  setSidenavColor(value, option) {
    localStorage.setItem(SIDENAV_COLOR, JSON.stringify(value));
  },

  setDarkMode(value, option) {
    localStorage.setItem(DARK_MODE, JSON.stringify(value));
  },

  setRememberMe(value, option) {
    localStorage.setItem(REMEMBER_ME, JSON.stringify(value));
  },

  getAuth() {
    return this.get(IS_AUTH);
  },

  getToken() {
    const remember = this.getRememberMe();
    if (remember) {
      const token = localStorage.getItem(ACCESS_TOKEN);
      return JSON.parse(token);
    } else {
      return this.get(ACCESS_TOKEN);
    }
  },

  // getToken() {
  //   // ưu tiên localStorage (rememberMe=true)
  //   const tokenLocal = localStorage.getItem(ACCESS_TOKEN);
  //   if (tokenLocal) return JSON.parse(tokenLocal);

  //   // fallback Cookies
  //   return this.get(ACCESS_TOKEN);
  // },

  getIDToken() {
    return this.get(ID_TOKEN);
  },

  getUser() {
    return this.get(USER_INFO);
  },
  getRole() {
    return this.get(ROLE);
  },

  getIsAdmin() {
    return this.get(IS_ADMIN);
  },

  getMaNhomQuyen() {
    return this.get(MA_NHOM_QUYEN);
  },

  getTenNhomQuyen() {
    return this.get(TEN_NHOM_QUYEN);
  },
  getSidenavColor() {
    return JSON.parse(localStorage.getItem(SIDENAV_COLOR));
  },

  getDarkMode() {
    return JSON.parse(localStorage.getItem(DARK_MODE));
  },

  getRememberMe() {
    return JSON.parse(localStorage.getItem(REMEMBER_ME));
  },
};

export default webStorageClient;
