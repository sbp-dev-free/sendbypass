export const MuiChip: any = {
  styleOverrides: {
    root: {
      height: "32px",
      borderRadius: "8px",
      padding: "6px 12px",
      "& .MuiChip-label": {
        padding: "0px 8px",
        fontSize: "14px",
        lineHeight: "20px",
        fontWeight: "500",
      },
    },
  },
  variants: [
    {
      props: { variant: "outlined" },
      style: {
        border: "1px solid rgb(var(--outline-variant))",
        color: "rgb(var(--on-surface-variant))",
        "&.MuiChip-deletable": {
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "rgb(var(--surface))",
          },
        },
        "&.MuiChip-clickable": {
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "rgb(var(--surface))",
          },
          "&:active": {
            backgroundColor: "rgb(var(--surface))",
            boxShadow: "0px 4px 20px 3px rgba(0, 0, 0, 0.10)",
          },
        },
        "&.Mui-focusVisible": {
          outline: "2px solid rgb(var(--surface))",
        },
        "&.Mui-disabled": {
          backgroundColor: "transparent",
          border: "1px solid rgb(var(--on-surface))",
          color: "rgb(var(--on-surface))",
          opacity: 0.2,
        },
        deleteIcon: {
          color: "rgb(var(--on-surface-variant))",
          "&:hover": {
            color: "rgb(var(--primary))",
          },
        },
      },
    },
    {
      props: { variant: "filled" },
      style: {
        backgroundColor: "rgb(var(--secondary-container))",
        color: "rgb(var(--on-secondary-container))",
        "&.MuiChip-deletable": {
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "rgb(var(--secondary-container))",
          },
        },
        "&.MuiChip-clickable": {
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "rgb(var(--secondary-container))",
          },
          "&:active": {
            backgroundColor: "rgb(var(--secondary-container))",
            boxShadow: "0px 4px 20px 3px rgba(0, 0, 0, 0.10)",
          },
        },
        "&.Mui-focusVisible": {
          outline: "2px solid rgb(var(--secondary-container))",
        },
        "&.Mui-disabled": {
          backgroundColor: "transparent",
          border: "1px solid rgb(var(--on-surface))",
          color: "rgb(var(--on-surface))",
          opacity: 0.2,
        },
        deleteIcon: {
          color: "rgb(var(--on-surface-variant))",
          "&:hover": {
            color: "rgb(var(--primary))",
          },
        },
      },
    },
  ],
};
