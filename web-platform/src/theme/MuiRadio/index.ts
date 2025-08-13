export const MuiRadio: any = {
  variants: [
    {
      props: { color: "primary" },
      style: {
        color: "rgb(var(--primary))",
        "&.Mui-checked": {
          color: "rgb(var(--primary))",
        },
        "&.Mui-disabled": {
          color: "rgb(var(--on-surface))",
          opacity: 0.08,
        },
      },
    },
    {
      props: { color: "error" },
      style: {
        color: "rgb(var(--error))",
        "&.Mui-checked": {
          color: "rgb(var(--error))",
        },
        "&.Mui-disabled": {
          color: "rgb(var(--on-surface))",
          opacity: 0.08,
        },
      },
    },
  ],
};
