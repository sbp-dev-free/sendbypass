export const MuiDrawer: any = {
  defaultProps: {
    anchor: "bottom",
    ModalProps: {
      keepMounted: false,
    },
  },
  styleOverrides: {
    paper: {
      backgroundColor: "rgb(var(--surface-container-lowest))",
      margin: "0",
      padding: "0",
      borderTopLeftRadius: "16px",
      borderTopRightRadius: "16px",
      "@media (max-width: 1024px)": {
        margin: "0",
      },
      "@media (max-width: 768px)": {
        margin: "0px",
        borderRadius: "0",
      },
    },
  },
};
