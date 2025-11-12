import React, { useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { deleteRequest } from "services/request/index";
import { AuthContext } from "context/index";
import { API_SERVER } from "services/constants";
import { endpointCsdlNganh } from "services/endpoint";
import { useNavigate } from "react-router-dom";
import { useMaterialUIController } from "context";
import colors from "assets/theme/base/colors";

export const XoaChart = ({ open, setOpen, infoChart, reloadDelete, setReloadDelete }) => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    const urlDetail = `${API_SERVER}${endpointCsdlNganh?.SuperSet}/xoa-bao-cao/${infoChart?.maPhongBan}/${infoChart?.maBaoCao}`;

    deleteRequest(urlDetail)
      ?.then((res) => {
        authContext.openAlert();
        authContext.alertInfo({
          icon: "notifications",
          title: "Xóa biểu đồ",
          content: "Xóa biểu đồ thành công!",
          open: authContext.open,
          close: authContext.openAlert(),
          color: "info",
        });
        setOpen(false);
        setReloadDelete(!reloadDelete);
      })
      ?.catch((e) => {
        setOpen(false);
        console.log(e);
        authContext.openAlert();
        authContext.alertInfo({
          icon: "notifications",
          title: "Xóa biểu đồ",
          content: "Xóa biểu đồ thất bại!",
          open: authContext.open,
          close: authContext.openAlert(),
          color: "error",
        });
      });
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
            backgroundColor: darkMode ? colors?.grey?.[700] : colors?.white?.focus,
            color: darkMode ? colors?.white?.focus : colors?.black?.light,
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Xóa biểu đồ ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa biểu đồ thống kê này ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              "&:hover": {
                backgroundColor: colors?.info?.focus,
                color: colors?.white?.focus
              },
            }}
            onClick={handleClose}>Hủy</Button>
          <Button
            onClick={handleDelete}
            sx={{
              backgroundColor: darkMode ? colors?.info?.main : '#3A91EE',
              color: colors?.white?.focus,
              "&:hover": {
                backgroundColor: colors?.info?.focus,
                color: colors?.white?.focus
              },
            }}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
