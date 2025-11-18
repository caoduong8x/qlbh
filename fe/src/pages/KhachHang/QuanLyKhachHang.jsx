import { useEffect, useState, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import { debounce, get } from "lodash";
import Card from "@mui/material/Card";
import { IconButton } from "@mui/material";

import DataTable from "examples/Tables/DataTable/index";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout/index";
import DashboardNavbar from "examples/Navbars/DashboardNavbar/index";
import MDTypography from "components/MDTypography/index";
import MDEditIcon from "components/MDEditIcon/index";
import MDViewIcon from "components/MDViewIcon/index";
import MDDeleteIcon from "components/MDDeleteIcon/index";
import MDTooltip from "components/MDTooltip/index";
import MDBox from "components/MDBox/index";
import Loading from "components/Loading";

import { useMaterialUIController } from "context";
import { endpointKhachHang } from "services/endpoint";
import * as Services from "services/request/index";
import { XoaNhomQuyen } from "./XoaNhomQuyen";

const QuanLyKhachHang = () => {
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const fontSize = "small";
  const [listApprove, setListApprove] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState();
  const [reload, setReload] = useState(false);
  const [filter, setFilter] = useState({
    params: {
      page: page,
      pagesize: pageSize,
      search: "",
    },
  });

  useEffect(() => {
    setFilter((prevFilter) => ({
      params: {
        ...prevFilter.params,
        page: page,
        pagesize: pageSize,
      },
    }));
  }, [page, pageSize]);

  useEffect(() => {
    getKhachHang();
  }, [filter, openDelete]);

  const getKhachHang = () => {
    Services.getRequest(endpointKhachHang, filter)
      ?.then((res) => {
        setListApprove(res?.data || []);
        setTotalPage(res?.totalPages || 0);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getListExportExcel = async () => {
    try {
      const result = [];
      const data =
        (
          await Services.getRequest(endpointKhachHang, {
            params: { getAll: true },
          })
        )?.data || [];
      console.log("data: ", data);
      data.forEach((dt) => {
        let itemResult = {
          name: dt.name || "",
          address: dt.address || "",
          phone: dt.phone || "",
          email: dt.email || "",
        };
        result.push(itemResult);
      });
      if (result.length > 0) {
        exportToExcel(result);
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
      { header: "Tên khách hàng", key: "name", width: 50 },
      { header: "Địa chỉ", key: "address", width: 100 },
      { header: "Điện thoại", key: "phone", width: 30 },
      { header: "Email", key: "email", width: 30 },
    ];

    // Thêm dữ liệu vào worksheet
    listExportExcel.forEach((item) => {
      const rowData = {
        name: item?.name || "",
        address: item?.address || "",
        phone: item?.phone || "",
        email: item?.email || "",
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
    a.download = "Danh sách khách hàng.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const onChangeSearch = useCallback(
    debounce((value) => {
      setFilter({
        params: {
          page: 1,
          pagesize: pageSize,
          search: value,
        },
      });
    }, 600),
    []
  );

  useEffect(() => {
    return () => {
      onChangeSearch.cancel();
    };
  }, [onChangeSearch]);

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
            Tên khách hàng
          </MDTypography>
        ),
        accessor: "name",
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
            Địa chỉ
          </MDTypography>
        ),
        accessor: "address",
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
            Điện thoại
          </MDTypography>
        ),
        accessor: "phone",
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
            Email
          </MDTypography>
        ),
        accessor: "email",
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
        key: 6,
        Header: () => (
          <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
            Hành động
          </MDTypography>
        ),
        accessor: "_id.$oid",
        Cell: ({ cell: { value } }) => {
          return (
            <MDBox display="flex" alignItems="center">
              <MDTooltip title="Xem chi tiết">
                <IconButton
                  onClick={() => {
                    navigate(`/chi-tiet-nhom-quyen/${value}`);
                  }}
                >
                  <MDViewIcon fontSize={fontSize} />
                </IconButton>
              </MDTooltip>
              <MDTooltip title="Cập nhật">
                <IconButton
                  onClick={() => {
                    navigate(`/cap-nhat-nhom-quyen/${value}`);
                  }}
                >
                  <MDEditIcon fontSize={fontSize} />
                </IconButton>
              </MDTooltip>
              <MDTooltip title="Xoá" isError={true}>
                <IconButton
                  onClick={() => {
                    setId(value);
                    setOpenDelete(true);
                  }}
                >
                  <MDDeleteIcon fontSize={fontSize} />
                </IconButton>
              </MDTooltip>
            </MDBox>
          );
        },
      },
    ],
    rows: listApprove,
  };

  const buttonList = [
    {
      id: 2,
      title: "Xuất danh sách",
      onClick: () => {
        getListExportExcel();
      },
    },
    {
      id: 1,
      title: "Thêm mới",
      onClick: () => {
        navigate("/them-nhom-quyen");
      },
    },
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
      <DashboardNavbar breadcrumbTitle="Danh sách khách hàng" />
      <Card sx={{ width: "100%", marginTop: "0.5rem" }}>
        <MDBox p={0}>
          {listApprove.length > 0 ? (
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
          ) : (
            <Loading text="Danh sách khách hàng trống!" />
          )}
        </MDBox>
      </Card>
    </DashboardLayout>
  );
};

export default QuanLyKhachHang;
