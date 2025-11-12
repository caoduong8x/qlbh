import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import FormField from "layouts/applications/wizard/components/FormField";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout/index";
import DashboardNavbar from "examples/Navbars/DashboardNavbar/index";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { API_SERVER } from "services/constants";
import { endpointBase } from "services/endpoint";
import { postRequest, getRequest, updateRequest } from "services/request/index";
import { messagesAlert } from "config/messages/messages";
import { AuthContext } from "context/index";
import { useParams } from "../../../../node_modules/react-router-dom/index";

export const EditApiKey = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  const [notification, setNotification] = useState({
    value: false,
    color: "info",
    message: "",
  });
  const [apiKey, setApiKey] = useState({
    name: "",
    description: "",
  });
  const [exp_timestamp, set_exp_timestamp] = useState(new Date()?.valueOf());
  const [error, setError] = useState({
    name: false,
    description: false,
    error: false,
    textError: "",
  });

  useEffect(() => {
    if (notification.value === true) {
      let timer = setTimeout(() => {
        setNotification({ value: false, color: "info", message: "" });
      }, 5000);
    }
  }, [notification]);

  useEffect(() => {
    getRequest(`${API_SERVER}/${endpointBase.APIKEY}/${params?.id}`)
      .then((response) => {
        if (response) {
          setApiKey({
            name: response.name,
            description: response.description,
          });
          if (response.expiredDate != null && response.expiredDate != "") {
            set_exp_timestamp(new Date(response.expiredDate)?.valueOf());
          }
        }
      })
      .catch((error) => {
        console.log(error);
        //  message.error(`${t("message.addFail")}`)
      });
  }, [params]);

  const changeNameHandler = (e) => {
    setApiKey({ ...apiKey, name: e.target.value });
  };
  const changeDescriptionHandler = (e) => {
    setApiKey({ ...apiKey, description: e.target.value });
  };

  const handleDateChange = (newValue) => {
    set_exp_timestamp(newValue?.valueOf());
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    postRequest(`${API_SERVER}/${endpointBase.CREATETOKEN}`, {
      data: { exp_timestamp: exp_timestamp },
    }).then((res) => {
      const datasubmit = {
        ...res?.success,
        name: apiKey?.name,
        description: apiKey?.description,
        expiredDate: moment(exp_timestamp).format("HH:mm:ss DD-MM-YYYY"),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      getRequest(
        `${API_SERVER}/${endpointBase.APIKEY}?filter={"name": "${apiKey?.name}"}`
      )
        .then((response) => {
          if (response?._returned > 0) {
            message.error(`${t("message.exist")}`);
          } else {
            updateRequest(
              `${API_SERVER}/${endpointBase.APIKEY}/${params?.id}`,
              {
                data: datasubmit,
              }
            )
              .then((res) => {
                authContext.openAlert();
                authContext.alertInfo({
                  icon: "notifications",
                  title: "Khoá API",
                  content: messagesAlert?.apiKey?.editSuccess,
                  open: authContext.open,
                  close: authContext.openAlert(),
                  color: "info",
                });

                navigate("/danh-sach-khoa-api");
              })
              .catch((error) => {
                console.log(error);

                authContext.openAlert();
                authContext.alertInfo({
                  icon: "notifications",
                  title: "Khoá API",
                  content: messagesAlert?.apiKey?.editFail,
                  open: authContext.open,
                  close: authContext.openAlert(),
                  color: "error",
                });
              });
          }
        })
        .catch(
          (error) => {}
          //  message.error(`${t("message.addFail")}`)
        );
    });
  };

  //statusBar

  return (
    <DashboardLayout>
      <DashboardNavbar breadcrumbTitle="Cập nhật khoá Api" />
      <Card sx={{ width: "100%", marginTop: "1.5rem" }}>
        <MDBox p={2} component="form" method="POST" onSubmit={submitHandler}>
          <MDBox display="flex" flexDirection="column" px={3} my={2}>
            <MDBox
              ml="auto"
              mt={4}
              mb={2}
              display="flex"
              justifyContent="flex-end"
            >
              <MDBox mx={2}>
                <MDButton
                  variant="gradient"
                  color="info"
                  size="small"
                  px={2}
                  mx={2}
                  onClick={() =>
                    navigate("/danh-sach-khoa-api", {
                      state: { value: false, text: "" },
                    })
                  }
                >
                  Huỷ
                </MDButton>
              </MDBox>
              <MDButton
                variant="gradient"
                color="info"
                size="small"
                type="submit"
              >
                Cập nhật
              </MDButton>
            </MDBox>
            {/* <MDBox p={1}> */}
            <Grid container justifyContent="space-between" spacing={3}>
              <Grid item xs={12} lg={6}>
                <FormField
                  type="text"
                  label="Tên khoá"
                  name="name"
                  value={apiKey.name}
                  onChange={changeNameHandler}
                  error={error.name}
                />
                {error.name && (
                  <MDTypography
                    variant="caption"
                    color="error"
                    fontWeight="light"
                  >
                    {error.textError}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12} lg={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label="Ngày hết hạn"
                    inputFormat="DD/MM/YYYY"
                    name="date"
                    value={new Date(exp_timestamp)}
                    onChange={handleDateChange}
                    slotProps={{ textField: { variant: "standard" } }}
                    renderInput={(params) => <TextField {...params} />}
                    sx={{
                      width: "100%",
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} lg={12}>
                <FormField
                  type="text"
                  label="Mô tả"
                  name="description"
                  value={apiKey.description}
                  onChange={changeDescriptionHandler}
                  error={error.description}
                />
                {error.description && (
                  <MDTypography
                    variant="caption"
                    color="error"
                    fontWeight="light"
                  >
                    {error.textError}
                  </MDTypography>
                )}
              </Grid>
            </Grid>
            {/* </MDBox> */}
          </MDBox>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
};
