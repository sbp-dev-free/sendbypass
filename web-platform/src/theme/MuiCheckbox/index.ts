export const MuiCheckbox: any = {
  variants: [
    {
      props: { color: "primary" },
      style: {
        color: "rgb(var(--outline))",
        "&.Mui-checked": {
          color: "rgb(var(--primary))",
        },
        "&.Mui-disabled": {
          color: "rgb(var(--on-surface))",
          opacity: 0.08,
        },
        "& .MuiSvgIcon-root": {
          width: "22px",
          height: "22px",
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
        "& .MuiSvgIcon-root": {
          width: "22px",
          height: "22px",
        },
      },
    },
  ],
};
