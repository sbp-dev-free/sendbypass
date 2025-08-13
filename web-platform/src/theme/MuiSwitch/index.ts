export const MuiSwitch: any = {
  styleOverrides: {
    root: {
      color: "rgb(var(--primary)) !important",
      padding: 4,
      "& .MuiSwitch-input": {
        color: "rgb(var(--primary)) !important",
      },
      "& .MuiSwitch-track": {
        borderRadius: 16,
        backgroundColor: "rgb(var(--on-surface-variant))",
      },
      "& .MuiSwitch-thumb": {
        color: "rgb(var(--on-primary)) !important",
        width: 24,
        height: 24,
        position: "relative",
        top: "-2px",
        right: "2px",
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        color: "rgb(var(--primary))",
      },
      "& .Mui-checked+.MuiSwitch-track": {
        backgroundColor: "rgb(var(--primary)) !important",
        opacity: "1 !important",
      },
      "& .MuiSwitch-switchBase.Mui-checked.Mui-disabled": {
        color: "rgb(var(--on-surface-variant)) !important", // Thumb color for disabled + checked

        "&+.MuiSwitch-track": {
          backgroundColor: "rgb(var(--primary))",
          opacity: "0.5 !important",
        },
      },
    },
  },
};
