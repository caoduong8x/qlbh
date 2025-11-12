// Material Dashboard 2 PRO React layouts

// @mui icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import GridViewIcon from "@mui/icons-material/GridView";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import StorageIcon from "@mui/icons-material/Storage";
import MapIcon from "@mui/icons-material/Map";
import ArticleIcon from "@mui/icons-material/Article";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import WebStoriesIcon from "@mui/icons-material/WebStories";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SendIcon from "@mui/icons-material/Send";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import HubIcon from "@mui/icons-material/Hub";
// Images

import QuanLyNguoiDung from "pages/QuanLyNguoiDung/QuanLyNguoiDung";
import ChiTietNguoiDung from "pages/QuanLyNguoiDung/ChiTietNguoiDung";
import CapNhatNguoiDung from "pages/QuanLyNguoiDung/CapNhatNguoiDung";
import ThemNguoiDung from "pages/QuanLyNguoiDung/ThemNguoiDung";
import QuanLyNhomQuyen from "pages/QuanLyNhomQuyen/QuanLyNhomQuyen";
import ChiTietNhomQuyen from "pages/QuanLyNhomQuyen/ChiTietNhomQuyen";
import CapNhatNhomQuyen from "pages/QuanLyNhomQuyen/CapNhatNhomQuyen";
import ThemNhomQuyen from "pages/QuanLyNhomQuyen/ThemNhomQuyen";
import QuanLyPhanQuyen from "pages/QuanLyPhanQuyen/QuanLyPhanQuyen";
import CapNhatPhanQuyen from "pages/QuanLyPhanQuyen/CapNhatPhanQuyen";
import NhatKyHeThong from "pages/NhatKyHeThong/NhatKyHeThong";
import ChiTietNhatKy from "pages/NhatKyHeThong/ChiTietNhatKy";
import Profile from "pages/Profile/Profile";

const routes = [
  {
    key: 1,
    route: "/quan-tri-he-thong",
    icon: <SettingsIcon />,
    name: "Quản trị hệ thống",
    role: ["*"],
    collapse: [
      {
        key: 1.1,
        route: "/quan-ly-nguoi-dung",
        component: <QuanLyNguoiDung />,
        icon: <ManageAccountsIcon />,
        name: "Quản lý người dùng",
        role: ["*"],
        level: 2,
      },
      {
        key: 1.2,
        route: "/nhom-quyen",
        component: <QuanLyNhomQuyen />,
        icon: <WebStoriesIcon />,
        name: "Quản lý nhóm quyền",
        role: ["*"],
        level: 2,
      },
      {
        key: 1.3,
        route: "/phan-quyen",
        component: <QuanLyPhanQuyen />,
        icon: <AssignmentIndIcon />,
        name: "Phân quyền người dùng",
        role: ["*"],
        level: 2,
      },
      {
        key: 1.4,
        route: "/nhat-ky-he-thong",
        component: <NhatKyHeThong />,
        icon: <EventNoteIcon />,
        name: "Lịch sử thao tác hệ thống",
        role: ["*"],
        level: 2,
      },
    ],
  },

  {
    key: 2,
    // route: MAIN_ROUTER.ALERT_LIST_V2,
    // component: AlertListV2,
    icon: <LogoutIcon />,
    name: "Logout",
    level: 1,
    role: ["*"],
  },

  {
    key: 3,
    route: "/chi-tiet-nguoi-dung/:id",
    component: <ChiTietNguoiDung />,
    name: "Chi tiết người dùng",
    icon: <ChiTietNguoiDung />,
    show: false,
    role: ["*"],
    collapse: [
      {
        key: 3.1,
        route: "/chi-tiet-nguoi-dung/:id",
        component: <ChiTietNguoiDung />,
        name: "Chi tiết người dùng",
        role: ["*"],
      },
      {
        key: 3.2,
        route: "/cap-nhat-nguoi-dung/:id",
        component: <CapNhatNguoiDung />,
        name: "Cập nhật người dùng",
        role: ["*"],
      },
      {
        key: 3.3,
        route: "/them-nguoi-dung",
        component: <ThemNguoiDung />,
        name: "Thêm người dùng",
        role: ["*"],
      },
    ],
  },

  {
    key: 4,
    route: "/chi-tiet-nhom-quyen/:id",
    component: <ChiTietNhomQuyen />,
    name: "Chi tiết nhóm quyền",
    icon: <ChiTietNhomQuyen />,
    show: false,
    role: ["*"],
    collapse: [
      {
        key: 4.1,
        route: "/chi-tiet-nhom-quyen/:id",
        component: <ChiTietNhomQuyen />,
        name: "Chi tiết nhóm quyền",
        role: ["*"],
      },
      {
        key: 4.2,
        route: "/cap-nhat-nhom-quyen/:id",
        component: <CapNhatNhomQuyen />,
        name: "Cập nhật nhóm quyền",
        role: ["*"],
      },
      {
        key: 4.3,
        route: "/them-nhom-quyen",
        component: <ThemNhomQuyen />,
        name: "Thêm nhóm quyền",
        role: ["*"],
      },
    ],
  },

  {
    key: 5,
    route: "/chi-tiet-nhat-ky/:id",
    component: <ChiTietNhatKy />,
    name: "Chi tiết nhật ký",
    icon: <DashboardIcon />,
    show: false,
    role: ["*"],
    collapse: [],
  },

  {
    key: 5,
    route: "/profile",
    component: <Profile />,
    name: "Thông tin cá nhân",
    icon: <DashboardIcon />,
    show: false,
    role: ["*"],
    collapse: [],
  },
  {
    key: 6,
    route: "/chi-tiet-phan-quyen/:id",
    component: <CapNhatPhanQuyen edit={false} />,
    name: "Chi tiết phân quyền",
    icon: <DashboardIcon />,
    show: false,
    role: ["*"],
    collapse: [],
  },
  {
    key: 7,
    route: "/cap-nhat-phan-quyen/:id",
    component: <CapNhatPhanQuyen edit={true} />,
    name: "Cập nhật phân quyền",
    icon: <DashboardIcon />,
    show: false,
    role: ["*"],
    collapse: [],
  },
];

export default routes;
