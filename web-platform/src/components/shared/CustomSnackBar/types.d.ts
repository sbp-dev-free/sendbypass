export interface SnackbarProps {
  message: string;
  actionText?: string;
  onActionClick?: () => void;
  longAction?: boolean;
  onClose?: () => void;
  icon?: string;
  variant?: "success" | "error";
}
