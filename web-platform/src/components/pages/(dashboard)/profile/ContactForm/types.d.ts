export interface FormRowProps {
  index: number;
  onDelete: () => void;
  countryTag?: string;
  showToast?: (message: string) => void;
}

export interface ContactFormProps {
  onApply?: () => void;
  onDiscard?: () => void;
  applyButtonText?: string;
  discardButtonText?: string;
  hasVerifyingAlert?: boolean;
  hasDiscardButton?: boolean;
}
