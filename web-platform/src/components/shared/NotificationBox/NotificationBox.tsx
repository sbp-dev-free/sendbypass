import { cn } from "@/utils";

import { Icon } from "../Icon";

import { NotificationBoxProps, NotificationBoxVariant } from "./types";

const variantClasses: Record<NotificationBoxVariant, string> = {
  error: "",
  info: "bg-informative-opacity-8 text-informative",
  success: "text-positive bg-positive-opacity-8",
  transparent: "border border-surface-container-high",
  warning: "bg-warning-opacity-8 text-warning",
};

function NotificationBox({
  children,
  variant = "transparent",
  className,
  icon,
  actionText,
  action,
  ...props
}: NotificationBoxProps) {
  return (
    <div
      className={cn(
        "flex p-20 rounded-large font-medium transition-colors gap-12 items-center ",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} className="text-[20px]" />}
      {children}
      {actionText && (
        <button
          type="button"
          aria-label="action"
          onClick={() => action?.()}
          className={cn(
            "h-[40px] flex items-center justify-center text-label-large md:ml-auto rounded-small px-24 w-full md:w-auto",
            variantClasses[variant],
            "!text-[14px]",
          )}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
export default NotificationBox;
