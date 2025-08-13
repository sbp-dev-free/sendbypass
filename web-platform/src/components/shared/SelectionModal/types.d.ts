export interface SelectionModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  options: Array<SelectOptionProps>;
}
export interface SelectOptionProps {
  key?: Number;
  title: string;
  icon: string;
  description: string;
  href?: string;
  onClick?: () => void;
  onClose?: () => void;
  showBadge?: boolean;
  badgeText?: string;
  disabled?: boolean;
}
