import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Typography } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";

const NotFound = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <DashboardLayout>
      <DashboardNavbar breadcrumbTitle="Not Found" />
      <Card sx={{ width: "100%", height: "80vh", marginTop: "1.5rem" }}>
        <MDBox
          display="flex"
          height="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          px={3}
          my={2}
          mb={2}
        >
          <MDTypography
            variant="h1"
            color={darkMode ? "white" : "dark"}
            fontWeight="bold"
            fontSize="80px"
          >
            404
          </MDTypography>
          <MDTypography variant="h6" color={darkMode ? "white" : "dark"} mt={2}>
            Trang bạn đang tìm kiếm không có ở đây !
          </MDTypography>
          <MDTypography
            variant="body1"
            color={darkMode ? "white" : "dark"}
            mt={1}
          >
            Có thể bạn đã nhập sai địa chỉ hoặc trang đó đã được di chuyển.
          </MDTypography>
          <MDBox mt={3}>
            <MDTypography
              component="a"
              href="/"
              variant="button"
              color="info"
              fontWeight="bold"
            >
              Quay lại trang chủ
            </MDTypography>
          </MDBox>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
};

export default NotFound;
