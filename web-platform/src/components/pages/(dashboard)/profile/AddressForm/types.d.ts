export interface FormRowProps {
  index: number;
  onDelete: () => void;
  country?: string;
  city?: string;
}

export interface AddressFormProps {
  onApply?: () => void;
  onDiscard?: () => void;
  applyButtonText?: string;
  discardButtonText?: string;
  hasVerifyingAlert?: boolean;
}
