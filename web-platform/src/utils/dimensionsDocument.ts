import { DOCUMENT_TYPES } from "@/constants/activities";

export const getSizeDimensions = ({
  size,
  width,
  length,
}: {
  size: string;
  width?: number | string;
  length?: number | string;
}): string => {
  if (size === "CUSTOM") {
    if (width !== undefined && length !== undefined) {
      return `${width}cm x ${length}cm`;
    }
    return "Custom Dimensions Missing";
  }

  for (const category of Object.values(DOCUMENT_TYPES)) {
    if (size in category) {
      return category[size as keyof typeof category];
    }
  }

  return "Size not found";
};
