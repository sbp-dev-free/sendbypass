import { variants } from "./variants";

export const MuiButton: any = {
  variants,
  defaultProps: {
    variant: "filled",
  },
  styleOverrides: {
    disableElevation: true,
    root: {
      "& .MuiButton-startIcon": {
        marginLeft: "0px",
      },
      "& .MuiButton-endIcon": {
        marginRight: "0px",
      },
      borderRadius: "8px",
      textTransform: "none",
      lineHeight: "20px",
      fontWeight: "500",
      fontSize: "14px",
      fontFamily: "var(--font-roboto)",
      transition: "all 0.3s ease-in-out",
    },
  },
};
