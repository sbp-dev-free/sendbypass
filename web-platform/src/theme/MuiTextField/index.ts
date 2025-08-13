export const MuiTextField: any = {
  styleOverrides: {
    root: {
      "& .MuiInputBase-root": {
        borderRadius: "6px",
        fontSize: "14px",
        lineHeight: "20px",
        fontWeight: "400",
        color: "rgb(var(--on-surface))",
      },
      "& .MuiInputAdornment-root": {
        color: "rgb(var(--on-surface))",
      },
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        borderWidth: "1px",
        borderColor: "rgb(var(--outline-variant))",
        transition: "border-color 0.2s ease",
        "&:hover": {
          border: "1px solid rgb(var(--outline))",
        },
        "&.Mui-focused": {
          outline: "3px solid rgb(var(--primary))",
        },
        "&.Mui-error": {
          border: "1px solid rgb(var(--error))",
          "&.Mui-focused": {
            outline: "3px solid rgb(var(--error))",
          },
        },
        "&.Mui-disabled": {
          borderColor: "rgb(var(--on-surface))",
          border: "1px solid rgb(var(--on-surface-opacity-12))",
        },
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
        color: "rgb(var(--error))",
      },
      "& label": {
        fontSize: "14px",
        lineHeight: "20px",
        fontWeight: "400",
        color: "rgb(var(--on-surface-variant))",
        backgroundColor: "rgb(var(--surface-container-lowest))",
        transform: "translate(16px, 90%) scale(1)",
        transition: "transform 0.2s ease",
        "&.MuiFormLabel-filled, &.Mui-focused": {
          backgroundColor: "rgb(var(--surface-container-lowest))",
          transform: "translate(16px, -8px) scale(0.75)",
          color: "rgb(var(--primary))",
          padding: "0px 20px",
        },
        "&.Mui-disabled": {
          color: "rgb(var(--on-surface))",
          opacity: 0.38,
        },
        "&.Mui-error": {
          color: "rgb(var(--error))",
        },
      },
      "& .MuiInputAdornment-root + .MuiInputBase-input ~ label": {
        transform: "translate(40px, 80%) scale(1)",
      },
    },
  },
};
