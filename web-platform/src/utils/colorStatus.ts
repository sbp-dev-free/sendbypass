export const getColorsByStatus = (status: string) => {
  switch (status) {
    case "PENDING":
      return {
        bg: "bg-warning-opacity-8",
        fill: "text-warning-opacity-8",
        text: "text-warning",
      };
    case "SUBMITTED":
      return {
        bg: "bg-informative-opacity-8",
        fill: "text-informative-opacity-8",
        text: "text-informative",
      };
    case "ACCEPTED":
      return {
        bg: "bg-positive-opacity-8",
        fill: "text-positive-opacity-8",
        text: "text-positive",
      };
    case "EXPIRED":
      return {
        bg: "bg-error-opacity-8",
        fill: "text-error-opacity-8",
        text: "text-error",
      };
    default:
      return {
        bg: "bg-error-opacity-8",
        fill: "text-error-opacity-8",
        text: "text-error",
      };
  }
};
