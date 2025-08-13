import { FC } from "react";

import Link from "next/link";

import { Icon } from "@/components";

import { MenuItemProps } from "./types";

export const MenuItem: FC<MenuItemProps> = ({
  href,
  icon,
  label,
  badge,
  onClick,
  hoverIcon = "Chevron Right MD",
  isLastItem,
  showIconAlways = false,
}) => {
  return (
    <Link
      href={href}
      className="inline-flex relative gap-8 items-center p-8 w-full transition-all duration-100 hover:bg-surface-container rounded-small group"
      onClick={onClick}
    >
      <Icon
        name={icon}
        className={`text-[20px] ${isLastItem ? "text-error-40" : "text-on-surface"}`}
      />
      <span
        className={`text-body-medium ${isLastItem ? "text-error-40" : "text-on-surface"}`}
      >
        {label}
      </span>
      {badge}
      {hoverIcon && (
        <Icon
          name={hoverIcon}
          className={`text-[20px] absolute right-8 ${showIconAlways ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-200 text-primary`}
        />
      )}
    </Link>
  );
};
