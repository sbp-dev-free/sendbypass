export interface PreviewDimensionProps {
  weight: string | undefined;
  length: string | undefined;
  width: string | undefined;
  height: string | undefined;
}

export interface DimensionItemProps {
  icon: string;
  unit: string;
  label: string;
  amount: string | undefined;
  className?: string;
}
