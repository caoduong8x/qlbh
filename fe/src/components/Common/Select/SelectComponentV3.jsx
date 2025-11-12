import React, { useEffect, useState } from "react";
import {
  TextField,
  Autocomplete,
  ListItemText,
  Typography,
} from "@mui/material";

export const SelectComponentV3 = ({
  disabled,
  label = "",
  setDataSelect = () => {},
  dataSelect = "",
  data = [],
  treeView = false,
  required = true,
  onChange = () => {},
  error = false, // Thêm props error
  helperText = "", // Thêm props helperText
}) => {
  const [localError, setLocalError] = useState(false); // Theo dõi lỗi cục bộ

  const transformedData = Array.isArray(data)
    ? data.map((item) => {
        const itemLabel = Object.keys(item)[0];
        const value = item[itemLabel];
        const maDinhDanhDonVi = item[Object.keys(item)[1]];
        return { label: itemLabel, value, maDinhDanhDonVi };
      })
    : [];

  const flattenData = (inputData, level = 0) => {
    const result = [];
    const traverse = (items, currentLevel) => {
      items.forEach((item) => {
        result.push({
          ...item,
          isParent: currentLevel === 0,
          level: currentLevel,
        });
        if (item.children) {
          traverse(item.children, currentLevel + 1);
        }
      });
    };
    traverse(inputData, level);
    return result;
  };

  const flatData = flattenData(data);

  useEffect(() => {
    if (dataSelect) {
      const defaultItem = flatData.find((item) => item.itemId === dataSelect);
      if (defaultItem) setDataSelect(defaultItem);
    }
  }, [flatData, dataSelect, setDataSelect]);

  // Kiểm tra xác thực mỗi khi dataSelect thay đổi
  // useEffect(() => {
  //   if (required && !dataSelect) {
  //     setLocalError(true);
  //   } else {
  //     setLocalError(false);
  //   }
  // }, [dataSelect, required]);

  return (
    <>
      {treeView ? (
        <Autocomplete
          disabled={disabled}
          fullWidth
          required={required}
          options={flatData}
          getOptionLabel={(option) => option.label || ""}
          isOptionEqualToValue={(option, value) =>
            option.itemId === value?.itemId
          }
          value={dataSelect}
          onChange={(event, newValue) => {
            setDataSelect(newValue);
            onChange(newValue, newValue?.maDinhDanhDonVi);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={label || "Chọn Nhóm cha"}
              sx={{
                "& .MuiInputBase-root": {
                  height: "40px",
                  padding: "10px",
                },
              }}
              disabled={disabled}
              error={error} // Hiển thị lỗi
              helperText={error ? helperText : ""} // Hiển thị thông báo lỗi
            />
          )}
          renderOption={(props, option) => (
            <div {...props} style={{ paddingLeft: option.level * 12 }}>
              <ListItemText
                primary={
                  <Typography
                    style={{
                      fontSize: "16px",
                      fontWeight: option.isParent ? "bold" : "normal",
                      color: "black",
                    }}
                  >
                    {option.label}
                  </Typography>
                }
              />
            </div>
          )}
          ListboxComponent={({ children, ...other }) => (
            <div {...other}>{children}</div>
          )}
        />
      ) : (
        <Autocomplete
          fullWidth
          required={required}
          disabled={disabled}
          options={transformedData}
          getOptionLabel={(option) => option?.label || ""}
          isOptionEqualToValue={(option, value) =>
            option?.value === value?.value
          }
          value={
            transformedData.find((item) => item.value === dataSelect) || null
          }
          onChange={(event, newValue) => {
            const selectedValue = newValue ? newValue.value : "";
            setDataSelect(selectedValue);
            onChange(selectedValue, newValue?.maDinhDanhDonVi);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{
                "& .MuiInputBase-root": {
                  height: "40px",
                  padding: "10px",
                },
              }}
              placeholder={label || "Select..."}
              required={required}
              error={localError || error} // Hiển thị lỗi
              helperText={localError ? "Vui lòng chọn!" : helperText} // Hiển thị thông báo lỗi
            />
          )}
        />
      )}
    </>
  );
};
