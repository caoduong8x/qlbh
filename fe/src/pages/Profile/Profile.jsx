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

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/pages/profile/components/Header";
import PlatformSettings from "layouts/pages/profile/profile-overview/components/PlatformSettings";

// Data
import profilesListData from "layouts/pages/profile/profile-overview/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { useContext, useEffect, useState } from "react";
import { getRequest } from "services/request/getRequest";
import { API_SERVER } from "services/constants";
import { AuthContext } from "context";
import { set } from "date-fns";
import DataTable from "examples/Tables/DataTable/index";
import { useMaterialUIController } from "context/index";
import { Icon, TextField } from "../../../node_modules/@mui/material/index";
import Checkbox from "@mui/material/Checkbox";

function Profile() {
  const [controller] = useMaterialUIController();

  const { darkMode } = controller;

  const [user, setUser] = useState();
  const [tenNhomQuyen, setTenNhomQuyen] = useState();
  const { getCurrentUser, getTenNhomQuyen } = useContext(AuthContext);
  const [quyenChucNang, setQuyenChucNang] = useState([]);

  const data = {
    columns: [
      {
        key: 1,
        Header: () => (
          <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
            STT
          </MDTypography>
        ),
        accessor: "id",
        Cell: ({ row }) => {
          return (
            <MDTypography
              variant="caption"
              color={darkMode ? "white" : "dark"}
              sx={{
                fontSize: "14px",
              }}
            >
              {row.index + 1}
            </MDTypography>
          );
        },
        width: "5%",
      },
      {
        key: 2,
        Header: () => (
          <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
            Tên chức năng
          </MDTypography>
        ),
        accessor: "Ten",
        Cell: ({ cell: { value } }) => {
          return (
            <>
              <MDTypography
                variant="caption"
                color={darkMode ? "white" : "dark"}
                sx={{
                  fontSize: "14px",
                }}
              >
                {value}
              </MDTypography>
            </>
          );
        },
      },
      {
        key: 3,
        Header: () => (
          <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
            Quyền xem
          </MDTypography>
        ),
        accessor: "GET",
        Cell: ({ row }) => {
          const ma = row.original.Ma;
          return (
            <Checkbox
              checked={
                quyenChucNang.find((item) => item.Ma === ma)?.HanhDong.GET
              }
              // onChange={() => handleCheckboxChange(ma, "GET")}
            />
          );
        },
      },
      {
        key: 4,
        Header: () => (
          <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
            Quyền thêm
          </MDTypography>
        ),
        accessor: "POST",
        Cell: ({ row }) => {
          const ma = row.original.Ma;
          return (
            <Checkbox
              checked={
                quyenChucNang.find((item) => item.Ma === ma)?.HanhDong.POST
              }
              // onChange={() => handleCheckboxChange(ma, "POST")}
            />
          );
        },
      },
      {
        key: 5,
        Header: () => (
          <MDTypography
            variant="h6"
            color={darkMode ? "white" : "dark"}
            sx={{
              fontSize: "14px",
            }}
          >
            Quyền sửa
          </MDTypography>
        ),
        accessor: "PATCH",
        Cell: ({ row }) => {
          const ma = row.original.Ma;
          return (
            <Checkbox
              checked={
                quyenChucNang.find((item) => item.Ma === ma)?.HanhDong.PATCH
              }
              // onChange={() => handleCheckboxChange(ma, "PATCH")}
            />
          );
        },
      },
      {
        key: 6,
        Header: () => (
          <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
            Quyền xóa
          </MDTypography>
        ),
        accessor: "DELETE",
        Cell: ({ row }) => {
          const ma = row.original.Ma;
          return (
            <Checkbox
              checked={
                quyenChucNang.find((item) => item.Ma === ma)?.HanhDong.DELETE
              }
              // onChange={() => handleCheckboxChange(ma, "DELETE")}
            />
          );
        },
      },
    ],
    rows: quyenChucNang,
  };
  return (
    <DashboardLayout onWheel={(e) => e.preventDefault()}>
      <DashboardNavbar breadcrumbTitle="Thông tin cá nhân" />
      {user && (
        <Header infoUser={user}>
          <MDBox mt={5} mb={3}>
            <Grid container spacing={1}>
              {/* <Grid item xs={12} md={6} xl={4}>
                <PlatformSettings />
              </Grid> */}
              {/* <Grid item xs={12} md={12} xl={12} sx={{ display: "flex" }}>
                <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
                <ProfileInfoCard
                  title="Thông tin cá nhân"
                  description=""
                  info={{
                    "Tên đầy đủ": user[0]?.hoVaTen || "",
                    "Số điện Thoại": user[0]?.dienThoai || "",
                    Email: user[0]?.taiKhoan || "",
                    "Đơn vị": user[0]?.donVi?.tenDonVi || "",
                    "Phòng ban": user[0]?.phongBan?.tenDonVi || "",
                    "Nhóm quyền": tenNhomQuyen || "",
                  }}
                  social={[
                    {
                      link: "https://www.facebook.com/",
                      icon: <FacebookIcon />,
                      color: "facebook",
                    },
                    {
                      link: "https://twitter.com/",
                      icon: <TwitterIcon />,
                      color: "twitter",
                    },
                    {
                      link: "https://www.instagram.com/",
                      icon: <InstagramIcon />,
                      color: "instagram",
                    },
                  ]}
                  action={{ route: "", tooltip: "Edit Profile" }}
                  shadow={false}
                />
                <Divider orientation="vertical" sx={{ mx: 0 }} />
              </Grid> */}
              {/* <Grid item xs={12} xl={4}>
                <ProfilesList
                  title="conversations"
                  profiles={profilesListData}
                  shadow={false}
                />
              </Grid> */}
            </Grid>

            <Grid item xs={12} p={0}>
              <MDBox
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
                style={{ paddingBottom: "4px" }}
              >
                <Icon color="info" style={{ paddingRight: "5px" }}>
                  info
                </Icon>
                <MDTypography variant="h6" color="info" fontWeight="bold">
                  Thông tin cá nhân
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid container p={1}>
              <Grid
                container
                justifyContent="flex-start"
                alignItems="center"
                sx={{ padding: "0px" }}
                xs={12}
                md={6}
              >
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    textAlign: { xs: "left", md: "left" },
                    padding: { xs: "0", md: "10px" },
                  }}
                >
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    Tên đầy đủ{" "}
                    <MDTypography
                      variant="button"
                      fontWeight="regular"
                      color="text"
                    >
                      {user[0]?.hoVaTen || ""}
                    </MDTypography>
                  </MDTypography>
                </Grid>
              </Grid>

              <Grid
                container
                justifyContent="flex-start"
                alignItems="center"
                sx={{ padding: "0px" }}
                xs={12}
                md={6}
              >
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    textAlign: { xs: "left", md: "left" },
                    padding: { xs: "0", md: "10px" },
                  }}
                >
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    Đơn vị{" "}
                    <MDTypography
                      variant="button"
                      fontWeight="regular"
                      color="text"
                    >
                      {user[0]?.donVi?.tenDonVi || ""}
                    </MDTypography>
                  </MDTypography>
                </Grid>
              </Grid>

              <Grid
                container
                justifyContent="flex-start"
                alignItems="center"
                sx={{ padding: "0px" }}
                xs={12}
                md={6}
              >
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    textAlign: { xs: "left", md: "left" },
                    padding: { xs: "0", md: "10px" },
                  }}
                >
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    Điện thoại{" "}
                    <MDTypography
                      variant="button"
                      fontWeight="regular"
                      color="text"
                    >
                      {user[0]?.dienThoai || ""}
                    </MDTypography>
                  </MDTypography>
                </Grid>
              </Grid>

              <Grid
                container
                justifyContent="flex-start"
                alignItems="center"
                sx={{ padding: "0px" }}
                xs={12}
                md={6}
              >
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    textAlign: { xs: "left", md: "left" },
                    padding: { xs: "0", md: "10px" },
                  }}
                >
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    Phòng ban{" "}
                    <MDTypography
                      variant="button"
                      fontWeight="regular"
                      color="text"
                    >
                      {user[0]?.phongBan?.tenDonVi || ""}
                    </MDTypography>
                  </MDTypography>
                </Grid>
              </Grid>

              <Grid
                container
                justifyContent="flex-start"
                alignItems="center"
                sx={{ padding: "0px" }}
                xs={12}
                md={6}
              >
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    textAlign: { xs: "left", md: "left" },
                    padding: { xs: "0", md: "10px" },
                  }}
                >
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    Email{" "}
                    <MDTypography
                      variant="button"
                      fontWeight="regular"
                      color="text"
                    >
                      {user[0]?.taiKhoan || ""}
                    </MDTypography>
                  </MDTypography>
                </Grid>
              </Grid>

              <Grid
                container
                justifyContent="flex-start"
                alignItems="center"
                sx={{ padding: "0px" }}
                xs={12}
                md={6}
              >
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    textAlign: { xs: "left", md: "left" },
                    padding: { xs: "0", md: "10px" },
                  }}
                >
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    Nhóm quyền{" "}
                    <MDTypography
                      variant="button"
                      fontWeight="regular"
                      color="text"
                    >
                      {tenNhomQuyen || ""}
                    </MDTypography>
                  </MDTypography>
                </Grid>
              </Grid>
            </Grid>
            <Divider />
            {quyenChucNang.length > 0 ? (
              <Grid item xs={12} p={0}>
                <MDBox
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Icon color="info" style={{ paddingRight: "5px" }}>
                    info
                  </Icon>
                  <MDTypography variant="h6" color="info" fontWeight="bold">
                    Chức năng của người dùng
                  </MDTypography>
                </MDBox>

                <DataTable
                  table={data}
                  isSorted={false}
                  sx={{ border: "1px solid", padding: "0rem" }}
                  showTotalEntries={false}
                />
              </Grid>
            ) : (
              ""
            )}
          </MDBox>
          {/* <MDBox pt={2} px={2} lineHeight={1.25}>
            <MDTypography variant="h6" fontWeight="medium">
              Projects
            </MDTypography>
            <MDBox mb={1}>
              <MDTypography variant="button" color="text">
                Architects design houses
              </MDTypography>
            </MDBox>
          </MDBox> */}
        </Header>
      )}
    </DashboardLayout>
  );
}

export default Profile;
