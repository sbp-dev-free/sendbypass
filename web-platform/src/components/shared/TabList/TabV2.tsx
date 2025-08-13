import { cn } from "@/utils";

import { Icon } from "../Icon";

import { TabProps } from "./types";

export const TabV2 = ({
  isSelected,
  icon,
  children,
  onClick,
  className,
  classes,
}: TabProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col justify-center gap-8 items-center px-16 transition-all duration-200 md:flex-row h-[36px] md:h-[44px] rounded-small group hover:bg-on-background-opacity-8 hover:text-on-surface  text-title-small text-on-surface ",
        {
          "text-title-small text-on-surface bg-on-background-opacity-8  hover:bg-on-background-opacity-8 hover:text-on-surface ":
            isSelected,
        },
        className,
      )}
    >
      {icon && (
        <Icon
          className={cn(
            `text-[20px] text-outline`,
            {
              "text-primary": isSelected,
            },
            classes?.icon,
          )}
          name={icon}
        />
      )}
      <div
        className={cn(
          "transition-colors duration-200 text-outline text-title-small",
        )}
      >
        {children}
      </div>
    </button>
  );
};
