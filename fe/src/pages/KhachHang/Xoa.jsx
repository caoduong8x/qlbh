import React, { useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { AuthContext } from "context/index";
import { useMaterialUIController } from "context";
import colors from "assets/theme/base/colors";
import MDButton from "components/MDButton";
import { endpointKhachHang } from "services/endpoint";
import * as Services from "services/request/index";

export const Xoa = ({ open, setOpen, id, title }) => {
  const authContext = useContext(AuthContext);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const showAlert = (content, isError = false) => {
    authContext.openAlert();
    authContext.alertInfo({
      icon: "notifications",
      title: `Xóa thông tin ${title}`,
      content,
      isError,
    });
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const url = `${endpointKhachHang}/${id}`;

      await Services.deleteRequest(url);

      showAlert(`Thông tin ${title} đã được xóa thành công!`);
    } catch (e) {
      console.log("Delete error:", e);
      const content =
        e.response?.status === 400
          ? e.response?.data?.error ||
            e.response?.data?.message ||
            "Xóa thất bại!"
          : "Xóa thất bại!";
      showAlert(content, true);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: darkMode
              ? colors?.grey?.[700]
              : colors?.white?.focus,
            color: darkMode ? colors?.white?.focus : colors?.black?.light,
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {`Xóa Thông tin ${title}?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa Thông tin {title} này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleClose}>Hủy</MDButton>
          <MDButton onClick={handleDelete} isDeleteButton={true}>
            Đồng ý
          </MDButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};
