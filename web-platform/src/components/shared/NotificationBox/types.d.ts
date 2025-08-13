import { IconName } from "../Icon/types";

export type NotificationBoxVariant =
  | "success"
  | "error"
  | "info"
  | "warning"
  | "transparent";

export type NotificationBoxProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: NotificationBoxVariant;
  icon?: IconName;
  actionText?: string;
  action?: () => void;
};
