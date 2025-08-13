import { cn } from "@/utils";

import { TabProps } from "./types";

export const Tab = ({ children, onClick, className, ...props }: TabProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center px-16 py-8 transition-all duration-200 rounded-full text-on-surface text-label-large group",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
    </button>
  );
};
