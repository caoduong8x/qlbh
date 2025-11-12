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

// @mui material components
import { useContext, useEffect } from "react";
import { AuthContext } from "context";

import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import BookingCard from "examples/Cards/BookingCard";

// Anaytics dashboard components
import SalesByCountry from "layouts/dashboards/analytics/components/SalesByCountry";

// Data
import reportsBarChartData from "layouts/dashboards/analytics/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboards/analytics/data/reportsLineChartData";

import { Chart } from "./Chart";

function Superset({ supersetId, supersetTitle }) {
  const { sales, tasks } = reportsLineChartData;

  const { setIsAuthenticated, getCurrentUser } = useContext(AuthContext);
  console.log("supersetId", supersetId);

  useEffect(() => {
    async function checkToken() {
      let user = await getCurrentUser();
      if (!user) {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      }
    }
    checkToken();
  }, [supersetId]);

  // Action buttons for the BookingCard
  const actionButtons = (
    <>
      <Tooltip title="Refresh" placement="bottom">
        <MDTypography
          variant="body1"
          color="primary"
          lineHeight={1}
          sx={{ cursor: "pointer", mx: 3 }}
        >
          <Icon color="inherit">refresh</Icon>
        </MDTypography>
      </Tooltip>
      <Tooltip title="Edit" placement="bottom">
        <MDTypography
          variant="body1"
          color="info"
          lineHeight={1}
          sx={{ cursor: "pointer", mx: 3 }}
        >
          <Icon color="inherit">edit</Icon>
        </MDTypography>
      </Tooltip>
    </>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* <Grid container>
          <SalesByCountry />
        </Grid> */}
        {supersetId ? (
          <Chart title={supersetTitle} idChart={supersetId} />
        ) : (
          <h1>Chưa có biểu đồ</h1>
        )}
        {/* <Chart
          title={"Báo cáo công tác quản lý nhà nước về hoạt động xuất bản"}
          idChart={"5ea15d2f-9d7c-411e-ade6-fbc0d55d00a5"}
        /> */}
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Superset;
