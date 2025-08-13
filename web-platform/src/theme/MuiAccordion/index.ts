export const MuiAccordion: any = {
  styleOverrides: {
    root: {
      "&.MuiAccordion-root": {
        boxShadow: "none",
        borderRadius: "12px",
        border: "1px solid #CBC4D0",
        marginBottom: "8px",

        "&:before": {
          display: "none",
        },

        "&.Mui-expanded": {
          margin: "0 0 8px 0",
        },
      },
      "& .MuiAccordionSummary-root": {
        padding: "20px !important",
      },

      "& .MuiAccordionDetails-root": {
        padding: "0 20px 20px 20px",
      },
    },
  },
};
