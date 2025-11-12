import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout/index";
import DashboardNavbar from "examples/Navbars/DashboardNavbar/index";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { XoaNguoiDung } from "./XoaNguoiDung";
import Checkbox from "@mui/material/Checkbox";

import { API_SERVER, SUPERSET_PASSWORD_DEFAULT } from "services/constants";
import {
  getRequest,
  patchRequest,
  postRequest,
  deleteRequest,
} from "services/request/index";
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
import { SelectComponent } from "components/Common/Select/SelectComponent";
import webStorageClient from "config/webStorageClient";
import { SelectComponentV2 } from "components/Common/Select/SelectComponentV2";
import { SelectComponentV3 } from "components/Common/Select/SelectComponentV3";
import { FormControl, FormHelperText } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import DataTable from "examples/Tables/DataTable/index";

const CapNhatNguoiDung = () => {
  const params = useParams();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { getRole, getTokenAdminSuperSet, getIsAdmin } =
    useContext(AuthContext);
  const [isAdmin, IsAdmin] = useState(getIsAdmin() || false);
  const [formData, setFormData] = useState();
  const [loading, setLoading] = useState(true);
  const [dataSupmitSuperSet, setDataSupmitSuperSet] = useState();
  const [showPassword, setShowPassword] = React.useState(false);

  const [dataDonVi, setDataDonVi] = useState([]);
  const [selectedDonVi, setSelectedDonVi] = useState();
  const [loaded, setLoaded] = useState(false);

  const [dataNhomQuyen, setDataNhomQuyen] = useState([]);
  const [selectedNhomQuyen, setSelectedNhomQuyen] = useState("");
  const [fullInfoNhomQuyen, setFullInfoNhomQuyen] = useState([]);
  const [selectedFullInfoNhomQuyen, setSelectedFullInfoNhomQuyen] =
    useState(null);
  const [currentPhanQuyen, setCurrentPhanQuyen] = useState();
  const [quyenChucNang, setQuyenChucNang] = useState([]);
  const maxRetries = 3;

  const [idUserSuperSet, setIdUserSuperSet] = useState();
  const [openDelete, setOpenDelete] = useState(false);

  const [listRole, setListRole] = useState();

  const [error, setError] = useState({
    hoVaTen: false,
    tkMailCongVu: false,
    dienThoai: false,
    passwordSuperset: false,
    donVi: false,
    textError: "",
  });

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
        (name === "tkMailCongVu" && !regexEmail.test(value)) ||
        (name === "dienThoai" && !regexDienThoai.test(value)) ||
        (name === "passwordSuperset" && !regexMatKhau.test(value))
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

  const handleGoBack = () => {
    navigate("/quan-ly-nguoi-dung");
  };

  useEffect(() => {
    const currentPath = "/quan-ly-nguoi-dung";
    const getRoleArray = getRole();
    const data = getRoleArray[0]?.quyen?.chucNang?.filter(
      (item) => item?.Ma === currentPath
    );
    setListRole(data[0]?.HanhDong);
  }, []);

  useEffect(() => {
    getDonVi();
    getNhomQuyen();
    getDetailUser();
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    let taiKhoan = formData?.taiKhoan;
    if (taiKhoan) {
      getRequest(`${API_SERVER}${endpointPhanQuyen.GetByTaiKhoan}/${taiKhoan}`)
        ?.then((res) => {
          if (res?.data?._embedded?.length > 0) {
            setCurrentPhanQuyen(res?.data?._embedded[0]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [formData]);

  useEffect(() => {
    if (currentPhanQuyen) {
      setSelectedNhomQuyen(currentPhanQuyen.maNhomQuyen || "");
    }
  }, [currentPhanQuyen]);

  useEffect(() => {
    setDataSupmitSuperSet({
      first_name:
        formData?.hoVaTen?.split(" ").slice(-1)[0] || formData?.hoVaTen || "",
      last_name: formData?.hoVaTen?.split(" ").slice(0, -1).join(" ") || "",
      username: formData?.tkMailCongVu || "",
      email: formData?.tkMailCongVu || "",
      password: formData?.passwordSuperset,
      roles: selectedDonVi?.roleSuperset?.map((item) => item.value),
    });
  }, [formData, selectedDonVi]);

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

  const getDetailUser = () => {
    const urlDetail = `${API_SERVER}${endpointUser?.ChiTietUser}/${params?.id}`;
    getRequest(urlDetail)
      ?.then((res) => {
        setFormData((pre) => ({
          ...pre,
          taiKhoan: res?.data?.taiKhoan,
          hoVaTen: res?.data?.hoVaTen,
          tkMailCongVu: res?.data?.tkMailCongVu,
          dienThoai: res?.data?.dienThoai,
          ghiChu: res?.data?.ghiChu,
          kichHoat: res?.data?.kichHoat,
          phongBan: res?.data?.phongBan,
          phongBanCha: res?.data?.phongBanCha,
          chucVu: res?.data?.chucVu,
          donVi: res?.data?.donVi,
          idUserSuperset: res?.data?.idUserSuperset,
          roleSuperset: res?.data?.roleSuperset,
          passwordSuperset: res?.data?.passwordSuperset,
        }));
        if (res?.data?.idUserSuperset) {
          setSelectedDonVi({
            itemId: res?.data?.donVi?.id,
            label: res?.data?.donVi?.tenDonVi,
            roleSuperset: res?.data?.roleSuperset,
          });
        } else {
          setSelectedDonVi(null);
        }
      })
      ?.catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getDonVi = () => {
    const urlDonVi = isAdmin
      ? `${API_SERVER}${endpointDonVi.DanhSachDonVi}`
      : `${API_SERVER}${endpointDonVi.RecordAndDescendants}`;

    getRequest(urlDonVi)
      ?.then((res) => {
        const transformedData = res?.data?._embedded
          .filter((item) => item.roleSuperset && item.roleSuperset.length > 0)
          .map((item) => ({
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

  if (loading) {
    return <div>Đang tải dữ liệu...</div>; // Hiển thị thông báo khi đang tải
  }

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

  const CreateUserSuperSet = (dataSuperSet, dataApp, retryCount = 0) => {
    const tokenLoginSuperSet = webStorageClient.getTokenAdminSuperSet();
    if (tokenLoginSuperSet) {
      postRequest(
        `${API_SERVER}${endpointCsdlNganh.SuperSet}/tao-user-superset`,
        {
          tokenLoginSuperSet,
          data: dataSuperSet,
        }
      )
        .then((res) => {
          UpdateUserApp({ ...dataApp, idUserSuperset: res?.data?.id });
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            if (retryCount < maxRetries) {
              getTokenAdminSuperSet()
                .then(() => {
                  CreateUserSuperSet(dataSuperSet, dataApp, retryCount + 1);
                })
                .catch((err) => {
                  console.log("Lỗi khi lấy lại token Superset:", err);
                });
            } else {
              console.log("Đã đạt giới hạn số lần thử lại để tạo tài khoản Superset.");
            }
          } else {
            authContext.openAlert();
            authContext.alertInfo({
              icon: "notifications",
              title: "Tạo mới người dùng thất bại",
              content: `Lỗi khi tạo tài khoản Superset !`,
              open: authContext.open,
              close: authContext.openAlert(),
              color: "info",
            });
          }
        });
    } else {
      console.log("Không có token Superset khả dụng.");
    }
  };

  // Khi chưa có tài khoản superset thì tạo tài khoản superset
  const UpdateUserSuperSet = (dataApp, retryCount = 0) => {
    const tokenLoginSuperSet = webStorageClient.getTokenAdminSuperSet();
    if (formData?.idUserSuperset === undefined) {
      CreateUserSuperSet(
        {
          ...dataSupmitSuperSet,
          password: SUPERSET_PASSWORD_DEFAULT,
          roles: selectedDonVi?.roleSuperset?.map((item) => item.value),
        },
        dataApp
      );
    }

    if (tokenLoginSuperSet && formData?.idUserSuperset) {
      patchRequest(
        `${API_SERVER}${endpointCsdlNganh.SuperSet}/cap-nhat-user-superset/${formData.idUserSuperset}`,
        {
          tokenLoginSuperSet,
          data: dataSupmitSuperSet,
        }
      )
        .then(() => {
          UpdateUserApp(dataApp);
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            if (retryCount < maxRetries) {
              getTokenAdminSuperSet()
                .then(() => {
                  UpdateUserSuperSet(dataApp, retryCount + 1);
                })
                .catch((err) => {
                  console.log("Lỗi khi lấy lại token Superset:", err);
                });
            } else {
              console.log("Đã đạt giới hạn số lần thử lại để cập nhật tài khoản Superset.");
            }
          } else {
            authContext.openAlert();
            authContext.alertInfo({
              icon: "notifications",
              title: "Cập nhật người dùng thất bại",
              content: `Lỗi khi cập nhật tài khoản Superset!`,
              open: authContext.open,
              close: authContext.openAlert(),
              color: "erro",
            });
          }
        });
    } else {
      console.log("Không có token Superset khả dụng hoặc ID người dùng Superset không xác định.");
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
    event.preventDefault();
    setError({
      hoVaTen: !formData?.hoVaTen,
      tkMailCongVu: !formData?.tkMailCongVu,
      passwordSuperset: !regexMatKhau.test(formData?.passwordSuperset),
      dienThoai: !regexDienThoai.test(formData?.dienThoai),
      donVi: !selectedDonVi,
      textError: "",
    });

    if (
      error?.hoVaTen === false &&
      error?.tkMailCongVu === false &&
      error?.passwordSuperset === false &&
      error?.dienThoai === false &&
      error?.donVi === false
    ) {
      let dataSubmitApp = {
        hoVaTen: formData?.hoVaTen,
        tkMailCongVu: formData?.tkMailCongVu,
        dienThoai: formData?.dienThoai,
        ghiChu: formData?.ghiChu || "",
        kichHoat: formData?.kichHoat,
        donVi: {
          id: selectedDonVi?.itemId,
          tenDonVi: selectedDonVi?.label,
        },
        roleSuperset: selectedDonVi?.roleSuperset,
        passwordSuperset: formData?.passwordSuperset,
      };

      UpdateUserSuperSet(dataSubmitApp);
    }
  };

  const UpdateUserApp = async (data) => {
    try {
      const url = `${API_SERVER}${endpointUser?.UpdateUser}/${params?.id}`;
      let updateUserRes = await patchRequest(url, {
        data: data,
      });
      let resultStr = "";

      if (currentPhanQuyen) {
        if (selectedNhomQuyen.length === 0) {
          let id = currentPhanQuyen._id?.$oid || "";
          if (id.length > 0) {
            const res = await HandleDeleteNhomQuyen(id);
            if (res?.msg === "success") resultStr = "xóa nhóm quyền";
          }
        } else if (currentPhanQuyen.maNhomQuyen !== selectedNhomQuyen) {
          let id = currentPhanQuyen._id?.$oid || "";
          if (id.length > 0) {
            const res = await HandlePatchNhomQuyen(id);
            if (res?.msg === "success") resultStr = "thay đổi nhóm quyền";
          }
        }
      } else if (selectedNhomQuyen.length > 0) {
        const res = await HandlePostNhomQuyen();
        if (res?.msg === "success") resultStr = "thêm nhóm quyền";
      }
      let content = "";
      if (updateUserRes?.msg === "success" && resultStr.length > 0) {
        content = `Cập nhật người dùng và ${resultStr} thành công!`;
      } else if (updateUserRes?.msg === "success") {
        content = "Cập nhật người dùng thành công!";
      } else if (resultStr.length > 0) {
        content = `${resultStr} thành công!`;
        content = content.charAt(0).toUpperCase() + content.slice(1);
      }

      authContext.openAlert();
      authContext.alertInfo({
        icon: "notifications",
        title: "Cập nhật người dùng",
        content: content,
        open: authContext.open,
        close: authContext.openAlert(),
        color: "info",
      });
      navigate("/quan-ly-nguoi-dung");
    } catch (e) {
      console.log("update user", e);
      let content =
        e.response?.status === 400
          ? e.response?.data?.message
          : "Cập nhật thất bại!";
      authContext.openAlert();
      authContext.alertInfo({
        icon: "notifications",
        title: "Cập nhật người dùng",
        content: content,
        open: authContext.open,
        close: authContext.openAlert(),
        color: "error",
      });
    }
  };

  const HandleDeleteNhomQuyen = async (id) => {
    const url = `${API_SERVER}${endpointPhanQuyen?.DanhSachPhanQuyen}/${id}`;
    const phanQuyenUserRes = await deleteRequest(url);
    return phanQuyenUserRes;
  };

  const HandlePatchNhomQuyen = async (id) => {
    const url = `${API_SERVER}${endpointPhanQuyen?.UpdatePhanQuyen}/${id}`;
    let data = {
      taiKhoan: formData.tkMailCongVu,
      maNhomQuyen: selectedFullInfoNhomQuyen.maNhomQuyen,
      tenNhomQuyen: selectedFullInfoNhomQuyen.tenNhomQuyen,
      quyenChucNang: selectedFullInfoNhomQuyen.quyenChucNang,
      kichHoat: true,
    };

    const phanQuyenUserRes = await patchRequest(url, {
      data: data,
    });
    return phanQuyenUserRes;
  };

  const HandlePostNhomQuyen = async () => {
    const url = `${API_SERVER}${endpointPhanQuyen?.PhanQuyenOneUser}`;
    let data = {
      taiKhoan: formData.tkMailCongVu,
      maNhomQuyen: selectedFullInfoNhomQuyen.maNhomQuyen,
      tenNhomQuyen: selectedFullInfoNhomQuyen.tenNhomQuyen,
      quyenChucNang: selectedFullInfoNhomQuyen.quyenChucNang,
      kichHoat: true,
    };

    const phanQuyenUserRes = await postRequest(url, {
      data: data,
    });
    return phanQuyenUserRes;
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
      <DashboardNavbar breadcrumbTitle="Cập nhật người dùng" />
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
                  CẬP NHẬT NGƯỜI DÙNG
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
                      setOpenDelete(true);
                      setIdUserSuperSet(formData?.idUserSuperset);
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
                  onClick={() => navigate("/quan-ly-nguoi-dung")}
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
                  InputProps={{
                    readOnly: true,
                  }}
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
                  value={formData?.taiKhoan}
                  onChange={handleInputChange}
                  error={error.taiKhoan}
                  helperText={
                    error.taiKhoan ? "Vui lòng nhập tên tài khoản" : ""
                  }
                  InputProps={{
                    readOnly: true,
                  }}
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

            {/* mật khẩu superset */}
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
                  Mật khẩu superset{" "}
                  <span style={{ color: colors?.error?.main }}>*</span>{" "}
                </MDTypography>
              </Grid>
              <Grid item xs={12} md={8}>
                <FormControl fullWidth error={error.passwordSuperset}>
                  <OutlinedInput
                    placeholder="Nhập mật khẩu"
                    type={showPassword ? "text" : "password"}
                    name="passwordSuperset"
                    value={formData?.passwordSuperset}
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
                    {error.passwordSuperset
                      ? "Mật khẩu phải có ít nhất 8 ký tự"
                      : ""}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            {/* điện thoại */}
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
                />
              </Grid>
            </Grid>

            {/* đơn vị */}
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
                  data={dataDonVi}
                  treeView={true}
                  setDataSelect={setSelectedDonVi}
                  dataSelect={selectedDonVi}
                  required={true} // Đảm bảo rằng trường là bắt buộc
                  error={error.donVi} // Kiểm tra nếu chưa chọn
                  helperText={
                    selectedDonVi === null ? "Vui lòng chọn đơn vị!" : ""
                  } // Thông báo lỗi
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
export default CapNhatNguoiDung;
