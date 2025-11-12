import { SERVER_TYPE } from "./constants";

const prefixAuth = "";
const prefixBase = "data/rh/dbModule3";
const prefixToken = "data/module3";
const networkScanBase = "data/networkscan";
const netScanBase = "data/netscan/v2";

const endpointAuth = {
  LOGIN: `${prefixAuth}/oauth/signin?type=${SERVER_TYPE}`,
  SIGNUP: `${prefixAuth}/auth/sign-up`,
  SIGNOUT: `${prefixAuth}/oauth/signout`,
  ME: `${prefixAuth}/me`,
  UPDATE_USER: `${prefixAuth}/user/me`,
  GET_TOKEN: `${prefixAuth}/oauth/token`,
  GET_ORG: `${prefixAuth}/data/rh/dbCommon/cltOrg`,
  GET_WEBSITES: `${prefixAuth}/data/rh/dbWebMonitoring/cltWeb`,
  GET_WEBSITES_LIST: `${prefixAuth}data/rh/dbWebMonitoring/cltWeb`,
  GET_SOC_ALL: `${prefixAuth}soc-statistic/_search`,
  GET_SOC_SPECIFIC: `${prefixAuth}soc-statistic-*/_search`,
  GET_ADD_MONITOR: `${prefixAuth}/monitor/add`,
  GET_EDIT_MONITOR: `${prefixAuth}/monitor/edit`,
  GET_DELETE_MONITOR: `${prefixAuth}/monitor/delete`,
  GET_USER_LIST: `${prefixAuth}/users/getAllUser`,
  CHANGE_PASS: `${prefixAuth}/users/changePassword`,
  CHANGE_INFO: `${prefixAuth}/users/changeUserInfo`,
};

const endpointBase = {
  PRODUCT_DETAILS: `${prefixBase}/product/slug`,
  POLICY_SCAN_SETTING: `${prefixBase}/cltCauHinhBanQuet`,
  POLICY: `${prefixBase}/cltChinhSach`,
  POLICY_V2: `${prefixBase}/cltScanConfigs`,
  BASE_POLICY: `${prefixBase}/cltBaseScanConfigs`,
  FOLDER: `${prefixBase}/cltThuMuc`,
  TYPE_FILE: `${prefixBase}/cltLoaiHeThongTep`,
  HOST: `${prefixBase}/cltHost`,
  NETWORKSCAN: networkScanBase,
  NETWORKSCAN_COMMAND: `${networkScanBase}/command`,
  APIKEY: `${prefixBase}/cltAPI`,
  CREDENTIAL: `${prefixBase}/cltCredentials`,
  CREDENTIAL_CREATE: `${netScanBase}/credential`,
  CREATETOKEN: `${prefixToken}/createToken`,
  SMTP_SERVER: `${prefixBase}/cltSmtpServer`,
  PLUGIN: `${prefixBase}/cltPlugin`,
  ID_ALERT: `${prefixToken}/getIdAlert`,
  SCAN: `${prefixToken}/addBanQuet`,
  SCAN_LIST: `${prefixBase}/cltBanQuet`,
  ALERT: `${prefixBase}/cltAlerts`,
  ALERT_V2: `${prefixBase}/cltNotifyConfigs`,
  WARNING: `${prefixBase}/cltCauHinhThongBao`,
  TARGET: `${prefixToken}/uploadExcelToTarget`,
  TARGETS_LIST: `${prefixBase}/cltTargets`,
  TARGETS_CREATE: `${netScanBase}/target`,
  DOWNLOAD_FILE: `${prefixToken}/public/downloadBaoCao`,
  SCHEDULE: `${prefixBase}/cltSchedules`,
  SCHEDULE_MODIFY: `${netScanBase}/schedule`,
  SCAN_LIST_V2: `${prefixBase}/cltScanTasks`,
  SCAN_DETAIL: `${prefixBase}/cltTasks`,
  SCAN_MODIFY: `${netScanBase}/task`,
  RUN_SCAN: `${netScanBase}/task/:id/run`,
  REPORT: `${prefixBase}/cltScanReports`,
  REPORT_MODIFY: `${netScanBase}/report`,
  OPTION_SELECT_OS: `${netScanBase}/audit/ssgs`,
  UNIT: `/data/rh/dbCommon/cltOrigin`,
};

const endpointCsdlNganh = {
  UpdateDoiTuongDuLieu: "/data/rh/doi-tuong-du-lieu/cap-nhat",
  ChiTietDoiTuongDuLieu: "/data/rh/doi-tuong-du-lieu",
  MienDuLieu: "/data/rh/mien-du-lieu",
  MienChaUpdate: "/mien-cha-for-update",
  CapNhatMien: "/data/rh/mien-du-lieu/cap-nhat",
  DanhSachMienDuLieu: "/data/rh/mien-du-lieu",
  DanhSachDoiTuongDuLieu: "/data/rh/doi-tuong-du-lieu",
  KieuDuLieu: "/data/rh/doi-tuong-du-lieu/kieu-du-lieu",
  DoiTuongDuLieu: "/data/rh/doi-tuong-du-lieu",
  DuLieu: "/data/rh/doi-tuong-du-lieu/data",
  NhapLieu: "/data/rh/doi-tuong-du-lieu/nhap-lieu",
  ThuMucVaTapTin: "/data/rh/thu-muc-va-tap-tin",
  SuperSet: "/data/rh/superset",
  DonVi: "/data/rh/don-vi",
};

const endpointUser = {
  UpdateUser: "/data/rh/quan-ly-nguoi-dung/cap-nhat",
  ChiTietUser: "/data/rh/quan-ly-nguoi-dung",
  DanhSachUser: "/data/rh/quan-ly-nguoi-dung",
  GetByIdDonVi: "/data/rh/quan-ly-nguoi-dung/users-in-org",
  LGSPInfo: "/data/rh/quan-ly-nguoi-dung/lgsp-info",
  GetByTaiKhoan: "/data/rh/quan-ly-nguoi-dung/tai-khoan",
  proFileUser: "/data/rh/profile",
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

const endpointCurrentPermission = {
  DanhSach: "/data/rh/current-permission",
  GetByTaiKhoan: "/data/rh/current-permission/tai-khoan",
};

const endpointSuperSet = {
  DonViForMapping: "/data/rh/superset/don-vi-for-mapping",
  Roles: "/data/rh/superset/roles",
  MappingDonViRole: "/data/rh/superset/mapping-don-vi-role",
  DanhSachNguoiDung: "/data/rh/superset/danh-sach-nguoi-dung",
  ThemNguoiDung: "/data/rh/superset/them-nguoi-dung",
  XoaNguoiDung: "/data/rh/superset/xoa-nguoi-dung",
  DanhSachDonViMapRole: "/data/rh/superset/danh-sach-map-role",
  TaoTaiKhoan: "/data/rh/superset/tao-tai-khoan",
  XoaTaiKhoan: "/data/rh/superset/xoa-tai-khoan",
  ChiTietNguoiDung: "/data/rh/superset/chi-tiet-nguoi-dung",
  CapNhatNguoiDung: "/data/rh/superset/cap-nhat-nguoi-dung",
  CapNhatTaiKhoan: "/data/rh/superset/cap-nhat-tai-khoan",
  DanhSachRole: "/api/v1/security/users",
};

const endpointDonVi = {
  UpdateDonVi: "/data/rh/quan-ly-don-vi/cap-nhat",
  ChiTietDonVi: "/data/rh/quan-ly-don-vi",
  DanhSachDonVi: "/data/rh/quan-ly-don-vi",
  RecordAndDescendants: "/data/rh/quan-ly-don-vi/record-and-descendants",
  CheckDBHasCollections: "/data/rh/quan-ly-don-vi/db-has-collections",
};

const endpointLog = {
  getAll: "/data/rh/nhat-ky-he-thong",
};

const endpointChiaSe = {
  DanhSachChiaSe: "/data/rh/chia-se-du-lieu",
  UpdateChiaSe: "/data/rh/chia-se-du-lieu/cap-nhat",
  HuyChiaSe: "/data/rh/chia-se-du-lieu/huy-chia-se",
  HuyChiaSeMotTruong: "/data/rh/chia-se-du-lieu/huy-chia-se-mot-truong-du-lieu",
};

const endpointTichHop = {
  DanhSachTichHop: "/data/rh/tich-hop-du-lieu",
  GetDataByUrl: "/data/rh/tich-hop-du-lieu/get-data-by-url",
};

const endpointOther = {
  UPLOAD_IMG: `${prefixAuth}/upload`,
};

export {
  endpointAuth,
  endpointBase,
  endpointCsdlNganh,
  endpointOther,
  endpointUser,
  endpointNhomQuyen,
  endpointPhanQuyen,
  endpointDonVi,
  endpointLog,
  endpointSuperSet,
  endpointCurrentPermission,
  endpointChiaSe,
  endpointTichHop,
};
