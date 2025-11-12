import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMaterialUIController } from "context";
import Card from "@mui/material/Card";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout/index";
import DashboardNavbar from "examples/Navbars/DashboardNavbar/index";
import MDTypography from "components/MDTypography/index";
import { AuthContext } from "context/index";
import MDBox from "components/MDBox/index";
import { SelectComponent } from "components/Common/Select/SelectComponent";
import { API_SERVER } from "services/constants";
import colors from "assets/theme/base/colors";
import {
  endpointNhomQuyen,
  endpointPhanQuyen,
  // endpointUser,
} from "services/endpoint";
import { getRequest, patchRequest } from "services/request/index";
import { Grid } from "../../../node_modules/@mui/material/index";
import Checkbox from "@mui/material/Checkbox";
import { Icon, TextField } from "../../../node_modules/@mui/material/index";
import { XoaPhanQuyen } from "./XoaPhanQuyen";
import DataTable from "examples/Tables/DataTable/index";
import _ from "lodash";

const CapNhatPhanQuyen = ({ edit }) => {
  const params = useParams();
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const { getIsAdmin, getRole, getDonViId } = useContext(AuthContext);
  const [listRole, setListRole] = useState();
  const [isAdmin, IsAdmin] = useState(getIsAdmin() || false);
  const [openDelete, setOpenDelete] = useState(false);

  const [phanQuyenInfo, setPhanQuyenInfo] = useState([]);
  const [dataNhomQuyen, setDataNhomQuyen] = useState([]);
  const [selectedNhomQuyen, setSelectedNhomQuyen] = useState("");
  const [dataSelect, setDataSelect] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quyenChucNang, setQuyenChucNang] = useState([]);
  const [userQuyenChucNang, setUserQuyenChucNang] = useState([]);

  const [userInfo, setUserInfo] = useState([]);

  const id = params?.id || "";

  useEffect(() => {
    const currentPath = "/phan-quyen";
    const getRoleArray = getRole();
    const data = getRoleArray[0]?.quyen?.chucNang?.filter(
      (item) => item?.Ma === currentPath
    );
    setListRole(data[0]?.HanhDong);
  }, []);

  useEffect(() => {
    if (!selectedNhomQuyen) {
      setSelectedItem(null);
    }
    if (dataSelect && selectedNhomQuyen) {
      if (selectedNhomQuyen.length > 0) {
        let obj =
          dataSelect.find((item) => item.maNhomQuyen === selectedNhomQuyen) ||
          null;
        setSelectedItem(obj);
      } else {
        setSelectedItem(null);
      }
    }
  }, [selectedNhomQuyen]);

  useEffect(() => {
    if (dataSelect) {
      let obj =
        dataSelect.find(
          (item) => item.maNhomQuyen === phanQuyenInfo.maNhomQuyen
        ) || null;
      setQuyenChucNang(obj?.quyenChucNang || []);
      setUserQuyenChucNang(obj?.quyenChucNang || []);
    }
  }, [dataSelect]);

  useEffect(() => {
    if (selectedItem) {
      let obj =
        dataSelect.find(
          (item) => item.maNhomQuyen === selectedItem.maNhomQuyen
        ) || null;
      setQuyenChucNang(obj?.quyenChucNang || []);
    } else {
      setQuyenChucNang(userQuyenChucNang);
    }
  }, [selectedItem]);

  // useEffect(() => {
  //   getNhomQuyen();
  // }, []);

  // useEffect(() => {
  //   getPhanQuyen();
  // }, []);

  useEffect(() => {
    Promise.all([
      getRequest(`${API_SERVER}${endpointPhanQuyen.DanhSachPhanQuyen}/${id}`),
      getRequest(`${API_SERVER}${endpointNhomQuyen?.DanhSachNhomQuyen}`),
    ])
      .then(async ([phanQuyenRes, nhomQuyenRes]) => {
        setPhanQuyenInfo(phanQuyenRes?.data);
        const transformedData = nhomQuyenRes?.data?._embedded.map((item) => ({
          maNhomQuyen: item.maNhomQuyen,
          tenNhomQuyen: item.tenNhomQuyen,
          quyenChucNang: item.quyenChucNang,
          donVi: item.donVi || "",
        }));
        const result = nhomQuyenRes?.data?._embedded.map((item) => ({
          [item.tenNhomQuyen]: item.maNhomQuyen,
        }));
        setDataNhomQuyen(result);
        setDataSelect(transformedData);
        let taiKhoan = phanQuyenRes?.data?.taiKhoan || "";
        // if (taiKhoan.length > 0) {
        //   let urlUser = `${API_SERVER}${endpointUser.GetByTaiKhoan}/${taiKhoan}`;
        //   const res = await getRequest(urlUser);
        //   if (Array.isArray(res?.data?._embedded))
        //     setUserInfo(res?.data?._embedded[0]);
        // }
      })
      .catch();
  }, []);

  const getNhomQuyen = () => {
    const filter = {
      params: {
        filter: "",
      },
    };
    const url = `${API_SERVER}${endpointNhomQuyen?.DanhSachNhomQuyen}`;
    getRequest(url, filter)
      ?.then((res) => {
        const transformedData = res?.data?._embedded.map((item) => ({
          maNhomQuyen: item.maNhomQuyen,
          tenNhomQuyen: item.tenNhomQuyen,
          quyenChucNang: item.quyenChucNang,
          donVi: item.donVi || "",
        }));
        const result = res?.data?._embedded.map((item) => ({
          [item.tenNhomQuyen]: item.maNhomQuyen,
          // [item.tenNhomQuyen]: item._id.$oid,
        }));
        setDataNhomQuyen(result);

        setDataSelect(transformedData);
        // setSelectedItem(transformedData[0]);
      })
      ?.catch((e) => {
        // console.log(e);
      });
  };

  const getPhanQuyen = () => {
    let url = `${API_SERVER}${endpointPhanQuyen.DanhSachPhanQuyen}/${id}`;
    getRequest(url)
      ?.then((res) => {
        setPhanQuyenInfo(res?.data);
      })
      .catch((err) => {
        // console.log(err);
      });
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

  const submitForm = (event) => {
    event.preventDefault();
    if (selectedItem === null) {
      authContext.alertInfo({
        icon: "notifications",
        title: "Phân quyền người dùng",
        content: "Bạn chưa chọn nhóm quyền mới!",
        open: authContext.open,
        close: authContext.openAlert(),
        color: "warning",
      });
      return;
    }

    if (selectedNhomQuyen === phanQuyenInfo?.maNhomQuyen) {
      authContext.alertInfo({
        icon: "notifications",
        title: "Thay đổi nhóm quyền",
        content: "Nhóm quyền mới phải khác nhóm quyền cũ!",
        open: authContext.open,
        close: authContext.openAlert(),
        color: "warning",
      });
      return;
    }

    const url = `${API_SERVER}${endpointPhanQuyen?.UpdatePhanQuyen}/${id}`;
    let data = {
      taiKhoan: phanQuyenInfo.taiKhoan,
      maNhomQuyen: selectedItem.maNhomQuyen,
      tenNhomQuyen: selectedItem.tenNhomQuyen,
      quyenChucNang: selectedItem.quyenChucNang,
      kichHoat: true,
    };

    patchRequest(url, {
      data: data,
    })
      .then(() => {
        authContext.openAlert();
        authContext.alertInfo({
          icon: "notifications",
          title: "Cập nhật phân quyền",
          content: "Cập nhật phân quyền thành công!",
          open: authContext.open,
          close: authContext.openAlert(),
          color: "info",
        });
        navigate("/phan-quyen");
      })
      .catch((e) => {
        console.log("e.response", e);
        let content =
          e.response?.status === 400
            ? "Cập nhật phân quyền thất bại: " + e.response?.data?.message
            : "Cập nhật phân quyền thất bại!";
        authContext.openAlert();
        authContext.alertInfo({
          icon: "notifications",
          title: "Cập nhật phân quyền",
          content: content,
          open: authContext.open,
          close: authContext.openAlert(),
          color: "error",
        });
      });
  };
  console.log("phanQuyenInfo", phanQuyenInfo);
  return (
    <DashboardLayout>
      <XoaPhanQuyen
        open={openDelete}
        setOpen={setOpenDelete}
        id={params?.id}
        navigate={navigate}
      ></XoaPhanQuyen>
      <DashboardNavbar
        breadcrumbTitle={
          edit === true ? "Cập nhật phần quyền" : "Chi tiết phân quyền"
        }
      />
      <Card sx={{ width: "100%", marginTop: "0.5rem" }}>
        <MDBox p={2} component="form" method="POST" onSubmit={submitForm}>
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
                  {edit === true
                    ? "CẬP NHẬT PHÂN QUYỀN"
                    : "CHI TIẾT PHÂN QUYỀN"}
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
                {edit === true && (
                  <MDButton variant="gradient" color="info" type="submit">
                    <Icon color="white" style={{ paddingRight: "5px" }}>
                      save
                    </Icon>{" "}
                    Lưu
                  </MDButton>
                )}

                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={() => navigate("/phan-quyen")}
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
                Thông tin cơ bản
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid container p={0}>
            {/* Tài khoản */}
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
                md={3}
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
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  placeholder="Tài khoản"
                  name="taiKhoan"
                  value={phanQuyenInfo?.taiKhoan}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
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
            >
              <Grid
                item
                xs={12}
                md={3}
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
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  placeholder="Đơn vị"
                  name="donVi"
                  value={userInfo?.donVi?.tenDonVi || ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
            </Grid>
            {/* Nhóm quyền */}
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
                md={3}
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
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  placeholder="Nhóm quyền"
                  name="nhomQuyen"
                  value={phanQuyenInfo?.tenNhomQuyen}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
            </Grid>
            {edit && (
              <Grid
                container
                justifyContent="flex-start"
                alignItems="center"
                sx={{ paddingTop: "0px", paddingBottom: "0px" }}
                xs={12}
              >
                <Grid
                  item
                  xs={12}
                  md={3}
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
                    Nhóm quyền mới{" "}
                    <span style={{ color: colors?.error?.main }}>*</span>{" "}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} md={9}>
                  <SelectComponent
                    label={"Chọn nhóm quyền"}
                    data={dataNhomQuyen}
                    setDataSelect={setSelectedNhomQuyen}
                    dataSelect={selectedNhomQuyen}
                    required={false}
                  />
                </Grid>
              </Grid>
            )}
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
                  Chi tiết các chức năng
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

export default CapNhatPhanQuyen;
