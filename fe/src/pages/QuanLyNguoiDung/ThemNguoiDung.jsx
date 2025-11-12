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
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import OutlinedInput from "@mui/material/OutlinedInput";
import { FormControl, FormHelperText } from "@mui/material";
import { API_SERVER } from "services/constants";
import { AuthContext } from "context/index";
import { useMaterialUIController } from "context";
import colors from "assets/theme/base/colors";
import {
  endpointUser,
  endpointDonVi,
  endpointCsdlNganh,
  endpointNhomQuyen,
  endpointPhanQuyen,
} from "services/endpoint";
import { Icon, TextField } from "../../../node_modules/@mui/material/index";
import { deleteRequest, getRequest, postRequest } from "services/request/index";
import webStorageClient from "config/webStorageClient";
import { SelectComponent } from "components/Common/Select/SelectComponent";
import { SelectComponentV2 } from "components/Common/Select/SelectComponentV2";
import { SelectComponentV3 } from "components/Common/Select/SelectComponentV3";
import DataTable from "examples/Tables/DataTable/index";
import { faL } from "../../../node_modules/@fortawesome/free-solid-svg-icons/index";

const ThemNguoiDung = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { getRole, getIsAdmin } = useContext(AuthContext);
  const [isAdmin, IsAdmin] = useState(getIsAdmin() || false);
  const { getTokenAdminSuperSet } = useContext(AuthContext);

  const [dataDonVi, setDataDonVi] = useState([]);
  const [selectedDonVi, setSelectedDonVi] = useState("");
  const [loaded, setLoaded] = useState(false);

  const [dataNhomQuyen, setDataNhomQuyen] = useState([]);
  const [selectedNhomQuyen, setSelectedNhomQuyen] = useState("");
  const [fullInfoNhomQuyen, setFullInfoNhomQuyen] = useState([]);
  const [selectedFullInfoNhomQuyen, setSelectedFullInfoNhomQuyen] =
    useState(null);
  const [quyenChucNang, setQuyenChucNang] = useState([]);

  const [formData, setFormData] = useState({
    hoVaTen: "",
    tkMailCongVu: "",
    dienThoai: "",
    ghiChu: "",
    password: "",
    kichHoat: true,
  });

  const [error, setError] = useState({
    hoVaTen: false,
    tkMailCongVu: false,
    dienThoai: false,
    password: false,
    donVi: false,
    textError: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);

  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexDienThoai = /^(0\d{9})?$/;
  const regexMatKhau = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    getDonVi();
    getNhomQuyen();
  }, []);

  useEffect(() => {
    if (loaded)
      setError((prevData) => ({
        ...prevData,
        donVi: !selectedDonVi,
      }));
    setLoaded(true);
  }, [selectedDonVi]);

  useEffect(() => {
    if (!selectedNhomQuyen) {
      setSelectedFullInfoNhomQuyen(null);
    }
    if (fullInfoNhomQuyen && selectedNhomQuyen) {
      if (selectedNhomQuyen.length > 0) {
        let obj =
          fullInfoNhomQuyen.find(
            (item) => item.maNhomQuyen === selectedNhomQuyen
          ) || null;
        setSelectedFullInfoNhomQuyen(obj);
        setQuyenChucNang(obj?.quyenChucNang || []);
      } else {
        setSelectedFullInfoNhomQuyen(null);
      }
    }
  }, [selectedNhomQuyen]);

  useEffect(() => {
    setQuyenChucNang(selectedFullInfoNhomQuyen?.quyenChucNang || []);
  }, [selectedFullInfoNhomQuyen]);

  const getDonVi = () => {
    const url = `${API_SERVER}${endpointDonVi?.DanhSachDonVi}`;
    const urlDonVi = isAdmin
      ? `${API_SERVER}${endpointDonVi.DanhSachDonVi}`
      : `${API_SERVER}${endpointDonVi.RecordAndDescendants}`;

    getRequest(urlDonVi)
      ?.then((res) => {
        const filteredItems = res?.data?._embedded.filter(
          (item) => item.roleSuperset && item.roleSuperset.length > 0
        );
        const transformedData = filteredItems.map((item) => ({
          itemId: item._id.$oid,
          parentId: item?.parent?.id || null,
          label: item?.title,
          maDinhDanh: item?.maDinhDanh,
          roleSuperset: item.roleSuperset,
        }));
        const organizedItems = organizeItems(transformedData);
        setDataDonVi(organizedItems);
      })
      ?.catch((e) => {
        console.log(e);
      });
  };

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
        }));
        const result = res?.data?._embedded.map((item) => ({
          [item.tenNhomQuyen]: item.maNhomQuyen,
          // [item.tenNhomQuyen]: item._id.$oid,
        }));
        setDataNhomQuyen(result);

        setFullInfoNhomQuyen(transformedData);
      })
      ?.catch((e) => {
        // console.log(e);
      });
  };

  function organizeItems(items) {
    const itemMap = {};

    items.forEach((item) => {
      if (!item.children) {
        item.children = [];
      }
      itemMap[item.itemId] = item;
    });

    const rootItems = [];

    items.forEach((item) => {
      if (item.parentId && itemMap[item.parentId]) {
        itemMap[item.parentId].children.push(item);
      } else {
        rootItems.push(item);
      }
    });

    const removeEmptyChildren = (node) => {
      if (node.children && node.children.length === 0) {
        delete node.children;
      } else {
        node.children.forEach(removeEmptyChildren);
      }
    };

    rootItems.forEach(removeEmptyChildren);

    return rootItems;
  }

  const handleGetLGSPUserInfo = async () => {
    if (formData.tkMailCongVu.length === 0) {
      authContext.openAlert();
      authContext.alertInfo({
        icon: "notifications",
        title: "Lấy thông tin người dùng",
        content: "Bạn phải nhập email để lấy thông tin người dùng",
        open: authContext.open,
        close: authContext.openAlert(),
        color: "warning",
      });
      return;
    }
    const url = `${API_SERVER}${endpointUser?.LGSPInfo}/${formData.tkMailCongVu}`;
    try {
      const userInfo = await getRequest(url);
      if (userInfo?.data) {
        setFormData((prevData) => ({
          ...prevData, // Giữ lại các giá trị hiện tại
          taiKhoan: userInfo?.data?.taiKhoan,
          hoVaTen: userInfo?.data?.hoVaTen,
          dienThoai: userInfo?.data?.dienThoai,
          phongBan: userInfo?.data?.phongBan,
          phongBanCha: userInfo?.data?.phongBanCha,
          chucVu: userInfo?.data?.chucVu,
        }));
      } else {
        authContext.openAlert();
        authContext.alertInfo({
          icon: "notifications",
          title: "Lấy thông tin người dùng",
          content: "Lấy thông tin thất bại",
          open: authContext.open,
          close: authContext.openAlert(),
          color: "warning",
        });
      }
    } catch (e) {
      authContext.openAlert();
      authContext.alertInfo({
        icon: "notifications",
        title: "Lấy thông tin người dùng",
        content: "Lấy thông tin thất bại",
        open: authContext.open,
        close: authContext.openAlert(),
        color: "warning",
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "kichHoat")
      setFormData((prevData) => ({
        ...prevData,
        [name]: event.target.checked,
      }));
    else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    if (value?.length > 0) {
      if (
        // (name === "taiKhoan" && !regexTaiKhoan.test(value)) ||
        (name === "tkMailCongVu" && !regexEmail.test(value)) ||
        (name === "dienThoai" && !regexDienThoai.test(value)) ||
        (name === "password" && !regexMatKhau.test(value))
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
      let v = true;
      if (name === "dienThoai") v = false;
      setError((prevData) => ({
        ...prevData,
        [name]: v,
      }));
    }
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
    const maxRetries = 3;
    const dataCreateSuperset = {
      first_name:
        formData?.hoVaTen?.split(" ").slice(-1)[0] || formData?.hoVaTen || "",
      last_name: formData?.hoVaTen?.split(" ").slice(0, -1).join(" ") || "",
      username: formData?.tkMailCongVu || "",
      email: formData?.tkMailCongVu || "",
      password: formData?.password,
      roles: selectedDonVi?.roleSuperset?.map((item) => item.value),
    };
    event.preventDefault();
    setError({
      hoVaTen: !formData?.hoVaTen,
      tkMailCongVu: !formData?.tkMailCongVu,
      password: !regexMatKhau.test(formData?.password),
      dienThoai: !regexDienThoai.test(formData?.dienThoai),
      donVi: !selectedDonVi,
      textError: "",
    });

    if (
      error?.hoVaTen === false &&
      error?.tkMailCongVu === false &&
      error?.password === false &&
      error?.dienThoai === false &&
      error?.donVi === false
    ) {
      const url = `${API_SERVER}${endpointUser?.DanhSachUser}`;
      let data = {
        taiKhoan: formData?.tkMailCongVu,
        hoVaTen: formData?.hoVaTen,
        tkMailCongVu: formData?.tkMailCongVu,
        dienThoai: formData?.dienThoai,
        ghiChu: formData?.ghiChu || "",
        ...(formData?.phongBan && { phongBan: formData.phongBan }),
        ...(formData?.phongBanCha && { phongBanCha: formData.phongBanCha }),
        ...(formData?.chucVu && { chucVu: formData.chucVu }),
        kichHoat: formData?.kichHoat,
        daPhanQuyen: false,
        donVi: {
          id: selectedDonVi?.itemId,
          tenDonVi: selectedDonVi?.label,
        },
        passwordSuperset: formData?.password,
        roleSuperset: selectedDonVi?.roleSuperset,
      };

      // Thêm mới user trong app
      const CreatuserApp = async (idUser) => {
        try {
          let createUserRes, phanQuyenUserRes;
          createUserRes = await postRequest(url, {
            data: { ...data, idUserSuperset: idUser },
          });

          if (createUserRes && createUserRes.msg === "success") {
            if (selectedFullInfoNhomQuyen) {
              const url = `${API_SERVER}${endpointPhanQuyen?.PhanQuyenOneUser}`;
              let data = {
                taiKhoan: formData.tkMailCongVu,
                maNhomQuyen: selectedFullInfoNhomQuyen.maNhomQuyen,
                tenNhomQuyen: selectedFullInfoNhomQuyen.tenNhomQuyen,
                quyenChucNang: selectedFullInfoNhomQuyen.quyenChucNang,
                kichHoat: true,
              };

              phanQuyenUserRes = await postRequest(url, {
                data: data,
              });
            }
          }
          let content = "";
          if (
            createUserRes.msg === "success" &&
            phanQuyenUserRes?.msg === "success"
          ) {
            content = "Thêm người dùng và phân quyền người dùng thành công!";
          } else if (createUserRes.msg === "success") {
            content = "Thêm người dùng thành công!";
          } else if (phanQuyenUserRes?.msg === "success") {
            content = "Phân quyền người dùng thành công!";
          }
          authContext.openAlert();
          authContext.alertInfo({
            icon: "notifications",
            title: "Thêm người dùng",
            content: content,
            open: authContext.open,
            close: authContext.openAlert(),
            color: "info",
          });
          navigate("/quan-ly-nguoi-dung");
        } catch (e) {
          DeleteUserSuperSet(idUser);
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
        }
      };
      // Thêm mới user trong superset
      const CreateUserSuperSet = (data, retryCount = 0) => {
        const tokenLoginSuperSet = webStorageClient.getTokenAdminSuperSet();
        if (tokenLoginSuperSet) {
          postRequest(
            `${API_SERVER}${endpointCsdlNganh.SuperSet}/tao-user-superset`,
            {
              tokenLoginSuperSet,
              data: data,
            }
          )
            .then((res) => {
              CreatuserApp(res?.data?.id);
            })
            .catch((err) => {
              if (err.response && err.response.status === 401) {
                if (retryCount < maxRetries) {
                  getTokenAdminSuperSet()
                    .then(() => {
                      CreateUserSuperSet(data, retryCount + 1);
                    })
                    .catch((tokenErr) => {
                      console.log("Lấy token thất bại:", tokenErr);
                    });
                } else {
                  console.log("Vượt quá số lần thử. Gọi lại thất bại.");
                }
              } else if (err.response && err.response.status === 422) {
                authContext.openAlert();
                authContext.alertInfo({
                  icon: "notifications",
                  title: "Thêm người dùng Thất bại",
                  content: "Tài khoản đã tồn tại !",
                  open: authContext.open,
                  close: authContext.openAlert(),
                  color: "error",
                });
              } else {
                authContext.openAlert();
                authContext.alertInfo({
                  icon: "notifications",
                  title: "Tạo mới người dùng thất bại",
                  content: `Lỗi khi tạo tài khoản Superset!`,
                  open: authContext.open,
                  close: authContext.openAlert(),
                  color: "info",
                });
              }
            });
        }
      };
      //Khi tạo thành công trên superset nhưng dữ liệu trong app đã có thì phải Xóa user trong superset để tạo lại tk khác
      const DeleteUserSuperSet = (id, retryCount = 0) => {
        const tokenLoginSuperSet = webStorageClient.getTokenAdminSuperSet();
        if (tokenLoginSuperSet) {
          deleteRequest(
            `${API_SERVER}${endpointCsdlNganh.SuperSet}/xoa-user-superset/${id}`,
            {
              tokenLoginSuperSet,
            }
          )
            .then(() => {})
            .catch((err) => {
              if (err.response && err.response.status === 401) {
                if (retryCount < maxRetries) {
                  getTokenAdminSuperSet()
                    .then(() => {
                      DeleteUserSuperSet(id, retryCount + 1);
                    })
                    .catch((tokenErr) => {
                      console.log("Lấy token thất bại:", tokenErr);
                    });
                } else {
                  console.log("Vượt quá số lần thử. Gọi lại thất bại.");
                }
              }
            });
        }
      };

      CreateUserSuperSet(dataCreateSuperset);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar breadcrumbTitle="Thêm người dùng" />
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
                  THÊM NGƯỜI DÙNG
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
                  onClick={handleGetLGSPUserInfo}
                  sx={{ fontSize: "14px" }}
                >
                  <Icon color="white" style={{ paddingRight: "5px" }}>
                    download
                  </Icon>{" "}
                  Lấy thông tin người dùng
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={() => navigate(-1)}
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
                Thông tin cơ bản
              </MDTypography>
            </MDBox>
          </Grid>
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
                  value={formData?.tkMailCongVu}
                  onChange={handleInputChange}
                  error={error.tkMailCongVu}
                  helperText={
                    error.tkMailCongVu ? "Vui lòng nhập email hợp lệ" : ""
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
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
                  placeholder="Nhập phòng ban"
                  name="donVi"
                  value={formData?.phongBan?.tenDonVi || ""}
                  onChange={handleInputChange}
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
                  value={formData?.tkMailCongVu}
                  onChange={handleInputChange}
                  error={error.taiKhoan}
                  helperText={
                    error.taiKhoan ? "Vui lòng nhập tên tài khoản" : ""
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
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
                  placeholder="Nhập phòng ban cha"
                  name="donViCha"
                  value={formData?.phongBanCha?.tenDonVi || ""}
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
                  value={formData?.hoVaTen}
                  onChange={handleInputChange}
                  error={error.hoVaTen}
                  helperText={error.hoVaTen ? "Vui lòng nhập họ tên" : ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
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
                  placeholder="Nhập chức vụ"
                  name="chucVu"
                  value={formData?.chucVu?.tenChucVu || ""}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>

            {/* Mật khẩu */}
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
                  Mật khẩu quản lý biểu đồ{" "}
                  <span style={{ color: colors?.error?.main }}>*</span>{" "}
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={8}>
                {/* <TextField
                  fullWidth
                  placeholder="Nhập mật khẩu"
                  name="password"
                  value={formData?.password}
                  onChange={handleInputChange}
                  error={error.password}
                  helperText={error.password ? "Vui lòng nhập mật khẩu" : ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                /> */}
                {/* <OutlinedInput
                  placeholder="Mật khẩu có độ dài 8 ký tự trở lên"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData?.password}
                  onChange={handleInputChange}
                  error={error.password}
                  helperText={error.password ? "Vui lòng nhập mật khẩu" : ""}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "hide the password"
                            : "display the password"
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  // label="Password"
                  style={{ width: "100%" }}
                  required
                /> */}
                <FormControl fullWidth error={error.password}>
                  <OutlinedInput
                    placeholder="Nhập mật khẩu"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    style={{ width: "100%" }}
                  />
                  <FormHelperText>
                    {error.password ? "Mật khẩu phải có ít nhất 8 ký tự" : ""}
                  </FormHelperText>
                </FormControl>
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
                  placeholder="Nhập số điện thoại"
                  name="dienThoai"
                  value={formData?.dienThoai}
                  onChange={handleInputChange}
                  error={error.dienThoai}
                  helperText={
                    error.dienThoai
                      ? "Vui lòng nhập số điện thoại hợp lệ (gồm 10 chữ số và bắt đầu bằng số 0 hoặc để trống)!"
                      : ""
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required={false}
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
                <SelectComponentV3
                  label={"Chọn đơn vị"}
                  treeView={true}
                  data={dataDonVi}
                  setDataSelect={setSelectedDonVi}
                  dataSelect={selectedDonVi}
                  required={true} // Đảm bảo rằng trường là bắt buộc
                  error={error.donVi} // Kiểm tra nếu chưa chọn
                  helperText={
                    selectedDonVi === null ? "Vui lòng chọn đơn vị!" : ""
                  } // Thông báo lỗi
                />

                {/* <SelectComponentV3
                  label={"Chọn đơn vị"}
                  treeView={true}
                  data={dataDonVi}
                  setDataSelect={setSelectedDonVi}
                  dataSelect={selectedDonVi}
                  required={true} // Đảm bảo rằng trường là bắt buộc
                  error={selectedDonVi === null} // Kiểm tra nếu chưa chọn
                  helperText={
                    selectedDonVi === null ? "Vui lòng chọn đơn vị!" : ""
                  } // Thông báo lỗi
                /> */}
                {/* <SelectComponent
                  label={"Chọn đơn vị"}
                  treeView={true}
                  data={dataDonVi}
                  setDataSelect={setSelectedDonVi}
                  dataSelect={selectedDonVi}
                  required={true}
                /> */}
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
                {/* <SelectComponentV3
                  label={"Chọn nhóm quyền"}
                  data={dataNhomQuyen}
                  setDataSelect={setSelectedNhomQuyen}
                  dataSelect={selectedNhomQuyen}
                  required={true} // Đảm bảo rằng trường là bắt buộc
                  error={selectedNhomQuyen === null} // Kiểm tra nếu chưa chọn
                  helperText={
                    selectedNhomQuyen === null ? "Vui lòng chọn đơn vị!" : ""
                  } // Thông báo lỗi
                /> */}

                <SelectComponentV3
                  label={"Chọn nhóm quyền"}
                  data={dataNhomQuyen}
                  setDataSelect={setSelectedNhomQuyen}
                  dataSelect={selectedNhomQuyen}
                  required={false}
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
                <Checkbox
                  name="kichHoat"
                  onChange={handleInputChange}
                  checked={formData?.kichHoat}
                />
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
export default ThemNguoiDung;
