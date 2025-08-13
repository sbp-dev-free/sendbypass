export const variants = [
  {
    props: { variant: "filled" },
    style: {
      color: "rgb(var(--on-primary))",
      backgroundColor: "rgb(var(--primary))",
      padding: "10px 24px",
      "&:hover": {
        boxShadow: "0px 1px 10px 3px rgba(0, 0, 0, 0.10)",
        opacity: 0.8,
        "&:active": {
          boxShadow: "none",
        },
      },
      "&:disabled": {
        backgroundColor: "rgba(29, 27, 31, 0.08)",
        color: "rgb(var(--outline-variant))",
      },
    },
  },
  {
    props: { variant: "error" },
    style: {
      color: "rgb(var(--on-error))",
      backgroundColor: "rgb(var(--error))",
      padding: "10px 24px",
      "&:hover": {
        opacity: 0.8,
        "&:active": {
          boxShadow: "none",
        },
      },
      "&:disabled": {
        backgroundColor: "rgba(29, 27, 31, 0.08)",
        color: "rgb(var(--outline-variant))",
      },
    },
  },
  {
    props: { variant: "success" },
    style: {
      color: "rgb(var(--on-positive))",
      backgroundColor: "rgb(var(--positive))",
      padding: "10px 24px",
      "&:hover": {
        opacity: 0.8,
        "&:active": {
          boxShadow: "none",
        },
      },
      "&:disabled": {
        backgroundColor: "rgba(29, 27, 31, 0.08)",
        color: "rgb(var(--outline-variant))",
      },
    },
  },
  {
    props: { variant: "outlined" },
    style: {
      color: "rgb(var(--primary))",
      border: "1px solid rgb(var(--outline))",
      backgroundColor: "transparent",
      padding: "10px 24px",
      "&:hover": {
        backgroundColor: "rgba(101, 85, 143, 0.08)",
      },
      "&:focus": {
        backgroundColor: "rgba(101, 85, 143, 0.08)",
        borderColor: "rgb(var(--primary))",
      },
      "&:active": {
        borderColor: "rgb(var(--outline))",
      },
      "&:disabled": {
        color: "rgb(var(--outline-variant))",
        borderColor: "rgb(var(--outline-variant))",
      },
    },
  },
  {
    props: { variant: "text" },
    style: {
      color: "rgb(var(--primary))",
      backgroundColor: "transparent",
      padding: "10px 24px",
      "&:hover": {
        backgroundColor: "rgba(101, 85, 143, 0.08)",
      },
      "&:focus": {
        backgroundColor: "rgba(101, 85, 143, 0.12)",
      },
      "&:active": {
        backgroundColor: "rgba(101, 85, 143, 0.12)",
      },
      "&:disabled": {
        color: "rgb(var(--outline-variant))",
      },
    },
  },
  {
    props: { variant: "text-plain" },
    style: {
      color: "rgb(var(--primary))",
      backgroundColor: "transparent",
      padding: "0",
      minWidth: "auto",
      "&:hover": {
        backgroundColor: "transparent",
      },
      "&:focus": {
        backgroundColor: "transparent",
      },
      "&:active": {
        backgroundColor: "transparent",
      },
      "&:disabled": {
        color: "rgb(var(--outline-variant))",
      },
    },
  },
  {
    props: { variant: "tonal" },
    style: {
      color: "rgb(var(--primary))",
      backgroundColor: "rgba(101, 85, 143, 0.08)",
      padding: "10px 24px",
      "&:hover": {
        backgroundColor: "rgba(79, 55, 138, 0.08)",
      },
      "&:focus": {
        backgroundColor: "rgba(0, 81, 68, 0.12)",
      },
      "&:active": {
        background: "rgba(0, 81, 68, 0.12)",
      },
      "&:disabled": {
        color: "rgb(var(--outline-variant))",
        backgroundColor: "rgba(29, 27, 31, 0.08)",
      },
    },
  },
];
