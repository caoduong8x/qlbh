import { API_SERVER } from "services/constants";

const endpointAuth = {
  LOGIN: `${API_SERVER}/auth/login`,
  SIGNOUT: `${API_SERVER}/auth/signout`,
  ME: `${API_SERVER}/me`,
  UPDATE_USER: `${API_SERVER}/user/me`,
  GET_USER_LIST: `${API_SERVER}/users/getAllUser`,
  CHANGE_PASS: `${API_SERVER}/users/changePassword`,
  CHANGE_INFO: `${API_SERVER}/users/changeUserInfo`,
};

const endpointKhachHang = `${API_SERVER}/customers`;

const endpointNhomQuyen = {
  UpdateNhomQuyen: "/data/rh/nhom-quyen/cap-nhat",
  ChiTietNhomQuyen: "/data/rh/nhom-quyen",
  DanhSachNhomQuyen: "/data/rh/nhom-quyen",
};

const endpointPhanQuyen = {
  UpdatePhanQuyen: "/data/rh/phan-quyen/cap-nhat",
  ChiTietPhanQuyen: "/data/rh/phan-quyen",
  DanhSachPhanQuyen: "/data/rh/phan-quyen",
  PhanQuyenOneUser: "/data/rh/phan-quyen/phan-quyen-one-user",
  GetByTaiKhoan: "/data/rh/phan-quyen/tai-khoan",
};

const endpointLog = {
  getAll: "/data/rh/nhat-ky-he-thong",
};

export {
  endpointAuth,
  endpointKhachHang,
  endpointNhomQuyen,
  endpointPhanQuyen,
  endpointLog,
};
