import DeleteIcon from "@mui/icons-material/Delete";
import colors from "assets/theme/base/colors";

// Wrapper component cập nhật hex mỗi lần render
export default function MDDeleteIcon({ sx, ...props }) {
  return (
    <DeleteIcon
      sx={{
        ...sx,
        color: `${colors.error.main} !important`,
        "&:hover": {
          transform: "scale(1.5)",
        },
      }}
      {...props}
    />
  );
}
