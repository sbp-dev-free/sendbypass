import "@mui/material/Badge";

declare module "@mui/material/Badge" {
  interface BadgePropsColorOverrides {
    default: false;
    info: false;
    primary: false;
    secondary: false;
    success: false;
    warning: false;
  }
}
