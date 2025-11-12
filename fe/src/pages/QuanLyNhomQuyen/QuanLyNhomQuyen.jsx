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
import { endpointNhomQuyen } from "services/endpoint";
import { getRequest, deleteRequest } from "services/request/index";
import { XoaNhomQuyen } from "./XoaNhomQuyen";
import { debounce } from "lodash";

const QuanLyNhomQuyen = () => {
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
  const [openDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState();
  const [reload, setReload] = useState(false);
  const [filter, setFilter] = useState({
    params: {
      page: page,
      pagesize: pageSize,
      count: count,
      filter: "",
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
    getNhomQuyen();
  }, [filter, openDelete]);

  const getNhomQuyen = () => {
    let url = `${API_SERVER}${endpointNhomQuyen.DanhSachNhomQuyen}`;

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
    const urlListAll = `${API_SERVER}${endpointNhomQuyen.DanhSachNhomQuyen}`;
    try {
      const res = await getRequest(urlListAll);
      let result = [];
      let data = res?.data?._embedded || [];
      data.forEach((dt) => {
        if (dt.quyenChucNang && dt.quyenChucNang.length > 0) {
          dt.quyenChucNang.forEach((item) => {
            let itemResult = {
              maNhomQuyen: dt.maNhomQuyen,
              tenNhomQuyen: dt.tenNhomQuyen,
              maChucNang: item?.Ma,
              tenChucNang: item?.Ten,
              quyenXem: item?.HanhDong?.GET,
              quyenThem: item?.HanhDong?.POST,
              quyenSua: item?.HanhDong?.PATCH,
              quyenXoa: item?.HanhDong?.DELETE,
            };
            result.push(itemResult);
          });
        }
      });
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
    const worksheet = workbook.addWorksheet("DanhSachNhomQuyen");

    // Thiết lập tiêu đề cột
    worksheet.columns = [
      { header: "Mã nhóm quyền", key: "maNhomQuyen", width: 20 },
      { header: "Tên nhóm quyền", key: "tenNhomQuyen", width: 30 },
      { header: "Chức năng", key: "tenChucNang", width: 50 },
      { header: "Quyền xem", key: "quyenXem", width: 20 },
      { header: "Quyền thêm", key: "quyenThem", width: 20 },
      { header: "Quyền sửa", key: "quyenSua", width: 20 },
      { header: "Quyền xóa", key: "quyenXoa", width: 20 },
    ];

    // Thêm dữ liệu vào worksheet
    listExportExcel.forEach((item) => {
      const rowData = {
        maNhomQuyen: item?.maNhomQuyen || "",
        tenNhomQuyen: item?.tenNhomQuyen || "",
        tenChucNang: item?.tenChucNang || "",
        quyenXem: item?.quyenXem || false,
        quyenThem: item?.quyenThem || false,
        quyenSua: item?.quyenSua || false,
        quyenXoa: item?.quyenXoa || false,
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
    a.download = "Danh sách nhóm quyền.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const onChangeSearch = debounce((value) => {
    const filterSearch = {
      $or: [
        {
          ["maNhomQuyen"]: {
            $regex: value,
            $options: "i",
          },
        },
        {
          ["tenNhomQuyen"]: {
            $regex: value,
            $options: "i",
          },
        },
        {
          ["ghiChu"]: {
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
        key: 3,
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

      {
        key: 4,
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
              key: 5,
              Header: () => (
                <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
                  Hành động
                </MDTypography>
              ),
              accessor: "_id.$oid",
              Cell: ({ cell: { value } }) => {
                return (
                  <MDBox display="flex" alignItems="center">
                    {(listRole?.GET || isAdmin) && (
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          onClick={() => {
                            navigate(`/chi-tiet-nhom-quyen/${value}`);
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
                            navigate(`/cap-nhat-nhom-quyen/${value}`);
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
              navigate("/them-nhom-quyen");
            },
          },
        ]
      : []),
  ];

  return (
    <DashboardLayout>
      <XoaNhomQuyen
        open={openDelete}
        setOpen={setOpenDelete}
        id={id}
        reload={reload}
        setReload={setReload}
      />
      <DashboardNavbar breadcrumbTitle="Danh sách nhóm quyền" />
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

export default QuanLyNhomQuyen;
