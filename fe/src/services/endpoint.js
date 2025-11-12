const prefixAuth = "";

const endpointAuth = {
  LOGIN: `${prefixAuth}/auth/login`,
  SIGNOUT: `${prefixAuth}/auth/signout`,
  ME: `${prefixAuth}/me`,
  UPDATE_USER: `${prefixAuth}/user/me`,
  GET_USER_LIST: `${prefixAuth}/users/getAllUser`,
  CHANGE_PASS: `${prefixAuth}/users/changePassword`,
  CHANGE_INFO: `${prefixAuth}/users/changeUserInfo`,
};

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

export { endpointAuth, endpointNhomQuyen, endpointPhanQuyen, endpointLog };
