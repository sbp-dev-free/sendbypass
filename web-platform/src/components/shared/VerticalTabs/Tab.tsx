import { cn } from "@/utils";

import { Icon } from "../Icon";

import { TabProps } from "./types";

export const Tab = ({
  children,
  onClick,
  className,
  icon,
  ...props
}: TabProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full relative flex items-center justify-start px-16 py-12 gap-8 transition-all duration-200 rounded-full text-on-surface text-label-large group",
        className,
      )}
      {...props}
    >
      <Icon name={icon} className="text-[20px]" />
      <span>{children}</span>
    </button>
  );
};
