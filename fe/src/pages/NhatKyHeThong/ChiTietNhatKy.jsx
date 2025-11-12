import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import colors from "assets/theme/base/colors";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout/index";
import DashboardNavbar from "examples/Navbars/DashboardNavbar/index";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context/index";

import { API_SERVER } from "services/constants";
import { endpointLog } from "services/endpoint";
import { getRequest } from "services/request/index";
import { useParams } from "react-router-dom";

import moment from "moment";
import { Icon } from "../../../node_modules/@mui/material/index";
import ReactJson from "react-json-view";
import { useLocation } from "react-router-dom";

const ChiTietNhatKy = () => {
  const location = useLocation()?.state;

  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [dataDetail, setDataDetail] = useState();
  const params = useParams();

  const JsonTreeView = ({ data }) => {
    return (
      <ReactJson
        src={data}
        theme="rjv-default"
        collapsed={false}
        enableClipboard={true}
        displayDataTypes={false}
        displayObjectSize={false}
        style={{
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
        }}
      />
    );
  };

  useEffect(() => {
    getRequest(`${API_SERVER}${endpointLog.getAll}/${params?.id}`)
      ?.then((res) => {
        setDataDetail(res?.data);
        // setDataPermission(res?.permission);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params?.id]);

  const getBackgroundColor = (status) => {
    switch (status) {
      case "DPD":
        return colors?.success?.focus;
      case "CPD":
        return colors?.warning?.focus;
      case "YCS":
        return colors?.warning?.error;
      default:
        return "#BDBDBD";
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar breadcrumbTitle="Chi tiết Lịch sử thao tác hệ thống" />
      <Card sx={{ width: "100%", marginTop: "0.5rem" }}>
        <MDBox p={1} component="form">
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
                  CHI TIẾT THAO TÁC HỆ THỐNG
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
                  onClick={() =>
                    navigate("/nhat-ky-he-thong", { state: location })
                  }
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

          <Grid container alignItems="center">
            <Grid item xs={12} p={1}>
              <Grid container>
                <Grid
                  item
                  md={6}
                  pb={1}
                  pl={2}
                  xs={12}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <MDTypography variant="h6">Loại:</MDTypography>
                  <span
                    style={{
                      color: colors?.grey[700],
                      paddingLeft: "10px",
                      fontSize: "16px",
                      fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                    }}
                  >
                    {dataDetail?.level}
                  </span>
                </Grid>
                <Grid
                  item
                  md={6}
                  pb={1}
                  pl={2}
                  xs={12}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <MDTypography variant="h6">Ngày Tạo:</MDTypography>
                  <span
                    style={{
                      color: colors?.grey[700],
                      paddingLeft: "10px",
                      fontSize: "16px",
                      fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                    }}
                  >
                    {moment(dataDetail?.timestamp).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </span>
                </Grid>
                <Grid
                  item
                  pb={1}
                  md={6}
                  pl={2}
                  xs={12}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <MDTypography variant="h6">Status message:</MDTypography>
                  <span
                    style={{
                      color: colors?.grey[700],
                      paddingLeft: "10px",
                      fontSize: "16px",
                      fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                    }}
                  >
                    {dataDetail?.metaData?.statusMessage}
                  </span>
                </Grid>
                <Grid
                  item
                  pb={1}
                  md={6}
                  pl={2}
                  xs={12}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <MDTypography variant="h6">Status:</MDTypography>
                  <span
                    style={{
                      color: colors?.grey[700],
                      paddingLeft: "10px",
                      fontSize: "16px",
                      fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                    }}
                  >
                    {dataDetail?.metaData?.status}
                  </span>
                </Grid>
                <Grid
                  item
                  pb={1}
                  pl={2}
                  xs={12}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <MDTypography variant="h6" style={{ minWidth: "80px" }}>
                    Đối tượng:
                  </MDTypography>
                  <span
                    style={{
                      color: colors?.grey[700],
                      paddingLeft: "10px",
                      fontSize: "16px",
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                    }}
                  >
                    {dataDetail?.metaData?.url}
                  </span>
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
                  Thông tin chi tiết
                </MDTypography>
              </MDBox>
            </Grid>

            <Grid
              container
              sx={{
                borderRadius: "8px",
                padding: "20px",
                overflow: "hidden",
              }}
              xs={12}
            >
              <Grid md={12}>
                <JsonTreeView data={dataDetail} />
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
};

export default ChiTietNhatKy;
