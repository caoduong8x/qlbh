import { useEffect, useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import Card from "@mui/material/Card";
import { Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Checkbox from "@mui/material/Checkbox";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout/index";
import DashboardNavbar from "examples/Navbars/DashboardNavbar/index";
import MDTypography from "components/MDTypography/index";
import { AuthContext } from "context/index";
import MDBox from "components/MDBox/index";

import { useMaterialUIController } from "context";
import DataTable from "examples/Tables/DataTable/index";
// import { getRequest } from "services/request/getRequest";
import { API_SERVER } from "services/constants";
import { endpointUser } from "services/endpoint";
import { getRequest } from "services/request/index";
import { XoaNguoiDung } from "./XoaNguoiDung";
import webStorageClient from "config/webStorageClient";
import { debounce } from "lodash";

const QuanLyNguoiDung = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { getIsAdmin } = useContext(AuthContext);

  const [isAdmin, IsAdmin] = useState(getIsAdmin() || false);
  const [listApprove, setListApprove] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [count, setCount] = useState(true);
  const [totalPage, setTotalPage] = useState(0);
  const [id, setId] = useState();
  const [idUserSuperSet, setIdUserSuperSet] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const idDonVi = webStorageClient.getDonViId();

  const [filter, setFilter] = useState({
    params: {
      page: page,
      pagesize: pageSize,
      count: count,
      filter: "",
      // filter: isAdmin ? "" : JSON.stringify({ "donVi.id": idDonVi }),
    },
  });
  const [listRole, setListRole] = useState();
  const { getRole } = useContext(AuthContext);

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
    getUser();
  }, [filter, openDelete]);

  const getUser = () => {
    let url = `${API_SERVER}${endpointUser.DanhSachUser}`;
    getRequest(url, filter)
      ?.then((res) => {
        setListApprove(res?.data?._embedded);
        setTotalPage(res?.data?._total_pages);
        // setListExportExcel(res?.data?._embedded);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getListExportExcel = async () => {
    const urlListAll = `${API_SERVER}${endpointUser.DanhSachUser}`;
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
    const worksheet = workbook.addWorksheet("DanhSachNguoiDung");

    // Thiết lập tiêu đề cột
    worksheet.columns = [
      { header: "Tài khoản", key: "taiKhoan", width: 30 },
      { header: "Email", key: "tkMailCongVu", width: 30 },
      { header: "Họ và tên", key: "hoVaTen", width: 30 },
      { header: "Đơn vị", key: "donVi", width: 30 },
      { header: "Phòng ban", key: "phongBan", width: 20 },
      { header: "Phòng ban cha", key: "phongBanCha", width: 50 },
      { header: "Chức vụ", key: "chucVu", width: 30 },
    ];

    // Thêm dữ liệu vào worksheet
    listExportExcel.forEach((item) => {
      const rowData = {
        taiKhoan: item?.taiKhoan || "",
        tkMailCongVu: item?.tkMailCongVu || "",
        hoVaTen: item?.hoVaTen || "",
        donVi: item?.donVi?.tenDonVi || "",
        phongBan: item?.phongBan?.tenDonVi || "",
        phongBanCha: item?.phongBanCha?.tenDonVi || "",
        chucVu: item?.chucVu?.tenChucVu || "",
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
    a.download = "Danh sách người dùng.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const onChangeSearch = debounce((value) => {
    const filterSearch = {
      $or: [
        {
          ["taiKhoan"]: {
            $regex: value,
            // $options: "i",
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

    setFilter({
      params: {
        page: 1,
        pagesize: pageSize,
        count: count,
        filter: JSON.stringify(filterSearch),
      },
    });
  }, 600);

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
        key: 4,
        Header: () => (
          <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
            Đơn vị
          </MDTypography>
        ),
        accessor: "donVi",
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
                {value?.tenDonVi}
              </MDTypography>
            </>
          );
        },
      },
      // {
      //   key: 5,
      //   Header: () => (
      //     <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
      //       Email
      //     </MDTypography>
      //   ),
      //   accessor: "tkMailCongVu",
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
      //           {value}
      //         </MDTypography>
      //       </>
      //     );
      //   },
      // },

      {
        key: 6,
        Header: () => (
          <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
            Trạng thái
          </MDTypography>
        ),
        accessor: "kichHoat",
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
                {value ? <Checkbox disabled checked /> : <Checkbox disabled />}
              </MDTypography>
            </>
          );
        },
      },

      ...(listRole?.DELETE || listRole?.PATCH || listRole?.GET || isAdmin
        ? [
            {
              key: 7,
              Header: () => (
                <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
                  Hành động
                </MDTypography>
              ),
              accessor: "_id.$oid",
              Cell: ({ cell: { value }, row }) => {
                return (
                  <MDBox display="flex" alignItems="center">
                    {(listRole?.GET || isAdmin) && (
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          onClick={() => {
                            navigate(`/chi-tiet-nguoi-dung/${value}`);
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
                            navigate(`/cap-nhat-nguoi-dung/${value}`);
                          }}
                        >
                          <EditIcon color={darkMode ? "text" : "secondary"} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {(listRole?.DELETE || isAdmin) && (
                      <Tooltip title="Xoá">
                        <IconButton
                          onClick={() => {
                            setId(value);
                            setOpenDelete(true);
                            setIdUserSuperSet(row?.original?.idUserSuperset);
                          }}
                        >
                          <DeleteIcon color={darkMode ? "text" : "secondary"} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </MDBox>
                );
              },
            },
          ]
        : []),
    ],
    rows: listApprove,
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
              navigate("/them-nguoi-dung");
            },
          },
        ]
      : []),
  ];

  const refreshList = () => {
    getUser();
  };

  return (
    <DashboardLayout>
      <XoaNguoiDung
        open={openDelete}
        setOpen={setOpenDelete}
        id={id}
        refreshList={refreshList}
        idUserSuperSet={idUserSuperSet}
      ></XoaNguoiDung>
      <DashboardNavbar breadcrumbTitle="Danh sách người dùng" />
      <Card sx={{ width: "100%", marginTop: "0.5rem" }}>
        <MDBox p={2}>
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
        </MDBox>
      </Card>
    </DashboardLayout>
  );
};

export default QuanLyNguoiDung;
