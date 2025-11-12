import React, { useState, useEffect } from "react";
import colors from "assets/theme/base/colors";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Typography } from "@mui/material/index";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout/index";
import FormField from "layouts/applications/wizard/components/FormField";
import DashboardNavbar from "examples/Navbars/DashboardNavbar/index";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import { useMaterialUIController } from "context/index";
import { API_SERVER } from "services/constants";
import { endpointUser } from "services/endpoint";
import { getRequest } from "services/request/index";
import { useParams } from "react-router-dom";

const ChiTietNguoiDung = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const params = useParams();

  const [dataDetail, setDataDetail] = useState();
  const [loading, setLoading] = useState(true); // Thêm trạng thái tải

  useEffect(() => {
    getRequest(`${API_SERVER}${endpointUser.ChiTietUser}/${params?.id}`)
      ?.then((res) => {
        console.log("res?.data", res?.data);
        setDataDetail(res?.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false); // Đặt trạng thái tải thành false khi hoàn tất
      });
  }, [params?.id]);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>; // Hiển thị thông báo khi đang tải
  }

  return (
    <DashboardLayout>
      <DashboardNavbar breadcrumbTitle="Chi tiết người dùng" />
      <Card sx={{ width: "100%", marginTop: "1.5rem" }}>
        <MDBox display="flex" flexDirection="column" px={3} my={2} mb={2}>
          {/* Hiển thị thông tin người dùng */}
          {[
            { label: "Tài khoản", value: dataDetail?.taiKhoan },
            { label: "Họ tên", value: dataDetail?.hoVaTen },
            {
              label: "Email",
              value: dataDetail?.tkMailCongVu,
            },
            { label: "Điện thoại", value: dataDetail?.dienThoai },
            { label: "Ghi chú", value: dataDetail?.ghiChu },
          ].map((item, index) => (
            <Grid
              container
              rowSpacing={1}
              columnSpacing={3}
              key={index}
              justifyContent="flex-start"
              alignItems="center"
              sx={{ paddingBottom: "10px" }}
            >
              <Grid
                item
                xs={12}
                lg={3}
                md={6}
                sx={{ textAlign: { xs: "left", md: "right" } }}
              >
                <Typography
                  sx={{
                    color: darkMode ? `${colors?.white?.focus} !important` : "",
                    fontSize: "16px",
                  }}
                >
                  {item.label}{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} lg={8}>
                <FormField
                  type="text"
                  placeholder=""
                  name={item.label}
                  value={item.value}
                  readonly={true}
                />
              </Grid>
            </Grid>
          ))}
          <Grid
            container
            rowSpacing={1}
            columnSpacing={3}
            justifyContent="flex-start"
            alignItems="center"
            sx={{ paddingBottom: "10px" }}
          >
            <Grid
              item
              xs={12}
              lg={3}
              md={6}
              sx={{ textAlign: { xs: "left", md: "right" } }}
            >
              <Typography
                sx={{
                  color: darkMode ? `${colors?.white?.focus} !important` : "",
                  fontSize: "16px",
                }}
              >
                Kích hoạt{" "}
              </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
              <Checkbox disabled checked={dataDetail?.kichHoat} />
            </Grid>
          </Grid>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
};

export default ChiTietNguoiDung;
