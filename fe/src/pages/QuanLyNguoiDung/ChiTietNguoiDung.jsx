import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "context/index";
import colors from "assets/theme/base/colors";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout/index";
import DashboardNavbar from "examples/Navbars/DashboardNavbar/index";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import { useMaterialUIController } from "context/index";
import { API_SERVER } from "services/constants";
import { endpointUser, endpointCurrentPermission } from "services/endpoint";
import { getRequest } from "services/request/index";
import DataTable from "examples/Tables/DataTable/index";
import { Icon, TextField } from "../../../node_modules/@mui/material/index";
import { XoaNguoiDung } from "./XoaNguoiDung";

const ChiTietNguoiDung = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const params = useParams();
  const navigate = useNavigate();

  const [dataDetail, setDataDetail] = useState();
  const [loading, setLoading] = useState(true); // Thêm trạng thái tải
  const [currentPermission, setCurrentPermission] = useState();
  const [quyenChucNang, setQuyenChucNang] = useState([]);

  const [idUserSuperSet, setIdUserSuperSet] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const { getIsAdmin } = useContext(AuthContext);
  const [isAdmin, IsAdmin] = useState(getIsAdmin() || false);
  const [listRole, setListRole] = useState();
  const { getRole } = useContext(AuthContext);

  useEffect(() => {
    const currentPath = "/quan-ly-nguoi-dung";
    const getRoleArray = getRole();
    const data = getRoleArray[0]?.quyen?.chucNang?.filter(
      (item) => item?.Ma === currentPath
    );
    setListRole(data[0]?.HanhDong);
  }, []);

  useEffect(() => {
    getRequest(`${API_SERVER}${endpointUser.ChiTietUser}/${params?.id}`)
      ?.then((res) => {
        setDataDetail(res?.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false); // Đặt trạng thái tải thành false khi hoàn tất
      });
  }, [params?.id]);

  useEffect(() => {
    if (dataDetail)
      getRequest(
        `${API_SERVER}${endpointCurrentPermission.GetByTaiKhoan}/${dataDetail.taiKhoan}`
      )
        ?.then((res) => {
          if (res?.data?._embedded?.length > 0) {
            let CRPermission = res?.data?._embedded[0];
            setCurrentPermission(CRPermission);
            setQuyenChucNang(CRPermission?.quyen?.chucNang || []);
          }
        })
        .catch((err) => {
          console.log(err);
        });
  }, [dataDetail]);

  const handleGoBack = () => {
    navigate("/quan-ly-nguoi-dung");
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>; // Hiển thị thông báo khi đang tải
  }
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
    <DashboardLayout>
      <XoaNguoiDung
        open={openDelete}
        setOpen={setOpenDelete}
        id={params?.id}
        idUserSuperSet={idUserSuperSet}
        handleGoBack={handleGoBack}
        // refreshList={refreshList}
      ></XoaNguoiDung>
      <DashboardNavbar breadcrumbTitle="Chi tiết người dùng" />
      <Card sx={{ width: "100%", marginTop: "0.5rem" }}>
        <MDBox p={2} component="form">
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={12} sm={6}>
              <MDBox
                sx={{
                  width: "100%",
                  borderBottom: 1,
                  borderColor: "grey.300",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", lg: "flex-start" },
                }}
              >
                <MDTypography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ paddingTop: 2, paddingLeft: 2 }}
                >
                  CHI TIẾT NGƯỜI DÙNG
                </MDTypography>
              </MDBox>
            </Grid>

            <Grid item xs={12} sm={6}>
              <MDBox
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", lg: "flex-end" },
                  gap: 1,
                }}
              >
                {(listRole?.DELETE || isAdmin) && (
                  <MDButton
                    variant="gradient"
                    color="error"
                    sx={{ fontSize: "14px" }}
                    onClick={() => {
                      // setId(params?.id);
                      setOpenDelete(true);
                      setIdUserSuperSet(dataDetail?.idUserSuperset);
                    }}
                  >
                    <Icon color="white" style={{ paddingRight: "5px" }}>
                      delete
                    </Icon>{" "}
                    Xóa
                  </MDButton>
                )}
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={() =>
                    navigate("/quan-ly-nguoi-dung", {
                      state: { value: false, text: "" },
                    })
                  }
                  sx={{ fontSize: "14px" }}
                >
                  <Icon color="white" style={{ paddingRight: "5px" }}>
                    reply
                  </Icon>
                  &nbsp;Quay lại
                </MDButton>
              </MDBox>
            </Grid>
          </Grid>
          {quyenChucNang.length > 0 ? (
            <Grid item xs={12} p={1}>
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
                  Thông tin cơ bản
                </MDTypography>
              </MDBox>
            </Grid>
          ) : (
            ""
          )}
          <Grid container p={0}>
            {/* Email */}
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingBottom: "10px" }}
              xs={12}
              md={6}
            >
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  textAlign: { xs: "left", md: "right" },
                  padding: { xs: "0", md: "20px" },
                }}
              >
                <MDTypography
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  Email công vụ{" "}
                  <span style={{ color: colors?.error?.main }}>*</span>{" "}
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Nhập email"
                  name="tkMailCongVu"
                  value={dataDetail?.tkMailCongVu}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            {/* Phòng ban */}
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingBottom: "10px" }}
              xs={12}
              md={6}
            >
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  textAlign: { xs: "left", md: "right" },
                  padding: { xs: "0", md: "20px" },
                }}
              >
                <MDTypography
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  Phòng ban{" "}
                  <span style={{ color: colors?.error?.main }}>*</span>{" "}
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Không có phòng ban"
                  name="donVi"
                  value={dataDetail?.phongBan?.tenDonVi || ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>

            {/* Tài khoản */}
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingBottom: "10px" }}
              xs={12}
              md={6}
            >
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  textAlign: { xs: "left", md: "right" },
                  padding: { xs: "0", md: "20px" },
                }}
              >
                <MDTypography
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  Tài khoản{" "}
                  <span style={{ color: colors?.error?.main }}>*</span>{" "}
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Nhập tên tài khoản"
                  name="taiKhoan"
                  value={dataDetail?.tkMailCongVu}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            {/* Phòng ban cha */}
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingBottom: "10px" }}
              xs={12}
              md={6}
            >
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  textAlign: { xs: "left", md: "right" },
                  padding: { xs: "0", md: "20px" },
                }}
              >
                <MDTypography
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  Phòng ban cha{" "}
                  <span style={{ color: colors?.error?.main }}>*</span>{" "}
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Không có phòng ban cha"
                  name="donViCha"
                  value={dataDetail?.phongBanCha?.tenDonVi || ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>

            {/* Họ tên */}
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingBottom: "10px" }}
              xs={12}
              md={6}
            >
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  textAlign: { xs: "left", md: "right" },
                  padding: { xs: "0", md: "20px" },
                }}
              >
                <MDTypography
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  Họ tên <span style={{ color: colors?.error?.main }}>*</span>{" "}
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Nhập họ tên"
                  name="hoVaTen"
                  value={dataDetail?.hoVaTen}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            {/* Chức vụ */}
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingBottom: "10px" }}
              xs={12}
              md={6}
            >
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  textAlign: { xs: "left", md: "right" },
                  padding: { xs: "0", md: "20px" },
                }}
              >
                <MDTypography
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  Chức vụ <span style={{ color: colors?.error?.main }}>*</span>{" "}
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Không có chức vụ"
                  name="chucVu"
                  value={dataDetail?.chucVu?.tenChucVu || ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>

            {/* Điện thoại */}
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingBottom: "10px" }}
              xs={12}
              md={6}
            >
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  textAlign: { xs: "left", md: "right" },
                  padding: { xs: "0", md: "20px" },
                }}
              >
                <MDTypography
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  Điện thoại{" "}
                  <span style={{ color: colors?.error?.main }}>*</span>{" "}
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Không có số điện thoại"
                  name="dienThoai"
                  value={dataDetail?.dienThoai}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            {/* Đơn vị */}
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingTop: "0px", paddingBottom: "0px" }}
              xs={12}
              md={6}
            >
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  textAlign: { xs: "left", md: "right" },
                  padding: { xs: "0", md: "20px" },
                }}
              >
                <MDTypography
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  Đơn vị <span style={{ color: colors?.error?.main }}>*</span>{" "}
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Nhập tên tài khoản"
                  name="taiKhoan"
                  value={dataDetail?.donVi?.tenDonVi}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            {/* Nhóm quyền */}
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingTop: "0px", paddingBottom: "0px" }}
              xs={12}
              md={6}
            >
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  textAlign: { xs: "left", md: "right" },
                  padding: { xs: "0", md: "20px" },
                }}
              >
                <MDTypography
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  Nhóm quyền{" "}
                  <span style={{ color: colors?.error?.main }}>*</span>{" "}
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Không có nhóm quyền"
                  name="tennhomquyen"
                  value={currentPermission?.quyen?.tenNhomQuyen || ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            {/* Ghi chú */}
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingTop: "12px" }}
              xs={12}
            >
              <Grid
                item
                xs={12}
                md={2}
                sx={{
                  textAlign: { xs: "left", md: "right" },
                  padding: { xs: "0", md: "20px" },
                }}
              >
                <MDTypography
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  Ghi chú
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={10}>
                <TextField
                  fullWidth
                  placeholder="Không có ghi chú"
                  name="ghiChu"
                  value={dataDetail?.ghiChu}
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            {/* Kích hoạt */}
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingBottom: "10px" }}
              xs={12}
            >
              <Grid
                item
                xs={12}
                md={2}
                sx={{
                  textAlign: { xs: "left", md: "right" },
                  padding: { xs: "0", md: "20px" },
                }}
              >
                <MDTypography
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  Kích hoạt
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={10} lg={4}>
                <Checkbox name="kichHoat" checked={dataDetail?.kichHoat} />
              </Grid>
            </Grid>
          </Grid>
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
      </Card>
    </DashboardLayout>
  );
};

export default ChiTietNguoiDung;
