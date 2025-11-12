import React, { useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import MDBox from "components/MDBox/index";
import MDTypography from "components/MDTypography/index";
import MDButton from "components/MDButton/index";
import { useMaterialUIController } from "context";
import Divider from "@mui/material/Divider";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

export default function MDModal({
  title,
  open,
  onClose,
  hasButton = true,
  content,
  onConfirm,
  children,
}) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [openModal, setOpenModal] = useState(open);

  return (
    <div>
      <Modal
        open={openModal}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MDBox sx={style}>
          <MDTypography variant="h4" color="inherit">
            {title || "Tiêu đề"}
          </MDTypography>
          {/* <Divider sx={{ margin: "1rem" }} light={darkMode} /> */}
          {children ? (
            children
          ) : (
            <MDTypography variant="body2" color="inherit">
              {content || "Nội dung Xác nhận"}
            </MDTypography>
          )}
          <>
            {hasButton && (
              <MDBox
                display="flex"
                justifyContent="flex-end"
                mt="2rem"
                gap="1rem"
              >
                <MDButton
                  variant="gradient"
                  color="info"
                  size="small"
                  onClick={onClose}
                >
                  Huỷ
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="error"
                  size="small"
                  onClick={() => {
                    onConfirm();
                    setOpenModal(!openModal);
                  }}
                >
                  Xác nhận
                </MDButton>
              </MDBox>
            )}
          </>
        </MDBox>
      </Modal>
    </div>
  );
}
