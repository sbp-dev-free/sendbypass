export interface FileInputLabelProps {
  file?: File | null;
  className?: string;
  htmlFor: string;
  label?: React.ReactNode;
  onDeleteImage: () => void;
  disabled?: boolean;
  errorMessage?: string;
}
