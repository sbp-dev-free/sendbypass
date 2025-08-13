import "@mui/material/IconButton";

declare module "@mui/material/IconButton" {
  interface IconButtonPropsSizeOverrides {
    small: false;
    medium: false;
    large: false;
  }

  interface IconButtonPropsColorOverrides {
    inherit: false;
    info: false;
    success: false;
    warning: false;
    default: false;
    error: false;
    secondary: false;
    primary: false;
    filled: true;
    standard: true;
    tonal: true;
    outlined: true;
  }
}
