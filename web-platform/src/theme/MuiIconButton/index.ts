import { variants } from "./variants";

export const MuiIconButton: any = {
  variants,
  defaultProps: {
    color: "filled",
  },
  styleOverrides: {
    disableElevation: true,
    disableRipple: true,
    disableFocusRipple: true,
    root: {
      width: "40px",
      height: "40px",
      borderRadius: "6px",
      transition: "all 0.3s ease-in-out",
    },
  },
};
