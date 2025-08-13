export const MuiLinearProgress: any = {
  styleOverrides: {
    root: {
      height: "4px",
      borderRadius: "8px",
      backgroundColor: "rgb(var(--surface-container-highest))",
      "& .MuiLinearProgress-bar": {
        borderRadius: "8px",
        backgroundColor: "rgb(var(--primary))",
      },
    },
  },
};
