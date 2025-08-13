export const MuiContainer: any = {
  defaultProps: {
    disableGutters: true,
    fixed: true,
  },
  styleOverrides: {
    root: {
      maxWidth: "1253px !important",
      paddingLeft: "16px !important",
      paddingRight: "16px !important",
      "@media (min-width: 1253px)": {
        paddingLeft: "0px !important",
        paddingRight: "0px !important",
      },
    },
  },
};
