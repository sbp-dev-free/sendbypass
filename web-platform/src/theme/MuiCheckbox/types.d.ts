import "@mui/material/Checkbox";

declare module "@mui/material/Checkbox" {
  interface CheckboxPropsColorOverrides {
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
