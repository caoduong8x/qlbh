import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// MUI & MD Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { IconButton, InputAdornment, InputLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import MDCheckbox from "components/MDCheckbox";
import MDInputLabel from "components/MDInputLabel";
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
  const sidenavColor = webStorageClient.getSidenavColor();
  const darkMode = webStorageClient.getDarkMode();
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    webStorageClient.getRememberMe()
  );

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
    const checkLogin = async () => {
      const verifyLoginResult = await verifyLogin();
      if (verifyLoginResult) {
        webStorageClient.setAuth(true);
        navigate("/khach-hang");
      }
    };
    checkLogin();
    setChecking(true);
  }, []);

  const verifyLogin = async () => {
    try {
      const token = webStorageClient.getToken();
      if (!token) return false;
      const res = await AuthService.verifyLogin();
      return res?.valid === true;
    } catch (e) {
      return false;
    }
  };

  const onLogin = async (e) => {
    e.preventDefault();

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
        navigate("/khach-hang");
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

  return checking ? (
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

        <MDBox display="flex" alignItems="center" ml={-1}>
          <MDCheckbox
            name="remember"
            id="remember"
            checked={rememberMe}
            onChange={() => {
              setRememberMe(!rememberMe);
              webStorageClient.setRememberMe(!rememberMe);
            }}
          />
          <MDInputLabel
            variant="standard"
            fontWeight="regular"
            sx={{ lineHeight: "1.5", cursor: "pointer", pt: 0.5 }}
            htmlFor="remember"
            textContent="Ghi nhớ đăng nhập"
          />
        </MDBox>

        <MDBox mt={2} mb={1}>
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
  ) : null;
}

export default Login;
