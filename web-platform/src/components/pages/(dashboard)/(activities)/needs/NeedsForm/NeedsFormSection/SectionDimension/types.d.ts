import { CustomSizeModal } from "./CustomSizeModal";
export type LoadType = {
  value: string;
  label: string;
};

export interface CustomSizeFormData {
  width: string;
  length: string;
}
export interface CustomSizeModalProps {
  open: boolean;
  onClose: () => void;
}
export interface SizeOption {
  value: string;
  label: string;
  dimensions: string;
  category: string;
}

export interface SectionDimensionProps {
  type: "shipping" | "shopping";
}
