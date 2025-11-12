import { useEffect, useState, useContext } from "react";

import { useNavigate, useParams } from "react-router-dom";
import ExcelJS from "exceljs";
import Card from "@mui/material/Card";
import { Tooltip, IconButton } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout/index";
import DashboardNavbar from "examples/Navbars/DashboardNavbar/index";
import MDTypography from "components/MDTypography/index";
import { AuthContext } from "context/index";
import MDBox from "components/MDBox/index";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import { useMaterialUIController } from "context";
import { SelectComponent } from "components/Common/Select/SelectComponent";
import DataTable from "examples/Tables/DataTable/index";
// import { getRequest } from "services/request/getRequest";
import { API_SERVER } from "services/constants";
import {
  endpointUser,
  endpointNhomQuyen,
  endpointPhanQuyen,
  endpointDonVi,
} from "services/endpoint";
import { getRequest, deleteRequest, postRequest } from "services/request/index";
import { XoaPhanQuyen } from "./XoaPhanQuyen";
import { Grid } from "../../../node_modules/@mui/material/index";
import _ from "lodash";
import { debounce } from "lodash";

const QuanLyPhanQuyen = () => {
  const params = useParams();
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();

  const { darkMode } = controller;
  const { getIsAdmin, getRole, getDonViId } = useContext(AuthContext);

  const [isAdmin, IsAdmin] = useState(getIsAdmin() || false);
  const [donViId, setDonViId] = useState(getDonViId() || null);

  const [listApprove, setListApprove] = useState([]);
  const [listNguoiDung, setListNguoiDung] = useState([]);
  const [listSelectedNguoiDung, setListSelectedNguoiDung] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [count, setCount] = useState(true);
  const [totalPage, setTotalPage] = useState(0);
  const [pageNguoiDung, setPageNguoiDung] = useState(1);
  const [pageSizeNguoiDung, setPageSizeNguoiDung] = useState(5);
  const [countNguoiDung, setCountNguoiDung] = useState(true);
  const [totalPageNguoiDung, setTotalPageNguoiDung] = useState(0);

  const [openSelect, setOpenSelect] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [checkedAll, setCheckedAll] = useState(false);
  const [id, setId] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const [dataNhomQuyen, setDataNhomQuyen] = useState([]);
  const [selectedNhomQuyen, setSelectedNhomQuyen] = useState("");
  const [dataSelect, setDataSelect] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const [filter, setFilter] = useState({
    params: {
      page: page,
      pagesize: pageSize,
      count: count,
      filter: "",
    },
  });
  const [listRole, setListRole] = useState();

  useEffect(() => {
    const currentPath = window.location.pathname;
    const getRoleArray = getRole();
    const data = getRoleArray[0]?.quyen?.chucNang?.filter(
      (item) => item?.Ma === currentPath
    );
    setListRole(data[0]?.HanhDong);
    // const timeoutId = setTimeout(() => {
    //   const currentPath = window.location.pathname;
    //   const getRoleArray = getRole();
    //   const data = getRoleArray[0]?.quyen?.chucNang?.filter(
    //     (item) => item?.Ma === currentPath
    //   );
    //   setListRole(data[0]?.HanhDong);
    // }, 1000);

    // return () => clearTimeout(timeoutId);
  }, []);

  const [filterNguoiDung, setFilterNguoiDung] = useState({
    params: {
      page: pageNguoiDung,
      pagesize: pageSizeNguoiDung,
      count: countNguoiDung,
      filter: JSON.stringify({
        daPhanQuyen: false,
      }),
    },
  });

  useEffect(() => {
    setFilter((prevFilter) => ({
      params: {
        ...prevFilter.params,
        page: page,
        pagesize: pageSize,
        count: count,
      },
    }));
  }, [page, pageSize]);

  useEffect(() => {
    setFilter((prevFilter) => ({
      params: {
        ...prevFilter.params,
        filter: JSON.stringify({ maNhomQuyen: selectedItem?.maNhomQuyen }),
      },
    }));
  }, [selectedItem]);

  useEffect(() => {
    setFilterNguoiDung((prevFilter) => ({
      params: {
        ...prevFilter.params,
        page: pageNguoiDung,
        pagesize: pageSizeNguoiDung,
        count: count,
      },
    }));
  }, [pageNguoiDung, pageSizeNguoiDung]);

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
    getNhomQuyen();
  }, [params]);

  useEffect(() => {
    getUser();
  }, [filterNguoiDung]);

  useEffect(() => {
    getPhanQuyen();
  }, [filter]);

  useEffect(() => {
    if (listSelectedNguoiDung.length >= listNguoiDung.length)
      setCheckedAll(true);
    else setCheckedAll(false);
  }, [listSelectedNguoiDung, listNguoiDung]);

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
    let url = `${API_SERVER}${endpointPhanQuyen.DanhSachPhanQuyen}`;
    getRequest(url, filter)
      ?.then((res) => {
        setListApprove(res?.data?._embedded);
        setTotalPage(res?.data?._total_pages);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getListExportExcel = async () => {
    const urlListAll = `${API_SERVER}${endpointPhanQuyen.DanhSachPhanQuyen}`;
    try {
      const res = await getRequest(urlListAll);
      let data = res?.data?._embedded || [];
      if (data) {
        exportToExcel(data);
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  const exportToExcel = async (listExportExcel) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("DanhSachPhanQuyen");

    // Thiết lập tiêu đề cột
    worksheet.columns = [
      { header: "Tài khoản", key: "taiKhoan", width: 30 },
      { header: "Mã nhóm quyền", key: "maNhomQuyen", width: 30 },
      { header: "Tên nhóm quyền", key: "tenNhomQuyen", width: 30 },
    ];

    // Thêm dữ liệu vào worksheet
    listExportExcel.forEach((item) => {
      const rowData = {
        taiKhoan: item?.taiKhoan || "",
        maNhomQuyen: item?.maNhomQuyen || "",
        tenNhomQuyen: item?.tenNhomQuyen || "",
      };
      worksheet.addRow(rowData);
    });

    // Định dạng tiêu đề cột
    worksheet.getRow(1).font = {
      name: "Times New Roman",
      size: 13,
      bold: true,
    };

    // Định dạng tất cả các ô còn lại
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber > 1) {
        // Bỏ qua dòng tiêu đề
        row.font = {
          name: "Times New Roman",
          size: 13,
        };
      }
    });

    // Tạo file Excel và tự động tải xuống
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Danh sách phân quyền.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getUser = () => {
    const combinedFilter = {
      $and: [
        // { "donVi.id": detailDonVi?._id.$oid },
        { donVi: { $exists: true } },
        { daPhanQuyen: false },
        ...(filterNguoiDung.params.filter
          ? [JSON.parse(filterNguoiDung.params.filter)]
          : []),
      ],
    };

    let url = `${API_SERVER}${endpointUser.DanhSachUser}`;

    const params = {
      ...filterNguoiDung.params,
      filter: JSON.stringify(combinedFilter),
    };

    getRequest(url, { params })
      ?.then((res) => {
        setListNguoiDung(res?.data?._embedded);
        setTotalPageNguoiDung(res?.data?._total_pages);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const refreshList = () => {
    getPhanQuyen();
    getUser();
  };

  const onChangeSearch = debounce((value) => {
    const filterSearch = {
      $or: [
        {
          ["taiKhoan"]: {
            $regex: value,
            $options: "i",
          },
        },
        {
          ["maNhomQuyen"]: {
            $regex: value,
            $options: "i",
          },
        },
      ],
    };

    setFilter({
      params: {
        page: 1,
        pagesize: pageSize,
        count: count,
        filter: JSON.stringify(filterSearch),
      },
    });
  }, 600);

  const onChangeSearchUser = (value) => {
    const filterSearch = {
      $or: [
        {
          ["taiKhoan"]: {
            $regex: value,
            $options: "i",
          },
        },
        {
          ["hoVaTen"]: {
            $regex: value,
            $options: "i",
          },
        },
        {
          ["tkMailCongVu"]: {
            $regex: value,
            $options: "i",
          },
        },
      ],
    };

    setFilterNguoiDung({
      params: {
        page: pageNguoiDung,
        pagesize: pageSizeNguoiDung,
        count: countNguoiDung,
        filter: JSON.stringify(filterSearch),
      },
    });
  };
  const handleMenuClick = (item) => {
    setSelectedItem(item);
    setOpenSelect(false);
  };

  const handleChangeCheckboxAll = (event, value) => {
    const checked = event.target.checked;
    setCheckedAll(checked);
    checked
      ? setListSelectedNguoiDung(
          listNguoiDung.map((item) => ({
            idTaiKhoan: item._id?.$oid,
            taiKhoan: item.taiKhoan,
            donVi: item.donVi?.id,
          }))
        )
      : setListSelectedNguoiDung([]);
  };

  const handleChangeCheckbox = (event, row) => {
    const checked = event.target.checked;
    let id = row?.original?._id?.$oid;
    let taiKhoan = row?.original?.taiKhoan;
    let donVi = row?.original?.donVi?.id;
    let obj = { idTaiKhoan: id, taiKhoan: taiKhoan, donVi: donVi };
    checked
      ? setListSelectedNguoiDung((prev) => [...prev, obj])
      : setListSelectedNguoiDung((prev) =>
          prev.filter((item) => !_.isEqual(item, obj))
        );
  };

  const handleClose = () => {
    setOpenModal(false);
    setFilterNguoiDung({
      params: {
        page: pageNguoiDung,
        pagesize: pageSizeNguoiDung,
        count: countNguoiDung,
        filter: JSON.stringify({
          daPhanQuyen: false,
        }),
      },
    });
    setListSelectedNguoiDung([]);
    setCheckedAll(false);
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
              {(page - 1) * pageSize + row.index + 1}
            </MDTypography>
          );
        },
        width: "5%",
      },
      {
        key: 2,
        Header: () => (
          <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
            Tài khoản
          </MDTypography>
        ),
        accessor: "taiKhoan",
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
            Mã nhóm quyền
          </MDTypography>
        ),
        accessor: "maNhomQuyen",
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
        key: 4,
        Header: () => (
          <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
            Tên nhóm quyền
          </MDTypography>
        ),
        accessor: "tenNhomQuyen",
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

      // {
      //   key: 4,
      //   Header: () => (
      //     <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
      //       Trạng thái
      //     </MDTypography>
      //   ),
      //   accessor: "kichHoat",
      //   Cell: ({ cell: { value } }) => {
      //     return (
      //       <>
      //         <MDTypography
      //           variant="caption"
      //           color={darkMode ? "white" : "dark"}
      //           sx={{
      //             fontSize: "14px",
      //           }}
      //         >
      //           {value ? <Checkbox disabled checked /> : <Checkbox disabled />}
      //         </MDTypography>
      //       </>
      //     );
      //   },
      // },

      ...(listRole?.GET || listRole?.PATCH || listRole?.DELETE || isAdmin
        ? [
            {
              key: 5,
              Header: () => (
                <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
                  Hành động
                </MDTypography>
              ),
              accessor: "_id.$oid",
              Cell: ({ cell: { value } }) => (
                <MDBox display="flex" alignItems="center">
                  {/* <Tooltip title="Xem chi tiết">
                <IconButton
                  onClick={() => {
                    navigate(`/chi-tiet-Phan-quyen/${value}`);
                  }}
                >
                  <RemoveRedEyeIcon color={darkMode ? "text" : "secondary"} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cập nhật">
                <IconButton
                  onClick={() => {
                    navigate(`/cap-nhat-Phan-quyen/${value}`);
                  }}
                >
                  <EditIcon color={darkMode ? "text" : "secondary"} />
                </IconButton>
              </Tooltip> */}
                  {(listRole?.GET || isAdmin) && (
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        onClick={() => {
                          navigate(`/chi-tiet-phan-quyen/${value}`);
                        }}
                      >
                        <RemoveRedEyeIcon
                          color={darkMode ? "text" : "secondary"}
                        />
                      </IconButton>
                    </Tooltip>
                  )}

                  {(listRole?.PATCH || isAdmin) && (
                    <Tooltip title="Cập nhật">
                      <IconButton
                        onClick={() => {
                          navigate(`/cap-nhat-phan-quyen/${value}`);
                        }}
                      >
                        <EditIcon color={darkMode ? "text" : "secondary"} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {(listRole?.DELETE || isAdmin) && (
                    <Tooltip title="Xóa">
                      <IconButton
                        onClick={() => {
                          setId(value);
                          setOpenDelete(true);
                        }}
                      >
                        <DeleteIcon color={darkMode ? "text" : "secondary"} />
                      </IconButton>
                    </Tooltip>
                  )}
                </MDBox>
              ),
            },
          ]
        : []),
    ],
    rows: listApprove,
  };

  const dataNguoiDung = {
    columns: [
      {
        key: 1,
        Header: () => (
          <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
            <Checkbox
              checked={checkedAll}
              // checked={listSelectedNguoiDung.length === listNguoiDung.length}
              onChange={handleChangeCheckboxAll}
            />
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
              {/* {(page - 1) * pageSize + row.index + 1} */}
              {/* {row?.original?.taiKhoan || (page - 1) * pageSize + row.index + 1} */}
              <Checkbox
                checked={listSelectedNguoiDung.find(
                  (item) => item.taiKhoan === row?.original?.taiKhoan
                )}
                onChange={(event) => handleChangeCheckbox(event, row)}
              />
            </MDTypography>
          );
        },
        width: "5%",
      },
      {
        key: 2,
        Header: () => (
          <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
            Họ tên
          </MDTypography>
        ),
        accessor: "hoVaTen",
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
            Tài khoản
          </MDTypography>
        ),
        accessor: "taiKhoan",
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
        key: 4,
        Header: () => (
          <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
            Email
          </MDTypography>
        ),
        accessor: "tkMailCongVu",
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
    ],
    rows: listNguoiDung,
  };

  const buttonList = [
    ...(listRole?.GET || isAdmin
      ? [
          {
            id: 2,
            title: "Xuất danh sách",
            onClick: () => {
              getListExportExcel();
            },
          },
        ]
      : []),
    ...(listRole?.POST || isAdmin
      ? [
          {
            id: 1,
            title: "Thêm mới",
            onClick: () => {
              // navigate("/them-phan-quyen");
              if (selectedNhomQuyen.length === 0) {
                authContext.alertInfo({
                  icon: "notifications",
                  title: "Phân quyền người dùng",
                  content: "Bạn chưa chọn nhóm quyền!",
                  open: authContext.open,
                  close: authContext.openAlert(),
                  color: "error",
                });
                return;
              }
              setOpenModal(true);
              getUser();
            },
          },
        ]
      : []),
  ];
  const submitForm = (event) => {
    event.preventDefault();

    if (listSelectedNguoiDung.length > 0) {
      const url = `${API_SERVER}${endpointPhanQuyen?.DanhSachPhanQuyen}`;
      let data = {
        danhSachTaiKhoan: listSelectedNguoiDung,
        maNhomQuyen: selectedItem.maNhomQuyen,
        tenNhomQuyen: selectedItem.tenNhomQuyen,
        // donVi: selectedItem.donVi,
        quyenChucNang: selectedItem.quyenChucNang,
        kichHoat: true,
      };

      postRequest(url, {
        data: data,
      })
        .then(() => {
          authContext.openAlert();
          authContext.alertInfo({
            icon: "notifications",
            title: "Phân quyền người dùng",
            content: "Phân quyền thành công!",
            open: authContext.open,
            close: authContext.openAlert(),
            color: "info",
          });
          getPhanQuyen();
          getUser();
          // navigate("/phan-quyen");
        })
        .catch((e) => {
          console.log("e.response", e.response);
          let content =
            e.response?.status === 400
              ? "Phân quyền thất bại: " + e.response?.data?.message
              : "Phân quyền thất bại!";
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
      handleClose();
    } else {
      alert("Bạn chưa chọn người dùng để phân quyền");
    }
  };
  return (
    <DashboardLayout>
      <XoaPhanQuyen
        open={openDelete}
        setOpen={setOpenDelete}
        id={id}
        refreshList={refreshList}
      ></XoaPhanQuyen>
      <DashboardNavbar breadcrumbTitle="Quản lý phân quyền" />
      <Card sx={{ width: "100%", marginTop: "0.5rem" }}>
        <MDBox p={2}>
          <Grid md={4} container xs={12} pl={1}>
            <SelectComponent
              label={"Chọn nhóm quyền"}
              data={dataNhomQuyen}
              setDataSelect={setSelectedNhomQuyen}
              dataSelect={selectedNhomQuyen}
            />
          </Grid>
          <DataTable
            table={data}
            isSorted={false}
            sx={{ border: "1px solid", padding: "2rem" }}
            showTotalEntries={false}
            canSearch
            onChangeSearch={onChangeSearch}
            hasButtons
            buttons={buttonList}
            entriesPerPage={{ defaultValue: pageSize }}
            totalPage={totalPage}
            pageCurrent={page}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newPageSize) => {
              setPageSize(newPageSize);
            }}
          />

          <Dialog
            open={openModal}
            onClose={handleClose}
            maxWidth="lg"
            theme={darkMode ? themeDark : theme}
            PaperProps={{
              component: "form",
              onSubmit: (event) => {
                submitForm(event);
              },
            }}
          >
            <DialogTitle>Chọn người dùng để phân quyền</DialogTitle>
            <DialogContent>
              <Card sx={{ width: "100%", marginTop: "1.5rem" }}>
                <MDBox p={2}>
                  <DataTable
                    table={dataNguoiDung}
                    isSorted={false}
                    sx={{ border: "1px solid", padding: "2rem" }}
                    showTotalEntries={false}
                    canSearch
                    onChangeSearch={onChangeSearchUser}
                    hasButtons
                    // buttons={buttonList}
                    entriesPerPage={{ defaultValue: pageSizeNguoiDung }}
                    totalPage={totalPageNguoiDung}
                    pageCurrent={pageNguoiDung}
                    onPageChange={(newPage) => setPageNguoiDung(newPage)}
                    onPageSizeChange={(newPageSize) => {
                      setPageSizeNguoiDung(newPageSize);
                    }}
                  />
                </MDBox>
              </Card>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} sx={{ fontSize: "14px" }}>
                Đóng
              </Button>
              <Button type="submit" sx={{ fontSize: "14px" }}>
                Phân quyền
              </Button>
            </DialogActions>
          </Dialog>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
};

export default QuanLyPhanQuyen;
