export const MuiAccordionSummary: any = {
  styleOverrides: {
    root: {
      padding: 0,
      minHeight: "40px",
      "& .MuiAccordionSummary-content": {
        margin: 0,
        "&.Mui-expanded": {
          margin: "0",
        },
      },
      "&.MuiButtonBase-root": {
        minHeight: "40px",
        padding: 0,

        "&.Mui-expanded": {
          minHeight: "40px",
        },
      },
    },
  },
};
