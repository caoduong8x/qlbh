import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// MUI & MD Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import AuthService from "services/auth-service";
import { AuthContext } from "context";
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import bgImage from "assets/images/illustrations/logo_QNA.png";
import webStorageClient from "config/webStorageClient";
import { set } from "date-fns";
import colors from "assets/theme/base/colors";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const sidenavColor = webStorageClient.getSidenavColor();
  const darkMode = webStorageClient.getDarkMode();

  const effectiveColor = darkMode
    ? colors.grey[600]
    : sidenavColor
    ? colors.gradients[sidenavColor].main
    : colors.gradients.info.main;

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    emailError: false,
    passwordError: false,
  });

  const changeHandler = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    color: "success",
    message: "",
  });

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    if (webStorageClient.getToken() && webStorageClient.getAuth()) {
      return navigate("/");
    }
  }, [navigate]);

  const onLogin = async (e) => {
    e.preventDefault();
    if (webStorageClient.getToken() && webStorageClient.getAuth()) {
      return navigate("/");
    }

    const newErrors = {
      emailError: inputs.email.trim().length === 0,
      passwordError: inputs.password.trim().length === 0,
    };

    setErrors(newErrors);

    if (newErrors.emailError || newErrors.passwordError) {
      return;
    }

    try {
      const res = await AuthService.login({
        email: inputs.email,
        password: inputs.password,
      });
      if (res?.access_token) {
        webStorageClient.setToken(res?.access_token);
        webStorageClient.setAuth(true);
        navigate("/");
      } else {
        setSnackbar({
          open: true,
          color: "error",
          message: "Sai thông tin đăng nhập!",
        });
      }
    } catch (error) {
      let message = "Lỗi kết nối tới máy chủ!";
      if (error?.status === 400 || error?.status === 401) {
        message = "Sai thông tin đăng nhập!";
      }
      setSnackbar({
        open: true,
        color: "error",
        message: message,
      });
      console.log("error: ", error);
    }
  };

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <IllustrationLayout illustration={bgImage}>
      <MDBox textAlign="center" mb={3}>
        <MDTypography variant="h5" fontWeight="medium">
          Đăng nhập hệ thống
        </MDTypography>
        <MDTypography color="text" variant="body2" mt={1}>
          Nhập thông tin tài khoản của bạn
        </MDTypography>
      </MDBox>

      <MDBox component="form" role="form" method="submit" onSubmit={onLogin}>
        <MDBox mb={2}>
          <MDInput
            type="email"
            label="Email"
            variant="standard"
            fullWidth
            name="email"
            value={inputs.email}
            onChange={changeHandler}
            error={errors.emailError}
            inputProps={{
              autoComplete: "email",
              form: {
                autoComplete: "off",
              },
            }}
          />
          {errors.emailError && (
            <MDTypography variant="caption" color="error" fontWeight="light">
              Bạn chưa nhập email!
            </MDTypography>
          )}
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            type={showPassword ? "text" : "password"}
            label="Mật khẩu"
            variant="standard"
            fullWidth
            name="password"
            value={inputs.password}
            onChange={changeHandler}
            error={errors.passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePassword}
                    sx={{
                      color: effectiveColor,
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {errors.passwordError && (
            <MDTypography variant="caption" color="error" fontWeight="light">
              Bạn chưa nhập mật khẩu!
            </MDTypography>
          )}
        </MDBox>

        <MDBox mt={4} mb={1}>
          <MDButton variant="gradient" fullWidth type="submit">
            Đăng nhập
          </MDButton>
        </MDBox>
      </MDBox>

      <MDSnackbar
        color={snackbar.color}
        icon={snackbar.color === "success" ? "check" : "error"}
        title="Thông báo"
        content={snackbar.message}
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        close={handleCloseSnackbar}
        bgWhite
      />
    </IllustrationLayout>
  );
}

export default Login;
