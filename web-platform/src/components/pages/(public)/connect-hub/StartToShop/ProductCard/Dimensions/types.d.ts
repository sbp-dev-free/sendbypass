export interface DimensionProps {
  type: "length" | "width" | "height";
  value?: number;
  icon: string;
  flexibleDescription?: string;
}

export interface DimensionsProps {
  length?: number;
  width?: number;
  height?: number;
  flexible?: boolean;
}

export interface FlexibleDimensionProps {
  description?: string;
}
