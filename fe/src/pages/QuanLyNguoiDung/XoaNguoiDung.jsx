import React, { useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { deleteRequest, getRequest } from "services/request/index";
import { AuthContext } from "context/index";
import { API_SERVER } from "services/constants";
import { endpointCsdlNganh, endpointUser } from "services/endpoint";
import { useMaterialUIController } from "context";
import colors from "assets/theme/base/colors";
import webStorageClient from "config/webStorageClient";

export const XoaNguoiDung = ({
  open,
  setOpen,
  id,
  refreshList,
  idUserSuperSet,
  handleGoBack,
}) => {
  const authContext = useContext(AuthContext);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { getTokenAdminSuperSet } = useContext(AuthContext);

  const handleClose = () => {
    setOpen(false);
  };

  const DeleteUserSuperSet = () => {
    const tokenLoginSuperSet = webStorageClient.getTokenAdminSuperSet();
    if (tokenLoginSuperSet) {
      deleteRequest(
        `${API_SERVER}${endpointCsdlNganh.SuperSet}/xoa-user-superset/${idUserSuperSet}`,
        {
          tokenLoginSuperSet,
        }
      )
        .then(() => {
          authContext.openAlert();
          authContext.alertInfo({
            icon: "notifications",
            title: "Xóa người dùng",
            content: "Xóa thành công !",
            open: authContext.open,
            close: authContext.openAlert(),
            color: "info",
          });
          setOpen(false);
          if (refreshList) refreshList();
          else handleGoBack();
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            getTokenAdminSuperSet()
              .then(() => {
                DeleteUserSuperSet();
              })
              .catch((err) => {
                console.log(err);
              });
          }
          if (err.response && err.response.status === 404) {
            authContext.openAlert();
            authContext.alertInfo({
              icon: "notifications",
              title: "Xóa người dùng",
              content: "Xóa thành công !",
              open: authContext.open,
              close: authContext.openAlert(),
              color: "info",
            });
            setOpen(false);
            if (refreshList) refreshList();
            else handleGoBack();
            // refreshList();
          }
          if (err.response && err.response.status === 422) {
            setOpen(false);
            authContext.alertInfo({
              icon: "notifications",
              title: "Xóa người dùng thất bại !",
              content:
                "Có dữ liệu về biểu đồ người dùng! Vui lòng xóa các dữ liệu liên quan trước",
              open: authContext.open,
              close: authContext.openAlert(),
              color: "error",
            });
          }
        });
    }
  };

  const handleDelete = async () => {
    const url = `${API_SERVER}${endpointUser?.DanhSachUser}/${id}`;
    let res = await getRequest(url);
    let account = res?.data ? res?.data?.account : "";
    let curentUser = authContext.getCurrentUser();
    if (account === curentUser) {
      alert(`Không được xóa người dùng hiện tại (${account})`);
      return;
    }
    deleteRequest(url)
      .then(() => {
        DeleteUserSuperSet();
      })
      .catch((e) => {
        setOpen(false);
        let content =
          e.response?.status === 400
            ? "Xóa thất bại: " + e.response?.data?.message
            : "Xóa thất bại!";
        authContext.openAlert();
        authContext.alertInfo({
          icon: "notifications",
          title: "Xóa người dùng",
          content: content,
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
            backgroundColor: darkMode
              ? colors?.grey?.[700]
              : colors?.white?.focus,
            color: darkMode ? colors?.white?.focus : colors?.black?.light,
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">{"Xóa Người dùng?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa Người dùng này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              "&:hover": {
                backgroundColor: colors?.info?.focus,
                color: colors?.white?.focus,
              },
            }}
            onClick={handleClose}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            sx={{
              backgroundColor: darkMode ? colors?.info?.main : "#3A91EE",
              color: colors?.white?.focus,
              "&:hover": {
                backgroundColor: colors?.info?.focus,
                color: colors?.white?.focus,
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
