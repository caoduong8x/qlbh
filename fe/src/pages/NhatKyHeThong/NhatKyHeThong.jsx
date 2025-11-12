import { useEffect, useState } from "react";

import moment from "moment";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { Tooltip, IconButton } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout/index";
import DashboardNavbar from "examples/Navbars/DashboardNavbar/index";
import MDTypography from "components/MDTypography/index";
import MDBox from "components/MDBox/index";
import FilterAltSharpIcon from "@mui/icons-material/FilterAltSharp";

import { useMaterialUIController } from "context";
import DataTable from "examples/Tables/DataTable/index";
// import { getRequest } from "services/request/getRequest";
import { API_SERVER } from "services/constants";
import { endpointLog } from "services/endpoint";
import { getRequest } from "services/request/index";
import { SelectComponentV2 } from "components/Common/Select/SelectComponentV2";
import { Grid, Typography } from "../../../node_modules/@mui/material/index";
import MDInput from "components/MDInput/index";
import { debounce } from "lodash";
import { useLocation } from "react-router-dom";

const NhatKyHeThong = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [listApprove, setListApprove] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [count, setCount] = useState(true);
  const [totalPage, setTotalPage] = useState(0);
  const [fromDate, setFromDate] = useState(location?.state?.fromDate || null);
  const [toDate, setToDate] = useState(location?.state?.toDate || null);
  const [selectMethod, setSelectMethod] = useState(
    location?.state?.method || []
  );
  const [textSearch, setTextSearch] = useState("");

  const [openFilter, setOpenFilter] = useState(
    location?.state === null ? false : true
  );
  const [filter, setFilter] = useState({
    params: {
      page: page,
      pagesize: pageSize,
      count: count,
      // sort: "-timestamp",
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
    getLog();
  }, [filter]);

  const getLog = () => {
    let url = `${API_SERVER}${endpointLog.getAll}`;
    getRequest(url, filter)
      ?.then((res) => {
        setListApprove(res?.data?._embedded);
        setTotalPage(res?.data?._total_pages);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const listMethod = [
    { value: "GET", label: "GET" },
    { value: "POST", label: "POST" },
    { value: "PATCH", label: "PATCH" },
    { value: "DELETE", label: "DELETE" },
  ];

  useEffect(() => {
    const filterSearch = {
      $and: [
        ...(selectMethod?.value
          ? [
              {
                "metaData.method": {
                  $regex: selectMethod.value,
                  $options: "i",
                },
              },
            ]
          : []),

        ...(textSearch
          ? [
              {
                $or: [
                  {
                    "metaData.actor": {
                      $regex: textSearch,
                      $options: "i",
                    },
                  },
                  {
                    ["metaData.url"]: {
                      $regex: textSearch,
                      $options: "i",
                    },
                  },
                ],
              },
            ]
          : []),

        {
          "metaData.timestamp": {
            $gte: fromDate ? new Date(fromDate).getTime() : 0,
            $lte: toDate
              ? toDate === fromDate
                ? new Date(toDate).setHours(23, 59, 59, 999)
                : new Date(toDate).getTime()
              : new Date().getTime(),
          },
        },
      ],
    };

    if (textSearch || selectMethod || (fromDate && toDate)) {
      setFilter({
        params: {
          page: 1,
          pagesize: pageSize,
          count: count,
          filter: JSON.stringify(filterSearch),
        },
      });
    }
  }, [textSearch, selectMethod, fromDate, toDate]);

  const onChangeSearch = debounce((value) => {
    setTextSearch(value);
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
            Tài khoản
          </MDTypography>
        ),
        accessor: "metaData.actor",
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
            Thời gian
          </MDTypography>
        ),
        accessor: "timestamp",
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
                {moment(value).utcOffset(7).format("DD-MM-YYYY HH:mm:ss")}
              </MDTypography>
            </>
          );
        },
      },
      {
        key: 4,
        Header: () => (
          <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
            Loại
          </MDTypography>
        ),
        accessor: "level",
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
        key: 5,
        Header: () => (
          <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
            Phương thức
          </MDTypography>
        ),
        accessor: "metaData.method",
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
            Đối tượng
          </MDTypography>
        ),
        accessor: "metaData.url",
        Cell: ({ cell: { value } }) => {
          return (
            <MDBox
              sx={{
                width: "200px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <MDTypography
                variant="caption"
                color={darkMode ? "white" : "dark"}
                sx={{
                  fontSize: "14px",
                }}
              >
                {value}
              </MDTypography>
            </MDBox>
          );
        },
      },

      {
        key: 7,
        Header: () => (
          <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
            Hành động
          </MDTypography>
        ),
        accessor: "_id.$oid",
        Cell: ({ cell: { value } }) => {
          return (
            <MDBox display="flex" alignItems="center">
              <Tooltip title="Xem chi tiết">
                <IconButton
                  onClick={() => {
                    if (fromDate || toDate || selectMethod) {
                      navigate(`/chi-tiet-nhat-ky/${value}`, {
                        state: {
                          fromDate: fromDate,
                          toDate: toDate,
                          method: selectMethod,
                        },
                      });
                    } else {
                      navigate(`/chi-tiet-nhat-ky/${value}`);
                    }
                  }}
                >
                  <RemoveRedEyeIcon color={darkMode ? "text" : "secondary"} />
                </IconButton>
              </Tooltip>
            </MDBox>
          );
        },
      },
    ],
    rows: listApprove,
  };

  return (
    <DashboardLayout>
      <DashboardNavbar breadcrumbTitle="Lịch sử thao tác hệ thống" />
      <Card sx={{ width: "100%", marginTop: "1.5rem" }}>
        <MDBox pl={3}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <MDTypography
                sx={{
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Lọc dữ liệu
                <FilterAltSharpIcon
                  style={{ cursor: "pointer", paddingLeft: "20px" }}
                  onClick={() => {
                    setOpenFilter(!openFilter);
                  }}
                />
              </MDTypography>
            </Grid>
            {openFilter && (
              <Grid item xs={12} md={4}>
                <MDTypography
                  sx={{
                    fontSize: "14px",
                  }}
                >
                  Từ ngày :
                </MDTypography>
                <MDInput
                  placeholder="dd/mm/yyywy"
                  sx={{ width: "100%" }}
                  type="date"
                  name="fromDay"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                  }}
                />
              </Grid>
            )}
            {openFilter && (
              <Grid item xs={12} md={4}>
                <MDTypography
                  sx={{
                    fontSize: "14px",
                  }}
                >
                  Đến ngày :
                </MDTypography>
                <MDInput
                  placeholder="dd/mm/yyywy"
                  sx={{ width: "100%" }}
                  type="date"
                  name="toDay"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                  }}
                />
              </Grid>
            )}
            {openFilter && (
              <Grid item xs={12} md={3}>
                <MDTypography
                  sx={{
                    fontSize: "14px",
                  }}
                >
                  Phương thức
                </MDTypography>
                <SelectComponentV2
                  style={{ padding: "10px" }}
                  label="Chọn Phương thức"
                  data={listMethod}
                  dataSelect={selectMethod}
                  setDataSelect={setSelectMethod}
                />
              </Grid>
            )}
          </Grid>
        </MDBox>
        <MDBox p={2}>
          <DataTable
            table={data}
            isSorted={false}
            sx={{ border: "1px solid", padding: "2rem" }}
            showTotalEntries={false}
            canSearch
            onChangeSearch={onChangeSearch}
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

export default NhatKyHeThong;
