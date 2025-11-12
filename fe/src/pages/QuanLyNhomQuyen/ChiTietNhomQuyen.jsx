import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout/index";
import DashboardNavbar from "examples/Navbars/DashboardNavbar/index";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";

import { API_SERVER } from "services/constants";
import { getRequest, patchRequest } from "services/request/index";
import { AuthContext } from "context/index";
import { useMaterialUIController } from "context";
import colors from "assets/theme/base/colors";
import { endpointNhomQuyen, endpointDonVi } from "services/endpoint";
import DataTable from "examples/Tables/DataTable/index";
import { Icon, TextField } from "../../../node_modules/@mui/material/index";
import { XoaNhomQuyen } from "./XoaNhomQuyen";

const CapNhatNhomQuyen = () => {
  const params = useParams();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [formData, setFormData] = useState();
  const [loading, setLoading] = useState(true); // Thêm trạng thái tải
  const [checkboxStates, setCheckboxStates] = useState();
  const [headerXemChecked, setHeaderXemChecked] = useState(false);
  const [headerThemChecked, setHeaderThemChecked] = useState(false);
  const [headerSuaChecked, setHeaderSuaChecked] = useState(false);
  const [headerXoaChecked, setHeaderXoaChecked] = useState(false);
  const [reload, setReload] = useState(false);
  const [listRole, setListRole] = useState();
  const { getRole } = useContext(AuthContext);
  const { getIsAdmin } = useContext(AuthContext);
  const [isAdmin, IsAdmin] = useState(getIsAdmin() || false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    const currentPath = "/nhom-quyen";
    const getRoleArray = getRole();
    const data = getRoleArray[0]?.quyen?.chucNang?.filter(
      (item) => item?.Ma === currentPath
    );
    setListRole(data[0]?.HanhDong);
  }, []);

  useEffect(() => {
    getRequest(
      `${API_SERVER}${endpointNhomQuyen?.ChiTietNhomQuyen}/${params?.id}`
    )
      ?.then(async (res) => {
        setFormData((pre) => ({
          ...pre,
          maNhomQuyen: res?.data?.maNhomQuyen,
          tenNhomQuyen: res?.data?.tenNhomQuyen,
          ghiChu: res?.data?.ghiChu,
          kichHoat: res?.data?.kichHoat,
        }));

        setCheckboxStates(res?.data?.quyenChucNang);
        setHeaderXemChecked(
          res?.data?.quyenChucNang?.every((element) => element.HanhDong.GET)
        );
        setHeaderThemChecked(
          res?.data?.quyenChucNang?.every((element) => element.HanhDong.POST)
        );
        setHeaderSuaChecked(
          res?.data?.quyenChucNang?.every((element) => element.HanhDong.PATCH)
        );
        setHeaderXoaChecked(
          res?.data?.quyenChucNang?.every((element) => element.HanhDong.DELETE)
        );
      })
      ?.catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false); // Đặt trạng thái tải thành false khi hoàn tất
      });
  }, []);

  const handleGoBack = () => {
    navigate("/nhom-quyen");
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
            Tên
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
            <Checkbox
              checked={headerXemChecked}
              // onChange={() => handleHeaderXemCheckboxChange("GET")}
            />
            Xem
          </MDTypography>
        ),
        accessor: "GET",
        Cell: ({ row }) => {
          const ma = row.original.Ma;
          return (
            <Checkbox
              checked={
                checkboxStates.find((item) => item.Ma === ma)?.HanhDong.GET
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
            <Checkbox
              checked={headerThemChecked}
              // onChange={() => handleHeaderThemCheckboxChange("POST")}
            />
            Thêm
          </MDTypography>
        ),
        accessor: "POST",
        Cell: ({ row }) => {
          const ma = row.original.Ma;
          return (
            <Checkbox
              checked={
                checkboxStates.find((item) => item.Ma === ma)?.HanhDong.POST
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
            <Checkbox
              checked={headerSuaChecked}
              // onChange={() => handleHeaderSuaCheckboxChange("PATCH")}
            />
            Sửa
          </MDTypography>
        ),
        accessor: "PATCH",
        Cell: ({ row }) => {
          const ma = row.original.Ma;
          return (
            <Checkbox
              checked={
                checkboxStates.find((item) => item.Ma === ma)?.HanhDong.PATCH
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
            <Checkbox
              checked={headerXoaChecked}
              // onChange={() => handleHeaderXoaCheckboxChange("DELETE")}
            />
            Xóa
          </MDTypography>
        ),
        accessor: "DELETE",
        Cell: ({ row }) => {
          const ma = row.original.Ma;
          return (
            <Checkbox
              checked={
                checkboxStates.find((item) => item.Ma === ma)?.HanhDong.DELETE
              }
              // onChange={() => handleCheckboxChange(ma, "DELETE")}
            />
          );
        },
      },
    ],
    rows: checkboxStates,
  };

  return (
    <DashboardLayout>
      <XoaNhomQuyen
        open={openDelete}
        setOpen={setOpenDelete}
        id={params?.id}
        reload={reload}
        setReload={setReload}
        handleGoBack={handleGoBack}
      />
      <DashboardNavbar breadcrumbTitle="Chi tiết nhóm quyền" />
      <Card sx={{ width: "100%", marginTop: "0.5rem" }}>
        <MDBox p={1} component="form">
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
                  CHI TIẾT NHÓM QUYỀN
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
                  onClick={() => navigate("/nhom-quyen")}
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
                Thông tin Nhóm quyền
              </MDTypography>
            </MDBox>
          </Grid>

          <Grid container p={0}>
            {/* <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingTop: "0px", paddingBottom: "0px" }}
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
                  Đơn vị <span style={{ color: colors?.error?.main }}>*</span>{" "}
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={10}>
                <TextField
                  fullWidth
                  name="donVi"
                  value={donVi?.title}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                  // onChange={handleInputChange}
                  // error={error.tenNhomQuyen}
                  // helperText={
                  //   error.tenNhomQuyen ? "Vui lòng nhập Tên đơn vị" : ""
                  // }
                  // InputLabelProps={{
                  //   shrink: true,
                  // }}
                  // required
                />
              </Grid>
            </Grid> */}

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
                  Tên Nhóm quyền{" "}
                  <span style={{ color: colors?.error?.main }}>*</span>{" "}
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Nhập Tên Nhóm quyền"
                  name="tenNhomQuyen"
                  value={formData?.tenNhomQuyen}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  readonly={true}
                  disabled={true}
                  required
                />
              </Grid>
            </Grid>
            {/* Mã Nhóm quyền */}
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
                  Mã Nhóm quyền{" "}
                  <span style={{ color: colors?.error?.main }}>*</span>{" "}
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Nhập mã nhóm quyền"
                  name="maNhomQuyen"
                  value={formData?.maNhomQuyen}
                  readonly={true}
                  disabled={true}
                  required
                />
              </Grid>
            </Grid>
            {/* Ghi chú */}
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
                  Ghi chú
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={10}>
                <TextField
                  fullWidth
                  placeholder="Nhập ghi chú"
                  name="ghiChu"
                  value={formData?.ghiChu}
                  // onChange={handleInputChange}
                  multiline
                  rows={4}
                  variant="outlined"
                  readonly={true}
                  disabled={true}
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
              <Grid item xs={12} md={10}>
                <Checkbox
                  name="kichHoat"
                  // onChange={handleInputChange}
                  checked={formData?.kichHoat}
                />
              </Grid>
            </Grid>
          </Grid>

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
                Chức năng
              </MDTypography>
            </MDBox>
            <DataTable
              table={data}
              isSorted={false}
              sx={{ border: "1px solid", padding: "0rem" }}
              showTotalEntries={false}
              // canSearch
              // onChangeSearch={onChangeSearch}
              // hasButtons
              // buttons={buttonList}
              // entriesPerPage={{ defaultValue: pageSize }}
              // totalPage={totalPage}
              // pageCurrent={page}
              // onPageChange={(newPage) => setPage(newPage)}
              // onPageSizeChange={(newPageSize) => {
              //   setPageSize(newPageSize);
              // }}
            />
          </Grid>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
};
export default CapNhatNhomQuyen;
