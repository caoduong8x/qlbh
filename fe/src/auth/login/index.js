import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// MUI & MD Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

import AuthService from "services/auth-service";
import { AuthContext } from "context";
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import bgImage from "assets/images/illustrations/logo_QNA.png";
import webStorageClient from "config/webStorageClient";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    color: "success",
    message: "",
  });

  const onLogin = async () => {
    if (webStorageClient.getToken() && webStorageClient.getAuth()) {
      return navigate("/");
    }
    if (!email || !password) {
      return setSnackbar({
        open: true,
        color: "error",
        message: "Vui lòng nhập email và mật khẩu!",
      });
    }

    try {
      const res = await AuthService.login({ email, password });
      console.log("res: ", res);

      if (res?.access_token) {
        webStorageClient.setToken(res?.access_token);
        webStorageClient.setAuth(true);

        // setSnackbar({
        //   open: true,
        //   color: "success",
        //   message: "Đăng nhập thành công!",
        // });

        // điều hướng sau 1 giây
        // setTimeout(() => navigate("/"), 1000);
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

      <MDBox component="form" role="form">
        <MDBox mb={2}>
          <MDInput
            type="email"
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            type="password"
            label="Mật khẩu"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </MDBox>
        <MDBox mt={4} mb={1}>
          <MDButton
            variant="gradient"
            color="info"
            size="large"
            fullWidth
            onClick={onLogin}
          >
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
