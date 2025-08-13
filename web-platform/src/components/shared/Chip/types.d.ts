export interface ChipProps {
  label: string;
  icon?: {
    element: ReactNode;
    placement?: "start" | "end";
  };
  closeIcon?: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "filled" | "outlined";
  color?: "surface" | "secondary" | "active";
  rounded?: boolean;
  elevation?: boolean;
  disabled?: boolean;
  hideIcon?: boolean;
}
