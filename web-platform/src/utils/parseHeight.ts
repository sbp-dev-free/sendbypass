export const parseHeight = (windowHeight: number, height?: string | number) => {
  if (typeof height === "string" && height.endsWith("%")) {
    return (parseFloat(height) / 100) * windowHeight;
  }
  return typeof height === "number"
    ? height
    : height
      ? parseFloat(height)
      : 300;
};
