/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useMemo, useEffect, useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-table components
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
} from "react-table";

// @mui material components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon";
import Autocomplete from "@mui/material/Autocomplete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import colors from "assets/theme/base/colors";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDPagination from "components/MDPagination";
import { Tooltip, IconButton } from "@mui/material";
import MDTooltip from "components/MDTooltip/index";

import webStorageClient from "config/webStorageClient";
import { useMaterialUIController } from "context";

// Material Dashboard 2 PRO React examples
import DataTableHeadCell from "examples/Tables/DataTable/DataTableHeadCell";
import DataTableBodyCell from "examples/Tables/DataTable/DataTableBodyCell";
import MDButton from "components/MDButton/index";
import pxToRem from "assets/theme/functions/pxToRem";

import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { Grid } from "@mui/material/index";
import {
  bo,
  co,
} from "../../../../node_modules/@fullcalendar/core/internal-common";

function DataTable({
  entriesPerPage,
  canSearch,
  fullWidthSearch,
  showTotalEntries,
  table,
  pagination,
  isSorted,
  noEndBorder = false,
  hasButtons = true,
  buttons,
  totalPage,
  onChangeSearch,
  pageCurrent,
  onPageChange,
  onPageSizeChange,
}) {
  const defaultValue = entriesPerPage.defaultValue
    ? entriesPerPage.defaultValue
    : 10;
  const entries = entriesPerPage.entries
    ? entriesPerPage.entries.map((el) => el.toString())
    : ["10", "20", "50", "100", "200"];
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);

  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;

  const effectiveColor = darkMode
    ? colors.grey[600]
    : sidenavColor
    ? colors.gradients[sidenavColor].main
    : colors.gradients.info.main;

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageOptions,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = tableInstance;

  // Set the default value for the entries per page when component mounts
  useEffect(() => setPageSize(defaultValue || 10), [defaultValue]);

  // Set the entries per page value based on the select value
  const setEntriesPerPage = (value) => {
    setPageSize(value);
    onPageChange(1);
    if (onPageSizeChange) onPageSizeChange(value);
  };

  // Search input value state
  const [search, setSearch] = useState(globalFilter);

  // Search input state handle
  const onSearchChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 100);

  // A function that sets the sorted value for the table
  const setSortedValue = (column) => {
    let sortedValue;

    if (isSorted && column.isSorted) {
      sortedValue = column.isSortedDesc ? "desc" : "asce";
    } else if (isSorted) {
      sortedValue = "none";
    } else {
      sortedValue = false;
    }

    return sortedValue;
  };

  // Setting the entries starting point
  const entriesStart =
    pageIndex === 0 ? pageIndex + 1 : pageIndex * pageSize + 1;

  // Setting the entries ending point
  let entriesEnd;

  if (pageIndex === 0) {
    entriesEnd = pageSize;
  } else if (pageIndex === pageOptions.length - 1) {
    entriesEnd = rows.length;
  } else {
    entriesEnd = pageSize * (pageIndex + 1);
  }

  const buttonList = [];

  return (
    <TableContainer sx={{ boxShadow: "none" }}>
      {fullWidthSearch && (
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          // sx={{ paddingBottom: "10px" }}
          xs={12}
          md={12}
          sx={{ paddingTop: 1 }}
        >
          <Grid item xs={12} md={12}>
            <MDInput
              placeholder="Tìm kiếm..."
              value={search}
              size="small"
              fullWidth
              onChange={({ currentTarget }) => {
                setSearch(search);
                onChangeSearch != null
                  ? onChangeSearch(currentTarget.value)
                  : onSearchChange(currentTarget.value);
              }}
            />
          </Grid>
        </Grid>
      )}
      <MDBox
        // width="100%"
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        sx={({ breakpoints }) => ({
          [breakpoints.up("xl")]: {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: `${pxToRem(8)}`,
            marginRight: `${pxToRem(8)}`,
          },
          [breakpoints.up("md")]: {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: `${pxToRem(8)}`,
          },
          [breakpoints.up("xs")]: {
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: `${pxToRem(10)}`,
          },
        })}
      >
        {hasButtons ? (
          <MDBox
            display="flex"
            flexWrap="wrap"
            sx={({ breakpoints }) => ({
              [breakpoints.up("xl")]: {
                flexDirection: "row",
                justifyContent: "flex-end",
                padding: `${pxToRem(8)}`,
                gap: `${pxToRem(8)}`,
                order: 2,
              },
              [breakpoints.up("md")]: {
                flexDirection: "row",
                justifyContent: "flex-end",
                padding: `${pxToRem(8)}`,
                gap: `${pxToRem(8)}`,
                order: 2,
              },
              [breakpoints.up("xs")]: {
                justifyContent: "flex-start",
                gap: `${pxToRem(10)}`,
                order: 1,
              },
            })}
          >
            {(buttons || buttonList)?.length > 2
              ? (buttons || buttonList)?.map((button) => (
                  <MDTooltip
                    title={button?.title}
                    isError={
                      button?.title.includes("Hủy") ||
                      button?.title.includes("Xóa")
                    }
                  >
                    <MDButton
                      variant="gradient"
                      key={button?.id}
                      onClick={button?.onClick}
                      isDeleteButton={
                        button?.title.includes("Hủy") ||
                        button?.title.includes("Xóa")
                      }
                      sx={{
                        fontSize: "12px",
                        backgroundColor:
                          (darkMode
                            ? colors.grey[600]
                            : button?.title.includes("Hủy")
                            ? colors.gradients.error.main
                            : button?.title.includes("Dừng")
                            ? colors.gradients.warning.main
                            : colors.gradients[sidenavColor].main ||
                              colors.gradients.info.main) + " !important",
                        color:
                          (darkMode ? colors.light.main : colors.white.main) +
                          " !important",
                        "&:hover": {
                          backgroundColor:
                            (colors.gradients[sidenavColor].state ||
                              colors.gradients.info.state) + " !important",
                        },
                      }}
                    >
                      {button?.title.includes("Hủy") ? (
                        <Icon color="white">delete</Icon>
                      ) : null}
                      {button?.title.includes("Xóa") ? (
                        <Icon color="white">delete</Icon>
                      ) : null}
                      {button?.title.includes("Dừng") ? (
                        <Icon color="white">stop</Icon>
                      ) : null}
                      {button?.title.includes("Tiếp") ? (
                        <PlayArrowIcon fontSize="large" color="white" />
                      ) : null}
                      {button?.title === "Xuất danh sách" ? (
                        <Icon color="white">downloadforofflineicon</Icon>
                      ) : null}
                      {button?.title === "Thêm mới" ? (
                        <Icon color="white">add_circle</Icon>
                      ) : null}
                      {button?.title === "Nhập liệu" ? (
                        <Icon color="white">upload</Icon>
                      ) : null}
                    </MDButton>
                  </MDTooltip>
                ))
              : (buttons || buttonList)?.map((button) => (
                  <MDButton
                    variant="gradient"
                    key={button?.id}
                    onClick={button?.onClick}
                    sx={{
                      fontSize: "12px",
                      backgroundColor:
                        (darkMode
                          ? colors.grey[600]
                          : button?.title.includes("Hủy")
                          ? colors.gradients.error.main
                          : button?.title.includes("Dừng")
                          ? colors.gradients.warning.main
                          : colors.gradients[sidenavColor].main ||
                            colors.gradients.info.main) + " !important",
                      color:
                        (darkMode ? colors.light.main : colors.white.main) +
                        " !important",
                      "&:hover": {
                        backgroundColor:
                          (colors.gradients[sidenavColor].state ||
                            colors.gradients.info.state) + " !important",
                      },
                    }}
                  >
                    {button?.title === "Hủy chia sẻ" ? (
                      <>
                        <Icon color="white">delete</Icon>
                        &nbsp;
                      </>
                    ) : null}
                    {button?.title === "Dừng chia sẻ" ? (
                      <>
                        <Icon color="white">stop</Icon>
                        &nbsp;
                      </>
                    ) : null}
                    {button?.title === "Tiếp tục chia sẻ" ? (
                      <>
                        <PlayArrowIcon fontSize="large" color="white" />
                        &nbsp;
                      </>
                    ) : null}
                    {button?.title === "Xuất danh sách" ? (
                      <>
                        <Icon color="white">downloadforofflineicon</Icon>
                        &nbsp;
                      </>
                    ) : null}
                    {button?.title === "Thêm mới" ? (
                      <>
                        <Icon color="white">add_circle</Icon>
                        &nbsp;
                      </>
                    ) : null}
                    {button?.title === "Nhập liệu" ? (
                      <>
                        <Icon color="white">upload</Icon>
                        &nbsp;
                      </>
                    ) : null}
                    {button?.title}
                  </MDButton>
                ))}
          </MDBox>
        ) : null}
        {entriesPerPage || canSearch ? (
          <MDBox
            sx={({ breakpoints }) => ({
              [breakpoints.up("xl")]: {
                width: "auto",
                order: 1,
              },
              [breakpoints.up("md")]: {
                width: "auto",
                order: 1,
              },
              [breakpoints.up("xs")]: {
                width: "80vw",
                order: 2,
              },
            })}
          >
            {canSearch && (
              <MDBox ml="auto" sx={{ marginRight: `${pxToRem(8)}` }}>
                <MDInput
                  placeholder="Tìm kiếm..."
                  value={search}
                  size="small"
                  fullWidth
                  onChange={({ currentTarget }) => {
                    setSearch(search);
                    onChangeSearch != null
                      ? onChangeSearch(currentTarget.value)
                      : onSearchChange(currentTarget.value);
                  }}
                />
              </MDBox>
            )}
          </MDBox>
        ) : null}
      </MDBox>
      <MDBox
        sx={{
          maxWidth: "100vw",
          overflow: "auto",
          minHeight:
            table?.rows.length > 3
              ? "60vh"
              : table?.rows.length > 0
              ? "30vh"
              : undefined,
        }}
      >
        <Table {...getTableProps()}>
          <MDBox component="thead">
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <DataTableHeadCell
                    {...column.getHeaderProps(
                      isSorted && column.getSortByToggleProps()
                    )}
                    width={column.width ? column.width : "auto"}
                    align={column.align ? column.align : "center"}
                    sorted={setSortedValue(column)}
                  >
                    {column.render("Header")}
                  </DataTableHeadCell>
                ))}
              </TableRow>
            ))}
          </MDBox>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, key) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <DataTableBodyCell
                      // noBorder={noEndBorder && rows.length - 1 === key}
                      align={cell.column.align ? cell.column.align : "center"}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </DataTableBodyCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </MDBox>

      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        py={pageOptions.length === 1 ? 0 : 3}
      >
        {entriesPerPage.defaultValue != null &&
          entriesPerPage.defaultValue != 1000 && (
            <MDBox display="flex" alignItems="center">
              <Autocomplete
                disableClearable
                value={pageSize.toString()}
                options={entries}
                onChange={(event, newValue) => {
                  setEntriesPerPage(parseInt(newValue, 10));
                }}
                size="small"
                sx={{
                  width: "5rem",
                  marginTop: "0.0rem",
                  marginBottom: "0.5rem",
                  marginLeft: "0.5rem",
                }}
                renderInput={(params) => <MDInput {...params} />}
              />
            </MDBox>
          )}
        {totalPage > 1 && (
          <Pagination
            count={totalPage}
            page={pageCurrent}
            onChange={(event, value) => {
              onPageChange(value);
              gotoPage(value - 1);
            }}
            // color={pagination.color ? pagination.color : "info"}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  color: effectiveColor,
                  borderColor: effectiveColor,
                  "&.Mui-selected": {
                    backgroundColor: effectiveColor + " !important",
                    color: colors.white.main,
                  },
                  "&:hover": {
                    backgroundColor: effectiveColor,
                    color: colors.white.main,
                  },
                }}
              />
            )}
            variant={"outlined"}
          />
        )}
      </MDBox>
    </TableContainer>
  );
}

// Setting default values for the props of DataTable
DataTable.defaultProps = {
  entriesPerPage: { defaultValue: 1000, entries: [5, 20, 50, 100, 200] },
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
  onChangeSearch: null,
};

// Typechecking props for the DataTable
DataTable.propTypes = {
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.shape({
      defaultValue: PropTypes.number,
      entries: PropTypes.arrayOf(PropTypes.number),
    }),
    PropTypes.bool,
  ]),
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
  hasButtons: PropTypes.bool,
  buttons: PropTypes.array,
  totalPage: PropTypes.number,
  onChangeSearch: PropTypes.func,
  pageCurrent: PropTypes.number,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
};

export default DataTable;
