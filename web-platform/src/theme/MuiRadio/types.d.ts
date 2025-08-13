import "@mui/material/Radio";

declare module "@mui/material/Radio" {
  interface RadioPropsColorOverrides {
    inherit: false;
    info: false;
    success: false;
    warning: false;
    default: false;
    secondary: false;
    primary: true;
    error: true;
  }
}
