import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout/index";
import DashboardNavbar from "examples/Navbars/DashboardNavbar/index";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import { API_SERVER } from "services/constants";
import { postRequest } from "services/request/index";
import { AuthContext } from "context/index";
import { useMaterialUIController } from "context";
import colors from "assets/theme/base/colors";
import { endpointNhomQuyen } from "services/endpoint";
import { Icon, TextField } from "../../../node_modules/@mui/material/index";
import moduleApi from "./moduleApi";
import { SelectComponent } from "components/Common/Select/SelectComponent";
import { endpointDonVi } from "services/endpoint";
import DataTable from "examples/Tables/DataTable/index";
import { getRequest } from "services/request/getRequest";

const ThemNhomQuyen = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [selectDonVi, setSelectDonVi] = useState(
    location ? location?.state : ""
  );
  const [dataDonVi, setDataDonVi] = useState([]);

  const [formData, setFormData] = useState({
    maNhomQuyen: "",
    tenNhomQuyen: "",
    ghiChu: "",
    kichHoat: true,
  });

  const [error, setError] = useState({
    maNhomQuyen: false,
    tenNhomQuyen: false,
    textError: "",
  });

  const [checkboxStates, setCheckboxStates] = useState(
    moduleApi.CONTROLER.map((item) => ({
      Ma: item.Ma,
      Ten: item.Ten,
      HanhDong: {
        POST: false,
        GET: false,
        PATCH: false,
        DELETE: false,
      },
    }))
  );

  const [headerXemChecked, setHeaderXemChecked] = useState(false);
  const [headerThemChecked, setHeaderThemChecked] = useState(false);
  const [headerSuaChecked, setHeaderSuaChecked] = useState(false);
  const [headerXoaChecked, setHeaderXoaChecked] = useState(false);

  const regexMa = /^[a-zA-Z0-9]+$/;

  const handleCheckboxChange = (ma, action) => {
    setCheckboxStates((prevStates) => {
      const doiTuongDuLieuState = prevStates.find(
        (item) => item.Ma === "/doi-tuong-du-lieu" && action === "GET"
      )?.HanhDong[action];
      const mienDuLieuState = prevStates.find(
        (item) => item.Ma === "/mien-du-lieu" && action === "GET"
      )?.HanhDong[action];

      if (doiTuongDuLieuState && ma === "/quan-ly-don-vi") {
        return prevStates;
      }

      const updatedStates = prevStates.map((item) =>
        item.Ma === ma
          ? {
              ...item,
              HanhDong: { ...item.HanhDong, [action]: !item.HanhDong[action] },
            }
          : item
      );

      if (ma === "/doi-tuong-du-lieu" && action === "GET") {
        const doiTuongDuLieuChecked = !doiTuongDuLieuState;
        return updatedStates.map((item) => {
          if (item.Ma === "/mien-du-lieu" || item.Ma === "/quan-ly-don-vi") {
            return {
              ...item,
              HanhDong: { ...item.HanhDong, [action]: doiTuongDuLieuChecked },
            };
          }
          return item;
        });
      }

      if (ma === "/mien-du-lieu" && action === "GET") {
        const mienDuLieuChecked = !mienDuLieuState;
        return updatedStates.map((item) => {
          if (
            item.Ma === "/doi-tuong-du-lieu" ||
            item.Ma === "/quan-ly-don-vi"
          ) {
            return {
              ...item,
              HanhDong: { ...item.HanhDong, [action]: mienDuLieuChecked },
            };
          }
          return item;
        });
      }
      return updatedStates;
    });
  };

  const handleHeaderXemCheckboxChange = (action) => {
    const newState = headerXemChecked;
    setCheckboxStates((prevStates) =>
      prevStates.map((item) => ({
        ...item,
        HanhDong: { ...item.HanhDong, [action]: !newState },
      }))
    );
    setHeaderXemChecked(!headerXemChecked);
  };

  const handleHeaderThemCheckboxChange = (action) => {
    const newState = headerThemChecked; // Trạng thái hiện tại của header
    setCheckboxStates((prevStates) =>
      prevStates.map((item) => ({
        ...item,
        HanhDong: { ...item.HanhDong, [action]: !newState },
      }))
    );
    setHeaderThemChecked(!headerThemChecked); // Đảo ngược trạng thái header
  };

  const handleHeaderSuaCheckboxChange = (action) => {
    const newState = headerSuaChecked; // Trạng thái hiện tại của header
    setCheckboxStates((prevStates) =>
      prevStates.map((item) => ({
        ...item,
        HanhDong: { ...item.HanhDong, [action]: !newState },
      }))
    );
    setHeaderSuaChecked(!headerSuaChecked); // Đảo ngược trạng thái header
  };

  const handleHeaderXoaCheckboxChange = (action) => {
    const newState = headerXoaChecked; // Trạng thái hiện tại của header
    setCheckboxStates((prevStates) =>
      prevStates.map((item) => ({
        ...item,
        HanhDong: { ...item.HanhDong, [action]: !newState },
      }))
    );
    setHeaderXoaChecked(!headerXoaChecked); // Đảo ngược trạng thái header
  };

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
              sx={{ fontSize: "14px" }}
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
                sx={{ fontSize: "14px" }}
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
              onChange={() => handleHeaderXemCheckboxChange("GET")}
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
              onChange={() => handleCheckboxChange(ma, "GET")}
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
              onChange={() => handleHeaderThemCheckboxChange("POST")}
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
              onChange={() => handleCheckboxChange(ma, "POST")}
            />
          );
        },
      },
      {
        key: 5,
        Header: () => (
          <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
            <Checkbox
              checked={headerSuaChecked}
              onChange={() => handleHeaderSuaCheckboxChange("PATCH")}
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
              onChange={() => handleCheckboxChange(ma, "PATCH")}
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
              onChange={() => handleHeaderXoaCheckboxChange("DELETE")}
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
              onChange={() => handleCheckboxChange(ma, "DELETE")}
            />
          );
        },
      },
    ],
    rows: moduleApi.CONTROLER,
  };

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
      if (name === "maNhomQuyen" && !regexMa.test(value)) {
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
    // if (!selectDonVi || selectDonVi?.length === 0) {
    //   authContext.openAlert();
    //   authContext.alertInfo({
    //     icon: "notifications",
    //     title: "Thêm nhóm quyền",
    //     content: "Bạn chưa chọn đơn vị!",
    //     open: authContext.open,
    //     close: authContext.openAlert(),
    //     color: "info",
    //   });
    //   return;
    // }
    setError({
      maNhomQuyen: !formData?.maNhomQuyen,
      tenNhomQuyen: !formData?.tenNhomQuyen,
      textError: "",
    });

    if (error?.maNhomQuyen === false && error?.tenNhomQuyen === false) {
      const url = `${API_SERVER}${endpointNhomQuyen?.DanhSachNhomQuyen}`;
      let data = {
        maNhomQuyen: formData?.maNhomQuyen,
        tenNhomQuyen: formData?.tenNhomQuyen,
        ghiChu: formData?.ghiChu,
        kichHoat: formData?.kichHoat,
        quyenChucNang: checkboxStates,
        donVi: selectDonVi,
      };

      postRequest(url, {
        data: data,
      })
        .then(() => {
          authContext.openAlert();
          authContext.alertInfo({
            icon: "notifications",
            title: "Thêm nhóm quyền",
            content: "Thêm thành công !",
            open: authContext.open,
            close: authContext.openAlert(),
            color: "info",
          });
          navigate("/nhom-quyen");
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
            title: "Thêm nhóm quyền",
            content: content,
            open: authContext.open,
            close: authContext.openAlert(),
            color: "error",
          });
        });
    }
  };

  useEffect(() => {
    const url = `${API_SERVER}${endpointDonVi?.DanhSachDonVi}`;

    getRequest(url)
      ?.then((res) => {
        const result = res?.data?._embedded.map((item) => ({
          [item.title]: item._id.$oid,
        }));
        setDataDonVi(result);
      })
      ?.catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar breadcrumbTitle="Thêm nhóm quyền" />
      <Card sx={{ width: "100%", marginTop: "0.5rem" }}>
        <MDBox p={1} component="form" method="POST" onSubmit={submitForm}>
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
                  THÊM NHÓM QUYỀN
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
                <MDButton
                  variant="gradient"
                  color="info"
                  type="submit"
                  sx={{ fontSize: "14px" }}
                >
                  <Icon color="white" style={{ paddingRight: "5px" }}>
                    save
                  </Icon>{" "}
                  Lưu
                </MDButton>
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
                <SelectComponent
                  label={"Chọn đơn vị"}
                  data={dataDonVi}
                  setDataSelect={setSelectDonVi}
                  dataSelect={selectDonVi}
                />
              </Grid>
            </Grid> */}

            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingTop: "0px", paddingBottom: "5px" }}
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
                  onChange={handleInputChange}
                  error={error.tenNhomQuyen}
                  helperText={
                    error.tenNhomQuyen ? "Vui lòng nhập Tên đơn vị" : ""
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
            </Grid>
            {/* Mã Nhóm quyền */}
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingTop: "0px", paddingBottom: "5px" }}
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
                  onChange={handleInputChange}
                  error={error.maNhomQuyen}
                  helperText={
                    error.maNhomQuyen
                      ? "Mã nhóm quyền không hợp lệ (mã không được chứa ký tự đặc biệt và dấu cách"
                      : ""
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
            </Grid>
            {/* Ghi chú */}
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingTop: "5px", paddingBottom: "0px" }}
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
                  onChange={handleInputChange}
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
              sx={{ paddingTop: "0px", paddingBottom: "5px" }}
              xs={12}
            >
              <Grid
                item
                xs={12}
                md={2}
                sx={{
                  textAlign: { xs: "left", md: "right" },
                  padding: { xs: "0px", md: "17px" },
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
                  onChange={handleInputChange}
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
export default ThemNhomQuyen;
