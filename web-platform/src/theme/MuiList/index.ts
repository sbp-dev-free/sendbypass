export const MuiList: any = {
  defaultProps: {
    disablePadding: true,
    dense: true,
    sx: {
      maxWidth: "310px",
      maxHeight: "400px",
      overflowY: "auto",
      overflowX: "hidden",
    },
  },
  styleOverrides: {
    root: {
      "&::-webkit-scrollbar": {
        width: "6px",
      },
      "&::-webkit-scrollbar-track": {
        boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
        webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(0,0,0,.1)",
        borderRadius: "12px",
      },
    },
  },
};
