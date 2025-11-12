import Cookies from "js-cookie";
import _ from "lodash";
import {
  ACCESS_TOKEN,
  ID_TOKEN,
  IS_AUTH,
  ROLE,
  MADINHDANH_DONVI,
  MADINHDANH_DONVICHA,
  USER_INFO,
  ACCESS_TOKEN_SUPERSET,
  ACCESS_TOKEN_ADMIN_SUPERSET,
  DONVI_ID,
  IS_ADMIN,
  LIST_CAU_TRUC_DU_LIEU,
  MA_DINH_DANH_DON_VI_SELECTED,
  MA_NHOM_QUYEN,
  TEN_NHOM_QUYEN,
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
  },

  setToken(value, option) {
    this.set(ACCESS_TOKEN, value, option);
  },

  setTokenSuperSet(value, option) {
    this.set(ACCESS_TOKEN_SUPERSET, value, option);
  },

  setTokenAdminSuperSet(value, option) {
    this.set(ACCESS_TOKEN_ADMIN_SUPERSET, value, option);
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

  setDonViId(value, option) {
    this.set(DONVI_ID, value, option);
  },

  setIsAdmin(value, option) {
    this.set(IS_ADMIN, value, option);
  },

  setMaDinhDanhDonVi(value, option) {
    this.set(MADINHDANH_DONVI, value, option);
  },
  setMaDinhDanhDonViCha(value, option) {
    this.set(MADINHDANH_DONVICHA, value, option);
  },

  setMaNhomQuyen(value, option) {
    this.set(MA_NHOM_QUYEN, value, option);
  },

  setTenNhomQuyen(value, option) {
    this.set(TEN_NHOM_QUYEN, value, option);
  },

  setListCauTrucDuLieu(value, option) {
    this.set(LIST_CAU_TRUC_DU_LIEU, value, option);
  },

  setMaDinhDanhDonViSelected(value, option) {
    this.set(MA_DINH_DANH_DON_VI_SELECTED, value, option);
  },

  getAuth() {
    return this.get(IS_AUTH);
  },

  getToken() {
    return this.get(ACCESS_TOKEN);
  },

  getTokenSuperSet() {
    return this.get(ACCESS_TOKEN_SUPERSET);
  },

  getTokenAdminSuperSet() {
    return this.get(ACCESS_TOKEN_ADMIN_SUPERSET);
  },

  getIDToken() {
    return this.get(ID_TOKEN);
  },

  getUser() {
    return this.get(USER_INFO);
  },
  getRole() {
    return this.get(ROLE);
  },

  getDonViId() {
    return this.get(DONVI_ID);
  },

  getIsAdmin() {
    return this.get(IS_ADMIN);
  },

  getMaDinhDanhDonVi() {
    return this.get(MADINHDANH_DONVI);
  },
  getMaDinhDanhDonViCha() {
    return this.get(MADINHDANH_DONVICHA);
  },

  getMaNhomQuyen() {
    return this.get(MA_NHOM_QUYEN);
  },

  getTenNhomQuyen() {
    return this.get(TEN_NHOM_QUYEN);
  },

  getListCauTrucDuLieu() {
    return this.get(LIST_CAU_TRUC_DU_LIEU);
  },

  getMaDinhDanhDonViSelected() {
    return this.get(MA_DINH_DANH_DON_VI_SELECTED);
  },
};

export default webStorageClient;
