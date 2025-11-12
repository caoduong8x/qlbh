import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import FormField from "layouts/applications/wizard/components/FormField";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout/index";
import DashboardNavbar from "examples/Navbars/DashboardNavbar/index";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import { API_SERVER } from "services/constants";
import { endpointBase, endpointCsdlNganh } from "services/endpoint";
import { getRequest, patchRequest, postRequest } from "services/request/index";
import { AuthContext } from "context/index";
import { Select, MenuItem, ListItemText, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useMaterialUIController } from "context";
import { Typography } from "@mui/material/index";
import colors from "assets/theme/base/colors";
import { endpointUser } from "services/endpoint";

const ThemNguoiDung = () => {
  const params = useParams();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [formData, setFormData] = useState({
    taiKhoan: "",
    hoVaTen: "",
    tkMailCongVu: "",
    dienThoai: "",
    ghiChu: "",
    kichHoat: false,
  });

  const [error, setError] = useState({
    taiKhoan: false,
    hoVaTen: false,
    tkMailCongVu: false,
    dienThoai: false,
    textError: "",
  });
  const regexTaiKhoan = /^[a-z][a-z0-9.@]*[a-z]$/;
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexDienThoai = /^0\d{9}$/;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "kichHoat")
      setFormData((prevData) => ({
        ...prevData,
        [name]: event.target.checked,
      }));
    else
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    if (value?.length > 0) {
      if (
        (name === "taiKhoan" && !regexTaiKhoan.test(value)) ||
        (name === "tkMailCongVu" && !regexEmail.test(value)) ||
        (name === "dienThoai" && !regexDienThoai.test(value))
      ) {
        setError((prevData) => ({
          ...prevData,
          [name]: true,
        }));
      } else {
        setError((prevData) => ({
          ...prevData,
          [name]: false,
        }));
      }
    } else {
      setError((prevData) => ({
        ...prevData,
        [name]: true,
      }));
    }
  };

  const submitForm = (event) => {
    event.preventDefault();
    setError({
      taiKhoan: !formData?.taiKhoan,
      hoVaTen: !formData?.hoVaTen,
      tkMailCongVu: !formData?.tkMailCongVu,
      dienThoai: !formData?.dienThoai,
      textError: "",
    });

    if (
      error?.taiKhoan === false &&
      error?.hoVaTen === false &&
      error?.tkMailCongVu === false &&
      error?.dienThoai === false
    ) {
      const url = `${API_SERVER}${endpointUser?.DanhSachUser}`;
      let data =
        formData.ghiChu.length > 0
          ? {
              taiKhoan: formData?.taiKhoan,
              hoVaTen: formData?.hoVaTen,
              tkMailCongVu: formData?.tkMailCongVu,
              dienThoai: formData?.dienThoai,
              ghiChu: formData?.ghiChu,
              kichHoat: formData?.kichHoat,
            }
          : {
              taiKhoan: formData?.taiKhoan,
              hoVaTen: formData?.hoVaTen,
              tkMailCongVu: formData?.tkMailCongVu,
              dienThoai: formData?.dienThoai,
              kichHoat: formData?.kichHoat,
            };
      postRequest(url, {
        data: data,
      })
        .then(() => {
          authContext.openAlert();
          authContext.alertInfo({
            icon: "notifications",
            title: "Thêm người dùng",
            content: "Thêm thành công !",
            open: authContext.open,
            close: authContext.openAlert(),
            color: "info",
          });
          navigate("/quan-ly-nguoi-dung");
        })
        .catch((e) => {
          console.log("e", e.response.data.message);
          let content =
            e.response?.status === 400
              ? "Thêm thất bại: " + e.response?.data?.message
              : "Thêm thất bại!";
          authContext.openAlert();
          authContext.alertInfo({
            icon: "notifications",
            title: "Thêm người dùng",
            content: content,
            open: authContext.open,
            close: authContext.openAlert(),
            color: "error",
          });
        });
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar breadcrumbTitle="Thêm người dùng" />
      <Card sx={{ width: "100%", marginTop: "1.5rem" }}>
        <MDBox p={2} component="form" method="POST" onSubmit={submitForm}>
          <MDBox display="flex" flexDirection="column" px={3} my={2}>
            <MDBox
              ml="auto"
              mt={0}
              mb={2}
              display="flex"
              justifyContent="flex-end"
            >
              <MDBox mx={2}>
                <MDButton
                  variant="gradient"
                  color="info"
                  size="small"
                  px={2}
                  mx={2}
                  onClick={() =>
                    navigate("/quan-ly-nguoi-dung", {
                      state: { value: false, text: "" },
                    })
                  }
                >
                  Huỷ
                </MDButton>
              </MDBox>

              <MDButton
                variant="gradient"
                color="info"
                size="small"
                type="submit"
              >
                Tạo
              </MDButton>
            </MDBox>

            <Grid
              container
              rowSpacing={1}
              columnSpacing={3}
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingBottom: "10px" }}
            >
              <Grid
                item
                xs={12}
                lg={3}
                md={6}
                sx={{ textAlign: { xs: "left", md: "right" } }}
              >
                <Typography
                  sx={{
                    color: darkMode ? `${colors?.white?.focus} !important` : "",
                    fontSize: "16px",
                  }}
                >
                  Tài khoản<span style={{ color: colors?.error }}>*</span>{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} lg={8}>
                <FormField
                  type="text"
                  placeholder="Nhập tên tài khoản"
                  name="taiKhoan"
                  value={formData?.taiKhoan}
                  onChange={handleInputChange}
                  error={error.taiKhoan}
                />
                {error.taiKhoan && (
                  <MDTypography
                    variant="caption"
                    color="error"
                    fontWeight="light"
                  >
                    Tài khoản không hợp lệ(bắt đầu bằng chữ cái, ít nhất 2 ký
                    tự)!
                  </MDTypography>
                )}
              </Grid>
            </Grid>

            <Grid
              container
              rowSpacing={1}
              columnSpacing={3}
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingBottom: "10px" }}
            >
              <Grid
                item
                xs={12}
                lg={3}
                md={6}
                sx={{ textAlign: { xs: "left", md: "right" } }}
              >
                <Typography
                  sx={{
                    color: darkMode ? `${colors?.white?.focus} !important` : "",
                    fontSize: "16px",
                  }}
                >
                  Họ tên<span style={{ color: colors?.error }}>*</span>{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} lg={8}>
                <FormField
                  type="text"
                  placeholder="Nhập họ tên"
                  name="hoVaTen"
                  value={formData?.hoVaTen}
                  onChange={handleInputChange}
                  error={error.hoVaTen}
                />
                {error.hoVaTen && (
                  <MDTypography
                    variant="caption"
                    color="error"
                    fontWeight="light"
                  >
                    Vui lòng nhập họ tên!
                  </MDTypography>
                )}
              </Grid>
            </Grid>

            <Grid
              container
              rowSpacing={1}
              columnSpacing={3}
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingBottom: "10px" }}
            >
              <Grid
                item
                xs={12}
                lg={3}
                md={6}
                sx={{ textAlign: { xs: "left", md: "right" } }}
              >
                <Typography
                  sx={{
                    color: darkMode ? `${colors?.white?.focus} !important` : "",
                    fontSize: "16px",
                  }}
                >
                  Tài khoản mail công vụ
                  <span style={{ color: colors?.error }}>*</span>{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} lg={8}>
                <FormField
                  type="text"
                  placeholder="Nhập email"
                  name="tkMailCongVu"
                  value={formData?.tkMailCongVu}
                  onChange={handleInputChange}
                  error={error.tkMailCongVu}
                />
                {error.tkMailCongVu && (
                  <MDTypography
                    variant="caption"
                    color="error"
                    fontWeight="light"
                  >
                    Vui lòng nhập email hợp lệ!
                  </MDTypography>
                )}
              </Grid>
            </Grid>

            <Grid
              container
              rowSpacing={1}
              columnSpacing={3}
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingBottom: "10px" }}
            >
              <Grid
                item
                xs={12}
                lg={3}
                md={6}
                sx={{ textAlign: { xs: "left", md: "right" } }}
              >
                <Typography
                  sx={{
                    color: darkMode ? `${colors?.white?.focus} !important` : "",
                    fontSize: "16px",
                  }}
                >
                  Điện thoại
                  <span style={{ color: colors?.error }}>*</span>{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} lg={8}>
                <FormField
                  type="text"
                  placeholder="Nhập số điện thoại"
                  name="dienThoai"
                  value={formData?.dienThoai}
                  onChange={handleInputChange}
                  error={error.dienThoai}
                />
                {error.dienThoai && (
                  <MDTypography
                    variant="caption"
                    color="error"
                    fontWeight="light"
                  >
                    Vui lòng nhập số điện thoại hợp lệ (gồm 10 chữ số và bắt đầu
                    bằng số 0)!
                  </MDTypography>
                )}
              </Grid>
            </Grid>

            <Grid
              container
              rowSpacing={1}
              columnSpacing={3}
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingBottom: "10px" }}
            >
              <Grid
                item
                xs={12}
                lg={3}
                md={6}
                sx={{ textAlign: { xs: "left", md: "right" } }}
              >
                <Typography
                  sx={{
                    color: darkMode ? `${colors?.white?.focus} !important` : "",
                    fontSize: "16px",
                  }}
                >
                  Ghi chú
                  <span style={{ color: colors?.error }}></span>{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} lg={8}>
                <FormField
                  type="text"
                  placeholder="Nhập ghi chú"
                  name="ghiChu"
                  value={formData?.ghiChu}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            <Grid
              container
              rowSpacing={1}
              columnSpacing={3}
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingBottom: "10px" }}
            >
              <Grid
                item
                xs={12}
                lg={3}
                md={6}
                sx={{ textAlign: { xs: "left", md: "right" } }}
              >
                <Typography
                  sx={{
                    color: darkMode ? `${colors?.white?.focus} !important` : "",
                    fontSize: "16px",
                  }}
                >
                  Kích hoạt{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} lg={8}>
                <Checkbox
                  name="kichHoat"
                  onChange={handleInputChange}
                  checked={formData?.kichHoat}
                />
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
};
export default ThemNguoiDung;
