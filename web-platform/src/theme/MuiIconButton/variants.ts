export const variants = [
  {
    props: { color: "filled" },
    style: {
      color: "rgb(var(--on-primary))",
      backgroundColor: "rgb(var(--primary))",
      "&:hover": {
        backgroundColor: "rgba(var(--primary-opacity-50))",
      },
      "&:disabled": {
        backgroundColor: "rgba(var(--on-surface-opacity-12))",
        color: "rgb(var(--on-surface))",
        opacity: 0.38,
      },
    },
  },
  {
    props: { color: "standard" },
    style: {
      color: "rgb(var(--on-surface-variant))",
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "rgba(var(--on-surface-variant-opacity-8))",
      },
      "&:disabled": {
        color: "rgb(var(--on-surface))",
        opacity: 0.38,
      },
    },
  },
  {
    props: { color: "tonal" },
    style: {
      color: "rgb(var(--primary))",
      backgroundColor: "rgba(var(--primary-opacity-8))",
      "&:hover": {
        background: "rgba(var(--secondary-container-opacity-8))",
      },
      "&:disabled": {
        backgroundColor: "rgba(var(--on-surface-opacity-12))",
        color: "rgb(var(--on-surface))",
        opacity: 0.38,
      },
    },
  },
  {
    props: { color: "outlined" },
    style: {
      color: "rgb(var(--on-surface-variant))",
      border: "1px solid rgb(var(--outline))",
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "rgba(var(--on-surface-variant-opacity-12))",
      },
      "&:disabled": {
        border: "1px solid rgb(var(--on-surface-variant-opacity-12))",
        color: "rgb(var(--on-surface))",
        opacity: 0.38,
      },
    },
  },
];
