export const formatIconName = (iconName: string): string => {
  return `icon-${iconName.trim().toLowerCase().replace(/\s+/g, "-").replace(/_/g, "-")}`;
};
