export const MuiBadge: any = {
  variants: [
    {
      props: { variant: "dot" },
      style: {
        "& .MuiBadge-badge": {
          minWidth: "6px !important",
          maxHeight: "6px !important",
        },
      },
    },
    {
      props: { variant: "standard" },
      style: {
        "& .MuiBadge-badge": {
          padding: "0 4px",
        },
      },
    },
  ],
  defaultProps: {
    color: "error",
    variant: "dot",
  },
  styleOverrides: {
    colorError: {
      backgroundColor: "rgb(var(--error))",
      color: "rgb(var(--on-error))",
      fontSize: "11px",
      fontWeight: "500",
      lineHeight: "16px",
    },
  },
};
