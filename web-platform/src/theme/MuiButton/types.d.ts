import "@mui/material/Button";

declare module "@mui/material/Button" {
  interface ButtonPropsSizeOverrides {
    small: false;
    medium: false;
    large: false;
  }

  interface ButtonPropsVariantOverrides {
    filled: true;
    outlined: true;
    contained: false;
    tonal: true;
    "text-plain": true;
    error: true;
    success: true;
  }

  interface OverridesStyleRules {
    filled: true;
    outlined: true;
    contained: false;
    tonal: true;
    "text-plain": true;
    error: true;
    success: true;
  }
}
