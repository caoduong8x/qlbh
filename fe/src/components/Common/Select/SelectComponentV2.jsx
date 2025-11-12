import React from "react";
import {
  TextField,
  Autocomplete,
  ListItemText,
  Typography,
} from "@mui/material";

export const SelectComponentV2 = ({
  disabled,
  label = "",
  setDataSelect = () => {},
  dataSelect = "",
  data = [],
  required = true,
  onChange = () => {},
  multiple = false,
  treeView = false,
}) => {
  const transformedData = Array.isArray(data) ? data : [];

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

  const flatData = treeView ? flattenData(data) : transformedData;
  const hasValue = multiple
    ? Array.isArray(dataSelect) && dataSelect.length > 0
    : dataSelect !== null && dataSelect !== "";

  return (
    <Autocomplete
      fullWidth
      required={required && !hasValue}
      disabled={disabled}
      options={treeView ? flatData : transformedData}
      getOptionLabel={(option) => option?.label || ""}
      isOptionEqualToValue={(option, value) =>
        multiple
          ? option?.value === value?.value
          : option?.value === (value?.value || value)
      }
      multiple={multiple}
      value={
        multiple
          ? Array.isArray(dataSelect)
            ? dataSelect
            : []
          : typeof dataSelect === "object"
          ? dataSelect
          : transformedData.find((item) => item.value === dataSelect) || null
      }
      onChange={(event, newValue) => {
        if (multiple) {
          setDataSelect(newValue || []);
          onChange(newValue?.map((item) => item.value) || [], newValue);
        } else {
          setDataSelect(newValue || "");
          onChange(newValue?.value || "", newValue);
        }
      }}
      renderOption={
        treeView
          ? (props, option) => (
              <div {...props} style={{ paddingLeft: option.level * 20 }}>
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
            )
          : undefined
      }
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{
            "& .MuiInputBase-root": {
              minHeight: "40px",
              height: multiple ? "auto" : "45px",
              padding: "0 9px",
              display: "flex",
              alignItems: "center",
              "& .MuiInputBase-input": {
                padding: multiple ? "4.5px 4px" : "7.5px 4px",
                height: "auto",
              },
              "& .MuiAutocomplete-endAdornment": {
                top: "50%",
                transform: "translateY(-50%)",
                right: "9px",
              },
              "& .MuiAutocomplete-tag": {
                maxWidth: "120px",
                margin: "3px",
                height: "24px",
                backgroundColor: "#f5f5f5",
                color: "#333",
                "& .MuiChip-deleteIcon": {
                  color: "#666",
                  "&:hover": {
                    color: "#333",
                  },
                },
              },
            },
          }}
          // placeholder={
          //   multiple
          //     ? (Array.isArray(dataSelect) && dataSelect.length === 0 ? label || "Select..." : "")
          //     : (!dataSelect ? label || "Select..." : "")
          // }
          placeholder={label || "Select..."}
          required={required && !hasValue}
        />
      )}
      ListboxProps={{
        style: {
          maxHeight: "200px",
        },
      }}
    />
  );
};
