export const MuiDialog: any = {
  defaultProps: {
    BackdropProps: {
      style: {
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        backdropFilter: "none",
      },
    },
  },
  styleOverrides: {
    paper: {
      maxWidth: "unset",
      background: "rgb(var(--surface-container-lowest))",
      borderRadius: "16px",
      transition: "transform 0.3s ease-in-out",
    },
  },
};
